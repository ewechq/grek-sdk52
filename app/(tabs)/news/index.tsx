import { View, Text, Image, FlatList, Dimensions, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { TextStyles, Colors } from '@/theme';
import NewsCard from '@/components/cards/NewsCard';


const { width } = Dimensions.get('window');

const slides = [
  require('../../../assets/images/child-photo-1.png'),
  require('../../../assets/images/child-photo-2.png'),
  require('../../../assets/images/child-photo-1.png'),
  require('../../../assets/images/child-photo-2.png'),
  // добавьте больше изображений по необходимости
];

const AUTOPLAY_INTERVAL = 3000; // интервал в миллисекундах

interface Article {
  id: number;
  title: string;
  introtext: string;
  content: string;
  cover: string;
  category: string;
  available: number;
  site_cover: string;
  site_title_color: string;
  site_button_color: string;
  site_button_text: string;
  site_button_link: string;
  created_at: string;
  updated_at: string;
}

const NewsScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [news, setNews] = useState<Article[]>([]);
  const [blog, setBlog] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const onScroll = (event: any) => {
    // Получаем текущий индекс слайда
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    setActiveIndex(index);
  };

  // Функция для автоматического скролла
  const scrollToNextSlide = () => {
    if (flatListRef.current) {
      const nextIndex = (activeIndex + 1) % slides.length;
      flatListRef.current.scrollToIndex({
        index: nextIndex,
        animated: true
      });
      setActiveIndex(nextIndex);
    }
  };

  // Настройка автоматического воспроизведения
  useEffect(() => {
    const interval = setInterval(scrollToNextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [activeIndex]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://api.grekland.ru/api/articles');
        const data = await response.json();
        
        setNews(data.filter((article: Article) => article.category === 'news'));
        setBlog(data.filter((article: Article) => article.category === 'blog'));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.purple} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sliderContainer}>
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image source={item} style={styles.image} />
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
          getItemLayout={(_, index) => ({
            length: width - 32,
            offset: (width - 32) * index,
            index,
          })}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true
              });
            });
          }}
        />
        
        {/* Индикатор прогресса */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationLine,
                { backgroundColor: index === activeIndex ? Colors.purple : Colors.grayElements }
              ]}
            />
          ))}
        </View>
      </View>

      {/*Блок с новостями*/}
      <View style={styles.newsContainer}>
        <Text style={styles.newsTitle}>Новости</Text>
        <View style={styles.cardsGrid}>
          {news.map(article => (
            <View key={article.id} style={styles.cardWrapper}>
              <NewsCard
                id={article.id}
                title={article.title}
                introtext={article.introtext}
                site_cover={article.site_cover}
              />
            </View>
          ))}
        </View>
      </View>

      {/*Блок с блогом*/}
      <View style={styles.blogContainer}>
        <Text style={styles.newsTitle}>Блог</Text>
        <View style={styles.cardsGrid}>
          {blog.map(article => (
            <View key={article.id} style={styles.cardWrapper}>
              <NewsCard
                id={article.id}
                title={article.title}
                introtext={article.introtext}
                site_cover={article.site_cover}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default NewsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  sliderContainer: {
    margin: 16,
    borderRadius: 25,
    backgroundColor: Colors.grayBg,
    overflow: 'hidden',
  },
  slide: {
    width: width - 32, 
    height: 400,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    gap: 8,
  },
  paginationLine: {
    width: 32,
    height: 4,
    borderRadius: 10,
  },
  newsTitle: {
    ...TextStyles.h2,
    color: Colors.black,
    marginBottom: 24,
  },
  newsContainer:{
    marginTop:16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 32,
    flex: 1,  
  },
  blogContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 32,
    flex: 1,  
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
})