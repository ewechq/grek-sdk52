import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Accordion } from "@/components/ui/others/Accordion";
import Btn from "@/components/ui/btns/Btn";
import { Colors, Typography } from "@/theme";
import BtnDownlineText from "@/components/ui/btns/BtnDownlineText";

interface HistoryItem {
  date: string;
  name: string;
  value: number;
}

interface TransactionHistoryProps {
  title?: string;
  historyData: HistoryItem[];
  initialLimit?: number;
  loadMoreCount?: number;
  defaultExpanded?: boolean;
  loading?: boolean;
  hasCardData?: boolean;
}

const HistoryItemComponent: React.FC<{ item: HistoryItem }> = ({ item }) => (
  <View style={styles.historyItem}>
    <View style={styles.historyHeader}>
      <Text style={styles.historyName}>{item.name}</Text>
      <Text style={styles.historyValue}>{item.value} ₽</Text>
    </View>
    <Text style={styles.historyDate}>{item.date}</Text>
  </View>
);

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  title = "ИСТОРИЯ ОПЕРАЦИЙ",
  historyData,
  initialLimit = 3,
  loadMoreCount = 10,
  defaultExpanded = false,
  loading = false,
  hasCardData = false,
}) => {
  const [visibleItems, setVisibleItems] = useState(initialLimit);

  const loadMore = () => {
    setVisibleItems(prev => prev + loadMoreCount);
  };

  const displayedHistory = historyData.slice(0, visibleItems);
  const hasMore = visibleItems < historyData.length;

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.purple} />
          <Text style={styles.emptyText}>История грузится, подождите</Text>
        </View>
      );
    }
    
    if (!hasCardData) {
      return (
        <Text style={styles.emptyText}>
          История операций пуста. Для того чтобы узнать историю транзакций, нажмите 
          на кнопку "Найти карту" и укажите номер телефона к которому привязана карта.
        </Text>
      );
    }
    
    if (displayedHistory.length > 0) {
      return (
        <>
          {displayedHistory.map((item, index) => (
            <HistoryItemComponent key={index} item={item} />
          ))}
          {hasMore && (
            <View style={styles.loadMoreContainer}>
              <BtnDownlineText
                title="Загрузить еще"
                onPress={loadMore}
                color={Colors.black}
              />
            </View>
          )}
        </>
      );
    }
    
    return <Text style={styles.emptyText}>История операций пуста</Text>;
  };

  return (
    <Accordion title={title} defaultExpanded={defaultExpanded}>
      <View style={styles.historyContainer}>
        {renderContent()}
      </View>
    </Accordion>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    paddingTop: 8,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayBg,
    paddingVertical: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
    paddingBottom: 8,
  },
  historyName: {
    color: Colors.black,
    ...Typography.caption(),
    width: '85%',
  },
  historyValue: {
    color: Colors.black,
    ...Typography.caption(),
  },
  historyDate: {
    color: Colors.grayText,
    ...Typography.small(),
  },
  loadMoreContainer: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  emptyText: {
    color: Colors.grayText,
    ...Typography.caption(),
    textAlign: 'center',
    paddingVertical: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
}); 