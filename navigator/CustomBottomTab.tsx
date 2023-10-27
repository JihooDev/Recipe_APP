import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import { COLORS, ICON, SHADOW } from '../asset/asset'
import { Image } from 'react-native'
import { MotiView } from 'moti'
import { useIsFocused, useNavigationState, useRoute } from '@react-navigation/native'

const CustomBottomTab = ({ state, navigation, descriptors }: any): JSX.Element => {

    const getIcon = (label: string) => {
        switch (label) {
            case "Main":
                return ICON.home
            case "Search":
                return ICON.search;
            case "Chef":
                return ICON.chef
            case "Liked":
                return ICON.like
            case "Setting":
                return ICON.setting
        }
    }

    return (
        <BottomBox>
            <BottomContainer
                style={SHADOW}
            >

                {
                    state.routes.map((route: any, index: number) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                    ? options.title
                                    : route.name;

                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate({ name: route.name, merge: true });
                            }

                        }

                        return (
                            <TabBarButton
                                key={index}
                                onPress={onPress}
                                activeOpacity={1}
                            >
                                <MotiView
                                    style={{ width: "90%", height: "90%", justifyContent: "center", alignItems: "center", borderRadius: 10, backgroundColor: isFocused ? COLORS.black : COLORS.white, }}
                                    from={{ translateY: isFocused ? -ht(10) : 0 }}
                                >
                                    <Image
                                        source={getIcon(label)}
                                        style={{
                                            width: wt(100),
                                            height: ht(100),
                                            tintColor: isFocused ? COLORS.white : COLORS.light_green
                                        }}
                                    />
                                </MotiView>
                            </TabBarButton>
                        )
                    })
                }
            </BottomContainer>
        </BottomBox>
    )
}

const BottomBox = styled.View`
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.white};
    /* background-color: red; */
    height: ${ht(500)}px;
`

const BottomContainer = styled.View`
    width: 90%;
    height: ${ht(250)}px;
    background-color: ${COLORS.white};
    border-radius: 15px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`

const TabBarButton = styled.TouchableOpacity`
    width: ${wt(200)}px;
    height: ${ht(200)}px;
    justify-content: center;
    align-items: center;
`


export default CustomBottomTab