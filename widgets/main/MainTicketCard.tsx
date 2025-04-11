/**
 * Виджет карточки с основной информацией о билетах
 * 
 * Функциональность:
 * 1. Отображение цен на билеты по дням недели
 * 2. Отображение информации о месте и времени
 * 3. Визуальное оформление с декоративными элементами
 * 4. Адаптивный дизайн
 * 
 * Особенности:
 * - Мемоизация компонентов для оптимизации
 * - SVG-декоративные элементы
 * - Переиспользуемые компоненты
 * - Адаптивные отступы через normalize
 */

import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useMemo } from 'react'
import { Colors, TextStyles } from '@/theme/index'
import Svg, { Path } from 'react-native-svg'
import { normalize } from '@/utils/responsive'
import { useTicketPrices } from '@/hooks/buyticket/useTicketPrices'

/**
 * Пропсы для карточки с ценой
 */
interface PriceCardProps {
  age: string;    // Возрастная категория
  price: string;  // Стоимость билета
}

/**
 * Компонент карточки с ценой
 * Отображает возрастную категорию и стоимость
 */
const PriceCard = ({ age, price }: PriceCardProps) => (
  <View style={styles.priceCard}>
    <View style={styles.ageCardColumn}>
      <Text style={TextStyles.textDescription}>Возраст</Text>
      <Text style={TextStyles.h2}>{age}</Text>
    </View>
    <View style={styles.priceCardColumn}>
      <Text style={TextStyles.textDescription}>Цена</Text>
      <Text style={TextStyles.h2}>{price}</Text>
    </View>
  </View>
);

/**
 * Пропсы для заголовка секции
 */
interface SectionHeaderProps {
  title: string;  // Текст заголовка
}

/**
 * Компонент заголовка секции
 * Включает декоративные элементы по бокам
 */
const SectionHeader = ({ title }: SectionHeaderProps) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionHeaderDecorLeft} />
    <Text style={styles.sectionHeaderTitle}>{title}</Text>
    <View style={styles.sectionHeaderDecorRight} />
  </View>
);

/**
 * Компонент разделителя
 * Мемоизирован для оптимизации
 */
const Divider = React.memo(() => (
  <View style={styles.divider} />
));

/**
 * Компонент верхнего декоративного края
 * SVG-элемент с волнообразным краем
 */
const TopEdge = React.memo(() => (
  <View style={styles.topSvgContainer}>
    <Svg 
      width="100%" 
      height="40" 
      viewBox="0 0 334 35" 
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <Path d="M15.1957 6.1204L11.3467 1.96514C9.80978 0.306017 7.23994 0.148697 5.51217 1.60796C-3.52645 9.24193 1.87194 24 13.703 24H321.099C333.363 24 338.396 8.25676 328.407 1.14205C326.688 -0.0828825 324.326 0.159743 322.891 1.70874L318.804 6.1204C312.868 12.5292 302.732 12.5292 296.796 6.1204L293.868 2.95987C291.889 0.823616 288.511 0.823614 286.532 2.95987L283.604 6.1204C277.668 12.5292 267.532 12.5292 261.596 6.1204L258.668 2.95987C256.689 0.823618 253.311 0.823614 251.332 2.95987L248.404 6.12037C242.468 12.5291 232.332 12.5291 226.396 6.12038L223.468 2.95987C221.489 0.823617 218.111 0.823616 216.132 2.95987L213.204 6.1204C207.268 12.5292 197.132 12.5292 191.196 6.1204L188.268 2.95987C186.289 0.823617 182.911 0.823615 180.932 2.95987L178.004 6.12038C172.068 12.5291 161.932 12.5292 155.996 6.1204L153.068 2.95987C151.089 0.823616 147.711 0.823614 145.732 2.95987L142.804 6.12039C136.868 12.5292 126.732 12.5292 120.796 6.12039L117.868 2.95987C115.889 0.823618 112.511 0.823615 110.532 2.95987L107.604 6.12039C101.668 12.5292 91.5323 12.5292 85.5957 6.1204L82.6681 2.95987C80.6892 0.823616 77.3108 0.823615 75.3319 2.95987L72.4043 6.12039C66.4677 12.5292 56.3323 12.5292 50.3957 6.12039L47.4681 2.95987C45.4893 0.823617 42.1108 0.823616 40.1319 2.95987L37.2043 6.1204C31.2677 12.5292 21.1323 12.5292 15.1957 6.1204Z" fill="white"/>
    </Svg>
  </View>
));

