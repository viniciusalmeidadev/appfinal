import React, {useState} from "react";
import {Picker} from '@react-native-picker/picker';
import {View, StyleSheet } from 'react-native';

export default (props) => {

    

    return (
        <View style={styles.select}>
        <Picker
        selectedValue={props.tipo_usuario}
        onValueChange={(itemValue, itemIndex) =>
            props.setTipo_usuario(itemValue)
        }
        >
            <Picker.Item label="Pessoa Física" value="1" />
            <Picker.Item label="Pessoa Jurídica" value="2" />
        </Picker>
        </View>
    );
};


const styles = StyleSheet.create({
    select:{   
        width:350,
        height:55, 
        marginBottom:15,
        paddingLeft:20, 
        borderRadius:5,
        elevation: 5,
        backgroundColor: 'white'
    }
});


