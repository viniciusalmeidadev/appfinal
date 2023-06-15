import React, { useState } from 'react';
import { Button, View, Platform,TextInput,StyleSheet,Text, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

function DatePickerExample({ onDateSelected }) {
  dayjs.locale('pt-br');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  function onChange(event, selectedDate) {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
    onDateSelected(currentDate); // Chama a função de callback com a data selecionada
  }

  function showDatepicker() {
    setShowPicker(true);
  }

  return (
    <View>
        <TouchableOpacity
            style={styles.inputMenor}
            onPress={showDatepicker}
        >
            <Text style={styles.data}>{dayjs(date.toISOString()).format('DD/MM/YYYY')}</Text>
        </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    inputMenor:{
        width:165,
        height:55, 
        marginBottom:15,
        paddingLeft:20, 
        borderRadius:5,
        elevation: 5,
        backgroundColor: 'white',
        justifyContent:'center'
    },
    data:{
        
    }
})

export default DatePickerExample;