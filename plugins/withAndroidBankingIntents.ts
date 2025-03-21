import { withAndroidManifest, ConfigPlugin } from 'expo/config-plugins';

const withAndroidBankingIntents: ConfigPlugin = config => {
  return withAndroidManifest(config, config => {
    // Добавляем queries для проверки наличия банковских приложений
    config.modResults.manifest.queries = [
      {
        package: [
          { $: { 'android:name': 'ru.sberbankmobile' } },
          { $: { 'android:name': 'ru.vtb24.mobilebanking.android' } },
          { $: { 'android:name': 'ru.raiffeisen.android' } },
          { $: { 'android:name': 'ru.gazprombank.android' } },
          { $: { 'android:name': 'ru.psbank.mobile' } },
          { $: { 'android:name': 'com.tinkoff.mobile' } },
          { $: { 'android:name': 'ru.open.mobile.android' } },
          { $: { 'android:name': 'ru.alfabank.mobile.android' } }
        ],
        intent: [
          {
            action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
            data: [
              { $: { 'android:scheme': 'bank100000000008' } },
              { $: { 'android:scheme': 'bank100000000004' } },
              { $: { 'android:scheme': 'bank100000000111' } },
              { $: { 'android:scheme': 'bank100000000015' } },
              { $: { 'android:scheme': 'bank100000000007' } },
              { $: { 'android:scheme': 'bank100000000001' } },
              { $: { 'android:scheme': 'bank100000000005' } },
              { $: { 'android:scheme': 'alfabank' } },
              { $: { 'android:scheme': 'bank' } }
            ],
            category: [
              { $: { 'android:name': 'android.intent.category.DEFAULT' } },
              { $: { 'android:name': 'android.intent.category.BROWSABLE' } }
            ]
          }
        ]
      }
    ];

    return config;
  });
};

export default withAndroidBankingIntents; 