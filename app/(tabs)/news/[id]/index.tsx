import React, { useEffect, useState } from "react";
import {
StyleSheet,
Text,
View,
ActivityIndicator,
ScrollView,
TouchableOpacity,
useWindowDimensions
} from "react-native";
import RenderHTML from 'react-native-render-html';
import { useRouter, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import Header from "@/components/Header";
import { Colors, TextStyles } from "@/theme";

interface NewsItem {
id: number;
title: string;
site_cover: string;
content: string;
//introtext: string;
created_at: string;
}

const NewsDetail = () => {
const { width } = useWindowDimensions();
const router = useRouter();
const { id } = useLocalSearchParams();
const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [imageLoading, setImageLoading] = useState(true);

useEffect(() => {
    const fetchNewsDetail = async () => {
     try {
        const response = await fetch("http://api.grekland.ru/api/articles");
        const data: NewsItem[] = await response.json();
        const item = data.find((item: NewsItem) => item.id === Number(id));
        console.log(response)
        setNewsItem(item || null);
        setIsLoading(false);
     } catch (error) {
        console.error("Error fetching news detail:", error);
     }
    };

    if (id) {
     fetchNewsDetail();
    }
}, [id]);

if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
}

if (!newsItem) {
    return <Text>Новость не найдена</Text>;
}

const formattedDate = format(
    new Date(newsItem.created_at),
    "dd MMM yyyy",
    { locale: ru }
);

return (
    <ScrollView style={styles.scrollView}>
     <Header title='Подробнее' marginTop={32}/>

     <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.purple} />
          </View>
        )}
        {newsItem.site_cover && (
          <Image
            source={{ uri: newsItem.site_cover }}
            style={styles.image}
            contentFit='cover'
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={(error) => {
              console.error('Ошибка загрузки изображения:', error);
              setImageLoading(false);
            }}
          />
        )}
     </View>

     <View style={[styles.contentContainer, !newsItem.site_cover && styles.contentContainerNoCover]}>
        
        <Text style={styles.title}>{newsItem.title}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        {/*<Text style={styles.description}>{newsItem.introtext}</Text>*/}
        <RenderHTML  
        contentWidth={width}
        source={{html:newsItem.content}}
        tagsStyles={{
            
            p:{...TextStyles.text, margin:0},
        }}
         />
        
     </View>
    </ScrollView>
);
};

const styles = StyleSheet.create({
scrollView: {
    height: "100%",
    backgroundColor: "white",
    paddingBottom: 200,
},
backButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 50,
    position: 'absolute',
    top: 20,
    left: 20,
},
imageContainer: {
    width: "90%",
    height: 300,
    backgroundColor: Colors.grayBg,
    borderRadius: 40,
    alignSelf: 'center',
    marginVertical: 16,
    overflow: 'hidden',
},
loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grayBg,
},
image: {
    width: "100%",
    height: "100%",
},
contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
},
contentContainerNoCover: {
    marginTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
},
title: {
    ...TextStyles.h2,
    marginBottom: 10,
    textAlign:'center',

},
description: {
    ...TextStyles.textDescription,
    paddingBottom:140,
},
date: {
    ...TextStyles.textDescription,
    color:Colors.grayText,
    marginBottom: 20,
    textAlign:'center',
},
});

export default NewsDetail;