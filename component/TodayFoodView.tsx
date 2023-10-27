import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import { COLORS, ICON, SHADOW } from '../asset/asset'
import { Image, ImageBackground, TouchableOpacity } from 'react-native'
import CustomText from './CustomText'
import { TodayFoodTypes, UserResultTypes } from '../types/types'
import { getStorageUserData } from '../functions/functions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { _getTodayFood } from '../server/server'
import moment from 'moment'
import { useFocusEffect } from '@react-navigation/native'

const TodayFoodView = () => {

    const [user, setUser] = useState<UserResultTypes | any>({});
    const [todayFood, setTodayFood] = useState<TodayFoodTypes | any>({});

    useFocusEffect(
        useCallback(() => {
            getUser();
            getTodayFood();
        }, [])
    )

    // 유저를 가져오는 함수
    const getUser = async () => {
        try {
            const userData = await getStorageUserData();

            setUser(userData);
        } catch (error) {
            setUser('회원');
        }
    }

    // 추천음식 가져오기 (날짜 비교)
    const getTodayFood = async (reflesh = false) => {
        const getStorageFood = await AsyncStorage.getItem('today_food');

        let parseStorageFood;

        if (getStorageFood) {
            parseStorageFood = JSON.parse(getStorageFood);
        }

        if (!getStorageFood || parseStorageFood?.update !== moment().format('YYYYMMDD') || reflesh) {
            const getFood = await _getTodayFood();

            if (getFood['status']) {
                setTodayFood(getFood['data']);
                await AsyncStorage.setItem('today_food', JSON.stringify({
                    ...getFood['data'],
                    update: moment().format('YYYYMMDD')
                }))
            }
        } else {
            setTodayFood(parseStorageFood);
        }
    }

    return (
        <Container
            style={SHADOW}
        >
            <ImageBackground
                source={ICON.card}
                style={{ flex: 1, padding: wt(80) }}
            >
                <TopView>
                    <CustomText
                        text={`${user['nick_name']}님 안녕하세요!`}
                        color={COLORS.white}
                        size={20}
                        type={'ExtraBold'}
                    />
                    <TouchableOpacity
                        onPress={() => getTodayFood(true)}
                    >
                        <Image
                            source={ICON.reflesh}
                            style={{ width: wt(120), tintColor: COLORS.white }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </TopView>
                <BottomView>
                    <CustomText
                        text={`오늘 ${todayFood['name']}는 어떨까요?`}
                        color={COLORS.white}
                        size={23}
                        type={'Bold'}
                    />
                </BottomView>
            </ImageBackground>
        </Container>
    )
}

const Container = styled.View`
    width: 100%;
    height: 100%;
    background-color: ${COLORS.white};
    border-radius: 15px;
    overflow: hidden;
`

const TopView = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const BottomView = styled.View`
    flex: 1;
    justify-content: center;
`

export default TodayFoodView