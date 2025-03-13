import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import { normalize } from '@/utils/responsive';
import PhoneInput from '@/components/inputs/InputPhone';
import EmailInput from '@/components/inputs/InputEmail';
import Counter from '@/components/CounterComponent';

interface PersonalDataFormProps {
  formData: {
    name: string;
    phone: string;
    email: string;
  };
  setFormData: (data: any) => void;
  guestCounts: {
    onetofour: number;
    fivetosixteen: number;
  };
  setGuestCounts: (counts: any) => void;
}

export const PersonalDataForm = ({
  formData,
  setFormData,
  guestCounts,
  setGuestCounts
}: PersonalDataFormProps) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, {marginBottom: normalize(8)}]}>
        Ваши данные:
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ваше ФИО"
        placeholderTextColor={Colors.grayText}
        value={formData.name}
        onChangeText={(text) => setFormData({...formData, name: text})}
      />
      
      <PhoneInput
        initialValue={formData.phone}
        onPhoneChange={(text) => setFormData({...formData, phone: text})}
        backgroundColor={Colors.white}
        borderColor={Colors.grayText}
      />
      
      <EmailInput
        value={formData.email}
        onChange={(text) => setFormData({...formData, email: text})}
        backgroundColor={Colors.white}
        borderColor={Colors.grayText}
      />

      <View style={styles.counterSection}>
        <Text style={styles.sectionTitle}>Количество билетов:</Text>           
        <View style={styles.countersContainer}>
          <View style={styles.counterRow}>
            <Counter
              label="От 1 до 4 лет:"
              value={guestCounts.onetofour}
              onIncrease={() => setGuestCounts({...guestCounts, onetofour: guestCounts.onetofour + 1})}
              onDecrease={() => setGuestCounts({...guestCounts, onetofour: Math.max(0, guestCounts.onetofour - 1)})}
            />
          </View>
          <View style={styles.counterRow}>
            <Counter
              label="От 5 до 16 лет:"
              value={guestCounts.fivetosixteen}
              onIncrease={() => setGuestCounts({...guestCounts, fivetosixteen: guestCounts.fivetosixteen + 1})}
              onDecrease={() => setGuestCounts({...guestCounts, fivetosixteen: Math.max(0, guestCounts.fivetosixteen - 1)})}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: normalize(40),
    marginHorizontal: normalize(16)
  },
  sectionTitle: {
    ...TextStyles.h2,
    color: Colors.black,
    marginBottom: normalize(8),
  },
  input: {
    ...TextStyles.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayElements,
    paddingHorizontal: normalize(16),
    marginBottom: normalize(8),
    paddingVertical: normalize(16),
  },
  counterSection: {
    marginTop: normalize(40),
  },
  countersContainer: {
    gap: normalize(4),
  },
  counterRow: {
    width: '100%',
    paddingHorizontal: normalize(16)
  }
}); 