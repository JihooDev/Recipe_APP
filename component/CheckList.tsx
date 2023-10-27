import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import { COLORS, SHADOW } from '../asset/asset'
import CustomText from './CustomText'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from '@react-native-async-storage/async-storage'

const CheckList = ({ item, index, onSelect }: any) => {

    return (
        <CheckListView
            style={SHADOW}
        >
            <NumberView>
                <CustomText
                    text={index + 1}
                    color={COLORS.white}
                    type={'Bold'}
                    size={16}
                />
            </NumberView>
            <ContentView>
                <CustomText
                    text={item.item}
                    size={17}
                    type='Bold'
                />
            </ContentView>
            <BouncyCheckbox
                size={wt(120)}
                fillColor={COLORS.light_green}
                unfillColor="#FFFFFF"
                onPress={() => onSelect(item.item)}
                isChecked={item.selected}
                iconStyle={{ borderColor: "red" }}
                innerIconStyle={{ borderWidth: 2 }}
                style={{ position: 'absolute', right: wt(10) }}
            />
        </CheckListView>
    )
}

const CheckListView = styled.View`
    width: 100%;
    height: ${ht(250)}px;
    flex-direction: row;
    background-color: ${COLORS.white};
    border-radius: 15px;
    margin-top: ${ht(50)}px;
    padding: 0 ${wt(80)}px;
    align-items: center;
`


const NumberView = styled.View`
    width: ${wt(150)}px;
    height: ${ht(150)}px;
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.gray};
    border-radius: 5px;
`

const ContentView = styled.View`
    width: 70%;
    height: 100%;
    justify-content: center;
    padding: 0 ${wt(70)}px;
`

export default CheckList