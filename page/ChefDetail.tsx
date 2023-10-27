import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Alert, Image, ScrollView, TouchableOpacity } from 'react-native'

import { useRecoilState, useSetRecoilState } from 'recoil'
import RBSheet, { RBSheetProps } from '@nonam4/react-native-bottom-sheet'
import { MotiView } from 'moti'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import styled from 'styled-components/native'

import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { COLORS } from '../asset/asset'
import { StackParamList, UserResultTypes } from '../types/types'
import { loadingControl } from '../recoil/control'
import Loading from '../component/Loading'
import CustomStatusBar from '../component/CustomStatusBar'
import { ht, wt } from '../responsive/responsive'
import { ICON } from '../asset/asset'
import CustomText from '../component/CustomText'
import ImageLoad from '../component/ImageLoad'
import { getStorageUserData } from '../functions/functions'
import MoreMenu from '../component/MoreMenu'
import RecipeDetailList from '../component/RecipeDetailList';
import BottomButton from '../component/BottomButton'
import IngredientList from '../component/IngredientList'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { _likesCheck, _onLikes, _postLikesCheck, _postReport, _unLikes } from '../server/server'
import { useFocusEffect } from '@react-navigation/native'
import ImageViewModal from '../component/modal/ImageViewModal'
import ReportModal from '../component/modal/ReportModal'

type ChefDetailProps = NativeStackScreenProps<StackParamList, "ChefDetail">;

