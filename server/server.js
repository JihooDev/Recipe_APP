import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import storage from '@react-native-firebase/storage';
import { JoinUserTypes } from '../types/types';
import axios from 'axios';
import { BASE_URL } from '@env';

// 유저별 리스트
const user_list = firestore().collection('user_list');
axios.defaults.headers['Content-Type'] = 'application/json';

// 유저 회원가입
export const _joinUser = async (data, setLoading) => {
    try {
        setLoading(true);

        const postSignUp = await axios.post(`${BASE_URL}/create_user`, {
            nick_name: data['nickName'],
            uid: data['uid'],
            user_name: data['user_name']
        })

        if (postSignUp.data['status'] === 200) {
            return {
                data: postSignUp.data['data'],
                status: true
            }
        } else {
            throw Error(postSignUp.data['status']);
        }
    } catch (error) {
        console.error(error);
        return {
            status: false,
            error_message: error
        }
    } finally {
        setLoading(false);
    }
}

// user 검색
export const _getUser = async (uid, setLoading) => {
    try {
        setLoading(true);
        if (uid) {
            // 유저 한명 검색
            const getData = await axios.post(`${BASE_URL}/search_user`, {
                uid
            })

            if (getData.status === 200) {
                return {
                    status: 200,
                    data: getData.data
                }
            } else {
                throw Error(getData.data);
            }
        } else {
            // 전체유저 검색
            const getData = await axios.post(`${BASE_URL}/search_user`);

            if (getData.data['status'] === 200) {
                return {
                    status: 200,
                    data: getData.data
                }
            } else {
                throw Error(getData.data);
            }
        }
    } catch (error) {
        return {
            status: false,
            error_message: error
        }
    } finally {
        setLoading(false);
    }
}

// 레시피 생성함수
export const _createRecipe = async (data) => {
    try {
        const postServer = await axios.post(`${BASE_URL}/create_post`, data)

        if (postServer.data['status'] === 200) {
            return postServer.data;
        } else {
            throw Error(postServer.data['status'])
        }
    } catch (error) {
        return 404;
    } finally {

    }
}

// 레시피 불러오는 함수
export const _getRecipeAll = async (setLoading) => {
    try {
        setLoading(true);
        const getList = await axios.post(`${BASE_URL}/search_post`);

        if (getList.status === 200) {
            return {
                status: true,
                data: getList['data']
            }
        }
    } catch (error) {
        console.error(error, '포스트 가져오기 실패');
        return {
            status: false,
            error_message: error
        }
    } finally {
        setLoading(false);
    }
}

// 레시피 삭제하는 함수
export const _deleteRecipe = async (post_id, setLoading = () => { }) => {
    try {
        setLoading(true);

        const deleteData = await axios.delete(`${BASE_URL}/delete_post`, {
            data: {
                post_id
            }
        })

        console.log(deleteData);

        if (deleteData.status === 200) {
            return {
                status: true,
                data: deleteData['data']
            }
        } else {
            throw Error('delete data not status 200');
        }
    } catch (error) {
        console.error(error, '포스트 삭제 실패');
        return {
            status: false,
            error_message: error
        }
    }
}


// 포스트 아이디로 포스트 가져오는 함수
export const _getPostData = async (post_id, setLoading) => {
    try {
        setLoading(true);
        const { data } = await axios.post(`${BASE_URL}/get_post_data`, {
            post_id
        })

        if (data['api_status'] === 200) {
            return data['result'][0];
        } else {
            throw Error('get post not status 200');
        }
    } catch (error) {
        console.error(error);
        return {
            status: false,
            error_message: error
        }
    } finally {
        setLoading(false);
    }
}

// 포스트 수정하는 함수
export const _modifyPost = async (post_id, modify_data, setLoading) => {
    try {
        setLoading(true);
        const { data } = await axios.put(`${BASE_URL}/modify_post/${post_id}`, modify_data);

        if (data['api_status'] === 200) {
            return {
                status: true,
                data: data['result']
            }
        } else {
            throw Error('modify failed');
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            error_message: error
        }
    } finally {
        setLoading(false);
    }
}

