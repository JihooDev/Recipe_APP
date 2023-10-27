import React, { useState } from 'react'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import { RecipeListTypes, StackParamList } from '../types/types'
import { COLORS, SHADOW } from '../asset/asset'
import CustomText from './CustomText'
import { Image } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import ImageLoad from './ImageLoad'

interface Props {
    data: RecipeListTypes,
    index: number
}

type RootStackNavigationProp = NativeStackNavigationProp<StackParamList>;

const LankPageList = ({ data, index }: Props) => {

    const [imageLoad, setImageLoad] = useState<boolean>(true);
    const navigation = useNavigation<RootStackNavigationProp>();

    return (
        <LankListView
            index={index}
            style={SHADOW}
            activeOpacity={.9}
            onPress={() => navigation.navigate({ name: 'ChefDetail', merge: true, params: data })}
        >
            <ImageView>
                {imageLoad && <ImageLoad />}
                <Image
                    source={{ uri: data['post_image'] }}
                    style={{ width: "100%", height: "100%" }}
                    onLoadEnd={() => setImageLoad(false)}
                />
            </ImageView>
            <CustomText
                text={data['post_name']}
                size={17}
                type={'Bold'}
            />
        </LankListView >
    )
}

const LankListView = styled.TouchableOpacity`
    width: 85%;
    height: ${ht(280)}px;
    background-color: ${COLORS.white};
    flex-direction: row;
    align-items: center;
    border-radius: 15px;
    padding: 0 ${wt(80)}px;
`

const ImageView = styled.View`
    width: ${wt(200)}px;
    height: ${ht(200)}px;
    border-radius: 5px;
    overflow: hidden;
    margin-right: ${wt(80)}px;
`

export default LankPageList