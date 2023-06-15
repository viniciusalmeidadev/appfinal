import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, ScrollView, TextInput} from 'react-native';
import { Feather, AntDesign, FontAwesome, Ionicons, FontAwesome5, MaterialIcons} from '@expo/vector-icons'; 
import Constants from 'expo-constants'
import {useNavigation, useRoute} from '@react-navigation/native';
import {api} from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {

    

    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState(null);

    const navigation = useNavigation();
    const route = useRoute();
    const listaEstabelecimento = route.params.listaEstabelecimento;

    function voltarParaInfoEstabelecimento(){
        navigation.navigate('InfoEstabelecimento', {listaEstabelecimento});
    }

    async function postarComentario(){
        var user_id_desformatado = await AsyncStorage.getItem('@unitruckIdUserLogado')
        const user_id = JSON.parse(user_id_desformatado)
        const posto_id = listaEstabelecimento.posto_id
        const response = await api.post('/cadastrar-recomendacao-posto', {
            user_id, posto_id, valor, descricao
        })

        if(response.status == 201){
            navigation.navigate('InfoEstabelecimento', {listaEstabelecimento});
        }else{
            console.log('algum erro ocorreu;')
        }
    }

    return(
        <View style={styles.containerPublicarComentario}>
            <Text style={styles.textoApresentacao}>{listaEstabelecimento.nome_posto}</Text>
            <Text>
                avalie este estabelecimento abaixo
            </Text>
            <TouchableOpacity style={styles.botaoVoltar} onPress={voltarParaInfoEstabelecimento}>
                    <Feather name="arrow-left" size={40} color="#fff" />
            </TouchableOpacity>

            <View>
            <Text style={styles.textoInfoAvaliacao}>Qual sua avaliação?</Text>
            <View style={styles.avaliacaoAreaGeral}>
                <TouchableOpacity onPress={() => setValor(1)}>
                    <AntDesign
                        name={valor >= 1 ? 'star' : 'staro'}
                        size={40}
                        color="#EAA421"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setValor(2)}>
                    <AntDesign
                        name={valor >= 2 ? 'star' : 'staro'}
                        size={40}
                        color="#EAA421"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setValor(3)}>
                    <AntDesign
                        name={valor >= 3 ? 'star' : 'staro'}
                        size={40}
                        color="#EAA421"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setValor(4)}>
                    <AntDesign
                        name={valor >= 4 ? 'star' : 'staro'}
                        size={40}
                        color="#EAA421"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setValor(5)}>
                    <AntDesign
                        name={valor >= 5 ? 'star' : 'staro'}
                        size={40}
                        color="#EAA421"
                    />
                </TouchableOpacity>
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
            

            <TouchableOpacity style={styles.botaoPostar} onPress={()=>postarComentario()}>
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
        padding:10,
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
    }
})