import React, { useState } from 'react'
import ReactNativeModal from 'react-native-modal'
import styled from 'styled-components/native'
import { font, ht, wt } from '../../responsive/responsive'
import { COLORS } from '../../asset/asset'
import CustomStatusBar from '../CustomStatusBar'
import { TextInput } from 'react-native'
import BottomButtonView from '../BottomButtonView'
import BottomButton from '../BottomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface Props {
    visible: boolean,
    closeFuc: () => void,
    onSubmit: (postText: string) => void
}

const ReportModal = ({
    visible,
    closeFuc,
    onSubmit
}: Props) => {

    const [postText, setPostText] = useState<string>('');

    return (
        <ReactNativeModal
            isVisible={visible}
            onBackdropPress={closeFuc}
        >

            <ModalContainer>

                <CustomStatusBar
                    text='신고하기'
                />
                <Container>
                    <TextInput
                        style={{
                            width: '100%',
                            height: '100%',
                            borderColor: COLORS.gray,
                            fontSize: font(15),
                            borderWidth: 2,
                            padding: wt(30),
                            borderRadius: 5,
                            fontFamily: 'Pretendard-Bold'
                        }}
                        multiline={true}
                        placeholder='신고하실 내용을 적어주세요'
                        onChangeText={(text: string) => setPostText(text)}
                        value={postText}
                    />
                </Container>
                <BottomButtonView>
                    <BottomButton
                        type='failed'
                        text='신고하기'
                        onPress={() => onSubmit(postText)}
                    />
                </BottomButtonView>
            </ModalContainer>
        </ReactNativeModal>
    )
}

const ModalContainer = styled.View`
    width: 100%;
    height: ${ht(1400)}px;
    background-color: ${COLORS.white};
    border-radius: 15px;
`

const Container = styled.View`
    flex: 1;
    padding: 0 ${wt(80)}px;
`


export default ReportModal