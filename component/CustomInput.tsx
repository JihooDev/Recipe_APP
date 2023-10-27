import { MotiView } from 'moti'
import React, { Dispatch, SetStateAction } from 'react'
import { TextInput, Image } from 'react-native'
import { font, ht, wt } from '../responsive/responsive'
import { COLORS, ICON } from '../asset/asset'
import styled from 'styled-components/native'

interface Props {
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    placeholder?: string,
    add?: boolean,
    onPress?: Function
}

const CustomInput = ({
    value,
    setValue,
    placeholder,
    add = false,
    onPress = () => { console.log('not action') }
}: Props) => {
    return (
        <MotiView
            style={{ width: "100%", height: "100%", position: "relative", flexDirection: 'row', alignItems: "center" }}
        >
            <TextInput
                value={value}
                onChangeText={(text) => setValue(text)}
                placeholder={placeholder}
                style={{
                    fontFamily: "Pretendard-Medium",
                    fontSize: font(16),
                    color: COLORS.black,
                    width: add ? "80%" : "100%",
                    height: "100%"
                }}
                placeholderTextColor={COLORS.gray}
            />
            {
                add &&
                <PlusButtonView>
                    <PlusButton
                        onPress={onPress}
                    >
                        <MotiView
                            style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}
                            animate={{ backgroundColor: value?.length > 0 ? COLORS.blue : COLORS.gray }}
                        >
                            <Image
                                source={ICON.plus}
                                style={{ width: wt(80), tintColor: COLORS.white }}
                                resizeMode='contain'
                            />
                        </MotiView>
                    </PlusButton>
                </PlusButtonView>
            }
            <MotiView
                style={{ position: "absolute", bottom: 0, width: "100%", height: ht(13) }}
                animate={{ backgroundColor: value.length > 0 ? COLORS.blue : COLORS.gray }}
            />
        </MotiView>
    )
}

const PlusButtonView = styled.View`
    width: 20%;
    height: 100%;
    align-items: flex-end;
    justify-content: center;
`

const PlusButton = styled.TouchableOpacity`
    width: ${wt(140)}px;
    height: ${ht(140)}px;
    overflow: hidden;
    border-radius: 50px;
    justify-content: center;
    align-items: center;
`

export default CustomInput