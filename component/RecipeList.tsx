import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import { COLORS, ICON, SHADOW } from '../asset/asset'
import { RecipeListTypes, StackParamList } from '../types/types'
import { Image, StyleSheet } from 'react-native'
import ImageLoad from './ImageLoad'
import CustomText from './CustomText'
import { useNavigation, useRoute } from '@react-navigation/native'
import ImageViewModal from './modal/ImageViewModal'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MotiView } from 'moti'
import MoreMenu from './MoreMenu'

interface Props {
    item: RecipeListTypes,
    navigation: any,
    type?: boolean
}

type RootStackNavigationProp = NativeStackNavigationProp<StackParamList>;

const RecipeList = ({ item, type = false }: Props) => {

    const [imageLoad, setImageLoad] = useState<boolean>(true);
    const navigation = useNavigation<RootStackNavigationProp>();
    const [moreMenu, setMoreMenu] = useState<boolean>(false);

    // 리스트 눌렀을 때 type 조건에 따라
    const listPress = () => {
        if (type) {
            setMoreMenu(!moreMenu);
        } else {
            navigation.navigate({ name: "ChefDetail", merge: true, params: item })
        }
    }

    return (
        <>
            <MotiView
                style={styles.moti}
                animate={{ translateY: moreMenu ? ht(50) : 0, opacity: moreMenu ? 1 : 0 }}
            >
                <BottomContent
                    onPress={() => {
                        setMoreMenu(false);
                        navigation.navigate({ name: "ChefDetail", merge: true, params: item })
                    }}
                >
                    <CustomText
                        text={'자세히 보기'}
                        color={COLORS.white}
                        type={'Bold'}
                    />
                </BottomContent>
                <BottomContent
                    onPress={() => {
                        setMoreMenu(false);
                        navigation.navigate({ name: "MartView", merge: true, params: item })
                    }}
                >
                    <CustomText
                        text={'장보러 가기'}
                        color={COLORS.white}
                        type={'Bold'}
                    />
                </BottomContent>
            </MotiView>
            <RecipeBox
                activeOpacity={.9}
                style={SHADOW}
                onPress={listPress}
                moreMenu={moreMenu}
            >

                <ImageView>
                    <ImageBox
                        activeOpacity={1}
                    >
                        {imageLoad && <ImageLoad />}
                        <Image
                            source={{ uri: item.post_image }}
                            style={{ width: "100%", height: "100%" }}
                            onLoadEnd={() => setImageLoad(false)}
                        />
                    </ImageBox>
                </ImageView>
                <ContentView>
                    <CustomText
                        text={item.post_name}
                        color={COLORS.black}
                        type='ExtraBold'
                        size={20}
                    />
                    <CustomText
                        text={item.created_user?.nick_name}
                        color={COLORS.gray}
                        type='Medium'
                        size={15}
                    />
                </ContentView>
                <NextButtonView>
                    {
                        !type &&
                        <DetailButton
                            activeOpacity={.9}
                        >
                            <Image
                                source={ICON.arrow_right}
                                style={{ width: wt(70) }}
                                resizeMode='contain'
                            />
                        </DetailButton>
                    }
                </NextButtonView>
            </RecipeBox >
        </>
    )
}

const RecipeBox = styled.TouchableOpacity`
    width: 100%;
    height: ${ht(400)}px;
    background-color: ${COLORS.white};
    border-radius: 15px;
    padding: 0 ${wt(30)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ moreMenu }: any) => moreMenu ? ht(250) : ht(80)}px;
    position: relative;
`

const ImageView = styled.View`
    width: 30%;
    height: 100%;
    justify-content: center;
    align-items: center;
`

const ImageBox = styled.TouchableOpacity`
    width: 80%;
    height: 70%;
    background-color: ${COLORS.white};
    border-radius:10px;
    overflow: hidden;
`

const ContentView = styled.View`
    width: 60%;
    height: 70%;
    padding: 0 ${wt(80)}px;
    justify-content: space-between;
`

const NextButtonView = styled.View`
    width: 10%;
    height: 100%;
    justify-content: center;
    align-items: center;
`

const DetailButton = styled.TouchableOpacity`
    width: ${wt(100)}px;
    height: ${ht(100)}px;
    background-color: ${COLORS.black};
    border-radius: 5px;
    justify-content: center;
    align-items: center;
`

const BottomContent = styled.TouchableOpacity`
    width: 50%;
    height: 100%;
    justify-content: center;
    align-items: center;
`

const styles = StyleSheet.create({
    moti: {
        width: "100%",
        position: "absolute",
        height: ht(250),
        backgroundColor: COLORS.light_green,
        bottom: ht(80),
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: "row",
        paddingTop: ht(50),
    }
})

export default RecipeList