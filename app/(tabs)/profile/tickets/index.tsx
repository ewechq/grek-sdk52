import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors, TextStyles } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/components/Header";

const MyTicketsScreen = () => {
  const router = useRouter();
  const tickets = [
    {
      id: '123',
      status: 'active',
      title: 'Билет №123',
      description: 'Будний · 50% скидка имениннику',
      isActive: true,
      date: '2024-11-05',
    },
    {
      id: '234',
      status: 'inactive',
      title: 'Билет №234',
      description: 'Выходной · 50% скидка с 20:00 до 21:00',
      isActive: false,
      date: '2025-01-28',
    },
    {
      id: '345',
      status: 'inactive',
      title: 'Билет №345',
      description: 'Выходной',
      isActive: false,
      date: '2025-02-13',
    },
  ];

  const renderTicket = (ticket: any) => (
    <TouchableOpacity
      key={ticket.id}
      onPress={() => router.push(`/profile/tickets/${ticket.id}`)}
      style={{
        backgroundColor: ticket.isActive ? Colors.purple : Colors.grayBg,
        borderRadius: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
      }}
    >
      <View>
        <Text style={{ 
          ...TextStyles.h2, 
          color: ticket.isActive ? Colors.white : Colors.black 
        }}>{ticket.title}</Text>
        <Text style={{ ...TextStyles.textDescription, color: ticket.isActive ? Colors.white : Colors.grayText }}>{ticket.date}</Text>
        <Text
          style={{
            ...TextStyles.text,
            color: ticket.isActive ? Colors.white : Colors.grayText,
            marginTop: 8,
          }}
        >
          {ticket.description}
        </Text>
      </View>
      <Ionicons
        name="arrow-forward-outline"
        size={16}
        color={ticket.isActive ? Colors.white : Colors.black}
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header title="Мои билеты" marginTop={32}/>
      {/*блок с настройками*/}
      <View style={{ marginTop: 40, gap: 8, padding: 16 }}>
        {tickets.map(renderTicket)}
      </View>
    </View>
  );
};

export default MyTicketsScreen;

const styles = StyleSheet.create({});
