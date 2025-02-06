import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TextStyles, Colors } from "@/theme";

export interface ImagePickerProps {
  maxImages?: number; // Максимальное количество изображений
  placeholder?: string; // Добавляем новый проп для плейсхолдера
}

const ImagePickerComponent: React.FC<ImagePickerProps> = ({ 
  maxImages = 5,
  placeholder = "Добавить изображение" // Дефолтное значение
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Для просмотра изображения

  const pickImageAsync = async () => {
    if (images.length >= maxImages) {
      alert(`Максимум ${maxImages} изображений`);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    } else {
      alert("Изображение не выбрано");
    }
  };

  const deleteImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImageAsync} style={styles.input}>
        <Text style={styles.placeholder}>{placeholder}</Text>
        <AntDesign name="paperclip" size={16} color={Colors.grayText} />
      </TouchableOpacity>

      {images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageList}>
          {images.map((imageUri, index) => (
            <View key={index} style={styles.imageContainer}>
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => deleteImage(index)}
              >
                <AntDesign name="close" size={16} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedImage(imageUri)}>
                <Image source={{ uri: imageUri }} style={styles.image} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Модальное окно для просмотра изображения */}
      <Modal visible={!!selectedImage} transparent>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setSelectedImage(null)}
          >
            <AntDesign name="close" size={16} color={Colors.white} />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default ImagePickerComponent;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: Colors.grayElements,
    paddingRight:16,
    height:50,
    marginBottom: 16,
  },
  placeholder: {
    ...TextStyles.text,
    color:Colors.grayText,
    paddingHorizontal:16,
  },
  imageList: {
    marginTop: 10,
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2,
  },
  modalImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
});
