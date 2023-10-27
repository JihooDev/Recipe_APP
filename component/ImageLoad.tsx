import LottieView from 'lottie-react-native'
import React from 'react'
import styled from 'styled-components/native'
import { LOTTIE } from '../asset/asset'

const ImageLoad = () => {
    return (
        <Container>
            <LottieView
                source={LOTTIE.skeleton}
                style={{ width: "100%", height: "100%" }}
                resizeMode='cover'
                autoPlay
                loop
            />
        </Container>
    )
}

const Container = styled.View`
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 980;
`

export default ImageLoad