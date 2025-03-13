import React from 'react';
import { View, StyleSheet } from 'react-native';
import { normalize } from '@/utils/responsive';
import { CheckboxWithLink } from '@/components/CheckboxWithLink';

interface AgreementsBlockProps {
  agreements: {
    privacy: boolean;
    rules: boolean;
    offer: boolean;
    price: boolean;
  };
  setAgreements: (agreements: any) => void;
}

export const AgreementsBlock = ({
  agreements,
  setAgreements
}: AgreementsBlockProps) => {
  return (
    <View style={styles.container}>
      <CheckboxWithLink
        checked={agreements.privacy}
        onCheck={() => setAgreements({...agreements, privacy: !agreements.privacy})}
        label="Политикой в отношении обработки персональных данных"
        url="https://grekland.ru/privacy.html"
      />
      <CheckboxWithLink
        checked={agreements.rules}
        onCheck={() => setAgreements({...agreements, rules: !agreements.rules})}
        label="Правилами парка"
        url="https://grekland.ru/regulations.html"
      />
      <CheckboxWithLink
        checked={agreements.price}
        onCheck={() => setAgreements({...agreements, price: !agreements.price})}
        label="Прайс листом"
        url="https://grekland.ru/ticket.html"
      />
      <CheckboxWithLink
        checked={agreements.offer}
        onCheck={() => setAgreements({...agreements, offer: !agreements.offer})}
        label="Публичной офертой"
        url="https://grekland.ru/public-offer.html"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: normalize(40),
    marginHorizontal: normalize(16)
  }
}); 