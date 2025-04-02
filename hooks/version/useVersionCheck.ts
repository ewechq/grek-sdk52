import { useState, useEffect, useCallback } from 'react';
import * as Updates from 'expo-updates';
import { Platform, BackHandler } from 'react-native';
import Constants from 'expo-constants';
import { Alert, Linking } from 'react-native';

interface UseVersionCheckResult {
  version: string;
  serverVersion: string;
  isUpdated: boolean;
  showUpdateModal: boolean;
  hasUpdate: boolean;
  setShowUpdateModal: (show: boolean) => void;
  handleUpdate: () => void;
  checkForUpdate: () => Promise<void>;
}

export const useVersionCheck = (): UseVersionCheckResult => {
  const [version, setVersion] = useState(Constants.expoConfig?.version || '0.1.0');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [serverVersion, setServerVersion] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);

  // Проверяем обновления через API сервера
  const checkVersionFromApi = useCallback(async () => {
    try {
      const response = await fetch('https://api.grekland.ru/api/version');
      const data = await response.json();
      const serverVer = data.Version || '';
      setServerVersion(serverVer);

      const needsUpdate = serverVer !== version && !isUpdated;
      setHasUpdate(needsUpdate);

      if (needsUpdate) {
        setShowUpdateModal(true);
      }
      
      return !needsUpdate;
    } catch (error) {
      console.error('Ошибка получения версии с сервера:', error);
      return true;
    }
  }, [version, isUpdated]);

  // Проверка и загрузка обновлений через expo-updates
  const checkForUpdate = useCallback(async () => {
    if (!Updates.isEmbeddedLaunch) {
      return; // Мы уже запущены из обновления, не нужно проверять еще раз
    }

    try {
      // Проверка обновлений в Expo Updates
      const update = await Updates.checkForUpdateAsync();
      
      // Если обновление доступно, загружаем его
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        // Перезагрузка приложения для применения обновления
        await Updates.reloadAsync();
      } else {
        // Если нет OTA обновлений, проверяем версию через API
        await checkVersionFromApi();
      }
    } catch (error) {
      console.error('Ошибка при проверке обновлений Expo:', error);
      // Если ошибка с Expo Updates, проверяем через API
      await checkVersionFromApi();
    }
  }, [checkVersionFromApi]);

  // Обработка нажатия кнопки обновления
  const handleUpdate = useCallback(() => {
    // Если обновление доступно через expo-updates и оно уже загружено
    if (Updates.updateId) {
      Updates.reloadAsync().catch(console.error);
      setIsUpdated(true);
      setShowUpdateModal(false);
      return;
    }

    // Не даем закрыть модальное окно - любое обновление обязательное
    Alert.alert(
      'Обновление обязательно',
      'Это обновление необходимо для использования приложения. Пожалуйста, обновите приложение, когда оно станет доступно.',
      [{ text: 'Понятно', style: 'cancel' }]
    );
  }, []);

  // Инициализация
  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  return {
    version,
    serverVersion,
    isUpdated,
    showUpdateModal,
    hasUpdate,
    setShowUpdateModal,
    handleUpdate,
    checkForUpdate
  };
}; 