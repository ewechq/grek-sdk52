import { Platform, Alert, Linking } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import { BANK_SCHEMES } from './bankSchemes';

// Функция для открытия банковского приложения через Intent на Android
export const openBankAppWithIntent = async (url: string, bankScheme: string): Promise<boolean> => {
  try {
    const bank = Object.values(BANK_SCHEMES).find(b => b.scheme === bankScheme);
    if (!bank) return false;

    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: url,
      flags: 0x10000000, // FLAG_ACTIVITY_NEW_TASK
      // @ts-ignore - игнорируем ошибку типов, так как эти параметры необходимы для работы с банковскими приложениями
      package: bank.package,
      action: bank.action
    });
    return true;
  } catch (error) {
    console.error('Ошибка при открытии через Intent:', error);
    return false;
  }
};

// Функция для получения имени банка по схеме
export const getBankNameByScheme = (scheme: string): string => {
  const bank = Object.entries(BANK_SCHEMES).find(([_, value]) => value.scheme === scheme);
  if (bank) {
    return bank[0].charAt(0).toUpperCase() + bank[0].slice(1);
  }
  return 'банка';
};

// Функция для извлечения paymentId из URL
export const extractPaymentId = (url: string): string => {
  const match = url.match(/transaction_id[=\/](\d+)/);
  return match ? match[1] : '';
};

// Проверяет, является ли URL банковским
export const isBankAppUrl = (url: string): boolean => {
  return (
    url.startsWith('bank') || 
    url.startsWith('sbp://') ||
    Object.values(BANK_SCHEMES).some(bank => url.startsWith(`${bank.scheme}://`))
  );
};

// Проверяет, является ли URL успешного платежа
export const isSuccessPaymentUrl = (url: string): boolean => {
  return url.includes('success') || url.includes('payment_success');
};

// Проверяет, является ли URL неудачного платежа
export const isFailurePaymentUrl = (url: string): boolean => {
  return url.includes('fail') || url.includes('payment_fail');
};

// Проверяет, является ли URL QR-платежом
export const isQRPaymentUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    return (
      url.includes('qr') || 
      url.includes('QR') || 
      url.includes('sbp')
    );
  } catch (error) {
    console.error('Ошибка при проверке URL QR-платежа:', error);
    return false;
  }
}; 