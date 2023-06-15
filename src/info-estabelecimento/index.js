import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, ScrollView, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, AntDesign, FontAwesome, Ionicons, FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons'; 
import Constants from 'expo-constants'
import {useNavigation, useRoute, useFocusEffect} from '@react-navigation/native';
import {api} from '../services/api';
import {Loading} from '../components/loading/Loading'
import getBackendIP from '../services/getBackendIP'



export default function App() {

    const [modalVisible, setModalVisible] = useState(false);
    const [listaTags, setListaTags] = useState([]);
    const [listaComentarios, setListaComentarios] = useState([]);
    const [notas,setNotas] = useState([])
    const [tag, setTag] = useState([]);
    const [loading, setLoading] = useState(true)
    const [showThreeDotsMenu, setShowThreeDotsMenu] = useState(0)
    const [usuario,setUsuario] = useState()

    const navigation = useNavigation();
    const route = useRoute();
    const listaEstabelecimento = route.params.listaEstabelecimento;


    function fazerComentario(listaEstabelecimento){
        navigation.navigate('PublicarComentario', {listaEstabelecimento});
    }

    function editarComentario(){
        navigation.navigate('EditarComentario', {listaEstabelecimento});
    }

    function mostraOuOcultaThreeDotsMenu(){
        if(showThreeDotsMenu == 0){
            setShowThreeDotsMenu(1)
        }else{
            setShowThreeDotsMenu(0)
        }
    }

    async function apagarComentario(id){

        setListaComentarios(prevState => prevState.filter(recomendacao_posto => recomendacao_posto.recomendacao_posto_id !== id))

        await api.delete("/deleta-comentario",{
            data: {recomendacao_posto_id: id}
        })
        console.log(id)
        Alert.alert('Sucesso!','Seu comentário foi excluído!')
        setShowThreeDotsMenu(0)
    }

    async function voltarParaRanking(){
        var rotaOriginaria = await AsyncStorage.getItem('@unitruckRotaOriginaria')

        if(rotaOriginaria == 'recomendacoes'){
            navigation.navigate('Recomendacoes');
        }else if(rotaOriginaria == 'mapa'){
            navigation.navigate('Mapa');
        }
    }

    async function consultarTags(){
        try{
            setLoading(true)
            const response = await api.get(`/consultar-tag/${listaEstabelecimento.posto_id}`)

            setListaTags([...response.data])
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    async function consultarComentarios(){
        try{
            setLoading(true)
            const response = await api.get(`/consultar-comentarios-posto/${listaEstabelecimento.posto_id}`)
            setListaComentarios([...response.data])
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    async function consultarNotaEQtdAvaliacoes(){
        try{
            setLoading(true)
            const response = await api.get(`/consultar-nota-estabelecimento/${listaEstabelecimento.posto_id}`)
            setNotas([...response.data])
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    async function pegaUserID(){
        var user = await AsyncStorage.getItem('@unitruckIdUserLogado')
        setUsuario(JSON.parse(user))
    }


    async function detalharDados(){
        navigation.navigate('DadosEstabelecimento', {listaEstabelecimento});
    }

    useFocusEffect(useCallback(()=>{
        pegaUserID()
        consultarTags()
        consultarComentarios()
        consultarNotaEQtdAvaliacoes()
    },[listaComentarios.length]))


  
    return(
        <View style={styles.container}>
            <View style={styles.header}>
            
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.modalTelaInteira}>
                        <View style={styles.modalView}>
                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.botaoFecharModalX}>
                            <Feather name="x" size={36} color="#23263A" />
                        </TouchableOpacity>

                      
                                <View style={styles.conteudoTag}>
                                {tag.tipo == 2 ? 
                                <Ionicons name="fast-food" size={64} color="#23263A" />
                                :
                                <FontAwesome5 name={
                                tag.tipo == 1 ? "shower" 
                                : 
                                tag.tipo == 3 ? "bed"
                                : 
                                tag.tipo == 4 ? "wifi"
                                :
                                "tools"
                                   
                        } size={64} color="#23263A" />
                        }
                                    <Text style={styles.textoDescricao}>{tag.descricao}</Text>
                                </View>

                        <TouchableOpacity 
                        style={styles.botaoFecharModal}
                        onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text
                            style={styles.textoBotaoFecharModal}
                            >
                                FECHAR
                            </Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    
                </Modal>

            
                <TouchableOpacity style={styles.botaoVoltar} onPress={voltarParaRanking}>
                    <Feather name="arrow-left" size={40} color="#fff" />
                </TouchableOpacity>
                {
                                listaEstabelecimento.temFoto == '2' ? 

                                <Image 
                                style={styles.fotoEstabelecimento}
                                source={{uri: getBackendIP(listaEstabelecimento.urlImagem)}}  
                                />

                                : 

                                <View style={styles.semFotoEstabelecimento}>
                                    <Ionicons name="business-outline" size={60} color="black" />
                                </View>
                }
                <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={detalharDados}>
                <Text style={styles.nomePosto}>{listaEstabelecimento.nome_posto}</Text>
                <Feather name="chevron-right" size={20} color="black"/>
                </TouchableOpacity>
                <View style={styles.tagsDoPosto}>
                    {
                    listaTags.map(item=>(
               
                        <TouchableOpacity key={item.tag_id} style={styles.tag} onPress={() => {setTag(item),setModalVisible(true)}}>
                        {item.tipo == 2 ? 
                            <Ionicons name="fast-food" size={24} color="#23263A" />
                        :
                        <FontAwesome5 name={
                            item.tipo == 1 ? "shower" 
                            : 
                            item.tipo == 3 ? "bed"
                            : 
                            item.tipo == 4 ? "wifi"
                            :
                            "tools"
                                   
                        } size={24} color="#23263A" />
                        }
                        </TouchableOpacity>
   
   
                    ))}
                </View>
            </View>
            <ScrollView style={styles.scroll}>
            {
                notas.map((nota,index) =>(
                    <View style={styles.reviewArea} key={index}>
                <Text>Review</Text>
                <Text style={{fontSize:32, fontWeight:'bold', marginVertical:5}}>{nota.avaliacao == null ? '0' : nota.avaliacao}</Text>
                <View style={styles.avaliacaoAreaGeral}>
                <AntDesign
                    name={nota.avaliacao >= 1 ? 'star' : 'staro'}
                    size={24}
                    color="#EAA421"
                />
                <AntDesign
                    name={nota.avaliacao >= 2 ? 'star' : 'staro'}
                    size={24}
                    color="#EAA421"
                />
                <AntDesign
                    name={nota.avaliacao >= 3 ? 'star' : 'staro'}
                    size={24}
                    color="#EAA421"
                />
                <AntDesign
                    name={nota.avaliacao >= 4 ? 'star' : 'staro'}
                    size={24}
                    color="#EAA421"
                />
                <AntDesign
                    name={nota.avaliacao >= 5 ? 'star' : 'staro'}
                    size={24}
                    color="#EAA421"
                />
                
                </View>
                <Text>{nota.avaliacao == null ? "Ainda não avaliado" : `${nota.totalAvaliacao} avaliações`}</Text>
                
                </View>
                ))
            }
                
                {
                    listaComentarios.map(listaComentario=>(
                        listaComentario.user_id == usuario ?
                        <View style={[styles.comentarioContainer]} key={listaComentario.recomendacao_posto_id}>
                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', position:'relative'}}>
                                <View style={styles.usuarioInfo}>
                                    {
                                    listaComentario.temFoto == '2' ? 
                                    <Image source={{uri: getBackendIP(listaComentario.urlImagem)}} style={styles.fotoUsuario} />
                                    :
                                    <View style={styles.semFotoUsuario}>
                                        <Feather name="user" size={30} color="black"/>
                                    </View>
                                    } 
                                    <View>
                                        <Text style={styles.nomeDestacado}>{listaComentario.nome} - Você</Text>
                                        <View style={styles.avaliacaoArea}>
                                            <AntDesign
                                                name={listaComentario.valor >= 1 ? 'star' : 'staro'}
                                                size={14}
                                                color="#EAA421"
                                            />
                                            <AntDesign
                                                name={listaComentario.valor >= 2 ? 'star' : 'staro'}
                                                size={14}
                                                color="#EAA421"
                                            />
                                            <AntDesign
                                                name={listaComentario.valor >= 3 ? 'star' : 'staro'}
                                                size={14}
                                                color="#EAA421"
                                            />
                                            <AntDesign
                                                name={listaComentario.valor >= 4 ? 'star' : 'staro'}
                                                size={14}
                                                color="#EAA421"
                                            />
                                            <AntDesign
                                                name={listaComentario.valor >= 5 ? 'star' : 'staro'}
                                                size={14}
                                                color="#EAA421"
                                            />
                                        </View>
            
                                    </View>
                                </View>
                                
                                {
                                    showThreeDotsMenu == 1 ?
                                    <TouchableOpacity style={styles.optionsThreeMenuDots} onPress={()=>apagarComentario(listaComentario.recomendacao_posto_id)}>
                                        <Text style={{color:'#fff', fontWeight:'bold'}}>Excluir</Text>
                                    </TouchableOpacity>
                                    :
                                    null
                                }

                                
                                <TouchableOpacity onPress={mostraOuOcultaThreeDotsMenu}> 
                                    <Entypo name="dots-three-vertical" size={24} color="#23263A" />                 
                                </TouchableOpacity>
                                </View>
                                <Text style={styles.textoComentario}>
                                    {listaComentario.descricao}
                                </Text>
                            
                            
                        </View>
                        : null))}
                    {
                    listaComentarios.length > 0 ? listaComentarios.map(listaComentario=>(
                    listaComentario.user_id != usuario ?
                    <View style={styles.comentarioContainer} key={listaComentario.recomendacao_posto_id}>
                    <View style={styles.usuarioInfo}>

                            {
                            listaComentario.temFoto == '2' ? 
                            <Image source={{uri: getBackendIP(listaComentario.urlImagem)}} style={styles.fotoUsuario} />
                            :
                            <View style={styles.semFotoUsuario}>
                                <Feather name="user" size={30} color="black"/>
                            </View>
                            } 

                        <View>
                            <Text>{listaComentario.nome}</Text>
                            <View style={styles.avaliacaoArea}>
                                <AntDesign
                                    name={listaComentario.valor >= 1 ? 'star' : 'staro'}
                                    size={14}
                                    color="#EAA421"
                                />
                                <AntDesign
                                    name={listaComentario.valor >= 2 ? 'star' : 'staro'}
                                    size={14}
                                    color="#EAA421"
                                />
                                <AntDesign
                                    name={listaComentario.valor >= 3 ? 'star' : 'staro'}
                                    size={14}
                                    color="#EAA421"
                                />
                                <AntDesign
                                    name={listaComentario.valor >= 4 ? 'star' : 'staro'}
                                    size={14}
                                    color="#EAA421"
                                />
                                <AntDesign
                                    name={listaComentario.valor >= 5 ? 'star' : 'staro'}
                                    size={14}
                                    color="#EAA421"
                                />
                            </View>

                        </View>
                    </View>
                    <Text style={styles.textoComentario}>
                        {listaComentario.descricao}
                    </Text>
                </View>
                    :null
                    ))
                    :
                    <View style={{paddingTop:'25%', alignItems:'center'}}>
                        <MaterialIcons name="rate-review" size={70} color="black" />
                        <Text>Nenhuma review publicada ainda</Text>
                    </View>
                }
                    
            </ScrollView>
            <View style={styles.containerBotao}>
            {
                listaComentarios.some(item => item.user_id == usuario) ? 
                    <TouchableOpacity style={styles.botao} onPress={()=>editarComentario(listaEstabelecimento)}>
                        <Text style={styles.textoBotao}>Editar review</Text>
                    </TouchableOpacity>
                :
                <TouchableOpacity style={styles.botao} onPress={()=>fazerComentario(listaEstabelecimento)}>
                    <Text style={styles.textoBotao}>Publicar review</Text>
                </TouchableOpacity>
            }
            
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor:'#fff'
    },
    modalCentralizado:{
        height:"100%",
        justifyContent: "center",
        alignItems: "center",
        
    },
    modalTelaInteira:{
        height:'100%',
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    modalView: {
        height:230,
        width:350,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        justifyContent:'space-around',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        position:'relative'
    },
    header:{
        paddingTop:Constants.statusBarHeight + 20,
        width:'100%',
        alignItems:'center',
        position:'relative',
        elevation:2,
        backgroundColor:'#fff',
        paddingBottom:30
    },
    imagemPosto:{
        width:100,
        height:100,
        borderRadius:50,
        backgroundColor:"#fff",
        elevation:4,
        resizeMode:'contain'
    },
    botaoVoltar:{
        width:40,
        height:40,
        backgroundColor:'#23263A',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20,
        position:'absolute',
        left:0,
        marginTop:Constants.statusBarHeight + 20,
        marginLeft:20
    },
    nomePosto:{
        marginVertical:15,
        fontWeight:'bold'
    },
    tagsDoPosto:{
        flexDirection:'row'
    },
    tag:{
        height:40,
        width:40,
        borderRadius:20,
        marginHorizontal:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff',
        elevation:4
    },
    conteudoTag:{
        alignItems:'center'
    },
    textoDescricao:{
        fontSize:16,
        marginTop:8
    },
    botaoFecharModal:{
        backgroundColor:"#23263A",
        width:100,
        height:35,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
    },
    textoBotaoFecharModal:{
        color:'#fff',
    },
    botaoFecharModalX:{
        position:"absolute",
        right:0,
        top:0,
        marginTop:10,
        marginRight:15
    },
    reviewArea:{
        justifyContent:'center',
        alignItems:'center',
        paddingTop:20,
        marginBottom:60
    },
    avaliacaoAreaGeral:{
        flexDirection:'row',
        marginBottom:10
    },
    avaliacaoArea:{
        flexDirection:'row',
        
    },
    comentarioContainer:{
        paddingHorizontal:20,
    },
    usuarioInfo:{
        flexDirection:'row',
        alignItems:"center"
    },
    nomeDestacado:{
        backgroundColor:'gray',
        borderRadius:10,
        paddingHorizontal:5,
        color:'white'
    },
    fotoUsuario:{
        width:50,
        height:50,
        borderRadius:25,
        elevation:2,
        marginRight:10
    },
    semFotoUsuario:{
        alignItems:"center",
        justifyContent:'center',
        width:50,
        height:50,
        borderRadius:25,
        elevation:2,
        marginRight:10,
        backgroundColor:'#fff'
    },
    textoComentario:{
        color:'#797979',
        marginTop:10,
        marginBottom:30
    },
    publicarResenha:{
        backgroundColor:'#fff',
        width:'100%',
        paddingHorizontal:20,
        paddingVertical:10,
        alignItems:'center',
        justifyContent:"space-between",
        flexDirection:'row'
    },
    containerBotao:{
        width:'100%',
        alignItems:'center'
    },
    botao:{
        backgroundColor:"#23263A",
        width:'95%',
        height:55,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        marginVertical:10
    },
    textoBotao:{
        color:"#fff",
        fontSize:16,
        fontWeight:'bold'
    },
    fotoEstabelecimento:{
        width:100,
        height:100,
        resizeMode:'contain'
    },
    semFotoEstabelecimento:{
        alignItems:"center",
        justifyContent:'center',
        width:100,
        height:100,
        borderRadius:30,
        marginLeft:20
    },
    optionsThreeMenuDots:{
        position:'absolute',
        backgroundColor:'#23263A',
        width:110,
        height:40,
        justifyContent:'center',
        paddingLeft:10,
        borderRadius:8,
        right:0,
        top:0,
        marginRight:10,
        marginTop:40
    }
})