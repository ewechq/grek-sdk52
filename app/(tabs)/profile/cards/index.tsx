import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import Header from "@/components/Header";
import { TextStyles, Colors } from "@/theme";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Btn from "@/components/btns/Btn";
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  interpolate
} from 'react-native-reanimated';
import Modal from 'react-native-modal';
import Accordion from '@/components/Accordion';

const LoyaltyProgram = () => {
  const [activeCard, setActiveCard] = useState(1); // 1 или 2
  const [isModalVisible, setModalVisible] = useState(false);

  const cards = [
    {
      id: 1,
      title: "Ресторан",
      subtitle: "Mr. Grek",
      backgroundColor: Colors.purple,
      cardNumber: "123 455",
      cashback: "3%",
      balance: "5 000₽",
      logo: require("../../../../assets/images/logo_mrgrek.png"),
      textColor: Colors.white
    },
    {
      id: 2,
      title: "Центр семейного отдыха",
      subtitle: "Троя Парк",
      backgroundColor: Colors.yellow,
      cardNumber: "777 777",
      cashback: "10%",
      balance: "3 000₽",
      logo: require("../../../../assets/images/logo_troya.png"),
      textColor: Colors.black
    }
  ];

  const currentCard = cards.find(card => card.id === activeCard);

  const handlePrevious = () => {
    setActiveCard(prev => prev === 1 ? 2 : 1);
  };

  const handleNext = () => {
    setActiveCard(prev => prev === 1 ? 2 : 1);
  };

  const firstCardStyle = useAnimatedStyle(() => {
    return {
      zIndex: activeCard === 1 ? 10 : 1,
      marginLeft: withTiming(activeCard === 1 ? 16 : 36),
      marginRight: withTiming(activeCard === 1 ? 36 : 8),
      marginTop: withTiming(activeCard === 1 ? 0 : 8),
      opacity: withTiming(activeCard === 1 ? 1 : 0.5),
      transform: [
        { scale: withTiming(activeCard === 1 ? 1 : 0.95) }
      ]
    };
  });

  const secondCardStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: withTiming(activeCard === 2 ? -16 : -32),
      left: withTiming(activeCard === 2 ? 16 : 36),
      right: withTiming(activeCard === 2 ? 36 : 8),
      zIndex: activeCard === 2 ? 10 : 1,
      opacity: withTiming(activeCard === 2 ? 1 : 0.5),
      transform: [
        { scale: withTiming(activeCard === 2 ? 1 : 0.95) }
      ],
    };
  });

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: Colors.white }}>
        <View style={{ marginBottom: 100 }}>
          <View style={{ marginBottom: 40 }}>
            <Header title="Карты лояльности" />
          </View>

          {/*Блок с названием и навигацией*/}
          <View style={styles.headerContainer}>
            <View>
              <Text style={{ ...TextStyles.textDescription, color: Colors.grayText }}>
                {currentCard?.title}
              </Text>
              <Text style={{ ...TextStyles.h3 }}>{currentCard?.subtitle}</Text>
            </View>
            <View style={styles.navigationContainer}>
              <TouchableOpacity style={styles.navButton} onPress={handlePrevious}>
                <Ionicons name="chevron-back" size={16} color={Colors.purple} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.navButton, { backgroundColor: Colors.purple }]}
                onPress={handleNext}
              >
                <Ionicons name="chevron-forward" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/*Блок с карточками и балансом*/}
          <View style={{ marginBottom: 8 }}>
            <View style={{ height: 400 }}>
              <Animated.View style={[firstCardStyle]}>
                <CardContent 
                  backgroundColor={cards[0].backgroundColor}
                  cardNumber={cards[0].cardNumber}
                  cashback={cards[0].cashback}
                  logo={cards[0].logo}
                  textColor={cards[0].textColor}
                />
              </Animated.View>

              <Animated.View style={[secondCardStyle]}>
                <CardContent 
                  backgroundColor={cards[1].backgroundColor}
                  cardNumber={cards[1].cardNumber}
                  cashback={cards[1].cashback}
                  logo={cards[1].logo}
                  textColor={cards[1].textColor}
                />
              </Animated.View>
            </View>

            {/* Блок с балансом - теперь вне анимированного контейнера */}
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>
                Баланс
              </Text>
              <Text style={styles.balanceValue}>
                {currentCard?.balance} 
              </Text>
            </View>
          </View>

          {/*Блок с кнопками*/}
          <View style={styles.buttonsContainer}>
            <Btn title="Пополнить" width="full" onPress={() => {}} />
            <Btn
              title="Подробнее о программе"
              width="full"
              onPress={() => setModalVisible(true)}
              bgColor={Colors.grayBg}
              textColor={Colors.black}
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{ margin: 0,  justifyContent: 'flex-end', }}
      >
        <View style={styles.modalContent}>
        <TouchableOpacity onPress={() => setModalVisible(false)} style={{ paddingHorizontal: 6 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Подробнее о программе</Text>
            <AntDesign name="close" size={14} color={Colors.black} />
          </View>
          </TouchableOpacity>

          <ScrollView style={styles.modalScroll}>
            <Accordion title="Описание бонусной системы">
              <Text style={styles.accordionText}>
                Посещение аттракционов осуществляется картой доступа. Карта доступа приобретается отдельно, стоимость карты 50 ₽.
                При внесении денежных средств на карту - мы зачисляем вам бонусные деньги. Подробнее в разделах Тарифы и Льготы.
              </Text>
            </Accordion>

            <Accordion title="Общая бонусная система">
              <Text style={styles.accordionText}>
                Здесь будет описание общей бонусной системы...
              </Text>
            </Accordion>

            <Accordion title="Льготная бонусная система">
              <Text style={styles.accordionText}>
                Здесь будет описание льготной бонусной системы...
              </Text>
            </Accordion>

            <Accordion title="Правила пользования картами доступа">
              <Text style={styles.accordionText}>
                Здесь будут правила пользования картами...
              </Text>
            </Accordion>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

// Выносим контент карточки в отдельный компонент
const CardContent = ({ backgroundColor, cardNumber, cashback, logo, textColor }) => (
  <View
    style={{
      borderRadius: 25,
      backgroundColor,
      height: 380,
      padding: 16,
      justifyContent: "space-around",
    }}
  >
    <View style={{ alignItems: "center", gap: 16 }}>
      <Image
        source={logo}
        style={{ width: 200, height: undefined, aspectRatio: 4 }}
        resizeMode="contain"
      />
      <Image
        source={require("../../../../assets/images/qr-code-ticket.png")}
        style={{ width: 200, height: 200, borderRadius: 15 }}
      />
    </View>

    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ gap: 4 }}>
        <Text style={{ ...TextStyles.textDescription, color: textColor }}>
          Номер карты
        </Text>
        <Text style={{ ...TextStyles.h3Number, color: textColor }}>
          {cardNumber}
        </Text>
      </View>

      <View style={{ gap: 4 }}>
        <Text style={{ ...TextStyles.textDescription, color: textColor }}>
          Кэшбек
        </Text>
        <Text style={{ ...TextStyles.h3Number, color: textColor }}>
          {cashback}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  navigationContainer: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
  },
  navButton: {
    width: 70,
    height: 40,
    borderRadius: 25,
    borderWidth: 0.3,
    borderColor: Colors.grayElements,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceContainer: {
    alignSelf: "center",
    alignItems: "center",
    gap: 4,
    paddingBottom: 16,
  },
  balanceLabel: {
    ...TextStyles.textDescription,
    color: Colors.grayText,
  },
  balanceValue: {
    ...TextStyles.h3Number,
    color: Colors.black,
  },
  buttonsContainer: {
    gap: 4,
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 16,
    maxHeight: '80%',
    paddingTop: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  modalTitle: {
    ...TextStyles.h2,
  },
  modalScroll: {
    paddingHorizontal: 16,
  },
  accordionText: {
    ...TextStyles.text,
    color: Colors.black,
  },
});

export default LoyaltyProgram;
