import React, {useState, useCallback} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image,StatusBar,ScrollView} from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import {api} from '../services/api';
import Constants from 'expo-constants'
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import getBackendIP from '../services/getBackendIP'

export default function App() {

    dayjs.locale('pt-br');
    const navigation = useNavigation();
    const[usuarios, setUsuarios] = useState([])
    const[categorias, setCategorias] = useState([])
    const[numero,setNumeroFormatado]=useState([])

    async function getUsuario(){
        var idUserLogado = await AsyncStorage.getItem('@unitruckIdUserLogado')
        const response = await api.get(`/consultar-usuario/${JSON.parse(idUserLogado)}`)
        console.log(response.data.usuario[0])
        setNumeroFormatado(response.data.usuario[0].telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3'))
        setUsuarios(response.data.usuario)
        setCategorias(response.data.categorias)
    }


    function editarInteresses(){
        navigation.navigate('EditarInteresses', {categorias});
    }

    async function fazerLogout(){
        await AsyncStorage.setItem('@unitruckIdUserLogado', '')
        navigation.navigate('Login')
    }

    useFocusEffect(useCallback(()=>{
        getUsuario()
    },[]))

    return(
        <>
        {
            usuarios.map(usuario=>(
                <ScrollView style={styles.container} key={usuario.user_id}>
                    <View style={styles.top}>
                        <TouchableOpacity style={styles.botaoVoltar}>
                            <Feather name="arrow-left" size={40} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.tituloPagina}>PERFIL</Text>
                    </View>
                    {
                        usuario.temFoto == 1 ?
                            <View style={styles.iconePerfil}>
                                <Feather name="user" size={60} color="black"/>
                            </View>
                        :
                        <Image 
                        source={{uri: getBackendIP(usuario.urlImagem)}}
                        style={styles.imagemPerfil}  
                        />

                    }
                    
                    <View style={styles.containerInfoUsuario}>

                        <View style={styles.containerQuantidadePosts}>

                            <Text style={{marginBottom:20, fontWeight:'bold',color:'#23263A'}}>Reviews realizadas por tipo de estabelecimento</Text>

                            <View style={styles.containerCards}>

                                <View style={styles.containerCard}>
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.textCard}>{usuario.recondacoes_posto}</Text>
                                    </View>
                                    <Text style={{fontWeight:'bold',color:'#23263A'}}>Postos</Text>
                                </View>

                                <View style={styles.containerCard}>
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.textCard}>{usuario.recondacoes_restaurantes}</Text>
                                    </View>
                                    <Text style={{fontWeight:'bold',color:'#23263A'}}>Restaurantes</Text>
                                </View>

                                <View style={styles.containerCard}>
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.textCard}>{usuario.recondacoes_hoteis}</Text>
                                    </View>
                                    <Text style={{fontWeight:'bold',color:'#23263A'}}>Hotéis</Text>
                                </View>

                            </View>

                        </View>
                        
                        <View style={styles.containerCategorias}>

                            <Text style={styles.tituloCategoria}>Escolha abaixo categorias de acordo com os seus interesses.</Text>
                            <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:10, marginTop:20}}>
                                <Text style={styles.tituloCategoria}>Categorias escolhidas: {categorias.length}/5</Text>
                                {
                                    categorias.length > 0 ? 

                                    <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={editarInteresses}>
                                        <Text style={{color:'#23263A', fontWeight:'bold'}}>{"Editar"}</Text> 
                                        <Feather style={styles.abrirBotaoFlutuante} name="chevron-right" size={24} color="black" />
                                    </TouchableOpacity>
                                    
                                    : ''
                                }
                                
                            </View>

                            <View style={{flexWrap:'wrap', width:400, flexDirection:'row'}}>
                            {
                                categorias.length == 0 ?

                                <TouchableOpacity style={styles.circuloAdicionar} onPress={editarInteresses}>
                                    <Feather name="plus" size={25} color="#fff" />
                                </TouchableOpacity>

                                :

                                categorias.map(categoria =>(
                                    <View style={styles.circuloCategoria} onPress={editarInteresses} key={categoria.id_categoria}>
                                        <Text style={styles.nomeCategoria}>{categoria.descricao}</Text>
                                    </View>
                                ))
    
                            }
                            {
                                categorias.length > 0 ? 
                                <TouchableOpacity style={styles.circuloAdicionar} onPress={editarInteresses}>
                                    <Feather name="edit-2" size={25} color="#fff" />
                                </TouchableOpacity>
                                :
                                ''
                            }
                            {
                                categorias.length > 0 && categorias.length < 5 ? 
                            
                                <TouchableOpacity style={styles.circuloAdicionar} onPress={editarInteresses}>
                                    <Feather name="plus" size={25} color="#fff" />
                                </TouchableOpacity>
                                : ''
                            }
                            </View>
                        </View>

                        <View style={styles.ContainerDadosUsuario}>
                            <Text style={styles.nomeCampo}>Nome de usuário</Text>
                            <Text style={styles.valorCampo}>{usuario.nome}</Text>

                            <Text style={styles.nomeCampo}>E-mail</Text>
                            <Text style={styles.valorCampo}>{usuario.email}</Text>

                            <Text style={styles.nomeCampo}>Telefone</Text>
                            <Text style={styles.valorCampo}>{numero}</Text>

                            <Text style={styles.nomeCampo}>Data de nascimento</Text>
                            <Text style={styles.valorCampo}>{dayjs(usuario.dataNascimento).format('DD/MM/YYYY')}</Text>
                        </View>


                        <View style={{height:100, justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity style={styles.botao} onPress={fazerLogout}>
                                <Text style={styles.textoBotao}>SAIR DA CONTA</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
            
        </ScrollView>

            ))
        }
        
        </>
    );
}


