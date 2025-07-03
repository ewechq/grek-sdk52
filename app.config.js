export default ({ config }) => {
    return {
      ...config,
      name: "Grek Land",
      slug: "grekApp",
      version: "1.0.1", 
      orientation: "portrait",
      icon: "./assets/images/icon2.png",
      scheme: "grekLand",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      splash: {
        image: "./assets/images/icon2.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.grek.one",
        infoPlist: {
          LSApplicationQueriesSchemes: [
            "bank100000000008",
            "bank100000000004",
            "bank100000000111",
            "bank100000000015",
            "bank100000000007",
            "bank100000000001",
            "bank100000000005"
          ],
          ITSAppUsesNonExemptEncryption: false
        }
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/icon2.png",
          backgroundColor: "#ffffff"
        },
        versionCode: 7, 
        package: "com.grek.one",
        permissions: ["INTERNET"],
        intentFilters: [
          {
            autoVerify: true,
            action: "android.intent.action.VIEW",
            data: [
              {
                scheme: "https"
              }
            ],
            category: ["android.intent.category.BROWSABLE", "android.intent.category.DEFAULT"]
          }
        ],
        queries: [
          {
            package: "com.bank100000000008"
          },
          {
            package: "com.bank100000000004"
          },
          {
            package: "com.bank100000000111"
          },
          {
            package: "com.bank100000000015"
          },
          {
            package: "com.bank100000000007"
          },
          {
            package: "com.bank100000000001"
          },
          {
            package: "com.bank100000000005"
          }
        ],
        edgeToEdgeEnabled: true
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/icon1.webp"
      },
      plugins: [
        "expo-router",
        "expo-font",
        "expo-system-ui"
      ],
      experiments: {
        typedRoutes: true
      },
      extra: {
        router: {
          origin: false
        },
        eas: {
          projectId: "d7664c7e-f5f1-4a46-9c3a-229f59e8039c"
        }
      },
      owner: "ewec"
    };
  };
  