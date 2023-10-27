import React, { useEffect } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { APP, COLORS, ICON, IMAGES } from '../asset/asset'
import CustomText from '../component/CustomText'
import styled from 'styled-components/native'
import { Image, StatusBar } from 'react-native'
import { ht, wt } from '../responsive/responsive'
import { MotiView } from 'moti'
import BottomButtonView from '../component/BottomButtonView'
import BottomButton from '../component/BottomButton'
import { firebase } from '@react-native-firebase/auth'
import { initConfig } from '../server/initConfigData'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { _getUser } from '../server/server'
import { useSetRecoilState } from 'recoil'
import { loadingControl } from '../recoil/control'

const Splash = ({
    navigation
}: any) => {

    const setLoading = useSetRecoilState(loadingControl);

    useEffect(() => {
        setTimeout(() => {
            checkUser();
        }, 1500)
    }, [])

    // 유저가 이미 로그인 한 유저인지 체크하는 함수입니다.
    const checkUser = async () => {
        const checkStorageDefault = await AsyncStorage.getItem('user');

        if (checkStorageDefault) {
            const parseData = JSON.parse(checkStorageDefault);

            const checkServer = await _getUser(parseData.uid ? parseData.uid : parseData[0].uid, setLoading);

            if (checkServer.data) {
                navigation.reset({ routes: [{ name: "Home" }] })
                // navigation.reset({ routes: [{ name: "SignIn" }] })
            }
        } else {
            navigation.reset({ routes: [{ name: "SignIn" }] });
        }
    }

    return (
        <CustomSafeAreaView backColor={COLORS.light_green}>
            <>
                <StatusBar barStyle={'light-content'} />
                <MainView>
                    <Image
                        source={ICON.logo}
                        style={{
                            width: wt(400),
                            height: ht(400)
                        }}
                        resizeMode='contain'
                    />
                </MainView>
            </>
        </CustomSafeAreaView>
    )
}

const MainView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`

const ImageView = styled.View`
    width: 100%;
    height: ${ht(1200)}px;
    justify-content: center;
    align-items: center;
`

export default Splash