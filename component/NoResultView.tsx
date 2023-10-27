import React from 'react'
import styled from 'styled-components/native'
import CustomText from './CustomText'

interface Props {
    content?: string
}

const NoResultView = ({
    content = '원하시는 결과가 없습니다.'
}: Props) => {
    return (
        <Container>
            <CustomText
                text={content}
                size={20}
                type={'ExtraBold'}
            />
        </Container>
    )
}

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`

export default NoResultView