import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import Constants from 'expo-constants'
import {useNavigation} from '@react-navigation/native';

import Select from '../components/select'

export default function App() {
    return(
        <View>
            <Text>TELA chat</Text>
        </View>
    );
}