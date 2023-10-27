import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components/native'
import { font, ht, wt } from '../responsive/responsive'
import { COLORS, ICON } from '../asset/asset'
import { MotiView } from 'moti'
import { Image, StyleSheet, TextInput } from 'react-native'
import CustomText from './CustomText'

interface Props {
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    onSubmit: () => void
}

const SearchTab = ({
    value,
    setValue,
    onSubmit
}: Props) => {

    const [focused, setFocused] = useState(false);

    return (
        <MotiView
            style={{
                width: "100%",
                height: ht(230),
                borderWidth: 2,
                borderRadius: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                overflow: "hidden",
            }}
            animate={{ borderColor: value?.length > 0 ? COLORS.green : COLORS.border_gray }}
        >
            <MotiView
                animate={{ width: "20%", height: '100%', opacity: value?.length === 0 ? 1 : 0 }}
                style={{ justifyContent: "center", alignItems: "center" }}
            >
                <Image
                    source={ICON.search}
                    style={{ width: wt(90) }}
                    resizeMode='contain'
                />

            </MotiView>
            <MotiView
                style={{ width: "50%", height: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                animate={{ translateX: value?.length === 0 ? 0 : -50 }}
            >
                <TextInput
                    style={{ width: "100%", height: "100%", fontFamily: "Pretendard-Medium", fontSize: font(16) }}
                    value={value}
                    onChangeText={text => setValue(text)}
                    onFocus={() => setFocused(true)}
                    placeholder='ex. 라면'
                    placeholderTextColor={COLORS.gray}
                />
            </MotiView>
            <MotiView
                style={{ width: "30%", height: "100%", paddingRight: wt(80) }}
                animate={{ translateX: value?.length === 0 ? 100 : 0 }}
            >
                <SearchButton
                    onPress={onSubmit}
                >
                    {/* <Image
                        source={ICON.search}
                        style={{ width: wt(90) }}
                        resizeMode='contain'
                    /> */}
                    <SubmitButton>
                        <CustomText
                            text='찾기'
                            color={COLORS.white}
                        />
                    </SubmitButton>
                </SearchButton>
            </MotiView>
        </MotiView >
    )
}

const SearchButton = styled.TouchableOpacity`
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: flex-end;
`

const SubmitButton = styled.View`
    width: 90%;
    height: 70%;
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.green};
    border-radius: 10px;
`

export default SearchTab