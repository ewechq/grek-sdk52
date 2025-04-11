/**
 * Утилиты для обработки платежей
 * Общие функции и константы для Android и iOS процессоров
 */

/**
 * Конфигурация банковских приложений
 * Содержит схемы, пакеты и действия для каждого банка
 */
export const BANK_SCHEMES = {
  tinkoff: {
    scheme: 'bank100000000001',
    package: 'com.tinkoff.mobile',
    action: 'android.intent.action.VIEW'
  },
  alfabank: {
    scheme: 'bank100000000004',
    package: 'ru.alfabank.mobile.android',
    action: 'android.intent.action.VIEW'
  },
  sberbank: {
    scheme: 'bank100000000008',
    package: 'ru.sberbankmobile',
    action: 'ru.sberbankmobile.android.action.VIEW'
  },
  otkritie: {
    scheme: 'bank100000000005',
    package: 'ru.open.mobile.android',
    action: 'android.intent.action.VIEW'
  },
  raiffeisen: {
    scheme: 'bank100000000111',
    package: 'ru.raiffeisen.android',
    action: 'android.intent.action.VIEW'
  },
  gazprombank: {
    scheme: 'bank100000000015',
    package: 'ru.gazprombank.android',
    action: 'android.intent.action.VIEW'
  },
  vtb: {
    scheme: 'bank100000000007',
    package: 'ru.vtb24.mobilebanking.android',
    action: 'android.intent.action.VIEW'
  }
};

/**
 * Извлекает ID платежа из URL
 * 
 * @param url - URL платежа
 * @returns ID платежа или пустую строку
 */
export const extractPaymentId = (url: string): string => {
  const match = url.match(/transaction_id[=\/](\d+)/);
  return match ? match[1] : '';
};

/**
 * Получает имя банка по схеме
 * 
 * @param scheme - Схема банка
 * @returns Имя банка с большой буквы или "банка" по умолчанию
 */
export const getBankNameByScheme = (scheme: string): string => {
  const bank = Object.entries(BANK_SCHEMES).find(([_, value]) => value.scheme === scheme);
  return bank ? bank[0].charAt(0).toUpperCase() + bank[0].slice(1) : 'банка';
};

/**
 * Проверяет, является ли URL банковской ссылкой
 * 
 * @param url - URL для проверки
 * @returns true, если URL является банковской ссылкой
 */
export const isBankAppUrl = (url: string): boolean => {
  return (
    url.startsWith('bank') ||
    url.startsWith('sbp://') ||
    url.includes('qr.nspk.ru') ||
    Object.values(BANK_SCHEMES).some(bank => url.startsWith(`${bank.scheme}://`))
  );
};

/**
 * Проверяет, является ли URL ссылкой на успешный платеж
 * 
 * @param url - URL для проверки
 * @returns true, если URL указывает на успешный платеж
 */
export const isSuccessUrl = (url: string): boolean => {
  return url.includes('success') || url.includes('payment_success');
};

/**
 * Проверяет, является ли URL ссылкой на неудачный платеж
 * 
 * @param url - URL для проверки
 * @returns true, если URL указывает на неудачный платеж
 */
export const isFailureUrl = (url: string): boolean => {
  return url.includes('fail') || url.includes('payment_fail');
}; 