import { ActivityIndicator, View, Text,StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 


export function NoticiasVazias(){
    return(
        <View style={styles.container}>
            <Ionicons name="newspaper-outline" size={60} color="black" />
            <Text style={styles.texto}>Nenhuma notícia encontrada nesta categoria!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        paddingTop:'50%'
    },
    texto:{
        fontSize:16,
        fontWeight:'bold'
    }
});