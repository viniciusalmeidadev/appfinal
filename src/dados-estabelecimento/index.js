import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert,Image} from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import Constants from 'expo-constants'
import {useNavigation, useRoute, useFocusEffect} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import getBackendIP from '../services/getBackendIP'
import Select from '../components/select'

export default function App() {

    const navigation = useNavigation();
    const route = useRoute();
    const listaEstabelecimento = route.params.listaEstabelecimento;

    async function voltarEstabelecimento(){
      navigation.navigate('InfoEstabelecimento', {listaEstabelecimento});
    }

    return(
        <View style={styles.container}>
            <View style={styles.header}>
            <TouchableOpacity style={styles.botaoVoltar} onPress={voltarEstabelecimento}>
                <Feather name="arrow-left" size={30} color="#fff" />
            </TouchableOpacity>
            </View>
            <Image 
                style={styles.fotoEstabelecimento}
                source={{ uri: getBackendIP(listaEstabelecimento.urlImagem) }} 
            />
            <View style={styles.ContainerDadosUsuario}>
                            <Text style={styles.nomeCampo}>Nome do estabelecimento</Text>
                            <Text style={styles.valorCampo}>{listaEstabelecimento.nome_posto}</Text>
                            <Text style={styles.nomeCampo}>Endereço</Text>
                            <Text style={styles.valorCampo}>{listaEstabelecimento.endereco}</Text>
                            <Text style={styles.nomeCampo}>Telefone</Text>
                            <Text style={styles.valorCampo}>{listaEstabelecimento.telefone}</Text>
                            <Text style={styles.nomeCampo}>Email</Text>
                            <Text style={styles.valorCampo}>{listaEstabelecimento.email}</Text>
                            <Text style={styles.nomeCampo}>CNPJ</Text>
                            <Text style={styles.valorCampo}>{listaEstabelecimento.cpf_cnpj}</Text>
                            <Text style={styles.nomeCampo}>Localização</Text>
            </View>
            <MapView
            style={{height:300, width:'100%'}}
            initialRegion={{latitude : parseFloat(listaEstabelecimento.latitude) , longitude : parseFloat(listaEstabelecimento.longitude),latitudeDelta: 0.0022, longitudeDelta: 0.0021}}
            customMapStyle={customMapStyle}
            >

                <Marker
                      coordinate={{latitude : parseFloat(listaEstabelecimento.latitude) , longitude : parseFloat(listaEstabelecimento.longitude)}}
                  >
                    <View style={styles.circuloEstabelecimento}>
                    
                      <Image 
                      style={{resizeMode:'contain',width:30,height:30}}  
                      source={{ uri: getBackendIP(listaEstabelecimento.urlImagem) }} 
                      />
                    </View>
                    <View style={styles.triangulo}/>
                   
                  </Marker>

            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    botaoVoltar:{
        width:34,
        height:34,
        backgroundColor:'#23263A',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:17,
        marginTop:10,
    },
    fotoEstabelecimento:{
        width:100,
        height:100,
        resizeMode:'contain',
        alignSelf:'center',
        marginBottom:10
    },
    container:{
        paddingTop:Constants.statusBarHeight + 10,
        paddingHorizontal:20,
        backgroundColor:'#fff'
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