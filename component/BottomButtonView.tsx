import React from 'react'
import { View } from 'react-native'
import { ht, wt } from '../responsive/responsive'

interface Props {
    style?: object,
    children: JSX.Element
}

const BottomButtonView = ({
    children,
    style
}: Props) => {
    return (
        <View style={{
            width: "100%",
            height: ht(400),
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: wt(80)
        }}>
            {children}
        </View>
    )
}

export default BottomButtonView