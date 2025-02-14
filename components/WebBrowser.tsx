import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/theme';
import Header from '@/components/Header';
import { useRouter } from 'expo-router';

interface WebBrowserProps {
  url: string;
  title?: string;
}

const WebBrowser: React.FC<WebBrowserProps> = ({ url, title = 'Оплата' }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header 
        title={title}
        marginTop={48}
        onPress={() => router.back()}
      />
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.purple} />
          </View>
        )}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});

export default WebBrowser; 