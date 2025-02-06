import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Animated, ScrollView } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import { Entypo } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';

interface SecondSlideProps {
  data: {
    subtitle: string;
    description: string;
    places: {
      id: number;
      title: string;
      description: string;
      image: any;
    }[];
  };
}

const { width: screenWidth } = Dimensions.get('window');
const imageWidth = screenWidth * 0.5 - 32;

const SecondSlide: React.FC<SecondSlideProps> = ({ data }) => {
  const arrowAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(arrowAnimation, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(arrowAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        })
      ]).start(() => startAnimation());
    };

    startAnimation();
    return () => arrowAnimation.stopAnimation();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <Text style={styles.subtitle}>{data.subtitle}</Text>
        <Text style={styles.description}>{data.description}</Text>
        <View style={styles.placesContainer}>
          {data.places.map((place) => (
            <TouchableOpacity key={place.id} style={styles.placeCard}>
              <View>
                <Image source={place.image} style={styles.placeImage} />
              </View>
              <View style={styles.placeContent}>
                <Text style={styles.placeTitle}>{place.title}</Text>
                <Text style={styles.placeDescription}>{place.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Animated.View 
        style={[
          styles.arrowContainer,
          {
            transform: [{ translateY: arrowAnimation }]
          }
        ]}
      >
        <TouchableOpacity 
          onPress={() => {
            scrollViewRef.current?.scrollTo({ y: 100, animated: true });
          }}
          style={{gap:2}}
        >
          <Entypo 
            name="chevron-thin-down" 
            size={12} 
            color={Colors.purple} 
            style={styles.arrowIcon} 
          />
          <Entypo 
            name="chevron-thin-down" 
            size={12} 
            color={Colors.purple} 
            style={styles.arrowIcon} 
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SecondSlide;

const styles = StyleSheet.create({
  subtitle: {
    ...TextStyles.h2,
    marginBottom: 4,
    marginTop: 16
  },
  description: {
    ...TextStyles.text,
    marginBottom: 32,
  },
  placesContainer: {
    marginBottom: 20,
  },
  placeCard: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    width: '100%',
  },
  placeImage: {
    width: imageWidth,
    height: imageWidth,
    borderRadius: 15,
  },
  placeContent: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 16
  },
  placeTitle: {
    ...TextStyles.h3,
    marginBottom: 5,
  },
  placeDescription: {
    ...TextStyles.textDescription,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    position: 'absolute',
    right: -20,
    bottom: 0,
    borderRadius: 40,
    justifyContent: 'center',
    gap:2,
  },
  arrowIcon: {
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
  },
}); 