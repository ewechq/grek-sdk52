import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import Btn from '@/components/btns/Btn';
import { useRouter } from 'expo-router';

interface FirstSlideProps {
  data: {
    subtitle: string;
    description: string;
    button: string;
    tags: string[];
  };
}

const FirstSlide: React.FC<FirstSlideProps> = ({ data }) => {
  const router = useRouter();
  const renderPriceBlock = () => {
    return (
      <View>
        <Text style={styles.priceTitle}>Понедельник-Пятница</Text>
        <View style={styles.pricesContainer}>
          <View style={styles.priceBlock}>
            <View style={styles.verticalLine} />
            <View style={styles.priceContent}>
              <Text style={styles.priceAge}>от 1 до 4 лет</Text>
              <Text style={styles.priceValue}>1 390₽</Text>
            </View>
          </View>
          <View style={styles.priceBlock}>
            <View style={styles.verticalLine} />
            <View style={styles.priceContent}>
              <Text style={styles.priceAge}>от 5 до 16 лет</Text>
              <Text style={styles.priceValue}>1 690₽</Text>
            </View>
          </View>
        </View>

        <Text style={styles.priceTitle}>Выходные и праздники</Text>
        <View style={styles.priceBlock}>
          <View style={styles.verticalLine} />
          <View style={styles.priceContent}>
            <Text style={styles.priceAge}>от 1 до 16 лет</Text>
            <Text style={styles.priceValue}>2 290₽</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>{data.subtitle}</Text>
        <Text style={styles.description}>{data.description}</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.priceLink}>Подробнее о ценах и скидках</Text>
        </TouchableOpacity>
        {renderPriceBlock()}
      </View>
      
      <View style={styles.buttonContainer}>
        <Btn
          title="Купить билет"
          onPress={() => router.push('/(buyticket)')}
          bgColor={Colors.green}
          textColor={Colors.black}
          width="full"
        />
      </View>
    </View>
  );
};

export default FirstSlide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 0,
  },
  buttonContainer: {
    paddingVertical: 16,
    marginTop: 'auto',
  },
  subtitle: {
    ...TextStyles.h2,
    marginBottom: 4,
    marginTop: 16
  },
  description: {
    ...TextStyles.text,
    marginBottom: 8,
  },
  priceLink: {
    ...TextStyles.text,
    textDecorationLine: 'underline',
    marginBottom: 24,
  },
  priceTitle: {
    ...TextStyles.h3,
    marginBottom: 16,
  },
  pricesContainer: {
    gap: 16,
    marginBottom: 24,
    flexDirection: 'row',
  },
  priceBlock: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  verticalLine: {
    width: 2,
    height: '100%',
    backgroundColor: Colors.green,
    borderRadius: 1,
  },
  priceContent: {
    flexDirection: 'column',
    gap: 4,
  },
  priceAge: {
    ...TextStyles.text,
  },
  priceValue: {
    ...TextStyles.h3Number,
  },
}); 