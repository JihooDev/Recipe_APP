import React from 'react'
import { COLORS } from '../asset/asset'
import { Text } from 'react-native'
import { font } from '../responsive/responsive'

interface Props {
    text: string,
    type?: "Black" | "Bold" | "ExtraBold" | "ExtraLight" | "Light" | "Medium" | "Regular" | "SemiBold" | "Thin",
    color?: string | any,
    size?: number | any,
    style?: object
}

const CustomText = ({
    text,
    type = 'Medium',
    color = COLORS.black,
    size = 15,
    style
}: Props) => {
    return (
        <Text style={{
            color,
            fontSize: font(size),
            fontFamily: `Pretendard-${type}`,
            ...style
        }}>
            {text}
        </Text>
    )
}

export default CustomText