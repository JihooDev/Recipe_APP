import React, { useState } from 'react'
import styled from 'styled-components/native'
import { RecipeListTypes, StackParamList } from '../types/types'
import { COLORS, SHADOW } from '../asset/asset'
import { Image, ImageBackground } from 'react-native'
import CustomText from './CustomText'
import ImageLoad from './ImageLoad'
import { ht, wt } from '../responsive/responsive'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type RootStackNavigationProp = NativeStackNavigationProp<StackParamList>;


const LankList = ({ item, index }: RecipeListTypes | any) => {

    const [imageLoad, setImageLoad] = useState<boolean>(true);
    const navigation = useNavigation<RootStackNavigationProp>();

    return (
        <LankListView
            onPress={() => navigation.navigate({ name: "ChefDetail", merge: true, params: item })}
            style={SHADOW}
            activeOpacity={.9}
        >
            <TopView>
                {imageLoad && <ImageLoad />}
                <Image
                    source={{ uri: item['post_image'] }}
                    style={{ width: '100%', height: "100%", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    resizeMode='cover'
                    onLoadEnd={() => setImageLoad(false)}
                />
            </TopView>
            <BottomView>
                <NumberView>
                    <CustomText
                        text={index + 1}
                        color={COLORS.white}
                        type={'ExtraBold'}
                        size={16}
                    />
                </NumberView>
                <CustomText
                    text={item['post_name']}
                    style={{ marginLeft: wt(80) }}
                    type={'ExtraBold'}
                    size={18}
                />
            </BottomView>
        </LankListView>
    )
}

const LankListView = styled.TouchableOpacity`
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background-color: ${COLORS.white};
`

const TopView = styled.View`
    width: 100%;
    height: 75%;
    border-top-right-radius: 10px;
    overflow: hidden;
    border-top-left-radius: 10px;
`

const BottomView = styled.View`
    flex: 1;
    padding: 0 ${wt(40)}px;
    flex-direction: row;
    align-items: center;
`

const NumberView = styled.View`
    width: ${wt(150)}px;
    height: ${ht(150)}px;
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.light_green};
    border-radius: 5px;
`

export default LankList