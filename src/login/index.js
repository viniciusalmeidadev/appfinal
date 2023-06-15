import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {api} from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import logo from '../assets/Logo-Azul-Transparente.png'

export default function App() {

    const [email, setEmail] = useState('');
    const [senhaInserida, setSenhaInserida] = useState('');

    const navigation = useNavigation();
    function backToHome(){
        
        navigation.navigate('Cadastro');
    }

    async function paraHome(){
      console.log('clicou')
      try{
        console.log(email, senhaInserida)
        if(email != '' && senhaInserida != ''){
          const response = await api.post('/autenticar', {
            email, senhaInserida
          })
          
      
          if (response.status === 201) {
            var {user_id} = response.data
            await AsyncStorage.setItem('@unitruckIdUserLogado', JSON.stringify(user_id))
            console.log(user_id)
            navigation.navigate('Menu');
          }else if(response.status === 400){
            alert('Senha incorreta')
          }
          else{
            alert('um erro ocorreu!');
          }
        }else if(email == ''){
          alert('Insira seu e-mail!')
        }else if(senhaInserida == ''){
          alert('Insira sua senha!')
        }
        

    
      }catch(err){
    
          alert('Usuário ou senha incorretos!')
          console.log(err)
    
      }
      console.log('chegou')
    }

  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Image source={logo} style={styles.Logo}/>
      </View>
      

      <View style={styles.containerForm}>
        <TextInput
        style={styles.input}
        placeholder='E-mail'
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        />

        <TextInput
        style={styles.input}
        placeholder='Senha'
        secureTextEntry={true}
        autoCorrect={false}
        value={senhaInserida}
        onChangeText={setSenhaInserida}
        autoCapitalize="none"
        />
        
        <TouchableOpacity>
          <Text style={styles.botaoEsqueceuSenha}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
        
      </View>

      <TouchableOpacity style={styles.botao} onPress={paraHome}>
          <Text style={styles.textoBotao}>LOGIN</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={backToHome}>
      <Text style={styles.textoCadastrar}>Quero me cadastrar</Text>
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
  },
  containerLogo:{
    width:'100%',
    height:150,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  Logo:{
    height:100,
    width:200,
    marginBottom:50,
    resizeMode:'contain'
  },
  containerForm:{
    position:'relative'
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



