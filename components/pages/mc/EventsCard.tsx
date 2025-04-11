import React, { useState } from "react";
import { StyleSheet, View, Text, ImageSourcePropType, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Colors, TextStyles } from "@/theme";
import { useRouter } from "expo-router";

export interface ChildComponentProps {
  id: number;
  title: string;
  cover: ImageSourcePropType;
  price?: number;
  time?: string;
  ageLimit?: number;
}

const CardComponent: React.FC<ChildComponentProps> = ({
  id,
  title,
  cover,
  price,
  time,
  ageLimit
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const handlePress = () => {
    router.push(`/mc/${id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.mainView}>
        <Image
          style={[styles.imgCard, !isLoaded && styles.imgPlaceholder]}
          source={cover}
          onLoad={() => setIsLoaded(true)}
        />
        {title && (
          <Text 
            style={styles.textHeader}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {String(title)}
          </Text>
        )}
        <View style={styles.infoContainer}>
          {time && (
            <Text style={styles.timeText}>
              {String(time)}
            </Text>
          )}
          {price !== undefined && price !== null && (
            <Text style={styles.priceText}>
              {String(price)} РУБ
            </Text>
          )}
        </View>
        {ageLimit !== undefined && ageLimit !== null && (
          <Text style={styles.ageLimitText}>
            {String(ageLimit)}+
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: "100%",
    height: 240,
    paddingHorizontal: 2,
  },
  imgCard: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 25,
  },
  imgPlaceholder: {
    backgroundColor: Colors.grayBg,
  },
  textHeader: {
    paddingTop: 8,
    paddingBottom: 2,
    ...TextStyles.h3,
    color: Colors.black,
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
    justifyContent: 'space-between',
  },
  timeText: {
    ...TextStyles.h3,
    paddingVertical: 4,
    color: Colors.grayText,
  },
  priceText: {
    ...TextStyles.h3,
    paddingVertical: 4,
    paddingLeft: 16,
    color: Colors.grayText,
  },
  ageLimitText: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    ...TextStyles.h3,
    width: 40,
    height: 40,
    color: Colors.grayText,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 40,
    paddingTop: 0,
  },
});

export default CardComponent;


