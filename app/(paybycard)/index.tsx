import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";
import { Colors, Typography } from "@/theme";
import Btn from "@/components/ui/btns/Btn";
import InputPhone from "@/components/ui/inputs/InputPhone";
import HeaderInner from "@/components/ui/layout/Header";
import BtnDownlineText from "@/components/ui/btns/BtnDownlineText";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { MoreIcon } from "@/components/ui/icons/MoreVerticalIcon";
import { Accordion } from "@/components/ui/others/Accordion";
import { TransactionHistory } from "@/widgets/paybycard/TransactionHistory";

const PAIDCARD_PHONE_KEY = "paidcard_phone";
const PAIDCARD_CARD_KEY = "paidcard_card";

const PayByCard = () => {
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState<null | {
    points: number;
    bonus: number;
    money: number;
    card: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [points, setPoints] = useState<string | null>(null);
  const [bonus, setBonus] = useState<string | null>(null);
  const [money, setMoney] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyArray, setHistoryArray] = useState<Array<{date: string, name: string, value: number}>>([]);
  const router = useRouter();

  // Анимация парящей карточки
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Запускаем бесконечную анимацию вверх-вниз
    translateY.value = withRepeat(
      withTiming(-20, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  // Анимированные стили для карточки
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Анимированные стили для тени (обратная зависимость от высоты)
  const shadowAnimatedStyle = useAnimatedStyle(() => {
    const shadowScale = interpolate(
      translateY.value,
      [-20, 0], // от верхней до нижней позиции
      [0.8, 1] // меньший размах: от 0.8 до 1.0
    );
    const shadowOpacity = interpolate(
      translateY.value,
      [-20, 0],
      [0.4, 0.6] // меньший размах прозрачности
    );

    return {
      transform: [{ scaleX: shadowScale }, { scaleY: shadowScale * 0.3 }], // добавим сжатие по Y
      opacity: shadowOpacity,
    };
  });

  useEffect(() => {
    (async () => {
      try {
        const storedPhone = await SecureStore.getItemAsync(PAIDCARD_PHONE_KEY);
        const storedCard = await SecureStore.getItemAsync(PAIDCARD_CARD_KEY);
        if (storedPhone) setPhone(storedPhone);
        if (storedCard) setCardNumber(storedCard);
        if (storedPhone && storedCard) {
          setLoading(true);
          setError(null);
          setPoints(null);
          setBonus(null);
          setMoney(null);
          try {
            const res2 = await fetch(
              `https://api.grekland.ru/api/card?card=${storedCard}`
            );
            const data2 = await res2.json();
            if (data2.error) {
              setError(data2.message || "Ошибка получения данных карты");
              setLoading(false);
              return;
            }
            setPoints(String(data2.points));
            setBonus(String(data2.bonus));
            setMoney(String(data2.money));
            // Сохраняем историю операций если она есть
            if (data2.history && Array.isArray(data2.history)) {
              setHistoryArray(data2.history);
            }
          } catch (e) {
            setError("Ошибка сети или сервера");
          } finally {
            setLoading(false);
          }
        }
      } catch {}
    })();
  }, []);

  const handlePaidCard = async () => {
    setLoading(true);
    setError(null);
    setCardData(null);
    setCardNumber(null);
    try {
      const requestBody = { phone };
      const res = await fetch("https://api.grekland.ru/api/card", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      console.log("Статус ответа:", res.status);
      const data = await res.json();
      console.log("Ответ сервера:", data);
      if (data.error) {
        setError(data.message || "Ошибка получения карты");
        setLoading(false);
        return;
      }
      const card = data.card;
      if (!card) {
        setError("Карта не найдена");
        setLoading(false);
        return;
      }
      setCardNumber(card);
      // Сохраняем телефон (как ввёл пользователь) и карту в SecureStore (всегда как строки)
      await SecureStore.setItemAsync(PAIDCARD_PHONE_KEY, String(phone));
      await SecureStore.setItemAsync(PAIDCARD_CARD_KEY, String(card));
      // Второй запрос: получаем данные карты
      console.log("Делаем второй запрос: /api/card?card=" + card);
      const res2 = await fetch(`https://api.grekland.ru/api/card?card=${card}`);
      console.log("Статус ответа 2:", res2.status);
      const data2 = await res2.json();
      console.log("Ответ сервера 2:", data2);
      if (data2.error) {
        setError(data2.message || "Ошибка получения данных карты");
        setLoading(false);
        return;
      }
      setCardData({
        points: data2.points,
        bonus: data2.bonus,
        money: data2.money,
        card: card,
      });
      setPoints(String(data2.points));
      setBonus(String(data2.bonus));
      setMoney(String(data2.money));
      // Сохраняем историю операций если она есть
      if (data2.history && Array.isArray(data2.history)) {
        setHistoryArray(data2.history);
      }
    } catch (e) {
      console.log("Catch error:", e);
      setError("Ошибка сети или сервера");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setPhone("");
    setIsValid(false);
    setCardData(null);
    setError(null);
    setCardNumber(null);
    setAmount("");
    setHistoryArray([]);
    setPoints(null);
    setBonus(null);
    setMoney(null);
    // Очищаем SecureStore
    await SecureStore.deleteItemAsync(PAIDCARD_PHONE_KEY);
    await SecureStore.deleteItemAsync(PAIDCARD_CARD_KEY);
  };

  const handleAmountChange = (text: string) => {
    // Оставляем только цифры
    const cleaned = text.replace(/[^0-9]/g, "");
    setAmount(cleaned);
  };

  const handleCardPayment = async () => {
    if (!cardNumber || !amount) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.grekland.ru/api/card/pay?card=${cardNumber}&sum=${amount}`,
        {
          method: "POST",
          headers: { Accept: "*/*" },
        }
      );
      const data = await res.json();
      if (data.link) {
        const encodedUrl = encodeURIComponent(data.link);
        router.push({
          pathname: "/(buyticket)/payment",
          params: { url: encodedUrl },
        });
      } else {
        setError("Ошибка получения ссылки на оплату");
      }
    } catch (e) {
      setError("Ошибка сети или сервера");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuSelect = (option: string) => {
    setMenuOpen(false);
    if (option === "Другая карта") {
      handleReset();
    } else if (option === "Правила использования") {
      // Здесь можно добавить логику для показа правил
      console.log("Показать правила использования");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderInner title="Пополнение карты" />
      <View style={styles.cardImageContainer}>
        {/* Анимированная тень */}
        <Animated.View style={[styles.shadowContainer, shadowAnimatedStyle]}>
          <Svg height="100%" width="100%" style={styles.shadowGradient}>
            <Defs>
              <RadialGradient id="shadowGradient" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="rgba(194, 194, 194, 0.5)" />
                <Stop offset="70%" stopColor="rgba(224, 224, 224, 0.2)" />
                <Stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </RadialGradient>
            </Defs>
            <Ellipse
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fill="url(#shadowGradient)"
            />
          </Svg>
        </Animated.View>

        {/* Анимированная карточка */}
        <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
          <Image
            source={require("@/assets/images/card.png")}
            resizeMode="contain"
            style={styles.image}
          />
          <View style={styles.cardOverlay}>
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Рубли:</Text>
                <Text style={styles.balanceValue}>
                  {money === null && loading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : money ? (
                    money + " ₽"
                  ) : (
                    "___"
                  )}
                </Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Бонусы:</Text>
                <Text style={styles.balanceValue}>
                  {bonus === null && loading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    bonus || "___"
                  )}
                </Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Баллы:</Text>
                <Text style={styles.balanceValue}>
                  {points === null && loading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    points || "___"
                  )}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 40,
                marginLeft: 40,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <View>
                <Text style={styles.balanceLabel}>Номер карты:</Text>
                <Text style={styles.cardNumberOverlay}>
                  {cardNumber || "___"}
                </Text>
              </View>
              <View>
                <Text style={styles.balanceLabel}>Номер телефона:</Text>
                <Text style={styles.cardNumberOverlay}>{phone || "___"}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
      {cardNumber && phone ? (
        <>
          <View style={styles.cardInfo}>
            <View>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="Сумма платежа"
                keyboardType="numeric"
                maxLength={7}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Btn
                  title="ПОПОЛНИТЬ КАРТУ"
                  onPress={handleCardPayment}
                  bgColor={Colors.purple}
                  textColor={Colors.white}
                  disabled={amount.length === 0 || loading}
                />
                <View style={{ position: "relative" }}>
                  <Btn
                    title={<MoreIcon size={16} color={Colors.grayText} />}
                    width="icon"
                    onPress={handleMenuToggle}
                    bgColor={Colors.grayBg}
                  />
                  {menuOpen && (
                    <View style={styles.dropdownMenu}>
                      <Pressable
                        onPress={() => handleMenuSelect("Другая карта")}
                        style={styles.dropdownItem}
                      >
                        <Text style={styles.dropdownText}>Другая карта</Text>
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          handleMenuSelect("Правила использования")
                        }
                        style={styles.dropdownItem}
                      >
                        <Text style={styles.dropdownText}>
                          Правила использования
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>

            </View>



          </View>
        </>
      ) : (
        <>
          <View style={{ marginHorizontal: 16 }}>
            <InputPhone
              initialValue={phone}
              onPhoneChange={setPhone}
              onValidityChange={setIsValid}
              backgroundColor="transparent"
            />
          </View>
          <Btn
            title={loading ? "ИЩЕМ КАРТУ..." : "НАЙТИ КАРТУ"}
            onPress={handlePaidCard}
            width="default"
            bgColor={Colors.purple}
            textColor={Colors.white}
            disabled={!isValid || loading}
            style={{ marginTop: 24 }}
          />

        </>
      )}
      {loading && !cardNumber && (
        <ActivityIndicator style={{ marginTop: 24 }} color={Colors.purple} />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <TransactionHistory 
            historyData={[]}
            defaultExpanded={false}
            loading={false}
            hasCardData={false}
          />
      <Accordion title="ПРАВИЛА ПОЛЬЗОВАНИЯ КАРТАМИ">
              <Text>
                1. Приобрести карту можно только в кассе парка. Пополнить можно
                как на кассе, так и онлайн на странице нашего сайта: "Пополнение
                бонусной карты". 2. Списание денежных средств производится по
                факту посещения аттракциона, согласно его стоимости. 3. При
                посещении аттракциона с помощью оператора, карту необходимо
                однократно зафиксировать на считывающем устройстве. 4. Когда на
                индикаторе загорается зеленый свет проход открыт, красный свет
                проход запрещен. 5. Баланс карты доступа вы можете узнать на
                кассе. 6. Сохраняйте свою карту доступа - неизрасходованные
                денежные средства действительны в другой день, и карта имеет
                неограниченный срок действия. 7. Возврат денежных средств с
                карты доступа, а также за саму карту возможен только в день
                пополнения. Для этого обратитесь к администратору парка и
                заполните необходимые бухгалтерские документы.
              </Text>
            </Accordion>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 40,
    paddingBottom: 160,
  },

  error: {
    color: Colors.red,
    marginTop: 16,
    ...Typography.small(),
    textAlign: "center",
  },
  cardInfo: {
    marginTop: 32,
    borderRadius: 16,
    padding: 16,
  },
  infoText: {
    ...Typography.caption(),
    color: Colors.black,
    marginBottom: 12,
  },
  value: {
    ...Typography.body(),
  },
  inputLabel: {
    marginBottom: 8,
  },
  amountInput: {
    ...Typography.caption(),
    height: 48,
    borderBottomWidth: 1,
    borderColor: Colors.grayBg,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  image: {
    width: "100%",
    height: 420,
    marginTop: 24,
  },
  dropdownMenu: {
    position: "absolute",
    bottom: 50,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 25,
    minWidth: 180,
    borderWidth: 0.5,
    borderColor: Colors.grayElements,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    ...Typography.caption(),
    color: Colors.black,
  },
  cardImageContainer: {
    position: "relative",
    width: "96%",
    alignSelf: "center",
  },
  cardOverlay: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 0,
    //backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: "flex-start",
  },
  balanceRow: {
    flexDirection: "row",
    gap: 40,
    alignItems: "center",
    marginTop: 40,
    marginLeft: 40,
  },
  balanceItem: {
    alignItems: "flex-start",
  },
  balanceLabel: {
    ...Typography.small(),
    color: Colors.white,
    marginBottom: 4,
  },
  balanceValue: {
    ...Typography.body(),
    color: Colors.white,
  },
  cardNumberOverlay: {
    ...Typography.body(),
    color: Colors.white,
  },
  shadowContainer: {
    position: "absolute",
    bottom: -25,
    left: "12%",
    right: "12%",
    height: 40,
    zIndex: 0,
  },
  shadowGradient: {
    flex: 1,
    borderRadius: 100,
  },
  cardContainer: {
    zIndex: 1,
  },
});

export default PayByCard;
