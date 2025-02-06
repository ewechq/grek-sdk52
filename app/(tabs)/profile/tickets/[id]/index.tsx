import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import Header from "@/components/Header";
import { TextStyles, Colors } from "@/theme";

const TicketDetails = () => {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header title={`Билет №${id}`} marginTop={32}/>
      <View style={{marginBottom:160, padding: 16}}>
      
      <View style={{ marginTop: 40 }}>
        <Image source={require('../../../../../assets/images/qr-code-ticket.png')} style={{ width: undefined, height: 300 }} resizeMode="contain" />
        <View style={{marginTop:32}}>
          <Text style={{...TextStyles.h2, marginBottom:16}}>Покупатель</Text>
          <Text>ФИО: Пупкин Василий Петрович</Text>
          <Text>Телефон: +79999999999</Text>
          <Text>Эл.почта: pupkin@gmail.com</Text>
        </View>
        <View style={{marginTop:32}}>
          <Text style={{...TextStyles.h2, marginBottom:16}}>Ребенок</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between',}}>
          <View>
            <Text>ФИО: Пупкин Василий Петрович</Text>
            <Text>Дата рождения: 15.07.2019</Text>
          </View>
          
          <View >
            <Image source={require('../../../../../assets/images/qr-code-ticket.png')} style={{ width: 100, height: 100 }} />
          </View>
          </View>
        </View>
        <View style={{marginTop:32}}>
          <Text style={{...TextStyles.h2, marginBottom:16}}>О билете</Text>
          <Text>Будни · 50% скидка имениннику</Text>
          <Text>Дата приобретения: 15.07.2024</Text>
        </View>
      </View>
      </View>
    </ScrollView>
  );
};

export default TicketDetails; 