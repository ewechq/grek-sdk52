import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React, { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'expo-router'
import Btn from '@/components/btns/Btn'
import { Colors, TextStyles } from '@/theme/index'
import Svg, { Path } from 'react-native-svg'
import DiscountsModal from '@/components/modals/DiscountsModal'
import { normalize } from '@/utils/responsive'

interface PriceCardProps {
  age: string;
  price: string;
}

// Создаем переиспользуемые компоненты для карточек с ценами
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

interface SectionHeaderProps {
  title: string;
}

// Создаем компонент для заголовка секции
const SectionHeader = ({ title }: SectionHeaderProps) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionHeaderDecorLeft} />
    <Text style={styles.sectionHeaderTitle}>{title}</Text>
    <View style={styles.sectionHeaderDecorRight} />
  </View>
);

// Выносим компоненты за пределы основного компонента
const DottedLine = React.memo(() => (
  <View style={styles.dottedLineContainer}>
    {Array(20).fill(null).map((_, index) => (
      <View key={index} style={styles.dottedLineSegment} />
    ))}
  </View>
));

const Divider = React.memo(() => (
  <View style={styles.divider} />
));

export default function MainScreen() {
  const [isDiscountsModalVisible, setIsDiscountsModalVisible] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const router = useRouter();

  // Мемоизируем функции-обработчики
  const handleLogoError = useCallback(() => {
    setLogoError(true);
    console.warn('Failed to load logo image');
  }, []);

  const handleBuyTicket = useCallback(() => {
    try {
      router.push('/(buyticket)');
    } catch (error) {
      router.push('/');
    }
  }, [router]);

  const handleDiscountsPress = useCallback(() => {
    setIsDiscountsModalVisible(true);
  }, []);

  // Мемоизируем компоненты PriceCard
  const weekdayPriceCards = useMemo(() => (
    <>
      <PriceCard age="1 - 4 года" price="1 390 РУБ" />
      <PriceCard age="5 - 16 лет" price="1 690 РУБ" />
    </>
  ), []);

  const weekendPriceCard = useMemo(() => (
    <PriceCard age="1 - 16 лет" price="2 290 РУБ" />
  ), []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/pattern.png')} 
        style={styles.backgroundPattern}
      />
      <ScrollView>
        {!logoError ? (
          <Image 
            source={require('@/assets/images/logo-white.png')} 
            style={styles.logoImage}
            onError={handleLogoError}
          />
        ) : (
          <View style={styles.logoFallback}>
            <Text style={styles.logoFallbackText}>GREK LAND</Text>
          </View>
        )}
        <View style={styles.mainContent}>
          <View style={styles.contentDescription}>
            <Text style={styles.sectionTitle}>Билет на весь день</Text>
            <Text style={styles.descriptionText}>
              Один соповождающий взрослый - бесплатно, каждый последующий - 250₽. Дети до 1 года - бесплатно.
            </Text>
            <Divider />
          </View>

          <View style={styles.priceSection}>
            <SectionHeader title="Понедельник-пятница" />
            {weekdayPriceCards}
          </View>

          <View style={styles.priceSection}>
            <SectionHeader title="Выходные и праздники" />
            {weekendPriceCard}
          </View>

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
        <View style={styles.bottomSection}>
          <View style={styles.bottomButtons}>
            <Btn 
              title="Купить билет" 
              onPress={handleBuyTicket}
              bgColor={Colors.purple} 
              width='full'
            />
            <Btn 
              title="Скидки" 
              onPress={handleDiscountsPress}
              bgColor={Colors.purpleLight} 
              textColor={Colors.purple} 
              width='full'
            />
          </View>
          <View style={styles.svgContainer}>
            <Svg width="640" height="20" viewBox="0 0 340 16" fill="none">
              <Path d="M17 9.5L13.6206 13.0671C10.5668 16.2906 5.43321 16.2906 2.3794 13.0671C-2.2954 8.13263 1.2027 0 8 0H332C338.797 0 342.295 8.13263 337.621 13.0671C334.567 16.2906 329.433 16.2906 326.379 13.0671L323 9.5C318.11 4.33842 309.89 4.33842 305 9.5C300.11 14.6616 291.89 14.6616 287 9.5C282.11 4.33842 273.89 4.33842 269 9.5C264.11 14.6616 255.89 14.6616 251 9.5C246.11 4.33842 237.89 4.33842 233 9.5C228.11 14.6616 219.89 14.6616 215 9.5C210.11 4.33842 201.89 4.33842 197 9.5C192.11 14.6616 183.89 14.6616 179 9.5C174.11 4.33842 165.89 4.33842 161 9.5C156.11 14.6616 147.89 14.6616 143 9.5C138.11 4.33842 129.89 4.33842 125 9.5C120.11 14.6616 111.89 14.6616 107 9.5C102.11 4.33842 93.8899 4.33842 89 9.5C84.1101 14.6616 75.8899 14.6616 71 9.5C66.1101 4.33842 57.8899 4.33842 53 9.5C48.1101 14.6616 39.8899 14.6616 35 9.5C30.1101 4.33842 21.8899 4.33842 17 9.5Z" fill="white"/>
            </Svg>
          </View>
        </View>
      </ScrollView>

      <DiscountsModal 
        isVisible={isDiscountsModalVisible}
        onClose={() => setIsDiscountsModalVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: Colors.purple,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '110%',
    height: '110%',
    opacity: 0.3
  },

  // Logo styles
  logoImage: {
    width: '50%',
    height: 80,
    alignSelf: 'center',
    marginVertical: normalize(16),
  },

  // Content section styles
  mainContent: {
    gap: normalize(28),
    backgroundColor: Colors.white,
    paddingTop: normalize(36),
    marginBottom: 0,
    marginHorizontal: normalize(28),
    borderRadius: normalize(32),
  },
  contentDescription: {
    marginHorizontal: normalize(16),
  },

  // Typography styles
  sectionTitle: {
    ...TextStyles.h2,
    alignSelf: 'center',
    marginBottom: normalize(8),
  },
  descriptionText: {
    ...TextStyles.text,
    textAlign: 'center',
    marginBottom: normalize(4),
    color: Colors.black,
  },

  // Price card styles
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


  // Section header styles
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
    height: normalize(28),
    top: -4
  },
  sectionHeaderDecorRight: {
    backgroundColor: Colors.purple,
    borderTopLeftRadius: normalize(16),
    borderBottomLeftRadius: normalize(16),
    width: normalize(16),
    height: normalize(28),
    top: -4
  },
  sectionHeaderTitle: {
    ...TextStyles.h2,
    alignSelf: 'center'
  },

  // Divider styles
  divider: {
    height: 0.5,
    opacity: 0.2,
    backgroundColor: Colors.purple,
    width: '60%',
    alignSelf: 'center',
    marginTop: normalize(16)
  },
  dottedLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 1,
    width: '100%'
  },
  dottedLineSegment: {
    width: normalize(8),
    height: normalize(3),
    backgroundColor: Colors.purple,
    marginRight: normalize(8)
  },

  // Bottom section styles
  bottomSection: {
    margin: normalize(32),
    marginBottom: normalize(100),
    marginTop: 0,
    overflow: 'hidden'
  },
  bottomButtons: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: normalize(32),
    borderTopRightRadius: normalize(32),
    gap: normalize(8),
    padding: normalize(24),
    paddingVertical: normalize(32)
  },
  locationTimeContainer: {
    gap: normalize(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(16),
    marginBottom: normalize(24),
    marginHorizontal: normalize(24)
  },
  locationTimeText: {
    ...TextStyles.text,
    color: Colors.black
  },

  // Fallback styles
  logoFallback: {
    width: '50%',
    height: 80,
    alignSelf: 'center',
    marginVertical: normalize(16),
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoFallbackText: {
    ...TextStyles.h1,
    color: Colors.white
  },

  svgContainer: {
    alignSelf: 'center',
    top: -2
  }
});