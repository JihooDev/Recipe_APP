import React from 'react';
import { ReactNativeModal } from 'react-native-modal';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loadingControl } from '../recoil/control';
import LottieView from 'lottie-react-native';
import { LOTTIE } from '../asset/asset';
import { ht, wt } from '../responsive/responsive';

const Loading = () => {

    const state = useRecoilValue(loadingControl);

    return (
        <ReactNativeModal
            isVisible={state}
            style={{ justifyContent: "center", alignItems: "center" }}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
        >
            <LottieView
                source={LOTTIE.loading}
                style={{ width: wt(500), height: ht(500) }}
                autoPlay
                loop
            />
        </ReactNativeModal>
    )
}

export default Loading