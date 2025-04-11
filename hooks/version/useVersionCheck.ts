import { useState, useEffect } from 'react';
import { Platform, Linking, Alert, AppState, AppStateStatus } from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

interface UseVersionCheckResult {
  version: string;
  serverVersion: string;
  showUpdateModal: boolean;
  hasUpdate: boolean;
  setShowUpdateModal: (show: boolean) => void;
  handleUpdate: () => void;
  forceUpdate: boolean;
}

export const useVersionCheck = (): UseVersionCheckResult => {
  const [version] = useState(Constants.expoConfig?.version || '0.1.0');
  const [serverVersion, setServerVersion] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  // Проверка версии
  const checkVersion = async () => {
    try {
      const response = await fetch('https://api.grekland.ru/api/version');
      const data = await response.json();
      
      const serverVer = data.Version || data.version || '';
      
      setServerVersion(serverVer);
      
      // Если версии не совпадают, показываем модальное окно
      if (serverVer !== version) {
        setHasUpdate(true);
        setShowUpdateModal(true);
        setForceUpdate(true); // Устанавливаем флаг принудительного обновления
      } else {
        setHasUpdate(false);
        setShowUpdateModal(false);
        setForceUpdate(false);
      }
    } catch (error) {
      console.error('Ошибка проверки версии:', error);
      setHasUpdate(false);
      setShowUpdateModal(false);
      setForceUpdate(false);
    }
  };

  // Обработка обновления
  const handleUpdate = () => {
    const storeUrl = Platform.select({
      android: 'market://details?id=com.grekland.app',
      ios: 'itms-apps://itunes.apple.com/app/id123456789'
    });
    
    if (storeUrl) {
      Linking.openURL(storeUrl).catch(() => {
        const webUrl = Platform.select({
          android: 'https://play.google.com/store/apps/details?id=com.grekland.app',
          ios: 'https://apps.apple.com/app/id123456789'
        });
        if (webUrl) {
          Linking.openURL(webUrl).catch(error => {
            console.error('Ошибка открытия магазина:', error);
            Alert.alert(
              'Ошибка',
              'Не удалось открыть магазин приложений. Пожалуйста, обновите приложение вручную.'
            );
          });
        }
      });
    }
  };

  // Проверяем версию при монтировании и при возврате в приложение
  useEffect(() => {
    // Первая проверка при монтировании
    checkVersion();

    // Слушатель состояния приложения
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkVersion();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    version,
    serverVersion,
    showUpdateModal,
    hasUpdate,
    setShowUpdateModal,
    handleUpdate,
    forceUpdate
  };
}; 