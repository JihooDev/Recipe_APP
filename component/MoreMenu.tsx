import React from 'react'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import { MotiView } from 'moti'
import ReactNativeModal from 'react-native-modal'
import { COLORS } from '../asset/asset'
import CustomText from './CustomText'
import { _deleteRecipe } from '../server/server'
import { Alert } from 'react-native'
import { useNavigation, useNavigationContainerRef } from '@react-navigation/native'
import { StackParamList } from '../types/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

interface Props {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    postId: string
}

interface SideMenu {
    id: number,
    type: string,
    title: string
}

type RootStackNavigationProp = NativeStackNavigationProp<StackParamList>;

const MoreMenu = ({ visible, setVisible, postId }: Props) => {

    const navigation = useNavigation<RootStackNavigationProp>();

    const sideMenuList = [
        {
            id: 1,
            title: "글 수정",
            type: 'set_post'
        },
        {
            id: 2,
            title: "글 삭제",
            type: "delete"
        },
    ]

    const typeAction = (type: string) => {
        switch (type) {
            case "delete":
                return deleteAction();
            case "set_post":
                setVisible(false);
                navigation.push('ModifyPost', { post_id: postId })
        }
    }

    // 포스트 글 삭제하는 함수
    const deleteAction = async () => {
        const postDelete = await _deleteRecipe(postId);

        if (postDelete['status']) {
            Alert.alert('삭제완료', '삭제가 완료되었습니다.', [
                {
                    text: "확인",
                    onPress: () => {
                        setVisible(false);
                        setTimeout(() => {
                            navigation.reset({ routes: [{ name: 'Home' }] });
                        }, 500)
                    }
                }
            ]);
        }
    }

    return (
        <ReactNativeModal
            isVisible={visible}
            onBackdropPress={() => setVisible(false)}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
        >
            <MainView>
                {
                    sideMenuList?.map((item: SideMenu): JSX.Element => (
                        <MenuButton key={item?.id} onPress={() => { typeAction(item.type) }}>
                            <CustomText
                                text={item?.title}
                                size={17}
                                type={'Bold'}
                            />
                        </MenuButton>
                    ))
                }
            </MainView>
        </ReactNativeModal>
    )
}

const MainView = styled.View`
    width: 100%;
    height: ${ht(500)}px;
    background-color: ${COLORS.white};
    border-radius: 10px;
`

const MenuButton = styled.TouchableOpacity`
    width: 100%;
    height: 50%;
    justify-content: center;
    align-items : center;
`

export default MoreMenu