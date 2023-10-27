import React, { useCallback, useEffect, useState } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { COLORS, ICON } from '../asset/asset'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import CustomText from '../component/CustomText'
import { Alert, FlatList, Image } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { loadingControl } from '../recoil/control'
import { _getRecipeAll } from '../server/server'
import Loading from '../component/Loading'
import RecipeList from '../component/RecipeList'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BottomParamList } from '../types/types'
import { MotiView } from 'moti'

type ChefNavigation = NativeStackScreenProps<BottomParamList | any, "Chef">;

const Chef = ({
    navigation
}: ChefNavigation) => {

    const [loading, setLoading] = useRecoilState(loadingControl);
    const [recipeList, setRecipeList] = useState([]);

    useFocusEffect(
        useCallback(() => {
            getRecipeList();
        }, [])
    )

    // 레시피 전체 불러오기
    const getRecipeList = async () => {
        const listData = await _getRecipeAll(setLoading);

        if (listData?.status) {
            setRecipeList(listData['data']);
        } else {
            Alert.alert('서버 에러', '리스트를 가져오는 도중 에러가 발생했습니다.\n다시 시도해주세요')
        }
    }

    if (loading) {
        return (<></>)
    }


    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <MotiView
                style={{ flex: 1 }}
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Header>
                    <CustomText
                        text={'레시피 백화점'}
                        size={20}
                        type={'ExtraBold'}
                    />
                    <AddButton
                        activeOpacity={.9}
                        onPress={() => navigation.push('AddRecipe')}
                    >
                        <Image
                            source={ICON.plus}
                            style={{ width: wt(80), height: ht(80) }}
                            tintColor={COLORS.white}
                        />
                    </AddButton>
                </Header>
                {
                    !loading &&
                    <Container>
                        {
                            recipeList.length > 0 ?
                                <FlatList
                                    data={recipeList}
                                    renderItem={(item) => { return <RecipeList item={item.item} navigation={navigation} /> }}
                                    style={{
                                        paddingHorizontal: wt(10),
                                        paddingVertical: ht(20)
                                    }}
                                />
                                :
                                <NotaCenterView>
                                    <CustomText
                                        text={'첫 번째로 레시피를 등록해보세요!'}
                                        size={20}
                                        type={'ExtraBold'}
                                        color={COLORS.light_green}
                                    />
                                </NotaCenterView>
                        }
                    </Container>
                }

            </MotiView>
        </CustomSafeAreaView>
    )
}

const Header = styled.View`
    width: 100%;
    height: ${ht(300)}px;
    padding: 0 ${wt(80)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const AddButton = styled.TouchableOpacity`
    width: ${wt(150)}px;
    height: ${ht(150)}px;
    background-color: ${COLORS.light_green};
    border-radius: 5px;
    justify-content: center;
    align-items: center;
`

const Container = styled.View`
    flex: 1;
    padding: 0 ${wt(70)}px;
`

const NotaCenterView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`

export default Chef