import React, { useEffect, useState } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { COLORS } from '../asset/asset'
import CustomStatusBar from '../component/CustomStatusBar'
import styled from 'styled-components/native'
import { MotiView } from 'moti'
import { ht, wt } from '../responsive/responsive'
import CustomText from '../component/CustomText'
import CustomInput from '../component/CustomInput'
import BottomButtonView from '../component/BottomButtonView'
import BottomButton from '../component/BottomButton'
import { Alert, FlatList, StatusBar } from 'react-native'
import { foodData } from '../data/food'
import FoodFlatList from '../component/FoodFlatList'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { loadingControl } from '../recoil/control'
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { _joinUser } from '../server/server'
import { userDataBox } from '../recoil/user'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../types/types'

type SignUpProps = NativeStackScreenProps<StackParamList, "SignUp">;

const SignUp = ({
    navigation
}: SignUpProps) => {

    const [loading, setLoading] = useRecoilState(loadingControl);
    const [nickName, setNickName] = useState<string>('');
    const setUserData = useSetRecoilState(userDataBox);

    // 회원가입 함수
    const onSignIn = async () => {
        const uid = await AsyncStorage.getItem('uid');
        const user_name = await AsyncStorage.getItem('user_name');

        const postServerData = {
            uid,
            nickName,
            user_name
        }

        const joinServer = await _joinUser(postServerData, setLoading);

        if (joinServer['status']) {
            setUserData(joinServer['data']);
            await AsyncStorage.setItem('user', JSON.stringify(joinServer['data']));
            navigation.reset({ routes: [{ name: "Home" }] });
        } else {
            Alert.alert('이미 사용중인 닉네임', '다른 닉네임으로 시도해주세요');
        }
    }

    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <>
                <StatusBar barStyle={'light-content'} />
                <MotiView
                    style={{
                        width: '100%',
                        height: ht(500),
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    from={{ opacity: 0, translateY: -ht(500) }}
                    animate={{ opacity: 1, translateY: 0 }}
                    delay={1000}
                >
                    <CustomText
                        text={'환영합니다!'}
                        color={COLORS.black}
                        size={24}
                        type={'ExtraBold'}
                    />
                    <CustomText
                        text={'닉네임을 입력해주세요'}
                        color={COLORS.black}
                        size={17}
                        style={{
                            marginTop: ht(50)
                        }}
                    />
                </MotiView>
                <Container>
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ width: "100%", height: ht(250) }}
                    >
                        <CustomInput
                            value={nickName}
                            setValue={setNickName}
                            placeholder={'사용하실 닉네임을 적어주세요'}
                        />
                    </MotiView>
                    {/* <MotiView>
                        <SelectView>
                            <CustomText
                                text={'* 좋아하는 음식을 선택해주세요!'}
                                size={13}
                            />
                            <FlatList
                                data={foodData}
                                renderItem={item => { return <FoodFlatList data={item.item} /> }}
                                style={{ paddingVertical: ht(50) }}
                            />
                        </SelectView>
                    </MotiView> */}
                </Container>
                <BottomButtonView>
                    <MotiView
                        style={{ width: '100%' }}
                        animate={{ translateY: nickName.length > 0 ? 0 : ht(550) }}
                    >
                        <BottomButton
                            text={'회원가입'}
                            onPress={onSignIn}
                        />
                    </MotiView>
                </BottomButtonView>
            </>
        </CustomSafeAreaView>
    )
}

const Container = styled.View`
    flex: 1;
    padding: ${ht(120)}px ${wt(80)}px;
`

const SelectView = styled.View`
    width: 100%;
    height: ${ht(1200)}px;
    background-color: ${COLORS.white};
    margin-top: ${ht(120)}px;
    border-radius: 10px;
    padding: ${wt(80)}px;
`


export default SignUp