const ChefDetail = ({ route }: ChefDetailProps) => {
    const setLoading = useSetRecoilState(loadingControl);
    const [imageLoad, setImageLoad] = useState<boolean>(true);
    const [like, setLike] = useState<boolean>(false);
    const [likeLength, setLikeLength] = useState<number>(0);
    const [imageView, setImageView] = useState<boolean>(false);
    const [user, setUser] = useState<UserResultTypes | any>({});
    const [moreMenuStatus, setMoreMenuStatus] = useState<boolean>(false);
    const [createUserCheck, setCreateUserCheck] = useState<boolean | null>(null);
    const [tabStatus, setTabStatus] = useState<number>(0);
    const [reportModalState, setReportModalState] = useState<boolean>(false);
    const data = route.params;

    useLayoutEffect(() => {
        getUser();
    }, [createUserCheck])

    useEffect(() => {
        checkLikes();
        checkPostLikes();
    }, [])

    // 유저를 가져와서 작성한 유저인지 아닌지 체크하는 함수
    const getUser = async () => {
        const user = await getStorageUserData();

        if (user) {
            setUser(user);
            console.log(data.created_user?.uid === user.uid)
            if (data.created_user?.uid === user.uid) {
                setCreateUserCheck(true);
            }
        };
    }

    // 현재 유저가 좋아요를 눌렀는지 체크하는 함수
    const checkLikes = async () => {
        const user = await getStorageUserData();

        const likesCheck = await _likesCheck(data['post_id'], user['uid']);

        if (likesCheck['status']) {
            setLike(likesCheck['data']);
        } else {
            setLike(false);
        }
    }

    // 포스트 글의 좋아요 갯수를 체크하는 함수
    const checkPostLikes = async () => {
        const likesLength = await _postLikesCheck(data['post_id']);

        if (likesLength['status']) {
            setLikeLength(likesLength['result']);
        }
    }

    // 사이드 메뉴를 눌렀을 때 일어나는 로직
    const sideMenuPress = async () => {
        const user = await getStorageUserData();


        if (createUserCheck) {
            setMoreMenuStatus(true);
        } else {
            if (like) {
                const postUnLike = await _unLikes(user.uid, data['post_id']);

                if (postUnLike['status']) {
                    await checkLikes();
                    await checkPostLikes();
                }
            } else {
                const postLike = await _onLikes(user.uid, data['post_id']);

                if (postLike['status']) {
                    await checkLikes();
                    await checkPostLikes();
                }
            }
        }
    }

    // 신고하기
    const postReport = async (post_text: string) => {
        if (post_text.length === 0) return;

        const paramsData = {
            post_id: data['post_id'],
            post_name: data['post_name'],
            post_content: post_text
        }

        console.log(paramsData);

        setReportModalState(false);
        Alert.alert('신고완료', '신고가 완료 되었습니다. 빠르게 조치하겠습니다.');
    }

    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <>
                <ReportModal
                    visible={reportModalState}
                    closeFuc={() => setReportModalState(false)}
                    onSubmit={postReport}
                />
                <ImageViewModal
                    imageUrl={data['post_image']}
                    isVisible={imageView}
                    closeFuc={() => setImageView(false)}
                />
                <MoreMenu visible={moreMenuStatus} setVisible={setMoreMenuStatus} postId={data?.post_id} />
                <CustomStatusBar
                    back={true}
                    text={data['post_name']}
                >
                    <>
                        <LikeButton
                            style={{ backgroundColor: like ? COLORS.red : null, marginLeft: wt(50) }}
                            onPress={sideMenuPress}
                        >
                            {
                                createUserCheck &&
                                    createUserCheck === true
                                    ?
                                    <Image
                                        source={ICON.more}
                                        style={{
                                            width: "80%",
                                            height: '80%',
                                            tintColor: like ? COLORS.white : COLORS.black
                                        }}
                                        resizeMode='contain'
                                    />
                                    :
                                    <Image
                                        source={ICON.like}
                                        style={{
                                            width: "80%",
                                            height: '80%',
                                            tintColor: like ? COLORS.white : COLORS.black
                                        }}
                                        resizeMode='contain'
                                    />
                            }

                        </LikeButton>

                    </>
                </CustomStatusBar>
                <ScrollView>
                    <ImageView
                        activeOpacity={.9}
                        onPress={() => setImageView(true)}
                    >
                        {imageLoad && <ImageLoad />}
                        <Image
                            source={{ uri: data['post_image'] }}
                            style={{ width: "100%", height: "100%" }}
                            onLoadEnd={() => setImageLoad(false)}
                        />
                    </ImageView>
                    <Container>
                        <SubscriptionView>
                            <CustomText
                                text={data['post_name']}
                                type={'ExtraBold'}
                                size={25}
                            />

                        </SubscriptionView>
                        <SubscriptionView style={{ height: ht(150) }}>
                            <CustomText
                                text={`추천수 ${likeLength}`}
                                type={'Medium'}
                                size={16}
                                color={COLORS.gray}
                            />
                            <TouchableOpacity
                                activeOpacity={.9}
                                onPress={() => setReportModalState(true)}
                            >
                                <CustomText
                                    text={'신고하기'}
                                    type={'Bold'}
                                    size={17}
                                    color={COLORS.red}
                                />
                            </TouchableOpacity>
                        </SubscriptionView>
                        <TabView>
                            <MotiView
                                style={{ position: 'absolute', width: '50%', height: '100%', backgroundColor: COLORS.light_green, margin: wt(30), borderRadius: 15 }}
                                animate={{ translateX: tabStatus === 0 ? 0 : wt(600) }}
                            />
                            <TabButton
                                onPress={() => setTabStatus(0)}
                            >
                                <CustomText
                                    text='정보'
                                    size={16}
                                    type='ExtraBold'
                                    color={COLORS.white}
                                />
                            </TabButton>
                            <TabButton
                                onPress={() => setTabStatus(1)}
                            >
                                <CustomText
                                    text='레시피'
                                    size={16}
                                    type='ExtraBold'
                                    color={COLORS.white}
                                />
                            </TabButton>
                        </TabView>
                        {
                            tabStatus === 0
                                ?
                                <MotiView
                                    from={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1000 }}
                                >
                                    <SubscriptionContentView>
                                        <CustomText
                                            text={'소개'}
                                            style={{ marginBottom: ht(50) }}
                                            size={19}
                                            type={'ExtraBold'}
                                        />
                                        <CustomText
                                            text={data['subscription']}
                                            type='SemiBold'
                                            size={17}
                                        />
                                        <CustomText
                                            text={'재료'}
                                            style={{ marginTop: ht(150) }}
                                            size={19}
                                            type={'ExtraBold'}
                                        />
                                        {
                                            data['ingredient']?.map((item, index) => (
                                                <IngredientList item={item} key={index} />
                                            ))
                                        }
                                    </SubscriptionContentView>
                                </MotiView>
                                :
                                <MotiView
                                    from={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1000 }}
                                >
                                    {
                                        data['recipe'].map((item: string, idx: number) => (
                                            <RecipeDetailList
                                                item={item}
                                                idx={idx}
                                                key={idx}
                                            />
                                        ))
                                    }
                                </MotiView>
                        }
                    </Container>
                </ScrollView>
            </>
        </CustomSafeAreaView>
    )
}

const LikeButton = styled.TouchableOpacity`
            width: ${wt(140)}px;
            height: ${ht(140)}px;
            border-radius: 5px;
            justify-content: center;
            align-items: center;
            `

const ImageView = styled.TouchableOpacity`
            width: 100%;
            height: ${ht(1200)}px;
            margin-top: ${ht(50)}px;
            `

const Container = styled.View`
            width: 100%;
            padding: 0 ${wt(80)}px;
            `

const SubscriptionView = styled.View`
            width: 100%;
            height: ${ht(220)}px;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
`

const TabView = styled.View`
            width: 100%;
            height: ${ht(250)}px;
            background-color: ${COLORS.light_gray};
            border-radius: 15px;
            padding: ${wt(30)}px;
            flex-direction: row;
            justify-content: space-between;
            `

const TabButton = styled.TouchableOpacity`
            width: 50%;
            height: 100%;
            justify-content: center;
            align-items: center;
            `

const SubscriptionContentView = styled.View`
            width: 100%;
            padding: ${ht(50)}px 0;
            justify-content: space-between;
            `



export default ChefDetail