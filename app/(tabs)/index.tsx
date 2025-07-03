import { StyleSheet, View, Pressable, Text, Image } from "react-native";
import React, { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { Colors, Typography } from "@/theme/index";
import MainHeader from "@/components/ui/layout/MainHeader";
import Feather from "@expo/vector-icons/Feather";
import { InstIcon } from "@/components/ui/icons/InstIcon";
import { VkIcon } from "@/components/ui/icons/VkIcon";
import { TgIcon } from "@/components/ui/icons/TgIcon";
import { useTheme } from "@/theme";

export default function MainScreen() {
  const { theme, toggleTheme, colors } = useTheme();
  const router = useRouter();

  const handleBuyTicket = useCallback(() => {
    try {
      router.push("/(buyticket)");
    } catch (error) {
      router.push("/");
    }
  }, [router]);

  const handlePaidCard = useCallback(() => {
    try {
      router.push("/(paybycard)");
    } catch (error) {
      router.push("/");
    }
  }, [router]);

  const handleTicketPrice = useCallback(() => {
    try {
      router.push("/(price)");
    } catch (error) {
      router.push("/");
    }
  }, [router]);

  return (
    <View style={{ height: "100%", backgroundColor: colors.background }}>
      <MainHeader />
      <View style={{ paddingHorizontal: 8, gap: 8 }}>
        <Pressable style={styles.cardBlock} onPress={handlePaidCard}>
          <View style={[styles.TextBlock, { width: "50%" }]}>
            <Text
              style={[
                styles.BlockTitle,
                { color: Colors.white },
              ]}
            >
              Пополнить карту
            </Text>
            <Text style={[styles.BlockText, { color: Colors.white }]}>
              Проходите на аттракционы без очередей
            </Text>
          </View>

          <Image
            source={require("@/assets/images/cards.png")}
            resizeMode="contain"
            style={styles.cardBlockImage}
          />
          <View style={styles.iconCard}>
            <Feather name="arrow-up-right" size={18} color={Colors.white} />
          </View>
        </Pressable>

        <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              height: 325,
              gap: 8,
              width: "49%",
            }}
          >
            <Pressable style={styles.buyTicketBlock} onPress={handleBuyTicket}>
              <View style={styles.TextBlock}>
                <Text style={styles.BlockTitle}>Купить билет</Text>
                <Text style={styles.BlockText}>
                  Забронируйте билеты заранее
                </Text>
              </View>
              <Image
                source={require("@/assets/images/success.webp")}
                resizeMode="contain"
                style={[
                  styles.cardBlockImage,
                  {
                    top: "auto",
                    bottom: 20,
                    right: 0,
                    height: 180,
                    width: 180,
                  },
                ]}
              />
              <View
                style={[
                  styles.iconCard,
                  { bottom: 8, top: "auto", backgroundColor: "#96E3F4" },
                ]}
              >
                <Feather name="arrow-up-right" size={18} color={Colors.black} />
              </View>
            </Pressable>
            <View style={styles.socialMediaBlock}>
              <Pressable style={styles.socialMedia}>
                <InstIcon></InstIcon>
              </Pressable>
              <Pressable style={styles.socialMedia}>
                <VkIcon></VkIcon>
              </Pressable>
              <Pressable style={styles.socialMedia}>
                <TgIcon></TgIcon>
              </Pressable>
            </View>
          </View>
          <Pressable
            style={styles.ticketPriceBlock}
            onPress={handleTicketPrice}
          >
            <View style={styles.TextBlock}>
              <Text style={styles.BlockTitle}>Стоимость билетов</Text>
              <Text style={styles.BlockText}>
                Прайс-лист, акции и специальные предложения
              </Text>
            </View>
            <Image
              source={require("@/assets/images/grek_vesna.webp")}
              resizeMode="contain"
              style={[styles.cardBlockImage, { top: -10, width: 200 }]}
            />
            <View style={[styles.iconCard, { backgroundColor: "#FBDF82" }]}>
              <Feather name="arrow-up-right" size={18} color={Colors.black} />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardBlock: {
    backgroundColor: Colors.purple,
    padding: 16,
    borderRadius: 15,
    position: "relative",
    marginTop: 40,
    height: 180,
    justifyContent: "flex-end",
  },
  TextBlock: {
    color: Colors.white,
    zIndex: 10,
  },
  BlockTitle: {
    ...Typography.h2(),
    textTransform: "uppercase",
    paddingBottom: 4,
  },
  BlockText: {
    ...Typography.caption(),
  },
  cardBlockImage: {
    position: "absolute",
    right: -10,
    top: -25,
    height: 220,
    width: 220,
  },
  iconCard: {
    padding: 8,
    backgroundColor: "rgb(200, 174, 255)",
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 12,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 11,
  },
  bottomButtons: {
    gap: 8,
    padding: 24,
  },
  socialMediaBlock: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
  socialMedia: {
    padding: 8,
    backgroundColor: "#F49FD6",
    borderRadius: 8,
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buyTicketBlock: {
    flex: 1,
    backgroundColor: "#C2F4FF",
    borderRadius: 15,
    padding: 16,
  },
  ticketPriceBlock: {
    width: "49%",
    backgroundColor: "rgb(255,248,167)",
    borderRadius: 15,
    padding: 16,
    justifyContent: "flex-end",
  },
});
