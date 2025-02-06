import { StyleSheet, Text, View, ImageBackground } from 'react-native'
import React from 'react'
import { TextStyles, Colors } from "@/theme";

interface ChildCardProps {
  name: string;
  birthDate: string;
  photo: any;
  isVerified: boolean;
}

const ChildCard = ({ name, birthDate, photo, isVerified }: ChildCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <ImageBackground 
          source={photo} 
          style={styles.childPhoto}
          imageStyle={styles.childPhotoImage}
        >
          {!isVerified && (
            <View style={styles.overlay}>
              <View style={styles.warningBadge}>
                <Text style={styles.warningText}>Не подтверждено</Text>
              </View>
            </View>
          )}
        </ImageBackground>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.date}>{birthDate}</Text>
    </View>
  )
}

export default ChildCard

const styles = StyleSheet.create({
  card: {
    width: '48%',
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  childPhoto: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  childPhotoImage: {
    borderRadius: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningBadge: {
    backgroundColor: Colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 40,
    zIndex: 2,
    height: 40,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    ...TextStyles.text,
    fontSize: 12,
    color: Colors.black,
    textAlign: 'center',
  },
  name: {
    ...TextStyles.text,
    marginTop: 8,
    color: Colors.black,
  },
  date: {
    ...TextStyles.text,
    color: Colors.grayText,
    fontSize: 12,
    marginTop: 4,
  }
}) 