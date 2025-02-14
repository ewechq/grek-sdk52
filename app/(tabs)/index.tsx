import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Colors, TextStyles } from "@/theme";
import Btn from "@/components/btns/Btn";
import DashedLine from "@/components/DashedLine";
import { useRouter } from "expo-router";
import DiscountsModal from '@/components/modals/DiscountsModal';

const MainScreen = () => {
  const router = useRouter();
  const [isDiscountsModalVisible, setIsDiscountsModalVisible] = React.useState(false);

  return (
    <View style={styles.container}>

      {/* Верхний блок */}
      <View style={styles.topBlock}>
      <Image 
        source={require('@/assets/images/logo-white.png')} 
        style={styles.logo}
      />
        <View style={styles.infoBox}>
          <Image
            source={require("@/assets/images/pattern.png")}
            resizeMode="cover"
            style={styles.patternBackground}
          />
          <View style={styles.infoContent}>
            <Text style={styles.title}>Билет на весь день</Text>
            <Text style={styles.description}>
              Один соповождающий взрослый - бесплатно, каждый последующий - 250₽.
              Дети до 1 года - бесплатно.
            </Text>
          </View>
        </View>
        <Btn title="Купить" bgColor={Colors.pink} width='full' onPress={() => router.push('/(buyticket)')} />
      </View>

      <DashedLine />

      {/* Нижний блок */}
      <View style={styles.bottomBlock}>
        <View style={styles.locationTimeContainer}>
          <Text style={styles.infoText}>
            Место: {'\n'}Алексеева 54А, {'\n'}ТЦ RedSail
          </Text>
          <Text style={[styles.infoText, styles.textRight]}>
            Время:{'\n'}Счастливое{'\n'}детство
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Image
            source={require("@/assets/images/pattern.png")}
            resizeMode="cover"
            style={styles.patternBackground}
          />
          <View style={styles.priceContent}>
            {/* Будни */}
            <View>
              <View style={styles.dayTypeLabel}>
                <Text style={styles.dayTypeText}>Понедельник-пятница</Text>
              </View>
              <View style={styles.priceRow}>
                <View style={styles.priceColumn}>
                  <Text style={styles.priceText}>От 1 до 4 лет</Text>
                  <Text style={styles.priceText}>От 5 до 16 лет</Text>
                </View>
                <View style={styles.priceColumn}>
                  <Text style={styles.priceText}>1 390 ₽</Text>
                  <Text style={styles.priceText}>1 690 ₽</Text>
                </View>
              </View>
            </View>

            {/* Выходные */}
            <View style={{marginTop: 24}}>
              <View style={styles.dayTypeLabel}>
                <Text style={styles.dayTypeText}>Выходные и праздники</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>От 1 до 16 лет</Text>
                <Text style={styles.priceText}>2 290 ₽</Text>
              </View>
            </View>
          </View>
        </View>
        <Btn 
            title="Скидки" 
            bgColor={Colors.purpleDark} 
            textColor={Colors.white} 
            width='full' 
            onPress={() => setIsDiscountsModalVisible(true)} 
          />
          <Text style={{...TextStyles.textDescription, color: Colors.white, textAlign: 'center', marginTop: 8}}>grekland.ru</Text>
      </View>

      <DiscountsModal 
        isVisible={isDiscountsModalVisible}
        onClose={() => setIsDiscountsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingBottom: 110,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  logo: {
    width: 200,
    height: 70,
    alignSelf: 'center',
    marginBottom: 4
  },
  topBlock: {
    flex: 1,
    backgroundColor: Colors.purple,
    borderRadius: 30,
    padding: 20,
    paddingTop:4
  },
  bottomBlock: {
    flex: 1.5,
    backgroundColor: Colors.purple,
    borderRadius: 30,
    padding: 20,
    justifyContent: 'space-between',
  },
  patternBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0.3,
  },
  infoBox: {
    flex: 1,
    backgroundColor: Colors.purpleDark,
    borderRadius: 20,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  infoContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    ...TextStyles.h2,
    textAlign: "center",
    marginBottom: 4,
    color: Colors.white,
  },
  description: {
    ...TextStyles.text,
    textAlign: "center",
    color: Colors.white,
  },
  locationTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: Colors.white,
  },
  infoText: {
    ...TextStyles.textDescription,
    color: Colors.white,
  },
  textRight: {
    textAlign: 'right',
    color: Colors.white,
  },
  priceContainer: {
    flex: 1,
    backgroundColor: Colors.purpleDark,
    borderRadius: 20,
    marginTop: 16,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  priceContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  dayTypeLabel: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: Colors.purple,
    borderRadius: 20,
    marginBottom: 8,
    color: Colors.white,
  },
  dayTypeText: {
    ...TextStyles.h3,
    textAlign: 'center',
    color: Colors.white,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceColumn: {
    gap: 8,
  },
  priceText: {
    ...TextStyles.text,
    color: Colors.white,
  },

});

export default MainScreen;
