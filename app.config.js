export default ({ config }) => {
    return {
      ...config,
      name: "Grek Land",
      slug: "grekApp",
      version: "1.0.1", 
      orientation: "portrait",
      icon: "./assets/images/icon2.webp",
      scheme: "grekLand",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      splash: {
        image: "./assets/images/icon2.webp",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.grekLand",
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
          foregroundImage: "./assets/images/icon2.webp",
          backgroundColor: "#ffffff"
        },
        versionCode: 3, 
        package: "com.grekLand",
        permissions: ["INTERNET", "QUERY_ALL_PACKAGES"]
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/icon1.webp"
      },
      plugins: ["expo-router"],
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
  