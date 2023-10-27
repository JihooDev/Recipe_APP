import React, { useEffect, useRef, useState } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { COLORS, ICON } from '../asset/asset'
import CustomStatusBar from '../component/CustomStatusBar'
import CustomInput from '../component/CustomInput'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import { Alert, Image, ScrollView, Text, TextInput, View } from 'react-native'
import CustomText from '../component/CustomText'
import { ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker'
import { _getImageUrl, getStorageUserData } from '../functions/functions'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { MotiView } from 'moti'
import { MotiPressable } from 'moti/interactions'
import RBSheet from "@nonam4/react-native-bottom-sheet";
import BottomButton from '../component/BottomButton'
import { sliceText } from '../functions/functions'
import { SwipeListView } from 'react-native-swipe-list-view'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { loadingControl } from '../recoil/control'
import BottomButtonView from '../component/BottomButtonView'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { userDataBox } from '../recoil/user'
import { _createRecipe } from '../server/server'
import RecipeDetailList from '../component/RecipeDetailList'
import ImageLoad from '../component/ImageLoad'

interface StyledProps {
    url?: string
}

const AddRecipe = ({
    navigation
}: any) => {

    const setLoading = useSetRecoilState(loadingControl);
    const userData = useRecoilValue(userDataBox);
    const [foodName, setFoodName] = useState<string>('');
    const [imageLoad, setImageLoad] = useState<boolean>(true);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [subscription, setSubscription] = useState<string>('');
    const [ingredient, setIngredient] = useState<string[]>([]);
    const [ingredientValue, setIngredientValue] = useState<string>('');
    const [recipeValue, setRecipeValue] = useState<string>('');
    const [recipeArray, setRecipeArray] = useState<string[]>([]);
    const [allCheck, setAllCheck] = useState<boolean>(false);
    const recipeModalRef = useRef<RBSheet | null>(null);

    // 모든 입력 필드의 조건이 충족 되었는지 확인하는 이펙트
    useEffect(() => {
        if (foodName.length > 0 && subscription.length > 0 && imageUrl.length > 0 && ingredient.length > 0 && recipeArray.length > 0) {
            setAllCheck(true);
        } else {
            setAllCheck(false);
        }
    }, [foodName, imageUrl, ingredient, recipeArray])

    // 이미지 불러오는 함수
    const getImageUrl = async () => {
        launchImageLibrary({ mediaType: 'photo' })
            .then(async ({ assets }: ImagePickerResponse) => {
                setLoading(true);
                console.log(assets);
                const url = await _getImageUrl(assets);

                console.log(url)

                url && setImageUrl(url);
            })
            .catch(error => {
                Alert.alert('업로드 에러', '이미지를 업로드 하는 중 문제가 발생 했습니다.');
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    // 재료 추가하는 함수
    const addInfredient = () => {
        if (ingredientValue.length === 0) return;

        setIngredient([...ingredient, ingredientValue]);

        setIngredientValue('');
    }

    // 레시피 추가하는 함수
    const addRecipe = () => {
        if (recipeValue.length === 0 || recipeValue.startsWith(' ')) return;

        setRecipeArray([...recipeArray, recipeValue]);

        setRecipeValue('');
    }

    // 레시피 삭제하는 함수
    const removeRecipe = (value: string) => {
        setRecipeArray(recipeArray.filter(arrItem => arrItem !== value));
    }

    // 레시피 생성하는 함수
    const onCreatePost = async () => {
        const getUserData = await getStorageUserData();

        const postData = {
            created_user: getUserData,
            post_image: imageUrl,
            post_name: foodName,
            subscription,
            ingredient,
            recipe: recipeArray
        }

        const createPost = await _createRecipe(postData);


        if (createPost['status'] === 200) {
            navigation.pop()
        }
    }

    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <>
                <RBSheet ref={recipeModalRef}
                    openDuration={400}
                    height={ht(1800)}
                    customStyles={{
                        container: {
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            padding: wt(50)
                        }
                    }}
                    keyboardAvoidingViewEnabled={true}
                    dragFromTopOnly={true}
                    closeOnDragDown={true}
                >
                    <ModalContainerView>
                        {
                            recipeArray?.length > 0
                                ?
                                <SwipeListView
                                    data={recipeArray}
                                    style={{ paddingHorizontal: wt(20) }}
                                    renderItem={(item, idx) => (
                                        <RecipeDetailList item={item.item} idx={item.index} />
                                    )}
                                    renderHiddenItem={(data: { item: string }) => (
                                        <HiddenMenu>
                                            <HiddenButton
                                                activeOpacity={.9}
                                                onPress={() => removeRecipe(data.item)}
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
                                :
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <CustomText
                                        text={"레시피를 추가해보세요"}
                                        color={COLORS.gray}
                                        size={20}
                                    />
                                </View>
                        }

                    </ModalContainerView>
                    <ModalInputView>
                        <TextInput
                            style={{
                                width: '85%',
                                height: '100%',
                                fontFamily: "Pretendard-Medium",
                                color: COLORS.black
                            }}
                            placeholder='레시피를 입력해주세요'
                            placeholderTextColor={COLORS.gray}
                            value={recipeValue}
                            onChangeText={text => setRecipeValue(text)}
                        />
                        <MotiView
                            style={{ position: "absolute", bottom: 0, width: "100%", height: ht(13) }}
                            animate={{ backgroundColor: recipeValue.length > 0 ? COLORS.blue : COLORS.gray }}
                        />
                        <AddButtonView>
                            <MotiPressable
                                style={{ width: wt(130), height: ht(130), borderRadius: 90, justifyContent: "center", alignItems: "center" }}
                                animate={{ backgroundColor: recipeValue.length > 0 ? COLORS.blue : COLORS.gray }}
                                onPress={addRecipe}
                            >
                                <Image
                                    source={ICON.plus}
                                    style={{
                                        tintColor: COLORS.white,
                                        width: wt(80),
                                        height: ht(80)
                                    }}
                                />
                            </MotiPressable>
                        </AddButtonView>
                    </ModalInputView>
                </RBSheet>
                <CustomStatusBar
                    text={'레시피 추가'}
                    back
                />
                <KeyboardAwareScrollView style={{ minHeight: !allCheck ? '100%' : null }}>
                    <Container>
                        <ImageButton
                            activeOpacity={.5}
                            onPress={getImageUrl}
                            url={imageUrl}
                        >
                            {
                                imageUrl.length > 0
                                    ?
                                    <>
                                        {imageLoad && <ImageLoad />}
                                        <Image
                                            source={{ uri: imageUrl }}
                                            style={{ width: "100%", height: "100%" }}
                                            resizeMode='cover'
                                            onLoadEnd={() => setImageLoad(false)}
                                        />
                                    </>
                                    :
                                    <>
                                        <Image
                                            source={ICON.plus}
                                            style={{ width: wt(120), tintColor: COLORS.black }}
                                            resizeMode='contain'
                                        />
                                        <CustomText
                                            text='대표 이미지를 추가해주세요'
                                            style={{ marginTop: ht(50) }}
                                        />
                                    </>
                            }

                        </ImageButton>
                        <InputView>
                            <CustomInput
                                value={foodName}
                                setValue={setFoodName}
                                placeholder='음식의 이름을 적어주세요.'
                            />
                        </InputView>
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
                                size={19}
                                type={'Bold'}
                            />
                        </LabelView>
                        <AddInput>
                            <TextInput
                                style={{
                                    width: '85%',
                                    height: '100%',
                                    fontFamily: "Pretendard-Medium",
                                    color: COLORS.black
                                }}
                                placeholder='필요한 재료를 입력해주세요 예) 마늘 5개'
                                placeholderTextColor={COLORS.gray}
                                value={ingredientValue}
                                onChangeText={text => setIngredientValue(text)}
                            />
                            <MotiView
                                style={{ position: "absolute", bottom: 0, width: "100%", height: ht(13) }}
                                animate={{ backgroundColor: ingredient.length > 0 ? COLORS.blue : COLORS.gray }}
                            />
                            <AddButtonView>
                                <MotiPressable
                                    style={{ width: wt(130), height: ht(130), borderRadius: 90, justifyContent: "center", alignItems: "center" }}
                                    animate={{ backgroundColor: ingredientValue.length > 0 ? COLORS.blue : COLORS.gray }}
                                    onPress={addInfredient}
                                >
                                    <Image
                                        source={ICON.plus}
                                        style={{
                                            tintColor: COLORS.white,
                                            width: wt(80),
                                            height: ht(80)
                                        }}
                                    />
                                </MotiPressable>
                            </AddButtonView>
                        </AddInput>
                        <View style={{ alignItems: "flex-end", justifyContent: "center", height: ht(120) }}>
                            <CustomText
                                text={'* 길게 누르면 삭제됩니다'}
                                size={13}
                                color={COLORS.gray}
                            />
                        </View>
                        <ScrollView
                            horizontal={true}
                        >
                            {
                                ingredient.map((item, index) => (
                                    <FoodItemButton
                                        key={index}
                                        style={{ marginLeft: index !== 0 && wt(50) }}
                                        onLongPress={() => {
                                            Alert.alert(
                                                '삭제하시겠습니까?',
                                                '',
                                                [
                                                    {
                                                        text: "취소",
                                                    },
                                                    {
                                                        text: "삭제합니다",
                                                        onPress: () => setIngredient(ingredient.filter(value => item !== value)),
                                                    }
                                                ],
                                            )
                                        }}
                                        activeOpacity={.5}
                                    >
                                        <CustomText
                                            text={item}
                                            color={COLORS.white}
                                        />
                                    </FoodItemButton>
                                ))
                            }
                        </ScrollView>
                        <BottomButton
                            text={'레시피 추가하기'}
                            style={{
                                backgroundColor: recipeArray?.length > 0 ? COLORS.blue : COLORS.gray,
                                marginTop: ht(80)
                            }}
                            onPress={() => recipeModalRef.current?.open()}
                        />
                    </Container>
                </KeyboardAwareScrollView>
                <BottomButtonView>
                    <MotiView
                        style={{ width: "100%" }}
                        animate={{ translateY: allCheck ? 0 : ht(500) }}
                    >
                        <BottomButton
                            text='등록하기'
                            style={{
                                backgroundColor: COLORS.green
                            }}
                            onPress={onCreatePost}
                        />
                    </MotiView>
                </BottomButtonView>
            </>
        </CustomSafeAreaView >
    )
}

const Container = styled.View`
    flex: 1;
    padding: 0 ${wt(80)}px;
`

const ImageButton = styled.TouchableOpacity`
    width: 100%;
    height: ${ht(700)}px;
    justify-content : center;
    align-items: center;
    border-radius: 10px;
    border-width: ${({ url }: StyledProps) => url?.length === 0 ? '3px' : '0px'};
    border-color: ${COLORS.gray};
    margin-top: ${ht(80)}px;
    overflow: hidden;
`

const InputView = styled.View`
    width: 100%;
    height: ${ht(250)}px;
    margin-top: ${wt(80)}px;
`

const LabelView = styled.View`
    width: 100%;
    height: ${ht(220)}px;
    justify-content: center;
`

const SubscriptionLabelView = styled(LabelView)`
    height: ${ht(150)};
`

const AddInput = styled.View`
    width: 100%;
    height: ${ht(250)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const SubscriptionInputView = styled(AddInput)`
    height: ${ht(250)}px;
`

const AddButtonView = styled.View`
    width: 15%;
    height: 100%;
    justify-content: center;
    align-items: center;
`

const FoodItemButton = styled.TouchableOpacity`
    padding: ${ht(40)}px ${wt(40)}px;
    background-color: ${COLORS.light_green};
    border-radius: 5px;
`

const ModalContainerView = styled.View`
    flex: 1;
    padding: ${ht(80)}px 0;
`

const ModalInputView = styled.View`
    width: 100%;
    height: ${ht(250)}px;
    margin-bottom: ${ht(50)}px;
    flex-direction: row;
    justify-content: space-between;
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

export default AddRecipe