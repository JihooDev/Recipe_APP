import React, { Children } from 'react'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import { useNavigation } from '@react-navigation/native'
import CustomText from './CustomText'
import { COLORS, ICON } from '../asset/asset'
import { Image } from 'react-native'
import { sliceText } from '../functions/functions'

interface Props {
    text: string,
    back?: boolean,
    children?: JSX.Element
}

interface StyledProps {
    left?: boolean
}

const CustomStatusBar = ({
    text,
    back = false,
    children
}: Props) => {

    const navigation = useNavigation();

    return (
        <TopView>
            <SideView left={true}>
                {
                    back &&
                    <BackButton
                        activeOpacity={.9}
                        onPress={() => navigation.goBack()}
                    >
                        <Image
                            source={ICON.back}
                            style={{
                                tintColor: COLORS.white,
                                width: wt(80)
                            }}
                            resizeMode='contain'
                        />
                    </BackButton>
                }
            </SideView>
            <CenterView>
                <CustomText
                    text={sliceText(text)}
                    color={COLORS.black}
                    size={20}
                    type={'Bold'}
                />
            </CenterView>
            <SideView>
                {children}
            </SideView>
        </TopView>
    )
}

const TopView = styled.View`
    width: 100%;
    height: ${ht(200)}px;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 ${wt(80)}px;
`

const CenterView = styled.View`
    width: 50%;
    height: 100%;
    justify-content: center;
    align-items: center;
`

const SideView = styled.View`
    width: 25%;
    height: 100%;
    align-items: center;
    flex-direction: row;
    justify-content: ${({ left }: StyledProps) => left ? 'flex-start' : 'flex-end'};
`

const BackButton = styled.TouchableOpacity`
    width: ${wt(140)}px;
    height: ${ht(140)}px;
    background-color: ${COLORS.light_green};
    border-radius: 5px;
    justify-content: center;
    align-items: center;
`

export default CustomStatusBar