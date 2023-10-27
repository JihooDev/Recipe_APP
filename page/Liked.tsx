import React, { useCallback, useEffect, useState } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { COLORS } from '../asset/asset'
import { _getUser, _getUserLikes } from '../server/server'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { loadingControl } from '../recoil/control'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getStorageUserData } from '../functions/functions'
import { BottomParamList, RecipeListTypes, UserResultTypes } from '../types/types'
import { useFocusEffect } from '@react-navigation/native'
import CustomStatusBar from '../component/CustomStatusBar'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import CustomText from '../component/CustomText'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlatList } from 'react-native'
import RecipeList from '../component/RecipeList'
import NoResultView from '../component/NoResultView'

type LikedNavigation = NativeStackScreenProps<BottomParamList | any, "Liked">;


const Liked = ({
    navigation
}: LikedNavigation) => {

    const [loading, setLoading] = useRecoilState(loadingControl);
    const [likesData, setLikesData] = useState<RecipeListTypes[]>([]);
    const [userName, setUserName] = useState<string>('');

    useFocusEffect(
        useCallback(() => {
            getUserLike();
        }, [])
    )

    // 유저가 좋아하는 레시피 가져오기
    const getUserLike = async () => {
        try {
            setLoading(true);
            const { uid, user_name, nick_name }: UserResultTypes = await getStorageUserData();
            setUserName(nick_name);
            const { data, status } = await _getUser(uid, setLoading);

            if (status === 200) {
                const likes = data[0].likes;

                const getServerData = await _getUserLikes(likes);

                setLikesData(getServerData['data']);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (<></>)
    }

    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <>
                <Header>
                    <CustomText
                        text={`${userName} 님께서 좋아하시는 레시피`}
                        size={20}
                        type={'ExtraBold'}
                    />
                </Header>
                {
                    !loading &&
                    <Container>
                        {
                            likesData?.length > 0
                                ?
                                <FlatList
                                    data={likesData}
                                    style={{ paddingTop: ht(80), paddingHorizontal: wt(10) }}
                                    renderItem={(item) => { return <RecipeList item={item.item} navigation={navigation} type /> }}
                                />
                                :
                                <NoResultView
                                    content={'아직 좋아하시는 레시피가 없으시네요!'}
                                />
                        }
                    </Container>
                }

            </>
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

const Container = styled.View`
    flex: 1;
    padding: 0 ${wt(70)}px;
`

export default Liked