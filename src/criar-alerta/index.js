import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, ScrollView, TextInput} from 'react-native';
import { Feather, AntDesign, FontAwesome, Ionicons, FontAwesome5, MaterialIcons} from '@expo/vector-icons'; 
import Constants from 'expo-constants'
import {useNavigation, useRoute} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import * as Location from "expo-location";
import socketio from 'socket.io-client';


export default function App() {

    const [user_id,setUser_id] = useState(1)
    const [tipo, setTipo] = useState("");
    const [descricao, setDescricao] = useState("");

    const navigation = useNavigation();
   

    function voltarParaMapa(){
        navigation.navigate('Mapa')
    }


    async function pegarLocAtual(){
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
        Alert.alert("Ops!", "Permissão de acesso a localização negada.");
        }

        let {
        coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync();
        
        const socket = socketio('http://192.168.109.214:4011')

        const alerta_id = await Math.floor(Math.random()*100000000000)
        console.log(tipo)
        socket.emit('chat message', {alerta_id, user_id,tipo, descricao,latitude, longitude})

        navigation.navigate('Mapa')
    }

    return(
        <View style={styles.containerPublicarComentario}>
            <Text style={styles.textoApresentacao}></Text>
            <Text>
                Crie um alerta preenchendo os campos abaixo:
            </Text>
            <TouchableOpacity style={styles.botaoVoltar} onPress={voltarParaMapa}>
                    <Feather name="arrow-left" size={40} color="#fff" />
            </TouchableOpacity>

            <View>
            <Text style={styles.textoInfoAvaliacao}>Qual o tipo do alerta?</Text>
            <View style={styles.avaliacaoAreaGeral}>

                <View style={styles.select}>
                    <Picker
                    selectedValue={tipo}
                    onValueChange={(itemValue, itemIndex) =>
                        setTipo(itemValue)
                    }
                    >
                        <Picker.Item label="Acidente" value="1"/>
                        <Picker.Item label="Veículo quebrado" value="5"/>
                        <Picker.Item label="Eventos naturais" value="2" />
                        <Picker.Item label="Trânsito lento" value="3" />
                        <Picker.Item label="Pista em más condições" value="4" />
                    </Picker>
                </View>

            </View>
            </View>
            <View>
                <Text style={styles.textoInfoComentario}>Seu comentário</Text>
                <TextInput
                multiline={true}
                numberOfLines={10}
                style={styles.textoComentario}
                onChangeText={setDescricao}
                value={descricao}/>
            </View>
            

            <TouchableOpacity style={styles.botaoPostar} onPress={()=>pegarLocAtual()}>
                <Text style={{color:'#fff', fontSize:16, fontWeight:'bold'}}>POSTAR</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    containerPublicarComentario:{
        paddingTop:Constants.statusBarHeight + 20,
        paddingHorizontal:30,
        alignItems:'center',
        position:'relative'
    },
    textoApresentacao:{
        fontSize:20,
        fontWeight:'bold',
        marginBottom:20
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
    avaliacaoAreaGeral:{
        width:350,
        flexDirection:'row',
        marginBottom:10
    },
    textoInfoAvaliacao:{
        fontWeight:'bold',
        fontSize:16,
        marginTop:30,
        marginBottom:10
    },
    textoInfoComentario:{
        fontWeight:'bold',
        fontSize:16,
        marginVertical:10
    },
    textoComentario:{
        backgroundColor:'#fff',
        width:350,
        elevation:6,
        height:180,
        textAlignVertical: 'top',
        padding:20,
        borderRadius:10
    },
    botaoPostar:{
        backgroundColor:"#23263A",
        width:350,
        height:55,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        marginVertical:50
    },
    select:{   
        width:350,
        height:55, 
        marginBottom:15,
        paddingLeft:20, 
        borderRadius:5,
        elevation: 5,
        backgroundColor: 'white'
    }
})