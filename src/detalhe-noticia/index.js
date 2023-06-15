import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, ScrollView, TextInput,Image} from 'react-native';
import { Feather, AntDesign, FontAwesome, Ionicons, FontAwesome5, MaterialIcons} from '@expo/vector-icons'; 
import Constants from 'expo-constants'
import {useNavigation, useRoute} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import * as Location from "expo-location";
import socketio from 'socket.io-client';
import getBackendIP from '../services/getBackendIP'

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import relativeTime from 'dayjs/plugin/relativeTime';
import utcPlugin from 'dayjs/plugin/utc';

import setavoltar from '../assets/setavoltar.png'



export default function App() {

    dayjs.locale('pt-br');
    dayjs.extend(relativeTime);
    dayjs.extend(utcPlugin);

    const route = useRoute();
    const navigation = useNavigation();
    const detalhesNoticia = route.params.DetalheNoticia;

    async function voltarParaHome(){
        navigation.navigate('Home');
    }

    return (
        <>
        <View style={styles.header}>
            <TouchableOpacity style={styles.botaoVoltar} onPress={voltarParaHome}>
                <Feather name="arrow-left" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.tituloNoticia}>{detalhesNoticia.titulo}</Text>
            <View style={styles.areaPublicador}>
                <Image source={{uri: getBackendIP(detalhesNoticia.urlImagem)}} style={styles.temFotoPublicador}></Image>
                <Text style={styles.nomePublicante}>{detalhesNoticia.nomePublicante}</Text>
                <Text style={styles.divisor}>-</Text>
                <Text style={styles.dataPub}>{dayjs().utcOffset(-3).diff(dayjs(detalhesNoticia.dataPostagem).utcOffset(-3), 'hours') < 24 ? dayjs(detalhesNoticia.dataPostagem).utcOffset(-3).fromNow() : dayjs(detalhesNoticia.dataPostagem).utcOffset(-3).format('DD/MM')}</Text>
            </View>
            <Image source={{uri: getBackendIP(detalhesNoticia.urlBanner)}} style={styles.bannerNoticiaImagem}/>   
            <Text style={styles.conteudo}>{detalhesNoticia.conteudo}</Text>
        </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        backgroundColor:"#fff",
        
    },
    header:{
        width:'100%',
        backgroundColor:'#fff'
    },
    botaoVoltar:{
        width:34,
        height:34,
        backgroundColor:'#23263A',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:17,
        marginTop:Constants.statusBarHeight + 10,
        marginBottom:10,
        marginLeft:30
    },
    bannerNoticiaImagem:{
        height:230, 
        width:'100%',
        overflow:'hidden',
        resizeMode: 'stretch'
    },
    tituloNoticia:{
        fontSize:20,
        marginHorizontal:30,
        marginTop:10,
        fontWeight:'bold',
    },
    areaPublicador:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:20,
        marginBottom:20,
        paddingHorizontal:30,
    },
    temFotoPublicador:{
        width:32,
        height:32,
    },
    conteudo:{
        fontSize:15,
        marginHorizontal:30,
        marginTop:30,
        textAlign: 'justify', 
        lineHeight:25,
        marginBottom:10
    },
    nomePublicante:{
        fontSize:12,
        marginLeft:10
    },
    divisor:{
        marginLeft:5,
        marginRight:5,
        color:"#a0a0a0"
    },
    dataPub:{
        fontSize:12,
        color:"#a0a0a0"
    },
})