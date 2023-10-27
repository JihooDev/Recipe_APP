import React from 'react'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import { COLORS, SHADOW } from '../asset/asset'
import CustomText from './CustomText'

interface Props {
    item: string
}

const IngredientList = ({
    item
}: Props): JSX.Element => {
    return (
        <ListView style={SHADOW}>
            <CustomText
                text={item}
                type={'ExtraBold'}
                size={18}
            />
        </ListView>
    )
}

const ListView = styled.View`
    width: 100%;
    height: ${ht(250)}px;
    background-color: ${COLORS.white};
    border-radius: 15px;
    margin-top: ${ht(80)}px;
    justify-content: center;
    align-items: center;
`

export default IngredientList