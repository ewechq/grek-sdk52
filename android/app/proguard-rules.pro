# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add any project specific keep options here:

# Сохраняем mapping файл
-keepattributes SourceFile,LineNumberTable
-printmapping mapping.txt

# Сохраняем имена классов и методов
-keepnames class * { *; }
-keepnames interface * { *; }
-keepnames enum * { *; }

# Сохраняем аннотации
-keepattributes *Annotation*

# Сохраняем нативные методы
-keepclasseswithmembernames class * {
    native <methods>;
}

# Сохраняем классы React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Сохраняем классы Expo
-keep class expo.modules.** { *; }
-keep class host.exp.** { *; }
