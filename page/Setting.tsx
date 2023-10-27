import React, { useRef } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { COLORS, SHADOW } from '../asset/asset'
import CustomText from '../component/CustomText'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import BottomButton from '../component/BottomButton'
import CustomStatusBar from '../component/CustomStatusBar'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BottomParamList, StackParamList } from '../types/types'
import { clearStorage, getStorageUserData } from '../functions/functions'
import { settingMenu } from '../data/menuData'
import { Image } from 'react-native'
import RBSheet from '@nonam4/react-native-bottom-sheet'
import BottomButtonView from '../component/BottomButtonView'
import { _modifyUser } from '../server/server'
import { useSetRecoilState } from 'recoil'
import { loadingControl } from '../recoil/control'

type SettingNavigation = NativeStackScreenProps<BottomParamList | any, "Setting">;

const Setting = ({ navigation }: SettingNavigation) => {

    const confirmModalRef = useRef<RBSheet>(null);
    const setLoading = useSetRecoilState(loadingControl);

    // 버튼을 눌렀을 때 발생하는 함수를 모아놓은 object
    const pressMenu: any = {
        '닉네임 변경': () => { navigation.push('EditProfile') },
        '나의 글': () => { navigation.push('MyPost') },
        // '개발자 정보': () => { navigation.push('AboutDevelover') },
        '회원 탈퇴': () => { confirmModalRef.current?.open() },
        '로그아웃': () => { onSignOut() }
    }

    // 로그아웃 함수
    const onSignOut = async () => {
        const clear = await clearStorage();

        if (clear) {
            navigation.reset({ routes: [{ name: 'SignIn' }] });
        }
    }

    // 탈퇴 함수
    const outApp = async () => {
        const userData = await getStorageUserData();

        if (userData) {
            const modifyData = {
                ...userData,
                user_active: false
            }

            const { status } = await _modifyUser(userData?.uid, modifyData, setLoading);

            if (status) {
                confirmModalRef.current?.close();

                setTimeout(async () => {
                    await onSignOut();
                }, 1500)
            }
        }
    }

    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <>
                <RBSheet
                    ref={confirmModalRef}
                    customStyles={{
                        'container': {
                            width: "100%",
                            height: ht(1200),
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                        }
                    }}
                    animationType='slide'
                    closeOnDragDown={true}
                >
                    <Container>
                        <AlertMessageView>
                            <CustomText
                                text={'정말로 탈퇴 하시겠습니까?'}
                                size={19}
                                style={{ marginBottom: ht(50) }}
                            />
                        </AlertMessageView>
                        <BottomButtonView>
                            <BottomButton
                                text='탈퇴하기'
                                type='failed'
                                onPress={outApp}
                            />
                        </BottomButtonView>
                    </Container>
                </RBSheet>
                <CustomStatusBar
                    text={'설정'}
                />
                <Container>
                    {
                        settingMenu?.map(({ id, title, icon }) => (
                            <MenuButton
                                key={id}
                                style={SHADOW}
                                activeOpacity={.8}
                                onPress={() => { pressMenu[title]() }}
                            >
                                <Image
                                    source={icon}
                                    style={{ width: wt(100), position: "absolute", left: wt(80) }}
                                    resizeMode='contain'
                                />
                                <CustomText
                                    text={title}
                                    size={16}
                                    type='Bold'
                                />
                                <></>
                            </MenuButton>
                        ))
                    }
                </Container>
            </>
        </CustomSafeAreaView>
    )
}

const Container = styled.View`
    flex: 1;
    padding: ${ht(120)}px ${wt(80)}px;
`

const MenuButton = styled.TouchableOpacity`
    width: 100%;
    height: ${ht(250)}px;
    background-color: ${COLORS.white};
    margin-bottom: ${ht(120)}px;
    border-radius: 15px;
    padding: 0 ${wt(80)}px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

const AlertMessageView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`

export default Setting