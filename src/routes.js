import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
 
import Login from './login';
import Cadastro from './cadastro';
import Sucesso from './cadastro-sucesso';
import Menu from './routes/menu-bottom';
import InfoEstabelecimento from './info-estabelecimento';
import PublicarComentario from './publicar-comentario';
import Mapa from './mapa'
import CriarAlerta from './criar-alerta'
import CadastrarInteresse from './cadastrar-interesse'
import DetalheNoticia from './detalhe-noticia'
import EditarInteresses from './editar-interesses';
import EditarComentario from './editar-comentario'
import DadosEstabelecimento from './dados-estabelecimento'

export default function Routes(){
    var idUserLogado
    async function verificaUserLogado(){
         idUserLogado = await AsyncStorage.getItem('@unitruckIdUserLogado')
    }

    useEffect(()=>{
        verificaUserLogado()
    },[])

    return(
        <NavigationContainer>

            <Stack.Navigator  screenOptions={{ headerShown: false }}>
            
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Menu" component={Menu}/>
                <Stack.Screen name="Cadastro" component={Cadastro}/>
                <Stack.Screen name="Sucesso" component={Sucesso}/>
                <Stack.Screen name="InfoEstabelecimento" component={InfoEstabelecimento}/>
                <Stack.Screen name="PublicarComentario" component={PublicarComentario}/>
                <Stack.Screen name="CriarAlerta" component={CriarAlerta}/>
                <Stack.Screen name="CadastrarInteresse" component={CadastrarInteresse}/>
                <Stack.Screen name="DetalheNoticia" component={DetalheNoticia}/>
                <Stack.Screen name="EditarInteresses" component={EditarInteresses}/>
                <Stack.Screen name="EditarComentario" component={EditarComentario}/>
                <Stack.Screen name="DadosEstabelecimento" component={DadosEstabelecimento}/>
             
            </Stack.Navigator>


        </NavigationContainer>
    );
}