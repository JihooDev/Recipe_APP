import React, { useEffect } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { COLORS, ICON, IMAGES } from '../asset/asset'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import { Alert, Image, StatusBar } from 'react-native'
import CustomText from '../component/CustomText'
import auth, { firebase } from '@react-native-firebase/auth';
import { GOOGLE_CLIENT_ID } from '@env';
import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { loadingControl } from '../recoil/control'
import { _getUser } from '../server/server'
import appleAuth, { AppleButton, AppleButtonStyle } from '@invertase/react-native-apple-authentication';
import { userDataBox } from '../recoil/user'
import jwtDecode from 'jwt-decode'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../types/types'


interface IosTokenTypes {
    aud: string,
    auth_time: number,
    c_hash: string,
    email: string,
    email_verified: string,
    exp: number,
    iat: number,
    is_private_email: string,
    iss: string,
    nonce: string,
    nonce_supported: boolean,
    sub: string
}

type SignInProps = NativeStackScreenProps<StackParamList, "SignIn">;

const SignIn = ({
    navigation
}: SignInProps) => {

    const setLoading = useSetRecoilState(loadingControl);
    const setUserData = useSetRecoilState(userDataBox);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: GOOGLE_CLIENT_ID
        })
    }, [])

    // 애플 로그인
    const appleLogin = async () => {
        try {
            // performs login request
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

            if (credentialState === appleAuth.State.AUTHORIZED) {
                // user is authenticated
                const res = appleAuthRequestResponse;
                const decodedToken: IosTokenTypes = jwtDecode(res.identityToken!);
                console.log(res, '응답갑');
                console.log(decodedToken);

                if (res) {
                    await AsyncStorage.setItem('uid', decodedToken['sub']);
                    await AsyncStorage.setItem('user_name', decodedToken['email']);

                    const checkUser = await _getUser(decodedToken['sub'], setLoading);

                    console.log(checkUser)

                    if (checkUser['status'] === 200) {
                        if (checkUser['data']?.length === 0) return navigation.reset({ routes: [{ name: "SignUp" }] });
                        if (!checkUser['data'][0]?.user_active) return Alert.alert('탈퇴한 회원', '이미 탈퇴 한 회원입니다.');

                        setUserData(checkUser['data'][0]);
                        await AsyncStorage.setItem('user', JSON.stringify(checkUser['data'][0]));
                        navigation.reset({ routes: [{ name: "Home" }] });
                    } else {
                        Alert.alert('탈퇴한 회원', '이미 탈퇴 한 회원입니다.');
                    }
                }
            } else {
                throw Error('not state');
            }

        } catch (error) {
            console.error(error);
        }
    }

    // 구글 로그인
    const signInGoogle = async () => {
        try {
            setLoading(true);
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const { idToken } = await GoogleSignin.signIn();

            if (idToken) {
                await AsyncStorage.setItem('token', idToken);
                const googleCredential = auth.GoogleAuthProvider.credential(idToken);
                const res = await auth().signInWithCredential(googleCredential);

                if (res) {
                    await AsyncStorage.setItem('uid', res.user.uid);
                    await AsyncStorage.setItem('user_name', res.additionalUserInfo?.profile?.name);

                    const checkUser = await _getUser(res.user.uid, setLoading);

                    console.log(checkUser['data'])

                    if (checkUser['status'] === 200) {
                        if (checkUser['data']?.length === 0) return navigation.reset({ routes: [{ name: "SignUp" }] });
                        if (!checkUser['data'][0].user_active) return Alert.alert('탈퇴한 회원', '이미 탈퇴 한 회원입니다.');

                        setUserData(checkUser['data'][0]);
                        await AsyncStorage.setItem('user', JSON.stringify(checkUser['data'][0]));
                        navigation.reset({ routes: [{ name: "Home" }] });
                    }
                }
            }
        } catch (error) {
            console.error(error, '구글 로그인 에러');
        } finally {
            setLoading(false);
        }
    }


    return (
        <CustomSafeAreaView backColor={COLORS.light_green} >
            <>
                <StatusBar barStyle={'light-content'} />
                <MainView>
                    <MainImageView>
                        <Image
                            source={IMAGES.splash}
                            style={{
                                width: wt(900)
                            }}
                            resizeMode='contain'
                        />
                    </MainImageView>
                    <TextView>
                        <CustomText
                            text={'다른 사람의 레시피로\n한끼를 해결하다'}
                            style={{
                                textAlign: "center",
                            }}
                            size={18}
                            color={COLORS.white}
                        />
                    </TextView>
                </MainView>
                <BottomLoginView>
                    <LoginView>
                        <LoginButtonView
                            activeOpacity={.8}
                            onPress={signInGoogle}
                        >
                            <Image
                                source={ICON.google}
                                style={{
                                    width: wt(200)
                                }}
                                resizeMode='contain'
                            />
                        </LoginButtonView>
                        <LoginButtonView
                            activeOpacity={.8}
                        >
                            <AppleButton
                                style={{ width: wt(300), height: ht(300) }}
                                cornerRadius={10}
                                buttonStyle={AppleButton.Style.WHITE_OUTLINE}
                                buttonType={AppleButton.Type.CONTINUE}

                                onPress={appleLogin}
                            />
                        </LoginButtonView>
                    </LoginView>
                </BottomLoginView>
            </>
        </CustomSafeAreaView>
    )
}

const MainView = styled.View`
    flex: 1;
`

const BottomLoginView = styled.View`
    width: 100%;
    height: ${ht(800)}px;
    justify-content: center;
    align-items: center;
`

const MainImageView = styled.View`
    width: 100%;
    height: ${ht(1500)}px;
    justify-content: center;
    align-items: center;
`

const LoginView = styled.View`
    width: 90%;
    height: ${ht(500)}px;
    background-color: ${COLORS.black};
    border-radius: 10px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`

const TextView = styled.View`
    flex: 1;
    align-items: center;
`

const LoginButtonView = styled.TouchableOpacity`
    width: ${wt(440)}px;
    height: ${ht(400)}px;
    justify-content: center;
    align-items: center;
`


export default SignIn