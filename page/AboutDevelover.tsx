import React from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { COLORS } from '../asset/asset'
import CustomStatusBar from '../component/CustomStatusBar'

const AboutDevelover = () => {
    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <>
                <CustomStatusBar
                    text={'개발자 정보'}
                    back
                />
            </>
        </CustomSafeAreaView>
    )
}

export default AboutDevelover