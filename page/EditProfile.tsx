import React, { useEffect, useState } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import CustomStatusBar from '../component/CustomStatusBar'
import { COLORS } from '../asset/asset'
import styled from 'styled-components/native'
import { MotiView } from 'moti'
import CustomText from '../component/CustomText'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { _getUser, _modifyUser } from '../server/server'
import { StackParamList, UserResultTypes } from '../types/types'
import { useSetRecoilState } from 'recoil'
import { loadingControl } from '../recoil/control'
import CustomInput from '../component/CustomInput'
import { ht, wt } from '../responsive/responsive'
import BottomButtonView from '../component/BottomButtonView'
import BottomButton from '../component/BottomButton'
import { Alert } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type RootStackNavigationProp = NativeStackScreenProps<StackParamList, 'EditProfile'>;

const EditProfile = ({ navigation }: RootStackNavigationProp) => {

    const [user, setUser] = useState<UserResultTypes | any>({});
    const [userName, setUserName] = useState<string>('');
    const setLoading = useSetRecoilState(loadingControl);

    useEffect(() => {
        getUser();
    }, []);

    // 유저 수정 함수
    const onSubmit = async () => {
        const uid = await AsyncStorage.getItem('uid');

        const postData = {
            ...user,
            nick_name: userName
        }

        const { data, status } = await _modifyUser(uid, postData, setLoading);

        if (status) {

            await AsyncStorage.setItem('user', JSON.stringify(postData));

            Alert.alert('변경완료', `${userName}님 으로 변경이 완료 되었어요!`, [
                {
                    text: "확인",
                    onPress: () => navigation.reset({ routes: [{ 'name': 'Home' }] })
                }
            ])
        }
    }

    // 현재 유저 불러오기
    const getUser = async () => {
        const uid = await AsyncStorage.getItem('uid');

        if (uid) {
            const { data, status } = await _getUser(uid, setLoading);

            if (status) {
                setUser(data[0]);
            }
        }
    }

    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <>
                <CustomStatusBar
                    text={'닉네임 변경'}
                    back
                />
                <Container>
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        delay={1000}
                    >
                        <CustomText
                            text={`${user['nick_name']}님 어떤 닉네임으로 변경 해드릴까요?`}
                            size={18}
                        />
                    </MotiView>
                    <InputContainer>
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            delay={1300}
                        >
                            <CustomInput
                                value={userName}
                                setValue={setUserName}
                                placeholder='변경 하실 닉네임을 적어주세요'
                            />
                        </MotiView>
                    </InputContainer>
                </Container>
                <BottomButtonView>
                    <MotiView
                        from={{ width: "100%" }}
                        animate={{ opacity: userName?.length > 0 ? 1 : 0 }}
                    >
                        <BottomButton
                            text='변경하기'
                            type={'success'}
                            onPress={onSubmit}
                        />
                    </MotiView>
                </BottomButtonView>
            </>
        </CustomSafeAreaView>
    )
}

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`

const InputContainer = styled.View`
    width: 100%;
    height: ${ht(250)}px;
    padding: 0 ${wt(120)}px;
    margin-top: ${ht(120)}px;
`

export default EditProfile