// 유저가 해당 글을 좋아하고 있는지 확인
export const _likesCheck = async (post_id, uid) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/likes_check/${post_id}/liked/${uid}`);

        if (data['api_status'] === 200) {
            return {
                status: true,
                data: data['result']
            }
        } else {
            throw Error('status not 200');
        }
    } catch (error) {
        return {
            status: false,
            error_message: error
        }
    }
}

// 유저가 좋아요를 클릭했을 때
export const _onLikes = async (uid, post_id) => {
    try {
        const { data } = await axios.post(`${BASE_URL}/likes_post`, {
            uid,
            post_id
        })

        if (data['api_status'] === 200) {
            return {
                status: true
            }
        } else {
            throw Error('not status 200');
        }
    } catch (error) {
        console.error(error);
        return {
            status: false
        }
    }
}

// 유저가 좋아요를 취소 했을 때
export const _unLikes = async (uid, post_id) => {
    try {
        const { data } = await axios.post(`${BASE_URL}/likes_delete`, {
            uid,
            post_id
        })

        if (data['api_status'] === 200) {
            return {
                status: true
            }
        } else {
            throw Error('not status 200');
        }
    } catch (error) {
        return {
            status: false
        }
    }
}

export const _postLikesCheck = async (post_id) => {
    try {
        const { data } = await axios.post(`${BASE_URL}/check_post_likes`, {
            post_id
        })

        if (data['api_status'] === 200) {
            return {
                status: true,
                result: data['result']
            }
        } else {
            throw Error('not status 200');
        }
    } catch (error) {
        console.error(error);
        return {
            status: false,
            error_message: error
        }
    }
}

// 레시피 불러오는 함수
export const _searchRecipe = async (post_name, setLoading) => {
    try {
        setLoading(true);
        const { data } = await axios.post(`${BASE_URL}/search_post`, {
            post_name
        });


        if (data['api_status'] === 200) {
            return {
                status: true,
                data: data['data']
            }
        } else {
            throw Error('not status 200');
        }
    } catch (error) {
        console.error(error, '포스트 가져오기 실패');
        return {
            status: false,
            error_message: error
        }
    } finally {
        setLoading(false);
    }
}

// 유저가 좋아하는 레시피 모두 불러오기
export const _getUserLikes = async (postIdArr) => {
    try {
        const { data } = await axios.post(`${BASE_URL}/get_likes_post`, {
            likes: postIdArr
        })

        if (data['api_status'] === 200) {
            return {
                status: true,
                data: data['data']
            }
        } else {
            throw Error('not status 200');
        }
    } catch (error) {
        console.error(error);
        return {
            status: false,
            error_message: error
        }
    }
}

// 레시피 랭킹 가져오기
export const _getLankPosts = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}/get_lank_posts`);

        if (data['api_status'] === 200) {
            return {
                status: true,
                data: data['data']
            }
        } else {
            throw Error('not status 200');
        }
    } catch (error) {
        return {
            status: false,
            error_message: error
        }
    }
}

// 추천 음식 가져오기
export const _getTodayFood = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}/today_food`);

        if (data['api_status'] === 200) {
            return {
                status: true,
                data: data['data']
            }
        } else {
            throw Error('not status 200');
        }
    } catch (error) {
        return {
            status: false,
            error_message: error
        }
    }
}

// 레시피 랭킹 불러오기
export const _getLankAll = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}/get_lank_posts_all`);

        if (data['api_status'] === 200) {
            return {
                status: true,
                data: data['data']
            }
        } else {
            throw Error('not status 200');
        }
    } catch (error) {
        return {
            status: false,
            error_message: error
        }
    }
}

// 유저를 수정하는 함수
export const _modifyUser = async (uid, modify_data, setLoading) => {
    try {
        setLoading(true);
        const { data } = await axios.put(`${BASE_URL}/modify_user/${uid}`, modify_data);

        if (data['api_status'] === 200) {
            return {
                status: true,
                data: data['result']
            }
        } else {
            throw Error('modify failed');
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            error_message: error
        }
    } finally {
        setLoading(false);
    }
}

// 유저가 작성한 포스트 글을 가져오는 함수
export const _getMyPosts = async (uid, setLoading) => {
    try {
        setLoading(true);
        const { data } = await axios.post(`${BASE_URL}/my_posts`, {
            uid
        })

        if (data['api_status'] === 200) {
            return {
                status: true,
                data: data['data']
            }
        } else {
            throw Error('modify failed');
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            error_message: error
        }
    } finally {
        setLoading(false);
    }
}

// 신고하기
export const _postReport = async (post_data, setLoading) => {
    try {
        setLoading(true);

        const { data } = await axios.post(`${BASE_URL}/post_report`, post_data);

        if (data['api_status'] === 200) {
            return {
                data: data,
                status: true
            }
        } else {
            throw Error(postSignUp.data['status']);
        }
    } catch (error) {
        console.error(error);
        return {
            status: false,
            error_message: error
        }
    } finally {
        setLoading(false);
    }
}