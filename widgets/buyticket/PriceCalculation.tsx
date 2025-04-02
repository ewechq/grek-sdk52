/**
 * Виджет расчета стоимости билетов
 * 
 * Функциональность:
 * 1. Расчет общей стоимости билетов по возрастным категориям
 * 2. Отображение детальной разбивки по категориям
 * 3. Показ итоговой суммы
 * 
 * Особенности:
 * - Мемоизация расчетов для оптимизации производительности
 * - Условное отображение категорий (только если есть билеты)
 * - Обработка случая, когда билеты не выбраны
 * - Форматирование цен в рублях
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, TextStyles } from '@/theme';

/* Пропсы для компонента расчета стоимости*/
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
  // Мемоизированный расчет стоимости
  const calculations = useMemo(() => {
    if (!prices) return null;

    const totalTickets = youngChildrenCount + olderChildrenCount + attendantCount;
    
    // Если билеты не выбраны, возвращаем пустое состояние
    if (totalTickets === 0) {
      return { isEmpty: true };
    }

    // Расчет стоимости для каждой категории
    const youngChildrenTotal = youngChildrenCount * prices["1-4"];
    const olderChildrenTotal = olderChildrenCount * prices["5-16"];
    const attendantTotal = attendantCount * prices["attendant"];
    const total = youngChildrenTotal + olderChildrenTotal + attendantTotal;

    return {
      isEmpty: false,
      youngChildrenTotal,
      olderChildrenTotal,
      attendantTotal,
      total
    };
  }, [youngChildrenCount, olderChildrenCount, attendantCount, prices]);

  // Если цены не загружены или расчеты не выполнены, ничего не показываем
  if (!prices || !calculations) return null;

  // Если билеты не выбраны, показываем подсказку
  if (calculations.isEmpty) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          Вы пока не указали кол-во билетов <Text style={styles.emoji}>👆🏻</Text>
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Строка для детей от 1 до 4 лет */}
      {youngChildrenCount > 0 && (
        <View style={styles.row}>
          <Text style={styles.text}>
            Дети 1-4 лет ({youngChildrenCount} x {prices["1-4"]}₽)
          </Text>
          <Text style={styles.price}>{calculations.youngChildrenTotal} РУБ.</Text>
        </View>
      )}
      
      {/* Строка для детей от 5 до 16 лет */}
      {olderChildrenCount > 0 && (
        <View style={styles.row}>
          <Text style={styles.text}>
            Дети 5-16 лет ({olderChildrenCount} x {prices["5-16"]}₽)
          </Text>
          <Text style={styles.price}>{calculations.olderChildrenTotal} РУБ.</Text>
        </View>
      )}

      {/* Строка для взрослых */}
      {attendantCount > 0 && (
        <View style={styles.row}>
          <Text style={styles.text}>
            Взрослые ({attendantCount} x {prices["attendant"]}₽)
          </Text>
          <Text style={styles.price}>{calculations.attendantTotal} РУБ.</Text>
        </View>
      )}

      {/* Итоговая строка */}
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalText}>Итого</Text>
        <Text style={styles.totalPrice}>{calculations.total} РУБ.</Text>
      </View>
    </View>
  );
};

// Стили компонента
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