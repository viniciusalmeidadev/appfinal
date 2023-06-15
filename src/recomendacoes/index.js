import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, FlatList, ScrollView, Dimensions, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, AntDesign,Ionicons,FontAwesome5,MaterialCommunityIcons } from '@expo/vector-icons'; 
import Constants from 'expo-constants'
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {api} from '../services/api';
import {Loading} from '../components/loading/Loading'
import getBackendIP from '../services/getBackendIP'


export default function App() {

    const navigation = useNavigation();

    const [selecionado, setSelecionado] = useState('1');
    const [listaEstabelecimentos, setListaEstabelecimentos] = useState([]);
    const [tagsEstabelecimento, setTagsEstabelecimento] = useState([])
    const [tipo, setTipo] = useState('1')
    const [loading, setLoading] = useState(true)
    const [buscaEstabelecimento, setBuscaEstabelecimento] = useState('');

    async function carregarOutroTipoDeEstabelecimento(){
        try{
        setSelecionado(tipo)
        const response = await api.get('/consultar-recomendacao-posto')

        setListaEstabelecimentos([...response.data.avaliacao])
        setTagsEstabelecimento([...response.data.tags])


        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
        
    }


    async function abrirInfoEstabelecimento(listaEstabelecimento){
        await AsyncStorage.setItem('@unitruckRotaOriginaria', 'recomendacoes')
        navigation.navigate('InfoEstabelecimento', {listaEstabelecimento});
        console.log(listaEstabelecimento)
    }

    function barraDeBuscaEstabelecimento(buscaEstabelecimento){
        const buscaEstabelecimentoSemEspacos = buscaEstabelecimento ? buscaEstabelecimento.replace(/\s/g, '') : ''
        const regex = new RegExp(buscaEstabelecimentoSemEspacos, 'i');

        var filtroPreliminar = listaEstabelecimentos.filter((item) => regex.test(item.nome_posto.replace(/\s/g, '')))
        return filtroPreliminar.filter((item)=>item.tipoEstabelecimento == selecionado)

    }
    
    const listaEstabelecimentoRefinada = barraDeBuscaEstabelecimento(buscaEstabelecimento)

    useFocusEffect(useCallback(()=>{
        carregarOutroTipoDeEstabelecimento()
    },[tipo]))

    useEffect(()=>{
        barraDeBuscaEstabelecimento()
    },[buscaEstabelecimento])

    const screenHeight = Dimensions.get('window').height


    return(
        <View style={styles.container}> 
            <View style={styles.header}>

                <Text style={styles.titulo}>RECOMENDAÇÕES</Text>
                <View style={styles.searchSection}>                   
                    <TextInput
                    style={styles.input}
                    placeholder='Pesquisar...'
                    autoCorrect={false}
                    value={buscaEstabelecimento}
                    onChangeText={setBuscaEstabelecimento}
                    />
                    <Feather style={styles.searchIcon} name="search" size={24} color="#a4a4a4" />               
                </View>

                <View style={styles.menuHorizontal}>
                    <TouchableOpacity 
                    style={selecionado == '1' ? styles.itemMenu : styles.itemMenuApagado}
                    onPress={()=>setTipo('1')}
                    >
                        <Text style={selecionado == '1' ? styles.textoItemMenu : styles.textoItemMenuApagado}> 
                            POSTOS DE GASOLINA
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={selecionado == '2' ? styles.itemMenu : styles.itemMenuApagado}
                    onPress={()=>setTipo('2')}
                    >
                        <Text style={selecionado == '2' ? styles.textoItemMenu : styles.textoItemMenuApagado}>
                            RESTAURANTES
                        </Text>
                    </TouchableOpacity> 
                    <TouchableOpacity 
                    style={selecionado == '3' ? styles.itemMenu : styles.itemMenuApagado}
                    onPress={()=>setTipo('3')}
                    >
                        <Text style={selecionado == '3' ? styles.textoItemMenu : styles.textoItemMenuApagado}>
                            HOSPEDAGEM
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

           


            <ScrollView contentContainerStyle={styles.lista}>
                {
                    listaEstabelecimentoRefinada.length > 0 ? listaEstabelecimentoRefinada.map(listaEstabelecimento=>(

                        listaEstabelecimento.tipoEstabelecimento === selecionado ? 
                        <TouchableOpacity 
                        style={styles.cardEstabelecimento} 
                        onPress={()=>abrirInfoEstabelecimento(listaEstabelecimento)}
                        key={listaEstabelecimento.posto_id}
                        >
                            {
                                listaEstabelecimento.temFoto == '2' ? 

                                <Image 
                                style={styles.fotoEstabelecimento}
                                source={{uri: getBackendIP(listaEstabelecimento.urlImagem)}}  
                                />

                                : 

                                <View style={styles.semFotoUsuario}>
                                    <Ionicons name="business-outline" size={24} color="black" />
                                </View>
                            }
                                
                                
                            <View style={{marginLeft:10}}> 
                                <View style={styles.estabelecimentoInfo}>
                                <Text style={{fontWeight:'bold', fontSize:16}}>
                                    {listaEstabelecimento.nome_posto}
                                </Text>
                                <View style={styles.containerTags}>
                                {
                                     tagsEstabelecimento.length > 0 && tagsEstabelecimento.map(tagEstabelecimento =>(

                                        tagEstabelecimento.posto_id == listaEstabelecimento.posto_id ? tagEstabelecimento.tipo == 2 ? 
                                        <Ionicons key={tagEstabelecimento.tag_id} name="fast-food" size={10} color="#23263A" style={{marginRight:4}}/>
                                        :
                                        <FontAwesome5 key={tagEstabelecimento.tag_id} name={
                                        tagEstabelecimento.tipo == 1 ? "shower" 
                                        : 
                                        tagEstabelecimento.tipo == 3 ? "bed"
                                        : 
                                        tagEstabelecimento.tipo == 4 ? "wifi"
                                        :
                                        "tools"
                                   
                                    } size={10} color="#23263A" style={{marginRight:4}} /> : ''


                                    ))
                                }
                                </View>
                                </View>
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <AntDesign name="star" size={16} color="#EAA421" />
                                    <Text style={{color:'#EAA421'}}>
                                    {listaEstabelecimento.avaliacao == null ? 'N/A' : listaEstabelecimento.avaliacao}
                                    </Text>
                                </View>
                            </View>

                        </TouchableOpacity>

                        : ''

                       
      
                          
                    )

                    

                    

                    )

                    : 

                    <View style={{paddingTop:'50%', alignItems:'center'}}>
                        <MaterialCommunityIcons name="store-search" size={70} color="black" />
                        <Text style={{fontWeight:'bold', fontSize:18}}>Nenhum resultado encontrado!</Text>
                    </View>

                }
               
               </ScrollView>

            
            </View>
          
        
    );
}

const styles = StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor:'#fff'
    },
    header:{
        height:220,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop:Constants.statusBarHeight + 30
    },
    titulo:{
        fontSize:15,
        fontWeight:'bold',
        color:'#23263A'
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width:380,
        height:55, 
        marginBottom:20,
        marginTop:20,
        paddingLeft:20,
        borderRadius:50,
        elevation: 5,
        backgroundColor: 'white'
    },
    searchIcon: {
        padding: 10,
        paddingRight:20
    },
    input:{
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        backgroundColor: '#fff',
        color: '#424242'
    },
    menuHorizontal:{
        flexDirection:'row',
        width:380,
        justifyContent:'space-between',
        marginBottom:10
    },
    itemMenu:{
        borderBottomWidth:2,
        borderBottomColor:'#23263A'
    },
    textoItemMenuApagado:{
        color:'#a4a4a4'
    },
    textoItemMenu:{
        color:'#23263A'
    },
    rankingEstabelecimentos:{
        width:'100%',
        marginTop:10,
        alignItems:'center',

    },
    cardEstabelecimento:{
        height:100,
        backgroundColor:'#fff',
        borderRadius:20,
        elevation: 2,
        width:380,
        alignItems:'center',
        flexDirection:'row',
        marginTop:8,
        marginBottom:7
    },
    fotoEstabelecimento:{
        width:60,
        height:60,
        borderRadius:30,
        marginLeft:20,
        resizeMode:'contain'
    },
    semFotoUsuario:{
        alignItems:"center",
        justifyContent:'center',
        width:60,
        height:60,
        borderRadius:30,
        marginLeft:20
    },
    lista:{
        alignItems:'center'
    },
    estabelecimentoInfo:{
        width:280,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    containerTags:{
        flexDirection:'row',
        width:90,
        justifyContent:'flex-end'
    }
})