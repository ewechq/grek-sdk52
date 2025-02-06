import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import SecondSlide from '@/components/slides/SecondSlide'
import FirstSlide from '@/components/slides/FirstSlide'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { Colors } from '@/theme'

const { width } = Dimensions.get('window')
const SLIDE_WIDTH = width-32
const SLIDE_GAP = 4
const ITEM_WIDTH = SLIDE_WIDTH + SLIDE_GAP

// Данные для слайдов
const slidesData = [
  {
    id: '1',
    type: 'first',
    data: {
      subtitle: 'Билет на весь день',
      description: 'Один сопровождающий взрослый - бесплатно, каждый последующий - 250₽ дети до 1 года - бесплатно.',
      button: 'Купить билет',
      tags: [],
    },
  },
  {
    id: '2',
    type: 'second',
    data: {
      subtitle: 'Банкетные комнаты',
      description: 'Какой-нибудь тут может быть текст продумать было бы неплохо но можно и без него.',
      places: [
        {
          id: 1,
          title: 'Грэк холл',
          description: 'Какой-то текст может быть больше может нет может маленький',
          image: require('@/assets/images/hall1.png'),
        },
        {
          id: 2,
          title: 'БК Супергерои',
          description: 'Какой-то текст может быть больше может нет может маленький',
          image: require('@/assets/images/hall2.png'),
        },
        {
          id: 3,
          title: 'Грэк холл',
          description: 'Какой-то текст может быть больше может нет может маленький',
          image: require('@/assets/images/hall3.png'),
        },
      ],
    },
  },

]

// Добавляем дубликаты для плавного зацикливания
const extendedSlides = [
  slidesData[slidesData.length - 1],
  ...slidesData,
  slidesData[0]
]

const Carousel = () => {
  const scrollViewRef = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(1)

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: ITEM_WIDTH, animated: false })
    }, 0)
  }, [])

  const handleScroll = (event: any) => {
    let newIndex = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH)
    setCurrentIndex(newIndex)
  }

  useEffect(() => {
    if (!scrollViewRef.current) return

    if (currentIndex === 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: (slidesData.length) * ITEM_WIDTH, animated: false })
        setCurrentIndex(slidesData.length)
      }, 300)
    } else if (currentIndex === slidesData.length + 1) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: ITEM_WIDTH, animated: false })
        setCurrentIndex(1)
      }, 300)
    }
  }, [currentIndex])

  const handlePrevSlide = () => {
    if (currentIndex > 0) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex - 1) * ITEM_WIDTH,
        animated: true,
      })
    }
  }

  const handleNextSlide = () => {
    if (currentIndex < slidesData.length + 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * ITEM_WIDTH,
        animated: true,
      })
    }
  }

  const renderSlide = (slide: typeof slidesData[0], index: number) => {
    const SlideContent = () => {
      switch (slide.type) {
        case 'first':
          return <FirstSlide data={slide.data} />
        case 'second':
          return <SecondSlide data={slide.data} />
        default:
          return null
      }
    }

    return (
      <View 
        key={index}
        style={[
          styles.roomCard,
          
        ]}
      >
        <View style={styles.canvasWhite}>
          <SlideContent />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.mainContainer}>
    <View style={styles.container}>
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          onPress={handlePrevSlide}
          style={styles.navButton}
        >
          <Entypo 
            name="chevron-thin-left" 
            size={12} 
            color={Colors.grayText} 
            style={styles.arrowIcon} 
          />  
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleNextSlide}
          style={styles.navButton}
        >
          <Entypo 
            name="chevron-thin-right" 
            size={12} 
            color={Colors.grayText} 
            style={styles.arrowIcon} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        pagingEnabled
      >
        {extendedSlides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
    backgroundColor: Colors.yellow,
    justifyContent:'flex-end',
  },
  container: {
    paddingVertical: 20,
  },
  scrollViewContent: {
    height:460,
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
    marginBottom: 70,
  },
  roomCard: {
    width: SLIDE_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 10,
    marginHorizontal: SLIDE_GAP / 2,
    alignItems: 'center',
  },
  canvasWhite: {
    width: '100%',
    height: 450,
    borderRadius: 12,
    backgroundColor: Colors.white,
    padding: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 4,
    marginBottom: 4,
    justifyContent:'flex-end',
  },
  navButton: {
    width: 80,
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',

  },
  arrowIcon:{
    alignSelf:'center'
  }
})

export default Carousel
