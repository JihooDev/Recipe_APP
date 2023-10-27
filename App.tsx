import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { Suspense, useEffect } from 'react'
import Home from './page/Home';
import 'react-native-reanimated'
import 'react-native-gesture-handler'
import BottomNavigation from './navigator/BottomNavigation';
import Splash from './page/Splash';
import { StatusBar } from 'react-native';
import SignIn from './page/SignIn';
import { RecoilRoot } from 'recoil';
import { firebase } from '@react-native-firebase/auth';
import { initConfig } from './server/initConfigData';
import { STORAGE_BUCKET } from '@env';
import SignUp from './page/SignUp';
import AddRecipe from './page/AddRecipe';
import Loading from './component/Loading';
import ChefDetail from './page/ChefDetail';
import { StackParamList } from './types/types';
import ModifyPost from './page/ModifyPost';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Lank from './page/Lank';
import MartView from './page/MartView';
import EditProfile from './page/EditProfile';
import MyPost from './page/MyPost';
import AboutDevelover from './page/AboutDevelover';


// const Stack = createNativeStackNavigator();

const App = () => {

  useEffect(() => {
    initFirebase();
  }, [])

  // firebase init
  const initFirebase = async () => {
    if (firebase.apps?.length === 0) {
      await firebase.initializeApp(initConfig);
    }
  }

  const Stack = createNativeStackNavigator<StackParamList>();

  return (
    <RecoilRoot>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <StatusBar barStyle="light-content" /> */}
        <Loading />
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
            {/* 스플래시 */}
            <Stack.Screen name='Splash' component={Splash} />
            {/* 로그인 */}
            <Stack.Screen name='SignIn' component={SignIn} />
            {/* 회원가입 */}
            <Stack.Screen name='SignUp' component={SignUp} />
            {/* 홈 */}
            <Stack.Screen name='Home' component={BottomNavigation} />
            {/* 메뉴 추가 */}
            <Stack.Screen name='AddRecipe' component={AddRecipe} />
            {/* 레시피 디테일 페이지 */}
            <Stack.Screen name='ChefDetail' component={ChefDetail} />
            {/* 레시피 수정 페이지 */}
            <Stack.Screen name='ModifyPost' component={ModifyPost} />
            {/* 랭킹 페이지 */}
            <Stack.Screen name='Lank' component={Lank} />
            {/* 마트 리스트 페이지 */}
            <Stack.Screen name='MartView' component={MartView} />
            {/* 프로필 설정 */}
            <Stack.Screen name='EditProfile' component={EditProfile} />
            {/* 내가 올린 글 */}
            <Stack.Screen name='MyPost' component={MyPost} />
            {/* 개발자 정보 */}
            <Stack.Screen name='AboutDevelover' component={AboutDevelover} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </RecoilRoot>
  )
}

export default App;