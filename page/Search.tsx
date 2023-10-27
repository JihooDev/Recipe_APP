import React, { useCallback, useState } from 'react'
import CustomSafeAreaView from '../component/CustomSafeAreaView'
import { COLORS } from '../asset/asset'
import CustomStatusBar from '../component/CustomStatusBar'
import styled from 'styled-components/native'
import { ht, wt } from '../responsive/responsive'
import SearchTab from '../component/SearchTab'
import { BottomParamList, RecipeListTypes } from '../types/types'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { loadingControl } from '../recoil/control'
import { _searchRecipe } from '../server/server'
import { FlatList } from 'react-native'
import RecipeList from '../component/RecipeList'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import CustomText from '../component/CustomText'
import NoResultView from '../component/NoResultView'
import { useFocusEffect } from '@react-navigation/native'

type SearchNavigation = NativeStackScreenProps<BottomParamList | any, "Search">;

const Search = ({ navigation }: SearchNavigation) => {

    const [searchValue, setSearchValue] = useState<string>('');
    const [loading, setLoading] = useRecoilState(loadingControl);
    const [searchResult, setSearchResult] = useState<RecipeListTypes | any>([]);
    const [firstVisit, setFirstVisit] = useState<boolean>(true);

    // 처음 탭으로 들어왔을 때 텍스트 초기화
    useFocusEffect(
        useCallback(() => {
            setFirstVisit(true);
        }, [])
    )

    // 음식 검색 버튼을 눌렀을 때 일어나는 함수
    const searchPost = async () => {
        const getDataList = await _searchRecipe(searchValue, setLoading);

        if (getDataList['status']) {
            console.log(getDataList['data']);
            setSearchResult(getDataList['data']);
            setFirstVisit(false);
        }
    }

    return (
        <CustomSafeAreaView backColor={COLORS.white}>
            <Container>
                <SearchView>
                    <SearchTab
                        value={searchValue}
                        setValue={setSearchValue}
                        onSubmit={searchPost}
                    />
                </SearchView>
                {
                    !loading &&
                    <>
                        {
                            searchResult?.length > 0 &&
                            <ResultView>
                                <CustomText
                                    text={`${searchResult?.length}개의 레시피`}
                                    type={'Bold'}
                                />
                            </ResultView>
                        }
                        {
                            searchResult?.length > 0
                                ?
                                <FlatList
                                    data={searchResult}
                                    style={{ paddingTop: ht(80), paddingHorizontal: wt(20) }}
                                    renderItem={(item) => { return <RecipeList item={item.item} navigation={navigation} /> }}
                                />
                                :
                                <NoResultView
                                    content={firstVisit ? '오늘은 어떤 음식이 땡기세요?' : '원하시는 검색 결과가 없습니다.'}
                                />
                        }
                    </>
                }
            </Container>
        </CustomSafeAreaView>
    )
}

const Container = styled.View`
    flex: 1;
    padding: 0 ${wt(80)}px;
`

const ResultView = styled.View`
    width: 100%;
    height: ${ht(150)}px;
    justify-content: center;
    align-items: flex-end;
`

const SearchView = styled.View`
    width: 100%;
    height: ${ht(300)}px;
    justify-content: center;
    align-items: center;
`


export default Search