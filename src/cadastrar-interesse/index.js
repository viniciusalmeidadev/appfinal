import React, {useState, useCallback} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image,StatusBar} from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import {api} from '../services/api';
import Constants from 'expo-constants'
import {useNavigation, useFocusEffect} from '@react-navigation/native';

export default function App() {

    const navigation = useNavigation();

    const [interesses,setInteresses] = useState([])
    const [categoria,setCategoria] = useState()

    async function getInteressesNaoCadastrados(){
        const response = await api.get("/consultar-interesses-para-cadastrar/19")
        setInteresses(response.data)
    }

    function setInteresse(id){
        setCategoria(id)
    }

    async function cadastrarInterresse(){

        if(categoria >= 0){
            await api.post("/cadastrar-categorias-usuario-unit/19",{
            categoria
            })
        }

        navigation.navigate('Perfil')
        
    }

    useFocusEffect(useCallback(()=>{
        getInteressesNaoCadastrados()
    },[]))


    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text>Cadastrar Interesse</Text>
                <TouchableOpacity style={styles.botaoConfirmar} onPress={cadastrarInterresse}>
                    <Text style={styles.textoBotao}>Confirmar</Text>
                </TouchableOpacity>
            </View>


            {
                interesses.map(interesse=>(
                    <TouchableOpacity 
                    key={interesse.id_categoria} 
                    onPress={()=>setInteresse(interesse.id_categoria)}
                    style={interesse.id_categoria == categoria ? styles.cardInteresseSelecionado : styles.cardInteresse}
                    >
                    <Text>{interesse.descricao}</Text>
                    </TouchableOpacity>
                ))
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff",
        paddingTop:Constants.statusBarHeight + 20
    },
    header:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:10
    },
    cardInteresse:{
        display:'flex',
        borderWidth:1,
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        height:40,
        backgroundColor:'yellow'
    },
    cardInteresseSelecionado:{
        display:'flex',
        borderWidth:1,
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        height:40,
        backgroundColor:'blue'
    },
    botaoConfirmar:{
        backgroundColor:"#23263A",
        width:90,
        height:30,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
    },
    textoBotao:{
        color:"#fff",
        fontSize:11,
    }
})