import { StatusBar } from 'expo-status-bar';
import React, {useState,useCallback} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Image} from 'react-native';
import { Feather, FontAwesome5, MaterialCommunityIcons,MaterialIcons,Ionicons  } from '@expo/vector-icons'; 
import Constants from 'expo-constants'
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {api} from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBackendIP from '../services/getBackendIP'



import {NoticiasVazias} from '../components/NoticiasVazias/NoticiasVazias'
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import relativeTime from 'dayjs/plugin/relativeTime';
import utcPlugin from 'dayjs/plugin/utc';




export default function App() {

    dayjs.locale('pt-br');
    dayjs.extend(relativeTime);
    dayjs.extend(utcPlugin);
    const [listaDeNoticias, setlistaDeNoticias] = useState([]);
    const [noticiasMaisLidas, setNoticiasMaisLidas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtroCategoria, setFiltroCategoria] = useState(0)
    const [noticiasFiltradas, setNoticiasFiltradas] = useState([])
    const [noticiasIniciais, setNoticiasIniciais] = useState([])

    const navigation = useNavigation();


    async function carregarNoticias(){
        var idUserLogado = await AsyncStorage.getItem('@unitruckIdUserLogado')
        const response = await api.get(`/consultar-noticias/${JSON.parse(idUserLogado)}`)
        setlistaDeNoticias([...response.data.noticiasEmJSON])
        setNoticiasMaisLidas([...response.data.noticiasMaisLidas])
        setCategorias([...response.data.id_categoria])
        setNoticiasIniciais(response.data.noticiasEmJSON[0])
    }

    function abrirNoticia(DetalheNoticia){
        navigation.navigate('DetalheNoticia', {DetalheNoticia});
    }

    function filtrarCategoria(categoria, descricao){
        setFiltroCategoria(categoria)
        setNoticiasFiltradas(listaDeNoticias.filter((item)=>item.nome == descricao))
    }

    function cadastrarCategorias(){
        navigation.navigate('Perfil')
    }


    
    useFocusEffect(useCallback(()=>{
        carregarNoticias()
    },[]))

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titulo}>FEED DE NOTÍCIAS</Text>
            </View>
            {categorias.length === 0 ?
            
            <View style={{flex:1,alignItems:'center',justifyContent:'center', backgroundColor:'#fff'}}>
                <Ionicons name="newspaper-outline" size={60} color="black" />
                <Text style={{marginVertical:15}}>Você não possui nenhuma categoria cadatrada!</Text>
                <TouchableOpacity style={styles.botao} onPress={cadastrarCategorias}>
                    <Text style={styles.textoBotao}>CADASTRAR</Text>
                </TouchableOpacity>
            </View>

            :
            <>
            <View style={styles.filtro}>
                <Text style={styles.filtroTitulo}>Filtrar por:</Text>
                <ScrollView style={styles.categoriasContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {
                        categorias.map((categoria, index)=>(
                            <TouchableOpacity 
                            style={styles.categoriaAtiva}
                            onPress={()=>filtrarCategoria(index,categoria.descricao)}
                            key={`cat${categoria.descricao}`}
                            >
                                <Text style={filtroCategoria == index ? styles.tituloCategoriaAtiva : styles.tituloCategoria}>{categoria.descricao}</Text>
                                {
                                    filtroCategoria == index ? <View style={styles.borderBottom}/> : ''
                                }
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
    
                    {
                    
                    noticiasFiltradas.length <= 0 && filtroCategoria == 0?

                        noticiasIniciais && noticiasIniciais.noticias && noticiasIniciais.noticias.map(
                            (item,index)=>(
                                index == 0 ?
                                <TouchableOpacity style={styles.cardNoticia} key={`${item.dataPostagem}-${item.id}`} onPress={()=>abrirNoticia(item)}>
                                    <Image source={{uri: getBackendIP(item.urlBanner)}} style={styles.bannerNoticiaImagem}/>

                                    <Text style={styles.tituloNoticiaDestaque}>{item.titulo}</Text>
                                    
                                    <View style={styles.areaPublicador}>
                                        <Image source={{uri: getBackendIP(item.urlImagem)}} style={styles.temFotoPublicador}></Image>
                                        <Text style={styles.nomePublicante}>{item.nomePublicante}</Text>
                                        <Text style={styles.divisor}>-</Text>
                                        <Text style={styles.dataPub}>{dayjs().utcOffset(-3).diff(dayjs(item.dataPostagem).utcOffset(-3), 'hours') < 24 ? dayjs(item.dataPostagem).utcOffset(-3).fromNow() : dayjs(item.dataPostagem).utcOffset(-3).format('DD/MM')}</Text>
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={styles.cardDemaisNoticias}key={`${item.dataPostagem}-${item.id}`} onPress={()=>abrirNoticia(item)}>
                                    <View style={styles.InfoDemaisNoticias}>
                                        <Text style={styles.tituloDemaisNoticia}>{item.titulo}</Text>
                                        <Image source={{uri: getBackendIP(item.urlBanner)}} style={styles.bannerDemaisNoticiaImagem}/>
                                    </View>
                                    <View style={styles.areaPublicador}>
                                        <Image source={{uri: getBackendIP(item.urlImagem)}} style={styles.temFotoPublicador}></Image>
                                        <Text style={styles.nomePublicante}>{item.nomePublicante}</Text>
                                        <Text style={styles.divisor}>-</Text>
                                        <Text style={styles.dataPub}>{dayjs().utcOffset(-3).diff(dayjs(item.dataPostagem).utcOffset(-3), 'hours') < 24 ? dayjs(item.dataPostagem).utcOffset(-3).fromNow() : dayjs(item.dataPostagem).utcOffset(-3).format('DD/MM')}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        )

                    :
                    noticiasFiltradas.length == 0 ?
                    <NoticiasVazias/>
                    :
                    noticiasFiltradas.map((item)=>(
                        <View key={item.id}>
                        
                        {
                            item.noticias.map((noticia,index)=>(
                                index == 0 ?
                                <TouchableOpacity style={styles.cardNoticia} key={`${noticia.noticia_id}-${item.id}`} onPress={()=>abrirNoticia(noticia)}>
                                    <Image source={{uri: getBackendIP(noticia.urlBanner)}} style={styles.bannerNoticiaImagem}/>

                                    <Text style={styles.tituloNoticiaDestaque}>{noticia.titulo}</Text>
                                    
                                    <View style={styles.areaPublicador}>
                                        <Image source={{uri: getBackendIP(noticia.urlImagem)}} style={styles.temFotoPublicador}></Image>
                                        <Text style={styles.nomePublicante}>{noticia.nomePublicante}</Text>
                                        <Text style={styles.divisor}>-</Text>
                                        <Text style={styles.dataPub}>{dayjs().utcOffset(-3).diff(dayjs(noticia.dataPostagem).utcOffset(-3), 'hours') < 24 ? dayjs(noticia.dataPostagem).utcOffset(-3).fromNow() : dayjs(noticia.dataPostagem).utcOffset(-3).format('DD/MM')}</Text>
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={styles.cardDemaisNoticias}key={`${noticia.noticia_id}-${item.id}`} onPress={()=>abrirNoticia(noticia)}>
                                    <View style={styles.InfoDemaisNoticias}>
                                        <Text style={styles.tituloDemaisNoticia}>{noticia.titulo}</Text>
                                        <Image source={{uri: getBackendIP(noticia.urlBanner)}} style={styles.bannerDemaisNoticiaImagem}/>
                                    </View>
                                    <View style={styles.areaPublicador}>
                                        <Image source={{uri: getBackendIP(noticia.urlImagem)}} style={styles.temFotoPublicador}></Image>
                                        <Text style={styles.nomePublicante}>{noticia.nomePublicante}</Text>
                                        <Text style={styles.divisor}>-</Text>
                                        <Text style={styles.dataPub}>{dayjs().utcOffset(-3).diff(dayjs(noticia.dataPostagem).utcOffset(-3), 'hours') < 24 ? dayjs(noticia.dataPostagem).utcOffset(-3).fromNow() : dayjs(noticia.dataPostagem).utcOffset(-3).format('DD/MM')}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                        </View>
                    ))}

            </ScrollView>
            </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor:'#fff'
    },
    header:{
        height:100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop:Constants.statusBarHeight + 10,
        borderBottomWidth:5,
        borderBottomColor:'#F0F1F3',
    },
    titulo:{
        fontSize:15,
        fontWeight:'bold',
        color:'#23263A'
    },
    filtro:{
        paddingBottom:15,
        paddingLeft:15,
        paddingTop:15,
        borderBottomWidth:5,
        borderBottomColor:'#F0F1F3',
    },
    filtroTitulo:{
        fontWeight:'bold',
        fontSize:17,
        marginBottom:15
    },
    categoriasContainer:{
        flexDirection:'row',
    },
    categoriaAtiva:{
        marginRight:20,
    },
    borderBottom:{
        marginTop:4,
        width:'100%',
        borderBottomColor:'#23263A',
        borderBottomWidth:5,
        borderRadius:10
    },
    categoria:{
        marginRight:20,
        paddingBottom:4
    },
    tituloCategoria:{
        fontSize:15,
    },
    tituloCategoriaAtiva:{
        fontSize:15,
        fontWeight:'bold',
    },
    headerSecaoNoticias:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        marginTop:20,
        paddingLeft:15,
        height:50
    },
    tituloSecaoNoticias:{
        marginLeft:10,
        fontWeight:'bold'
    },
    cardNoticia:{
        borderBottomWidth:2,
        borderBottomColor:'#F0F1F3',
        paddingVertical:10,
        paddingHorizontal:15,
        overflow:'hidden',
        position:'relative',
    },
    botaoFechar:{
        position:'absolute',
        top:0,
        right:0,
        marginTop: 15,
        marginRight:15
    },
    bannerNoticia:{
        backgroundColor:'#23263A',
        height:200, 
        borderRadius:15,
        overflow:'hidden'
    },
    bannerNoticiaImagem:{
        height:200, 
        width:'100%',
        borderRadius:15,
        overflow:'hidden',
    },
    tituloNoticiaDestaque:{
        fontSize:19,
        fontWeight:'bold',
        color:'#23263A'
    },
    tituloNoticia:{
        fontSize:16,
        marginTop:10,
        fontWeight:'bold'
    },
    cardDemaisNoticias:{
        width:'100%',
        borderBottomWidth:2,
        borderBottomColor:'#F0F1F3',
        paddingVertical:10,
        paddingHorizontal:15,
    },
    InfoDemaisNoticias:{
        justifyContent:'space-between',
        flexDirection:'row'
    },
    tituloDemaisNoticia:{
        width:'65%',
        fontSize:16,
        fontWeight:'bold',
        lineHeight:22,
        textAlign:'auto'
    },
    bannerDemaisNoticiaImagem:{
        height:100, 
        width:'30%',
        borderRadius:15,
        overflow:'hidden',
    },
    areaPublicador:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:10
    },
    fotoPublicador:{
        width:16,
        height:16,
        backgroundColor:'#23263A',
        borderRadius:16,
        marginRight:10,
    },
    temFotoPublicador:{
        width:20,
        height:20,
        marginRight:10,
    },
    nomePublicante:{
        fontSize:10,
    },
    divisor:{
        marginLeft:5,
        marginRight:5,
        color:"#a0a0a0"
    },
    dataPub:{
        fontSize:10,
        color:"#a0a0a0"
    },
    horarioPublicacao:{
        marginLeft:10
    },
    botao:{
        backgroundColor:"#23263A",
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




