import React from 'react'
import { TouchableOpacity } from 'react-native'
import CustomText from './CustomText'
import { ht, wt } from '../responsive/responsive'
import { COLORS } from '../asset/asset'

interface Props {
    text: string,
    type?: 'default' | 'success' | 'failed',
    style?: object,
    onPress?: any
}

const BottomButton = ({
    text,
    type = 'default',
    style,
    onPress
}: Props) => {

    const buttonType = {
        'default': COLORS.button,
        'success': COLORS.green,
        'failed': COLORS.red
    }

    return (
        <TouchableOpacity
            style={{
                width: "100%",
                height: ht(230),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: wt(20),
                backgroundColor: buttonType[type],
                ...style
            }}
            activeOpacity={.9}
            onPress={onPress}
        >
            <CustomText
                text={text}
                color={COLORS.white}
                size={17}
                type='Bold'
            />
        </TouchableOpacity>
    )
}

export default BottomButton