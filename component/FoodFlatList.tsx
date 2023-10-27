import React from 'react'
import styled from 'styled-components/native'
import { ht } from '../responsive/responsive'
import CustomText from './CustomText'

interface PropObj {
    id: number,
    name: string,
    type: string
}

interface Props {
    data: PropObj
}

const FoodFlatList = ({
    data
}: Props) => {
    return (
        <FoodListView>
            <CustomText text={data.name} />
        </FoodListView>
    )
}

const FoodListView = styled.TouchableOpacity`
    width: 100%;
    height: ${ht(250)}px;
    margin-top: ${ht(30)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

export default FoodFlatList