import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, TextStyles } from '@/theme';

interface PriceCalculationProps {
  youngChildrenCount: number;
  olderChildrenCount: number;
  attendantCount: number;
  prices: {
    "1-4": number;
    "5-16": number;
    "attendant": number;
  } | null;
}

export const PriceCalculation: React.FC<PriceCalculationProps> = ({
  youngChildrenCount,
  olderChildrenCount,
  attendantCount,
  prices
}) => {
  const calculations = useMemo(() => {
    if (!prices) return null;

    const totalTickets = youngChildrenCount + olderChildrenCount + attendantCount;
    
    if (totalTickets === 0) {
      return { isEmpty: true };
    }

    const youngChildrenTotal = youngChildrenCount * prices["1-4"];
    const olderChildrenTotal = olderChildrenCount * prices["5-16"];
    const attendantTotal = attendantCount * (prices["attendant"] || 0);
    const total = youngChildrenTotal + olderChildrenTotal + attendantTotal;

    return {
      isEmpty: false,
      youngChildrenTotal,
      olderChildrenTotal,
      attendantTotal,
      total
    };
  }, [youngChildrenCount, olderChildrenCount, attendantCount, prices]);

  if (!prices || !calculations) return null;

  if (calculations.isEmpty) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Вы пока не указали кол-во билетов <Text style={styles.emoji}>👆🏻</Text></Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {youngChildrenCount > 0 && (
        <View style={styles.row}>
          <Text style={styles.text}>
            Дети 1-4 лет ({youngChildrenCount} x {prices["1-4"]}₽)
          </Text>
          <Text style={styles.price}>{calculations.youngChildrenTotal} РУБ.</Text>
        </View>
      )}
      
      {olderChildrenCount > 0 && (
        <View style={styles.row}>
          <Text style={styles.text}>
            Дети 5-16 лет ({olderChildrenCount} x {prices["5-16"]}₽)
          </Text>
          <Text style={styles.price}>{calculations.olderChildrenTotal} РУБ.</Text>
        </View>
      )}

      {attendantCount > 0 && (
        <View style={styles.row}>
          <Text style={styles.text}>
            Взрослые ({attendantCount} x {prices["attendant"] || 0}₽)
          </Text>
          <Text style={styles.price}>{calculations.attendantTotal} РУБ.</Text>
        </View>
      )}

      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalText}>Итого</Text>
        <Text style={styles.totalPrice}>{calculations.total} РУБ.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    ...TextStyles.text,
    color: Colors.black,
  },
  price: {
    ...TextStyles.h2,
    color: Colors.black,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.grayElements,
  },
  totalText: {
    ...TextStyles.h2,
    color: Colors.black,
  },
  totalPrice: {
    ...TextStyles.h2,
    color: Colors.black,
  },
  emptyText: {
    ...TextStyles.text,
    color: Colors.black,
    lineHeight: 18,
  },
  emoji: {
    ...TextStyles.h2,
  }
}); 