const styles = StyleSheet.create({
container:{
    backgroundColor:"#23263A",
    paddingTop:Constants.statusBarHeight + 20
},
top:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    height:40
},
tituloPagina:{
    fontWeight:'bold',
    color:'#fff',
    fontSize:20
},
botaoVoltar:{
    width:40,
    height:40,
    position:'absolute',
    left:0,
    marginLeft:20
},
imagemPerfil:{
    height:130,
    width:130,
    marginTop:20,
    marginBottom:35,
    borderRadius:65,
    elevation: 10,
    backgroundColor: 'white',
    alignSelf:'center'
},
iconePerfil:{
    height:130,
    width:130,
    marginTop:20,
    marginBottom:35,
    borderRadius:65,
    elevation: 10,
    backgroundColor: 'white',
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center'
},
containerInfoUsuario:{
    borderWidth:1,
    backgroundColor:'#fff',
    borderTopLeftRadius:50,
    borderTopRightRadius:50,
    height:900
},
containerQuantidadePosts:{
    paddingHorizontal:30,
    paddingTop:30,
    borderBottomColor:'#BFC0C6',
    borderBottomWidth:2,
    paddingBottom:30,
    marginBottom:30,
},
containerCards:{
    flexDirection:"row",
    justifyContent:'space-between',
},
containerCard:{
    alignItems:'center'
},
cardInfo:{
    backgroundColor:'#BFC0C6',
    width:100,
    height:100,
    borderRadius:10,
    justifyContent:"center",
    alignItems:'center'
},
textCard:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:30
},
tituloCategoria:{
    fontWeight:'bold',
    color:'#23263A'
},
containerCategorias:{
    flexDirection:"column",
    borderBottomColor:'#BFC0C6',
    borderBottomWidth:2,
    paddingBottom:30,
    marginBottom:30,
    paddingHorizontal:30,
},
nomeCategoria:{
    fontSize:12
},
circuloAdicionar:{
    backgroundColor:'#23263A',
    borderRadius:19,
    width:38,
    height:38,
    justifyContent:'center',
    alignItems:'center',
    marginRight:10,
    marginTop:10
},
circuloCategoria:{
    borderRadius:50,
    width:110,
    height:38,
    justifyContent:'center',
    alignItems:'center',
    marginRight:10,
    backgroundColor:'#BFC0C6',
    marginTop:10
},
imagemCategoria:{
    height:55,
    width:55,
    resizeMode:'contain'
},
nomeCampo:{
    color:'#BFC0C6',
    fontSize:14,
    fontWeight:'800'
},
valorCampo:{
    Color:"#23263A",
    fontWeight:'bold',
    fontSize:16,
    marginBottom:20
},
ContainerDadosUsuario:{
    paddingHorizontal:30
},
botao:{
    backgroundColor:"#e02041",
    width:200,
    height:55,
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center',
},
textoBotao:{
    color:"#fff",
    fontSize:16,
    fontWeight:'bold'
}
})