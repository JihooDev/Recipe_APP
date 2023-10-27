import React, { useEffect, useState } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { COLORS } from '../asset/asset'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '../types/types';
import CustomStatusBar from '../component/CustomStatusBar';
import { FlatList } from 'react-native';
import CheckList from '../component/CheckList';
import { wt } from '../responsive/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MarketViewProps = NativeStackScreenProps<StackParamList, "MartView">;

const MartView = ({ route, navigation }: MarketViewProps) => {

    const [recipeList, setRecipeList] = useState([]);
    const data = route.params;


    useEffect(() => {
        checkPostMenu();
    }, [])

    // AsyncStorage에 아이템의 아이디가 있는지 비교
    const checkPostMenu = async () => {
        const menuCheck = await AsyncStorage.getItem(data['post_id']);
        let pushItemArr: any = [];
        let parseItem;

        if (menuCheck) {
            parseItem = JSON.parse(menuCheck);
            pushItemArr = parseItem.map((item: any) => ({ ...item }));
            setRecipeList(pushItemArr);
        } else {

            data['ingredient'].forEach((item: any, index: any) => {
                pushItemArr.push({
                    item,
                    index,
                    seleted: false
                })

                setRecipeList(pushItemArr);
            })

            AsyncStorage.setItem(data['post_id'], JSON.stringify(pushItemArr));
        }
    }

    // 메뉴를 선택했을 때 발생하는 함수
    const checkMyMenu = async (item: string) => {
        const menuCheck = await AsyncStorage.getItem(data['post_id']);

        if (menuCheck) {
            let parseItem = JSON.parse(menuCheck);

            parseItem.forEach((itemValue: any, index: number) => {
                if (item === itemValue.item) {
                    parseItem[index] = {
                        ...itemValue,
                        selected: !itemValue.selected
                    }
                }
            })

            await AsyncStorage.setItem(data['post_id'], JSON.stringify(parseItem));

            setRecipeList(parseItem);
        }
    }


    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <>
                <CustomStatusBar
                    text={data['post_name']}
                    back
                />
                <FlatList
                    data={recipeList}
                    renderItem={({ item, index }) => { return <CheckList item={item} index={index} onSelect={checkMyMenu} /> }}
                    style={{ paddingHorizontal: wt(80) }}
                />
            </>
        </CustomSafeAreaView>
    )
}

export default MartView