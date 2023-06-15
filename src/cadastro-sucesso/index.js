import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import Constants from 'expo-constants'
import {useNavigation} from '@react-navigation/native';

export default function App() {
    const navigation = useNavigation();

    function navegaParaHome(){
        navigation.navigate('Menu');
    }

    return (
        <>
            <View style={styles.mainContainer}>
                <TouchableOpacity style={styles.botaoFechar} onPress={navegaParaHome}>
                    <Feather name="x" size={36} color="#a4a4a4" />
                </TouchableOpacity>

                <View style={styles.checkContainer}>
                    <Feather name="check" size={96} color="#fff" />
                </View>
                <Text style={styles.textoBoasVindas}>Seja bem vindo!</Text>
                <Text style={styles.textoCadSucesso}>Cadastro realizado com sucesso!</Text>

                <TouchableOpacity style={styles.botao} onPress={navegaParaHome}>
                    <Text style={styles.textoBotao}>FECHAR</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    mainContainer:{
        backgroundColor:'#eeeded',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height:'100%',
        borderWidth:1,
        position:'relative'
    },
    checkContainer:{
        width:150,
        height:150,
        backgroundColor:'#77f08d',
        borderRadius:75,
        alignItems:'center',
        justifyContent:'center',
    },
    textoBoasVindas:{
        fontWeight:'bold',
        fontSize:28,
        marginVertical:30
    },
    textoCadSucesso:{
        color:'#a4a4a4',
        fontSize:20
    },
    botao:{
        backgroundColor:"#23263A",
        width:200,
        height:55,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:100,
        position:'absolute',
        bottom:0
    },
    textoBotao:{
        color:"#fff",
        fontSize:16,
        fontWeight:'bold'
    },
    botaoFechar:{
        position:'absolute',
        top:0,
        right:0,
        marginTop:Constants.statusBarHeight + 30,
        marginRight:25
    }

})

