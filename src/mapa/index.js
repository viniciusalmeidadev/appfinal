import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Modal, Image, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {Marker} from 'react-native-maps';
import { Feather, Ionicons } from '@expo/vector-icons'; 
import Constants from 'expo-constants'
import {useNavigation} from '@react-navigation/native';
import {api} from '../services/api';
import socketio from 'socket.io-client';
import * as Location from "expo-location";
import getBackendIP from '../services/getBackendIP'

import arvoreCaida from '../assets/MarcadorEventNatu.png'
import carroQuebrado from '../assets/MarcadorVeículoQuebrado.png'
import acidente from '../assets/MarcadorAcidente.png'
import transitoLento from '../assets/MarcadorTransitoLento.png'
import pistaRuim from '../assets/MarcadorPistaRuim.png'
import axios from 'axios';
import eventoNatural from '../assets/eventoNatural.png'
import transito from '../assets/transito.png'
import veiculoQuebrado from '../assets/carroquebrado.png'
import pistaCondicaoRuim from '../assets/pistaRuim.png'
import acidenteVeicular from '../assets/acidente.png'
import perigo from '../assets/acidente.png'
import alertaIcon from '../assets/alerta.png'
import viaInterditada from '../assets/Viainterditada.png'
import ocultar from '../assets/ocultar.png'
import mostrar from '../assets/mostrar.png'


import marcadorPosto from '../assets/MarcadorPosto.png'

