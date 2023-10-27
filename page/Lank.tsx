import React, { useEffect, useState } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { COLORS } from '../asset/asset'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecipeListTypes, StackParamList } from '../types/types';
import CustomStatusBar from '../component/CustomStatusBar';
import { _getLankAll } from '../server/server';
import { Alert, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { ht, wt } from '../responsive/responsive';
import LankPageList from '../component/LankPageList';
import CustomText from '../component/CustomText';

type RootStackNavigationProp = NativeStackScreenProps<StackParamList, 'Lank'>;

const Lank = ({ navigation }: RootStackNavigationProp) => {

    const [lankData, setLankData] = useState<RecipeListTypes[]>([]);

    useEffect(() => {
        getAllLank();
    }, [])

    // 랭킹 데이터 가져오기
    const getAllLank = async () => {
        const { data, status } = await _getLankAll();

        if (status) {
            setLankData(data);
        } else {
            Alert.alert('불러오기 실패', '랭킹을 불러오기 실패 했습니다.\n잠시 후 다시 시도 해주세요', [{
                text: "뒤로가기",
                onPress: () => navigation.goBack()
            }])
        }
    }

    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <>
                <CustomStatusBar text={'랭킹'} back />
                <Container>
                    <FlatList
                        data={lankData}
                        renderItem={({ item, index }) => {
                            return (
                                <ListContainer>
                                    <IndexView>
                                        <CustomText
                                            text={String(index + 1)}
                                            color={COLORS.light_gray}
                                            type={'Bold'}
                                        />
                                    </IndexView>
                                    <LankPageList data={item} index={index} />
                                </ListContainer>
                            )
                        }}
                        style={{ paddingHorizontal: wt(5) }}
                    />
                </Container>
            </>
        </CustomSafeAreaView>
    )
}

const Container = styled.View`
    flex: 1;
    padding: ${ht(50)}px ${wt(80)}px;
`

const ListContainer = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${ht(70)}px;
`

const IndexView = styled.View`
    width: ${wt(130)}px;
    height: ${ht(130)}px;
    background-color: ${COLORS.light_green};
    border-radius: 5px;
    justify-content: center;
    align-items: center;
`

export default Lank