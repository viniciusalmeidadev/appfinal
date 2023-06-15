import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Feather} from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

import Home from '../home';
import Recomendacoes from '../recomendacoes';
import Mapa from '../mapa';
import Perfil from '../perfil';

export default function DashboardRoutes(){
    return(
        <Tab.Navigator

            screenOptions={
                ({route})=>({
                tabBarIcon:({color})=>{
                    let iconName;
                   
                        if(route.name === 'Home'){
                        iconName = 'home'
                        }else if(route.name === 'Recomendacoes'){
                        iconName = 'star'
                        }else if(route.name === 'Mapa'){
                            iconName = 'map-pin'
                        }else if(route.name === 'Perfil'){
                            iconName = 'user'
                        }

                return <Feather name={iconName} size={30} color={color}/>
            },
            tabBarStyle:{
                height:70,
                
            },
            headerShown: false,
            tabBarActiveTintColor:'#24263b',
            tabBarInactiveTintColor:'#a4a4a4',
            tabBarInactiveBackgroundColor:'#fff',
            tabBarActiveBackgroundColor:'#fff',
            tabBarLabelStyle:{
                    fontSize:9,
                    marginBottom:5,
                   
            }

        })}>
            <Tab.Screen name="Home" component={Home}/>
            <Tab.Screen name="Recomendacoes" component={Recomendacoes}/>
            <Tab.Screen name="Mapa" component={Mapa}/>
            <Tab.Screen name="Perfil" component={Perfil}/>
            
          
        </Tab.Navigator>
    );
}