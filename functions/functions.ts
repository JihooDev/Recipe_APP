import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "@react-native-firebase/storage"
import { UserResultTypes } from "../types/types";
import uuid from 'react-native-uuid';

export const _getImageUrl = async (assetData: any) => {
    try {
        const location = firebase.storage().ref(`${uuid.v4()}/food`);

        await location.putFile(assetData[0].uri);

        const imageUrl = await location.getDownloadURL();

        return imageUrl
    } catch (error) {
        console.error(error, '이미지 넣기 실패')
    }
}

/**
 * @function sliceText
 * @param {string} text = 자를 문자열 
 * @param {number} length = 몇 글자 까지만 보이게 할지 설정하는 숫자
 * @returns {String} = ex. test...
 */
export const sliceText = (text: string, length: number = 10): string => {
    if (text?.length > 10) {
        return `${text.slice(0, length)}...`
    } else {
        return `${text}`
    }
}

// AsyncStorage 유저데이터를 Parse해서 리턴해주는 함수
export const getStorageUserData = async () => {
    const strData = await AsyncStorage.getItem('user');

    if (strData) {
        if (typeof JSON.parse(strData) === 'object') {
            return JSON.parse(strData);
        } else {
            return JSON.parse(strData)[0];
        }
    }
}

// 로그아웃 시 AsyncStorage 의 값을 모두 지워주는 함수
export const clearStorage = async () => {
    try {
        const allAsynckey = await AsyncStorage.getAllKeys();

        allAsynckey.forEach(async (key) => {
            await AsyncStorage.removeItem(key);
        })

        return true;
    } catch (error) {
        return false;
    }
}
