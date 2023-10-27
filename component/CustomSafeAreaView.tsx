import React from 'react'
import { SafeAreaView } from 'react-native'

interface Props {
    backColor: string,
    children: JSX.Element
}

const CustomSafeAreaView = ({
    backColor,
    children
}: Props) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: backColor }} >
            {children}
        </SafeAreaView>
    )
}

export default CustomSafeAreaView;