import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { COLORS, SHADOW } from '../asset/asset'
import { ht, wt } from '../responsive/responsive'
import { ScrollView } from 'react-native'
import CustomText from './CustomText'

interface Props {
    item: string;
    idx: number | any;
}

const RecipeDetailList = ({ item, idx }: Props) => {
    return (
        <RecipeList
            style={SHADOW}
        >
            <RecipeIndexList>
                <CustomText
                    text={String(idx + 1)}
                    color={COLORS.light_green}
                    size={15}
                />
            </RecipeIndexList>
            <ScrollView style={{ flex: 1, paddingHorizontal: wt(50) }}>
                <CustomText
                    text={item}
                    color={COLORS.black}
                    size={16}
                    type={'Bold'}
                />
            </ScrollView>
        </RecipeList>
    )
}


const RecipeList = styled.View`
    width: 100%;
    margin: ${ht(40)}px 0;
    background-color: ${COLORS.white};
    border-radius: 10px;
    flex-direction: row;
    padding: ${wt(80)}px;
    min-height: ${ht(305)}px;
`


const RecipeIndexList = styled.View`
    width: ${wt(130)}px;
    height: ${ht(130)}px;
    background-color: ${COLORS.light_gray};
    justify-content: center;
    align-items: center;
    border-radius: 5px;
`

export default RecipeDetailList