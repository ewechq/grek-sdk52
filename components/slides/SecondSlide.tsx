import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Animated, ScrollView, Modal } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef, useState } from 'react';

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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const imageWidth = screenWidth * 0.5 - 32;
const CARD_HEIGHT = screenHeight * 0.8; // 80% от высоты экрана

const SecondSlide: React.FC<SecondSlideProps> = ({ data }) => {
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const arrowAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(arrowAnimation, {
          toValue: 10,
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

  const renderModal = () => {
    const place = data.places.find(p => p.id === selectedPlace);
    
    return (
      <Modal
        visible={selectedPlace !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPlace(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {place && (
              <>
                <Text style={styles.modalTitle}>{place.title}</Text>
                <Text style={styles.modalDescription}>{place.description}</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSelectedPlace(null)}
                >
                  <MaterialIcons name="close" size={24} color={Colors.white} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { height: CARD_HEIGHT }]}>
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <Text style={styles.subtitle}>{data.subtitle}</Text>
        <Text style={styles.description}>{data.description}</Text>
        <View style={styles.placesContainer}>
          {data.places.map((place) => (
            <View key={place.id} style={styles.placeCard}>
              <View style={styles.imageContainer}>
                <Image 
                  source={place.image} 
                  style={styles.placeImage}
                />
                <TouchableOpacity 
                  style={styles.infoButton}
                  onPress={() => setSelectedPlace(place.id)}
                >
                  <MaterialIcons name="arrow-forward" size={16} color={Colors.white} style={{transform: [{rotate: '-45deg'}]}}/>
                </TouchableOpacity>
              </View>
              <View style={styles.placeContent}>
                <Text style={styles.placeTitle}>{place.title}</Text>
                <Text style={styles.placeDescription}>{place.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {renderModal()}
      <Animated.View 
        style={[
          styles.arrowContainer,
          { transform: [{ translateY: arrowAnimation }] }
        ]}
      >
        <TouchableOpacity 
          onPress={() => scrollViewRef.current?.scrollTo({ y: 100, animated: true })}
          style={{backgroundColor: Colors.purple, borderRadius: 40,  height: 40, width: 40, justifyContent: 'center', alignItems: 'center'}}
        >
          <MaterialIcons name="keyboard-double-arrow-down" size={16} color={Colors.white} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    height: CARD_HEIGHT,
  },
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
    backgroundColor: Colors.white, // Добавляем белый фон
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
    right: -8,
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
  imageContainer: {
    position: 'relative',
    backgroundColor: Colors.white, // Добавляем белый фон
  },
  infoButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    ...TextStyles.h2,
    marginBottom: 10,
  },
  modalDescription: {
    ...TextStyles.text,
  },
  closeButton: {
    position: 'absolute',
    top: -40,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SecondSlide; 