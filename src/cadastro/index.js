import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import Constants from 'expo-constants'
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../services/api';
import DatePickerExample from '../components/DatePicker';



import Select from '../components/select'

export default function App() {
  const navigation = useNavigation();

  const [tipo_usuario, setTipo_usuario] = useState('1');
  const [nome, setNome] = useState('');
  const [cpf_cnpj, setCpf_cnpj] = useState('123');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confereSenha, setConfereSenha] = useState('')
  const [sexo, setSexo] = useState('M');
  const [telefone, setTelefone] = useState('');
  const [image, setImage] = useState(null);


  
  const [dataNascimento, setDataNascimento] = useState(null);

  function handleDateSelected(date) {
    setDataNascimento(date.toISOString()); // Armazena a data selecionada no estado do componente App
  }


  async function pegarImagem(){

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }

  }

  const uri = image




  async function confirmaCadastro(){
    if(senha === confereSenha){

      try{

        // FAZ UPLOAD DA IMAGEM DO PERFIL 
        
        let formData = new FormData();

        let urlImagem = `${uuid.v4()}.jpg`;
        let temFoto = 2

        formData.append('file', {
          uri,
          name: `${urlImagem}`,
          type: 'image/jpeg',
        });

        let options = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        };

        await api.post('/uploads', formData, options)

        // cria cliente no banco de dados

        const response = await api.post('/cadastrar-usuario', {
            nome, email, senha, tipo_usuario, sexo, cpf_cnpj, telefone,urlImagem, temFoto,dataNascimento 
        })
        
    
        if (response.status === 201) {
          var {user_id} = response.data
          var id_categoria = 1
          await AsyncStorage.setItem('@unitruckIdUserLogado', JSON.stringify(user_id))

          await api.post(`/editar-categoria/${user_id}`,{
            id_categoria
          })

          navigation.navigate('Sucesso');
        }else{
          alert('um erro ocorreu!');
        }
    
      }catch(err){
    
          alert('erro ao fazer o registro!')
          console.log(err)
    
      }

    }else{
    
      alert('Senhas Diferem!')
    
    }
      
    
  }

  function voltarParaLogin(){
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>

      <Feather name="arrow-left" size={38} color="black" style={styles.backToLogin} onPress={voltarParaLogin}/>

      

      {
      !image ? 
      <TouchableOpacity style={styles.containerFotoPerfil} onPress={pegarImagem}>
      <Feather name="user" size={24} color="black"/>
      </TouchableOpacity>
      :
      <TouchableOpacity onPress={pegarImagem}>
      <Image style={styles.containerFotoPerfil} source={{ uri: image }}/>
      </TouchableOpacity>
      }
        
        
      
      <View>

        <View style={styles.grupoInput}>
            <TextInput
            style={styles.input}
            placeholder='Nome'
            autoCorrect={false}
            value={nome}
            onChangeText={setNome}
            />
        </View>

        <View style={styles.grupoInput}>
            <DatePickerExample onDateSelected={handleDateSelected} />
            <TextInput
            style={styles.inputMenor}
            placeholder='Telefone'
            autoCorrect={false}
            value={telefone}
            onChangeText={setTelefone}
            maxLength={11}
            keyboardType="numeric"
            />
        </View>

        <TextInput
        style={styles.input}
        placeholder='E-mail'
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
        />

        <TextInput
        style={styles.input}
        placeholder='Senha'
        secureTextEntry={true}
        autoCorrect={false}
        value={senha}
        onChangeText={setSenha}
        />

        <TextInput
        style={styles.input}
        placeholder='Confirmar senha'
        secureTextEntry={true}
        autoCorrect={false}
        value={confereSenha}
        onChangeText={setConfereSenha}
        />
        
        
        
      </View>

      <TouchableOpacity style={styles.botao} onPress={confirmaCadastro}>
          <Text style={styles.textoBotao}>REGISTRAR</Text>
      </TouchableOpacity>
      
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position:'relative'
  },
  backToLogin:{
    position:'absolute',
    top:0,
    left:0,
    marginTop:Constants.statusBarHeight + 30,
    marginLeft:25
  },
  containerFotoPerfil:{
    alignItems:'center',
    justifyContent:'center',
    height:100,
    width:100,
    marginBottom:50,
    borderRadius:50,
    elevation: 10,
    backgroundColor: 'white'
  },
  containerForm:{
    borderWidth:1,
    position:'relative',
    height:450
  },
  input:{
    width:350,
    height:55, 
    marginBottom:15,
    paddingLeft:20, 
    borderRadius:5,
    elevation: 5,
    backgroundColor: 'white'
  },
  grupoInput:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  inputMenor:{
    width:165,
    height:55, 
    marginBottom:15,
    paddingLeft:20, 
    borderRadius:5,
    elevation: 5,
    backgroundColor: 'white'
  },
  input:{
    width:350,
    height:55, 
    marginBottom:15,
    paddingLeft:20,
    borderRadius:5,
    elevation: 5,
    backgroundColor: 'white'
  },
  botaoEsqueceuSenha:{
    position:'absolute',
    right:0,
    bottom:0,
    marginBottom:-15
  },
  botao:{
    backgroundColor:"#23263A",
    width:200,
    height:55,
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center',
    marginVertical:30
  },
  textoBotao:{
    color:"#fff",
    fontSize:16,
    fontWeight:'bold'
  },
  textoCadastrar:{
    fontWeight:'bold',
    fontSize:14
  }
});