export default function App() {

    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();
    
    const[localAtual, setLocalAtual] = useState([])

    const[alerta, setAlerta] = useState([]);

    const[alertaModal, setAlertaModal] = useState([])

    const[inicioRegiao, setInicioRegiao] = useState()

    const [listaEstabelecimentosMapa, setListaEstabelecimentosMapa] = useState([]);

    const [botaoFlutuanteAberto,setBotaoFlutuanteAberto] = useState(false)

    const [alertasVisiveis, setAlertasVisiveis] = useState(true)

    const [estabelecimentosVisiveis, setEstabelecimentosVisiveis] = useState(true)

    const [zoomLevel, setZoomLevel] = useState(20);

    const [fotosCarregadas, setFotosCarregadas] = useState(true);

    const [user_id,setUser_id] = useState(19)

    async function pegarLocAtual(tipo){
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
      Alert.alert("Ops!", "Permissão de acesso a localização negada.");
      }

      let {
      coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();

      var descricao = "Enviando alerta"
      
      const socket = socketio('http://192.168.1.64:4011')

      const alerta_id = await Math.floor(Math.random()*100000000000)
      console.log(tipo)
      socket.emit('chat message', {alerta_id, user_id,descricao,tipo,latitude, longitude})
      setBotaoFlutuanteAberto(false)
    }


    function voltarParaHome(){
        navigation.navigate('Home')
    }

    async function chamarAlertas(){
        const response = await api.get('/pegaAlertas')

        setAlerta([...response.data])
    }

    function criarAlerta(){
        navigation.navigate('CriarAlerta');
    }



    async function pegarRua(){
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
        Alert.alert("Ops!", "Permissão de acesso a localização negada.");
        }

        var {
        coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync();

        setInicioRegiao({ latitude, longitude, latitudeDelta: 0.0022, longitudeDelta: 0.0021 });
        const response = await axios.get(`http://api.positionstack.com/v1/reverse?access_key=5145b22a729618173206549467e55f74&query=${latitude},${longitude}&limit=1`)
        
        setLocalAtual([...response.data.data])
        
    }

    async function buscaEstabelecimentos(){
        const response = await api.get('/consultar-postos')

        setListaEstabelecimentosMapa([...response.data])
    }

    function abrirBotaoFlutuante(abrirOuFechar){
        setBotaoFlutuanteAberto(abrirOuFechar)
    }

    function mostrarOuOcultarAlertas(){
        if(alertasVisiveis === true){
            setAlertasVisiveis(false)
        }else{
            setAlertasVisiveis(true)
        }
    }

    function mostrarOuOcultarEstabelecimentos(){
        if(estabelecimentosVisiveis === true){
            setEstabelecimentosVisiveis(false)
        }else{
            setEstabelecimentosVisiveis(true)
        }
    }

    async function handleRegionChangeComplete (region){

      setInicioRegiao(region)
      await calculateZoomLevel(region.latitudeDelta);
      
    };

    function calculateZoomLevel  (latitudeDelta){
      const minLatitudeDelta = 0.00001; 
      const maxZoomLevel = 20; 

      const zoom = Math.log2(minLatitudeDelta / latitudeDelta);
      setZoomLevel(Math.max(0, Math.min(maxZoomLevel, -zoom)));
    };

    const [terminou,setTerminou] = useState([])

    

    function countRender(){
      setTerminou(prevCount=> prevCount + 1)
    }

    async function abrirInfoEstabelecimento(listaEstabelecimento){
      await AsyncStorage.setItem('@unitruckRotaOriginaria', 'mapa')
      navigation.navigate('InfoEstabelecimento', {listaEstabelecimento});
      console.log(listaEstabelecimento)
    }

    useEffect(()=>{
      if(listaEstabelecimentosMapa.length > 0 && terminou.length === listaEstabelecimentosMapa.length){

        setTimeout(() => {
          setFotosCarregadas(false)
        },1000)
        
        setTerminou([]) 
        console.log('if 1')
       }else if(zoomLevel > 12){
        setFotosCarregadas(true)
        console.log('eif 2')
       }
       console.log(inicioRegiao)
    },[terminou,zoomLevel])

    useEffect(()=>{
      if(zoomLevel < 12 && estabelecimentosVisiveis === true){
        setFotosCarregadas(true)
        setTimeout(() => {
          setFotosCarregadas(false)
        },1000)
        console.log('eif 3')
       }
    },[estabelecimentosVisiveis])

    useEffect(()=>{
        pegarRua()
        chamarAlertas()
        buscaEstabelecimentos()
    },[])
    

    useEffect(()=>{
        const socket = socketio('http://192.168.1.64:4011')

        socket.on('chat message', msg=>{setAlerta(oldAlerta=>[...oldAlerta,msg])
            
        })
        
    },[])

    return(
        <View style={styles.container}>
            

            


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
                                    <Image style={{height:80, width:80}}source={
                                        alertaModal.tipo == 2 ?  viaInterditada : 
                                        alertaModal.tipo == 3 ? alertaIcon :
                                        alertaModal.tipo == 4 ? transito :
                                        perigo
                                    }/>
                                    <Text style={{fontSize:16, fontWeight:'bold', marginVertical:15}}>{
                                        alertaModal.tipo == 2 ?  "Alerta de via interditada!" : 
                                        alertaModal.tipo == 3 ? "Alerta de perigo!" :
                                        alertaModal.tipo == 4 ? "Alerta de trânsito lento!" :
                                        "Alerta de acidente!"    
                                    }</Text>
                                    <Text style={styles.textoDescricao}>

                                    {
                                        alertaModal.tipo == 2 ?  "Este alerta quer dizer que a via está intertada para manutenção, intrafegabilidade, entre eventos." : 
                                        alertaModal.tipo == 3 ? "Este alerta quer dizer que a via pode ter algum perigo. Tenha precaução sempre!" :
                                        alertaModal.tipo == 4 ? "Este alerta quer dizer que neste trecho a trafegabilidade pode estar lenta!" :
                                        "Este alerta quer dizer que possivelmente ocorreu acidente neste trecho. Prefira outro."    
                                    }

                                    </Text>
                                </View>

                                
                  
                        
                        </View>
                    </View>
                    
            </Modal>






            {
            <MapView
            initialRegion={inicioRegiao}
            style={{flex:1, width:'100%'}}
            showsUserLocation={true}
            customMapStyle={customMapStyle}
            onRegionChangeComplete={handleRegionChangeComplete}    
        >
            {
                 estabelecimentosVisiveis === true && zoomLevel <= 12 && listaEstabelecimentosMapa.map((listaEstabelecimento,index)=>(
                  <Marker
                      key={listaEstabelecimento.posto_id}
                      coordinate={{latitude : parseFloat(listaEstabelecimento.latitude) , longitude : parseFloat(listaEstabelecimento.longitude)}}
                      tracksViewChanges={fotosCarregadas}
                      onPress={()=>abrirInfoEstabelecimento(listaEstabelecimento)}
                  >
                    <View style={styles.circuloEstabelecimento}>
                    
                      <Image 
                      style={{resizeMode:'contain',width:30,height:30}}  
                      source={{uri: getBackendIP(listaEstabelecimento.urlImagem)}}
                      onLoad={countRender}
                      />
                    </View>
                    <View style={styles.triangulo}/>
                   
                  </Marker>
                ))
            }
            {
                alertasVisiveis === true && zoomLevel <= 12 && alerta.map((listaAlerta,index)=>(
                    <Marker
                    key={index}
                    coordinate={{latitude : parseFloat(listaAlerta.latitude) , longitude : parseFloat(listaAlerta.longitude)}}
                    tracksViewChanges={false} 
                    image={
                        listaAlerta.tipo == 2 ?  viaInterditada : 
                        listaAlerta.tipo == 3 ? alertaIcon :
                        listaAlerta.tipo == 4 ? transito :
                        perigo}
                    style={{height:200, width:100}}
                    onPress={() => {setModalVisible(true), setAlertaModal(listaAlerta)}}
                    />
                ))
            }
            </MapView>
            
          
            
            
            }



            
            {
              <View style={styles.adressInfo}>
                {
                            localAtual.map((local,index)=>(
                                <Text key={index} style={styles.textoSeuLocal}>{local.label}</Text>
                            ))
                }
              </View>
            }

            {
              botaoFlutuanteAberto == true ?
              <>
              <View style={styles.botaoAberto}>
                <View style={styles.conteudoBotao}>
                  <View style={{width:"40%",paddingVertical:10, height:"90%", justifyContent:"space-around", alignItems:'center'}}>  
                    <TouchableOpacity style={styles.alertaContainer} onPress={()=>pegarLocAtual("3")}>
                        <Image source={alertaIcon} style={{height:59,width:59}}></Image>
                      <Text style={styles.alertaTitulo}>Perigo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.alertaContainer} onPress={()=>pegarLocAtual("2")}>
                      <Image source={viaInterditada} style={{height:59,width:59}}></Image>
                      <Text style={styles.alertaTitulo}>Via interditada</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width:"40%",paddingVertical:10, height:"90%", justifyContent:"space-around", alignItems:'center'}}> 
                    <TouchableOpacity style={styles.alertaContainer} onPress={()=>pegarLocAtual("1")}>
                      <Image source={perigo} style={{height:59,width:59}}></Image>
                      <Text style={styles.alertaTitulo}>Acidente</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.alertaContainer} onPress={()=>pegarLocAtual("4")}>
                      <Image source={transito} style={{height:59,width:59}}></Image>
                      <Text style={styles.alertaTitulo}>Trânsito</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View> 
              <TouchableOpacity style={styles.botaoFlutuanteFechado} onPress={()=>abrirBotaoFlutuante(false)}>
                <Feather name="minus" size={24} color="#fff"/>
              </TouchableOpacity>
              </>
              :
              <TouchableOpacity style={styles.botaoFlutuanteFechado} onPress={()=>abrirBotaoFlutuante(true)}>
                <Feather name="plus" size={24} color="#fff"/>
              </TouchableOpacity>
            }

            

                   
                    <View style={styles.botaoFlutuante}>
                        <View style={styles.containerBotoes}>
                            <TouchableOpacity style={styles.botoes} onPress={mostrarOuOcultarAlertas}>
                                <Feather name={alertasVisiveis === true ? "eye-off":"eye"} size={24} color="black" />
                                <Text style={{fontSize:10}}>{alertasVisiveis === true ? "Ocultar Alertas": "Mostrar Alertas"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botoes} onPress={mostrarOuOcultarEstabelecimentos}>
                                <Feather name={estabelecimentosVisiveis === true ? "eye-off":"eye"} size={24} color="black" />
                                <Text style={{fontSize:10}}>{estabelecimentosVisiveis === true ? "Ocultar Estabelecimentos": "Mostrar Estabelecimentos"}</Text>
                            </TouchableOpacity>
                        </View>                     
                    </View>

        </View>
        
    );
}

