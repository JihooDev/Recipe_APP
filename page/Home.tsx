import React, { useEffect } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { FlatList, ScrollView, Text, TouchableOpacity } from 'react-native'
import { COLORS } from '../asset/asset'
import CustomText from '../component/CustomText'
import { MotiView } from 'moti'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import { foodData } from '../data/food'
import FoodFlatList from '../component/FoodFlatList'
import LankView from '../component/LankView'
import TodayFoodView from '../component/TodayFoodView'
import { BottomParamList } from '../types/types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type HomeNavigation = NativeStackScreenProps<BottomParamList | any, "Home">;

const Home = ({ navigation }: HomeNavigation) => {
    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <ScrollView>
                <HeaderBar>
                    <HeaderLeftView>
                        <CustomText
                            text={'오늘은 모머글까?'}
                            size={23}
                            type={'ExtraBold'}
                        />
                    </HeaderLeftView>
                </HeaderBar>
                <MainTabView>
                    <TodayFoodView />
                </MainTabView>
                <LabelView>
                    <CustomText
                        text={'랭킹'}
                        size={17}
                        type={'Bold'}
                    />
                    <TouchableOpacity
                        style={{ width: wt(180), height: ht(180), justifyContent: "center", alignItems: "center" }}
                        activeOpacity={.5}
                        onPress={() => navigation.push('Lank')}
                    >
                        <CustomText
                            text={'더보기'}
                            size={15}
                            color={COLORS.gray}
                        />
                    </TouchableOpacity>
                </LabelView>
                <LankView />
            </ScrollView>
        </CustomSafeAreaView>
    )
}

const HeaderBar = styled.View`
    width: 100%;
    height: ${ht(350)}px;
    padding: 0 ${wt(80)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const MainTabView = styled.View`
    width: 100%;
    height: ${ht(700)}px;
    justify-content: center;
    align-items: center;
    padding: 0 ${wt(80)}px;
`

const HeaderLeftView = styled.View`
    width: 50%;
    height: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const LabelView = styled.View`
    width: 100%;
    height: ${ht(200)}px;
    padding: 0 ${wt(80)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

export default Home