import React, { useEffect, useRef, useState } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { COLORS, ICON } from '../asset/asset'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecipeListTypes, StackParamList } from '../types/types';
import { _getPostData, _modifyPost } from '../server/server';
import { useSetRecoilState } from 'recoil';
import { loadingControl } from '../recoil/control';
import { Alert, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import CustomStatusBar from '../component/CustomStatusBar';
import styled from 'styled-components/native';
import { ht, wt } from '../responsive/responsive';
import ImageLoad from '../component/ImageLoad';
import CustomInput from '../component/CustomInput';
import { MotiView } from 'moti';
import CustomText from '../component/CustomText';
import { SwipeListView } from 'react-native-swipe-list-view'
import RecipeDetailList from '../component/RecipeDetailList';
import BottomButtonView from '../component/BottomButtonView';
import BottomButton from '../component/BottomButton';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { SHADOW } from '../asset/asset';
import RBSheet from '@nonam4/react-native-bottom-sheet';
import { _getImageUrl, getStorageUserData } from '../functions/functions';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

type ModifyProps = NativeStackScreenProps<StackParamList, "ModifyPost">;
type RootStackNavigationProp = NativeStackNavigationProp<StackParamList>;

const ModifyPost = ({ route }: ModifyProps) => {

    const setLoading = useSetRecoilState(loadingControl);
    const post_id = route.params.post_id;
    const [postData, setPostData] = useState<RecipeListTypes | any>({});
    const [postImage, setPostImage] = useState<string>('');
    const [imageLoad, setImageLoad] = useState<boolean>(true);
    const [foodName, setFoodName] = useState<string>('');
    const [subscription, setSubscription] = useState<string>('');
    const [ingredientArrow, setIngredientArrow] = useState<boolean>(false);
    const [ingredient, setIngredient] = useState<string[]>([]);
    const [recipeArrow, setRecipeArrow] = useState<boolean>(false);
    const [recipe, setRecipe] = useState<string[]>([]);
    const [newIngredient, setNewIngredient] = useState<string>('');
    const addRecipeRef = useRef<RBSheet>(null);
    const addIngredientRef = useRef<RBSheet>(null);
    const [newRecipeValue, setNewRecipeValue] = useState<string>('');
    const navigation = useNavigation<RootStackNavigationProp>();

    useEffect(() => {
        getPost();
        console.log(post_id)
    }, [])

    // 서버에서 포스트 데이터 가져오기
    const getPost = async () => {
        const serverData: RecipeListTypes = await _getPostData(post_id, setLoading);

        if (Object.keys(serverData).length > 0) {
            setPostData(serverData);
            setFoodName(serverData['post_name']);
            setSubscription(serverData['subscription']);
            setIngredient(serverData['ingredient']);
            setRecipe(serverData['recipe']);

        } else {
            Alert.alert('불러오기 실패', '잠시 후 다시 시도 해주세요.');
        }
    }

    // 재료 삭제 함수
    const removeIngredient = (item: string) => {
        setIngredient(ingredient?.filter(ingredientItem => ingredientItem !== item));
    }

    // 레시피 추가 함수 (addRecipeRef 모달에서 동작)
    const addRecipe = () => {
        if (!newRecipeValue) return;

        setRecipe([...recipe, newRecipeValue]);

        setTimeout(() => {
            addRecipeRef.current?.close();
        }, 300)
    }


    // 재료 추가 함수 (addIngredientRef 모달에서 동작)
    const addIngredientItem = () => {
        if (!newIngredient) return;

        setIngredient([...ingredient, newIngredient]);

        setTimeout(() => {
            addIngredientRef.current?.close();
        }, 300)
    }

    // 최종 수정하기
    const onSubmit = async () => {
        const userData = await getStorageUserData();

        const data = {
            created_user: userData,
            post_image: postImage?.length > 0 ? postImage : postData['post_image'],
            post_name: foodName,
            subscription,
            ingredient,
            recipe
        }

        const postServer = await _modifyPost(post_id, data, setLoading);

        if (postServer['status']) {
            Alert.alert('수정완료', '수정이 완료되었습니다', [
                {
                    text: '레시피 백화점으로 이동',
                    onPress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home', params: { screen: 'Chef' } }],
                        });
                    }
                }
            ]);
        } else {
            Alert.alert('수정실패', '문제가 발생했습니다. 다시 시도해주세요.')
        }
    }


    // 이미지 수정 함수
    const getImageUrl = async () => {
        launchImageLibrary({ mediaType: 'photo' })
            .then(async ({ assets }: ImagePickerResponse) => {
                setLoading(true);
                const url = await _getImageUrl(assets);

                url && setPostImage(url);
            })
            .catch(error => {
                Alert.alert('업로드 에러', '이미지를 업로드 하는 중 문제가 발생 했습니다.');
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            })
    }


    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <>
                <RBSheet
                    ref={addRecipeRef}
                    customStyles={{
                        container: {
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30
                        }
                    }}
                    closeOnDragDown={true}
                >
                    <ModalContainer>
                        <ModalSubScriptionContainer>
                            <CustomText
                                text={'추가 하실 레시피를 적어주세요!'}
                                size={20}
                            />
                        </ModalSubScriptionContainer>
                        <ModalInputView>
                            <CustomInput
                                value={newRecipeValue}
                                setValue={setNewRecipeValue}
                                add
                                onPress={addRecipe}
                            />
                        </ModalInputView>
                    </ModalContainer>
                </RBSheet>
                <RBSheet
                    ref={addIngredientRef}
                    customStyles={{
                        container: {
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30
                        }
                    }}
                    closeOnDragDown={true}
                >
                    <ModalContainer>
                        <ModalSubScriptionContainer>
                            <CustomText
                                text={'추가 하실 재료를 적어주세요!'}
                                size={20}
                            />
                        </ModalSubScriptionContainer>
                        <ModalInputView>
                            <CustomInput
                                value={newIngredient}
                                setValue={setNewIngredient}
                                add
                                onPress={addIngredientItem}
                            />
                        </ModalInputView>
                    </ModalContainer>
                </RBSheet>
                <CustomStatusBar
                    text={postData['post_name']}
                    back={false}
                />
                <ScrollView style={{ flex: 1 }}>
                    <ImageView
                        activeOpacity={.9}
                        onPress={getImageUrl}
                    >
                        {imageLoad && <ImageLoad />}
                        <Image
                            source={{ uri: postImage.length === 0 ? postData['post_image'] : postImage }}
                            style={{ width: "100%", height: "100%" }}
                            onLoadEnd={() => setImageLoad(false)}
                        />
                    </ImageView>
                    <Container>
                        <InputView>
                            <CustomInput
                                value={foodName}
                                setValue={setFoodName}
                                placeholder='음식의 이름을 적어주세요.'
                            />
                        </InputView>
                        <CustomText
                            text={'음식에 대한 소개'}
                            size={16}
                            type={'Bold'}
                            style={{ marginTop: ht(80) }}
                        />
                        <SubscriptionInputView>
                            <TextInput
                                style={{
                                    width: '85%',
                                    height: '100%',
                                    fontFamily: "Pretendard-Medium",
                                    color: COLORS.black
                                }}
                                placeholder='음식에 대한 간단한 소개를 해주세요'
                                placeholderTextColor={COLORS.gray}
                                value={subscription}
                                onChangeText={text => setSubscription(text)}
                            />
                            <MotiView
                                style={{ position: "absolute", bottom: 0, width: "100%", height: ht(13) }}
                                animate={{ backgroundColor: subscription.length > 0 ? COLORS.blue : COLORS.gray }}
                            />
                        </SubscriptionInputView>
                        <LabelView>
                            <CustomText
                                text={'필요한 재료'}
                                size={16}
                                type={'Bold'}
                            />
                            <ArrowButton
                                onPress={() => setIngredientArrow(!ingredientArrow)}
                            >
                                <MotiView
                                    animate={{
                                        transform: [{ rotate: ingredientArrow ? '0deg' : '180deg' }]
                                    }}
                                >
                                    <Image
                                        source={ICON.arrow_icon}
                                        style={{ width: wt(80), height: ht(80) }}
                                    />
                                </MotiView>
                            </ArrowButton>
                        </LabelView>
                        {
                            ingredientArrow &&
                            <>
                                <SwipeListView
                                    data={ingredient}
                                    renderItem={(data, idx) => (
                                        <RecipeDetailList item={data.item} idx={data.index} />
                                    )}
                                    style={{ paddingHorizontal: wt(20) }}
                                    disableScrollViewPanResponder={true}
                                    scrollEnabled={false}
                                    keyExtractor={index => index}
                                    renderHiddenItem={(data: { item: string }) => (
                                        <HiddenMenu>
                                            <HiddenButton
                                                activeOpacity={.9}
                                                onPress={() => removeIngredient(data.item)}
                                            >
                                                <Image
                                                    source={ICON.trash}
                                                    style={{
                                                        width: wt(100),
                                                        tintColor: COLORS.white
                                                    }}
                                                    resizeMode='contain'
                                                />
                                            </HiddenButton>
                                        </HiddenMenu>
                                    )}
                                    rightOpenValue={-wt(250)}
                                />
                                <PlusButton
                                    style={SHADOW}
                                    activeOpacity={.5}
                                    onPress={() => addIngredientRef.current?.open()}
                                >
                                    <Image
                                        source={ICON.plus}
                                        style={{ width: wt(80) }}
                                        resizeMode='contain'
                                    />
                                </PlusButton>
                            </>
                        }
                        <LabelView>
                            <CustomText
                                text={'레시피'}
                                size={16}
                                type={'Bold'}
                            />
                            <ArrowButton
                                onPress={() => setRecipeArrow(!recipeArrow)}
                            >
                                <MotiView
                                    animate={{
                                        transform: [{ rotate: recipeArrow ? '0deg' : '180deg' }]
                                    }}
                                >
                                    <Image
                                        source={ICON.arrow_icon}
                                        style={{ width: wt(80), height: ht(80) }}
                                    />
                                </MotiView>
                            </ArrowButton>
                        </LabelView>
                        {
                            recipeArrow &&
                            <>
                                <DraggableFlatList
                                    data={recipe}
                                    style={{ paddingHorizontal: wt(20) }}
                                    onDragEnd={({ data }) => setRecipe(data)}
                                    renderItem={({ item, drag, isActive, getIndex }: RenderItemParams<any>) => {

                                        let index = getIndex();

                                        return (
                                            <ScaleDecorator>
                                                <TouchableOpacity onLongPress={drag} disabled={isActive} activeOpacity={.9}>
                                                    <RecipeDetailList item={item} idx={index} />
                                                </TouchableOpacity>
                                            </ScaleDecorator>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    scrollEnabled={false}
                                />
                                <PlusButton
                                    style={SHADOW}
                                    activeOpacity={.5}
                                    onPress={() => addRecipeRef.current?.open()}
                                >
                                    <Image
                                        source={ICON.plus}
                                        style={{ width: wt(80) }}
                                        resizeMode='contain'
                                    />
                                </PlusButton>
                            </>
                        }
                    </Container>
                    <BottomButtonView>
                        <BottomButton
                            text={'수정하기'}
                            type={'success'}
                            onPress={onSubmit}
                        />
                    </BottomButtonView>
                </ScrollView>
            </>
        </CustomSafeAreaView >
    )
}

const ImageView = styled.TouchableOpacity`
    width: 100%;
    height: ${ht(1200)}px;
    margin-top: ${ht(50)}px;
`

const Container = styled.View`
    width: 100%;
    padding: 0 ${wt(80)}px;
`

const InputView = styled.View`
    width: 100%;
    height: ${ht(250)}px;
    margin-top: ${wt(80)}px;
`

const AddInput = styled.View`
    width: 100%;
    height: ${ht(250)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const LabelView = styled.View`
    width: 100%;
    height: ${ht(220)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const SubscriptionInputView = styled(AddInput)`
    height: ${ht(250)}px;
`

const HiddenMenu = styled.View`
    width: 100%;
    height: ${ht(300)}px;
    margin: ${ht(40)}px 0;
    margin-right: ${wt(50)}px;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`

const HiddenButton = styled.TouchableOpacity`
    width: ${wt(250)}px;
    height: 100%;
    background-color: ${COLORS.red};
    justify-content: center;
    align-items: center;
    border-radius: 10px;
`

const ArrowButton = styled.TouchableOpacity`
    width: ${wt(120)}px;
    height: ${ht(120)}px;
    justify-content: center;
    align-items: center;
`

const PlusButton = styled.TouchableOpacity`
    width: 100%;
    height: ${ht(230)}px;
    border-radius: 10px;
    margin-top: ${ht(15)}px;
    background-color: ${COLORS.white};
    justify-content: center;
    align-items: center;
`

// bottom sheet
const ModalContainer = styled.View`
    flex: 1;
    padding: ${ht(120)}px ${wt(80)}px;
`

const ModalInputView = styled.View`
    width: 100%;
    height: ${ht(250)}px;
`

const ModalSubScriptionContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`

export default ModifyPost