/**
 * Компонент нижнего декоративного края
 * SVG-элемент с волнообразным краем
 */
const BottomEdge = React.memo(() => (
  <View style={styles.svgContainer}>
    <Svg 
      width="100%" 
      height="40" 
      viewBox="0 0 334 35" 
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <Path d="M14.1957 21.8796L11.4321 24.8631C9.39437 27.0629 5.89191 26.9864 3.95216 24.6997C-4.31326 14.9559 2.61204 0 15.3893 0H317.047C330.04 0 336.832 15.4466 328.049 25.0213C326.084 27.1643 322.707 27.1726 320.731 25.0393L317.804 21.8796C311.868 15.4708 301.732 15.4708 295.796 21.8796L292.868 25.0401C290.889 27.1764 287.511 27.1764 285.532 25.0401L282.604 21.8796C276.668 15.4708 266.532 15.4708 260.596 21.8796L257.668 25.0401C255.689 27.1764 252.311 27.1764 250.332 25.0401L247.404 21.8796C241.468 15.4709 231.332 15.4709 225.396 21.8796L222.468 25.0401C220.489 27.1764 217.111 27.1764 215.132 25.0401L212.204 21.8796C206.268 15.4708 196.132 15.4708 190.196 21.8796L187.268 25.0401C185.289 27.1764 181.911 27.1764 179.932 25.0401L177.004 21.8796C171.068 15.4709 160.932 15.4708 154.996 21.8796L152.068 25.0401C150.089 27.1764 146.711 27.1764 144.732 25.0401L141.804 21.8796C135.868 15.4708 125.732 15.4708 119.796 21.8796L116.868 25.0401C114.889 27.1764 111.511 27.1764 109.532 25.0401L106.604 21.8796C100.668 15.4708 90.5323 15.4708 84.5957 21.8796L81.6681 25.0401C79.6892 27.1764 76.3108 27.1764 74.3319 25.0401L71.4043 21.8796C65.4677 15.4708 55.3323 15.4708 49.3957 21.8796L46.4681 25.0401C44.4892 27.1764 41.1108 27.1764 39.1319 25.0401L36.2043 21.8796C30.2677 15.4708 20.1323 15.4708 14.1957 21.8796Z" fill="white"/>
    </Svg>
  </View>
));

/**
 * Основной компонент карточки с информацией о билетах
 */
