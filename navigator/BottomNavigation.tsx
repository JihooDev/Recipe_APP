import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import Home from '../page/Home';
import Splash from '../page/Splash';
import CustomBottomTab from './CustomBottomTab';
import Search from '../page/Search';
import Liked from '../page/Liked';
import Setting from '../page/Setting';
import { StatusBar } from 'react-native';
import Chef from '../page/Chef';
import { BottomParamList } from '../types/types';

const Tab = createBottomTabNavigator<BottomParamList>();

const BottomNavigation = () => {
    return (
        <>
            <StatusBar barStyle={'dark-content'} />
            <Tab.Navigator
                initialRouteName='Main'
                screenOptions={{
                    headerShown: false
                }}
                tabBar={props => <CustomBottomTab {...props} />}
            >
                {/* 홈 */}
                <Tab.Screen name='Main' component={Home} />
                <Tab.Screen name='Search' component={Search} />
                <Tab.Screen name='Chef' component={Chef} />
                <Tab.Screen name='Liked' component={Liked} />
                <Tab.Screen name='Setting' component={Setting} />
            </Tab.Navigator>
        </>
    )
}

export default BottomNavigation