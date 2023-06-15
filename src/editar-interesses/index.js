import React, {useState, useCallback} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image,StatusBar} from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import {api} from '../services/api';
import Constants from 'expo-constants'
import {useNavigation, useFocusEffect,useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

    const navigation = useNavigation();
    const route = useRoute();
    const[categoria, setCategoria] = useState([])
    const [categoriasUsuario, setCategoriasUsuario] = useState([]) 
    const [interesses, setInteresses] = useState([])

    
    async function pegarInteresses(){
        var idUserLogado = await AsyncStorage.getItem('@unitruckIdUserLogado')
        const response = await api.get(`/consultar-interesses-para-cadastrar/${JSON.parse(idUserLogado)}`)
        console.log(response.data.categorias)
        setInteresses(response.data.interessesNaoCadastrados)
        setCategoriasUsuario(response.data.categorias)
    }

    async function setarInteresse(id_categoria){
            var idUserLogado = await AsyncStorage.getItem('@unitruckIdUserLogado')
            if(categoriasUsuario.includes(id_categoria)){
                await api.post(`/editar-categoria/${JSON.parse(idUserLogado)}`,{
                    id_categoria
                })
                setCategoriasUsuario(prevState => prevState.filter(cat_id => cat_id !== id_categoria))
            }else if(categoriasUsuario.length < 5){
                await api.post(`/editar-categoria/${JSON.parse(idUserLogado)}`,{
                    id_categoria
                })
                setCategoriasUsuario(prevState => [...prevState, id_categoria])
            }else{
                Alert.alert('Você só pode escolher cinco categorias de interesse!')
            }
    }

    function voltarParaPerfil(){
        navigation.navigate('Perfil')
    }



    useFocusEffect(useCallback(()=>{
        pegarInteresses()
    },[]))


    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.botaoVoltar} onPress={voltarParaPerfil}>
                            <Feather name="arrow-left" size={40} color="#fff" />
                </TouchableOpacity>
                <Text style={{fontWeight:'bold',color:'#23263A', fontSize:15}}>SELECIONE SEUS INTERESSES</Text>
            </View>

            {
                interesses.map(interesse=>(
                    <TouchableOpacity 
                    key={interesse.id_categoria} 
                    onPress={()=>setarInteresse(interesse.id_categoria)}
                    style={styles.containerCategoria}
                    >
                    <Text style={{fontWeight:'bold', color:'#23263A'}}>{interesse.descricao}</Text>
                    {
                        categoriasUsuario.includes(interesse.id_categoria) ?
                        <View style={styles.checked}>
                            <Feather name="check" size={18} color="#fff"/>
                        </View>
                        :
                        <View style={styles.notChecked}>
                            
                        </View>
                    }
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
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        height:40,
        marginBottom:20
    },
    botaoVoltar:{
        width:40,
        height:40,
        position:'absolute',
        left:0,
        marginLeft:20,
        backgroundColor:'#23263A',
        borderRadius:20
    },
    containerCategoria:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'100%',
        height:40,
        paddingHorizontal:15
    },
    checked:{
        backgroundColor:'#23263A',
        padding:2,
        borderRadius:2,
        width:24,
        height:24
    },
    notChecked:{
        borderWidth:1,
        borderRadius:2,
        width:24,
        height:24
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
    },
    text:{
        marginHorizontal:10,
        marginBottom:10
    }
})