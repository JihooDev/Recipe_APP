import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import { _getLankPosts } from '../server/server'
import { RecipeListTypes } from '../types/types'
import Carousel from 'react-native-snap-carousel';
import LankList from './LankList'
import { Dimensions } from 'react-native'

interface StyledProps {
    topLank?: boolean
}

const LankView = () => {

    const [lankData, setLankData] = useState<RecipeListTypes[] | any>([]);

    const sliderWidth = Dimensions.get('window').width;

    useEffect(() => {
        getLankData();
    }, [])

    // 랭킹 데이터 가져오기
    const getLankData = async () => {
        const getServerData = await _getLankPosts();

        if (getServerData['status']) {
            setLankData(getServerData['data']);
        }
    }

    return (
        <Container>
            <Carousel
                data={lankData}
                renderItem={({ item, index }: RecipeListTypes | any) => { return <LankList item={item} index={index} /> }}
                sliderWidth={sliderWidth}
                itemWidth={sliderWidth * .9}
                vertical={false}
                containerCustomStyle={{
                    paddingVertical: ht(20)
                }}
            />
        </Container>
    )
}

const Container = styled.View`
    width: 100%;
    height: ${ht(1000)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

export default LankView