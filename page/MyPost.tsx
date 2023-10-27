import React, { useCallback, useEffect, useState } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { COLORS, ICON } from '../asset/asset'
import CustomStatusBar from '../component/CustomStatusBar'
import { RecipeListTypes, StackParamList, UserResultTypes } from '../types/types'
import { _getMyPosts } from '../server/server'
import { getStorageUserData } from '../functions/functions'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { loadingControl } from '../recoil/control'
import styled from 'styled-components/native'
import { MotiView } from 'moti'
import CustomText from '../component/CustomText'
import { ht, wt } from '../responsive/responsive'
import { FlatList, Image } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useFocusEffect } from '@react-navigation/native'
import RecipeList from '../component/RecipeList'

type RootStackNavigationProp = NativeStackScreenProps<StackParamList, 'MyPost'>;


const MyPost = ({ navigation }: RootStackNavigationProp): JSX.Element => {

    const [loading, setLoading] = useRecoilState(loadingControl);
    const [myPostData, setMyPostData] = useState<RecipeListTypes[]>([]);


    useFocusEffect(
        useCallback(() => {
            getMyPosts();
        }, [])
    )

    // 유저가 작성한 글을 가져오는 함수
    const getMyPosts = async () => {
        const { uid } = await getStorageUserData();

        const { data, status } = await _getMyPosts(uid, setLoading);

        if (status) setMyPostData(data);
    }

    if (loading) {
        return (
            <></>
        )
    }

    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <>
                <CustomStatusBar
                    text={'나의 글'}
                    back
                />
                <Container>
                    {
                        myPostData?.length > 0
                            ?
                            <FlatList
                                data={myPostData}
                                renderItem={({ item }) => { return <RecipeList item={item} navigation={navigation} /> }}
                                style={{ paddingHorizontal: wt(10) }}
                            />
                            :
                            <NoDataResult>
                                <MotiView
                                    from={{ translateY: -100, opacity: 0 }}
                                    animate={{ translateY: 0, opacity: 1 }}
                                >
                                    <CustomText
                                        text={'아직 작성한 글이 없어요!'}
                                        size={20}
                                    />
                                </MotiView>
                                <MotiView
                                    from={{ marginTop: ht(170), opacity: 0, translateY: 100 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                >
                                    <AddButton
                                        activeOpacity={.9}
                                        onPress={() => navigation.push('AddRecipe')}
                                    >
                                        <Image
                                            source={ICON.plus}
                                            style={{ width: wt(80), tintColor: COLORS.white }}
                                            resizeMode='contain'
                                        />
                                    </AddButton>
                                </MotiView>
                            </NoDataResult>
                    }
                </Container>
            </>
        </CustomSafeAreaView>
    )
}

const Container = styled.View`
    flex: 1;
    padding: ${ht(120)}px ${wt(70)}px;
`

const NoDataResult = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`

const AddButton = styled.TouchableOpacity`
    width: ${wt(280)}px;
    height: ${ht(280)}px;
    background-color: ${COLORS.green};
    border-radius: 10px;
    justify-content: center;
    align-items: center;
`

export default MyPost