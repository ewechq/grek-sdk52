// Определение известных схем банковских приложений
export interface BankScheme {
  scheme: string;
  package: string;
  action: string;
}

export interface BankSchemes {
  [key: string]: BankScheme;
}

export const BANK_SCHEMES: BankSchemes = {
  sberbank: {
    scheme: 'bank100000000008',
    package: 'ru.sberbankmobile',
    action: 'ru.sberbankmobile.android.action.VIEW'
  },
  vtb: {
    scheme: 'bank100000000004',
    package: 'ru.vtb24.mobilebanking.android',
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
  psb: {
    scheme: 'bank100000000007',
    package: 'ru.psbank.mobile',
    action: 'android.intent.action.VIEW'
  },
  tinkoff: {
    scheme: 'bank100000000001',
    package: 'com.tinkoff.mobile',
    action: 'android.intent.action.VIEW'
  },
  otkritie: {
    scheme: 'bank100000000005',
    package: 'ru.open.mobile.android',
    action: 'android.intent.action.VIEW'
  },
  alfabank: {
    scheme: 'alfabank',
    package: 'ru.alfabank.mobile.android',
    action: 'android.intent.action.VIEW'
  }
}; 