import React from 'react'
import { SafeAreaView } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import ReactNativeModal from 'react-native-modal'
import styled from 'styled-components/native'
import { ht } from '../../responsive/responsive'
import { COLORS } from '../../asset/asset'
import ImageLoad from '../ImageLoad'
import CustomText from '../CustomText'
import CustomSafeAreaView from '../CustomSafeAreaView'

interface Props {
    imageUrl: string,
    isVisible: boolean,
    closeFuc: () => void
}

const ImageViewModal = ({
    imageUrl,
    isVisible,
    closeFuc
}: Props) => {
    return (
        <ReactNativeModal
            isVisible={isVisible}
            style={{ margin: 0, }}
            animationOut={'fadeOut'}
        >
            <CustomSafeAreaView backColor={'#000'}>
                <ImageViewer
                    enableImageZoom={true}
                    enableSwipeDown={true}
                    useNativeDriver={true}
                    imageUrls={[{ url: imageUrl }]}
                    saveToLocalByLongPress={false}
                    onSwipeDown={closeFuc}
                    style={{
                        width: "100%",
                        height: "100%"
                    }}
                />
            </CustomSafeAreaView>
        </ReactNativeModal>
    )
}

const Container = styled.View`
    flex: 1;
`


export default ImageViewModal