const styles = StyleSheet.create({
    container:{
        position:'relative',
        height:'100%'
    },
    header:{
        height:150,
        alignItems: 'center',
        justifyContent:'space-around',
        paddingTop:Constants.statusBarHeight + 10,
        backgroundColor:"#23263A"
    },
    estabelecimento:{
        width:60,
        height:60,
        backgroundColor:"yellow",
        borderWidth:2,
        borderColor:"red",
        borderRadius:30
    },
    containerBotao:{
        width:"100%",
        alignItems:'center',
        marginTop:20
    },
    botaoAlerta:{
        backgroundColor:"#FFF",
        width:200,
        height:55,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
    },
    tituloPagina:{
        color:'#fff',
        fontSize:20,
        fontWeight:'bold',
        
    },
    infoPagina:{
        fontSize:14,
        color:'#fff'
    },
    containerSeuLocal:{
        height:90,
        paddingTop:20,
        paddingLeft:30,
        width:320
    },
    tituloSeuLocal:{
        color:'#FFF',
        fontSize:16,
        fontWeight:'bold'
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
        height:250,
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
    containerBotaoFechar:{
        flexDirection:'row',
        width:'65%',
        justifyContent:"space-between"
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
    textoDescricao:{
        fontSize:14,
        textAlign:'center'
    },
    conteudoTag:{
        alignItems:'center',
        paddingHorizontal:20
    },
    botaoVoltar:{
        position:'absolute',
        left:0,
        marginTop:Constants.statusBarHeight + 10,
        marginLeft:20
    },
    adressInfo:{
        position:'absolute',
        top:0,
        marginTop:'20%',
        backgroundColor:'rgba(255, 255, 255, 1)',
        width:'90%',
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'space-around',
        borderRadius:50,
        paddingHorizontal:30,
        paddingVertical:10
    },
    textoSeuLocal:{
      color:'black',
      fontSize:11,
      fontWeight:'bold'
    },
    botaoAberto:{
      position:'absolute',
      bottom:0,
      width:"100%",
      height:280,
      marginBottom:90,
      paddingHorizontal:20,

    },
    conteudoBotao:{
      elevation:2,
      height:280,
      backgroundColor:"#fff",
      width:'100%',
      borderRadius:45,
      borderBottomEndRadius:45,
      flexDirection: 'row',
      alignItems:'center',
      justifyContent:'center',
    },
    botaoFlutuanteFechado:{
        position:'absolute',
        right:0,
        bottom:0,
        marginBottom:98,
        borderWidth:3,
        borderColor:'#fff',
        height:60,
        width:60,
        borderRadius:30,
        alignItems:'center',
        justifyContent:'center',
        marginRight:28,
        backgroundColor:"#23263A"
    },
    botaoFlutuante:{
        position:'absolute',
        bottom:0,
        marginBottom:'5%',
        backgroundColor:'rgba(255, 255, 255, 1)',
        width:'60%',
        height:50,
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'space-around',
        borderRadius:50,
        paddingHorizontal:10,
        paddingVertical:10,
    },
    containerBotoes:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:"100%"
    },
    botoes:{
        alignItems:'center',
        justifyContent:'center',
        height:40,
        borderRadius:6
    },
    fecharBotaoFlutuante:{
        position:"absolute",
        top: '50%',
        right:0,
        marginTop:-7.5
    },
    circuloEstabelecimento:{
      borderWidth:2,
      borderColor:'#23263A',
      backgroundColor:'#fff',
      width:49,
      height:49,
      borderRadius:24.5,
      justifyContent:'center',
      alignItems:'center'
    },
    triangulo: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 20,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: '#23263A',
      marginTop:-2.2,
      alignSelf:'center',
      transform: [{ rotate: '180deg' }],
    },
    alertaContainer:{
      alignItems:'center',
      justifyContent:'center',
      width:110,
      height:80,
      paddingHorizontal:5,
      paddingVertical:20
    },
    alertaIcone:{
      borderWidth:1,
      width:50,
      height:50,
      borderRadius:25
    }
})


const customMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
]