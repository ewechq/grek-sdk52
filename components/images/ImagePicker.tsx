import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const PlaceholderImage = require('../../assets/images/addImg.png');
export interface ImagePickerProps {
    widthImg?: number 
    heightImg?: number; 
  }

const ImagePickerComponent: React.FC<ImagePickerProps> = ({ widthImg, heightImg }) => {
  const screenWidth = Dimensions.get('window').width;
  const imageSize = screenWidth - 32; // учитываем padding по 16px с каждой стороны

const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
     allowsEditing: true,
     quality: 1,
    });

    if (!result.canceled) {
     setSelectedImage(result.assets[0].uri);
    } else {
     alert('Изображение не выбрано');
    }
};

const imageSource = selectedImage ? { uri: selectedImage } : PlaceholderImage;

return (
    <View style={styles.wrapper}>
     <TouchableOpacity onPress={pickImageAsync} style={[styles.container, { width: imageSize, height: imageSize }]}>
        <Image 
          source={imageSource} 
          style={[styles.image]} 
        />
     </TouchableOpacity>
    </View>
);
}
export default ImagePickerComponent;
const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  container: {
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});