export const MainTicketCard = () => {
  const { prices, isLoading } = useTicketPrices();

  // Мемоизируем карточки с ценами для будних дней
  const weekdayPriceCards = useMemo(() => {
    if (!prices) return null;
    
    return (
      <>
        <PriceCard age="1 - 4 года" price={`${prices["1-4"]} РУБ`} />
        <PriceCard age="5 - 16 лет" price={`${prices["5-16"]} РУБ`} />
      </>
    );
  }, [prices]);

  // Мемоизируем карточку с ценой для выходных
  const weekendPriceCard = useMemo(() => {
    if (!prices) return null;
    
    return (
      <PriceCard age="1 - 16 лет" price={`${prices["5-16"]} РУБ`} />
    );
  }, [prices]);

  // Если цены загружаются, показываем плейсхолдер
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Загрузка цен...</Text>
      </View>
    );
  }

  // Если цены не загружены, показываем сообщение об ошибке
  if (!prices) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Не удалось загрузить цены</Text>
      </View>
    );
  }

  return (
    <View>
      {/* Верхний декоративный край */}
      <TopEdge />
      
      {/* Основной контент */}
      <View style={styles.mainContent}>
        {/* Описание билета */}
        <View style={styles.contentDescription}>
          <Text style={styles.sectionTitle}>Билет на весь день</Text>
          <Text style={styles.descriptionText}>
            Один сопровождающий взрослый - бесплатно, каждый последующий - {prices["attendant"]}₽. Дети до 1 года - бесплатно.
          </Text>
          <Divider />
        </View>

        {/* Секция с ценами на будние дни */}
        <View style={styles.priceSection}>
          <SectionHeader title="Понедельник-пятница" />
          {weekdayPriceCards}
        </View>

        {/* Секция с ценами на выходные */}
        <View style={styles.priceSection}>
          <SectionHeader title="Выходные и праздники" />
          {weekendPriceCard}
        </View>

        {/* Информация о месте и времени */}
        <View>
          <View
            style={{
              height: 0.5,
              opacity: 0.2,
              backgroundColor: Colors.purple,
              width: '60%',
              alignSelf: 'center',
            }}
          />
          <View style={styles.locationTimeContainer}>
            <Text style={styles.locationTimeText}>Место:{'\n'}Алессеева 54А,{'\n'}ТЦ RedSail</Text>
            <Text style={[styles.locationTimeText, {textAlign: 'right'}]}>Время:{'\n'}Счастливое{'\n'}детство</Text>
          </View>
        </View>
      </View>
      
      {/* Нижний декоративный край */}
      <BottomEdge />
    </View>
  )
}

// Стили компонента
const styles = StyleSheet.create({
  // Стили основного контента
  mainContent: {
    gap: normalize(24),
    backgroundColor: Colors.white,
    paddingTop: normalize(36),
  },
  contentDescription: {
    marginHorizontal: normalize(16),
  },

  // Стили типографики
  sectionTitle: {
    ...TextStyles.h2,
    alignSelf: 'center',
    marginBottom: normalize(8),
  },
  descriptionText: {
    ...TextStyles.textDescription,
    textAlign: 'center',
    marginBottom: normalize(4),
    color: Colors.grayText,
  },

  // Стили карточек с ценами
  priceSection: {
    gap: normalize(4)
  },
  priceCard: {
    marginHorizontal: normalize(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.purpleLight,
    padding: normalize(16),
    borderRadius: normalize(16)
  },
  priceCardColumn: {
    alignItems: 'flex-end',
    gap: normalize(4)
  },  
  ageCardColumn: {
    alignItems: 'flex-start',
    gap: normalize(4)
  },

  // Стили заголовков секций
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionHeaderDecorLeft: {
    backgroundColor: Colors.purple,
    borderTopRightRadius: normalize(16),
    borderBottomRightRadius: normalize(16),
    width: normalize(16),
    height: normalize(24),
    top: -4
  },
  sectionHeaderDecorRight: {
    backgroundColor: Colors.purple,
    borderTopLeftRadius: normalize(16),
    borderBottomLeftRadius: normalize(16),
    width: normalize(16),
    height: normalize(24),
    top: -4
  },
  sectionHeaderTitle: {
    ...TextStyles.h2,
    alignSelf: 'center'
  },

  // Стили разделителя
  divider: {
    height: 0.5,
    opacity: 0.2,
    backgroundColor: Colors.purple,
    width: '60%',
    alignSelf: 'center',
    marginTop: normalize(16)
  },

  // Стили SVG-контейнеров
  svgContainer: {
    width: '100%',
    height: 40,
    position: 'relative',
    top: -2
  },
  topSvgContainer: {
    width: '100%',
    height: 24,
    position: 'relative',
    top: 2
  },

  // Стили контейнера с информацией о месте и времени
  locationTimeContainer: {
    gap: normalize(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(16),
    marginBottom: normalize(24),
    marginHorizontal: normalize(24)
  },
  locationTimeText: {
    ...TextStyles.textDescription,
    color: Colors.grayText
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
  },
  loadingText: {
    ...TextStyles.text,
    color: Colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
  },
  errorText: {
    ...TextStyles.text,
    color: Colors.red,
  },
}); 