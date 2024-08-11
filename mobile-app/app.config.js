// import { AppConfig } from './config/AppConfig';
// import { GoogleMapApiConfig } from './config/GoogleMapApiConfig';

export default {
    name: "Booking Bike App",
    description: "An app for booking bikes easily.",
    owner: "giangdeptrai123",
    slug: "bookingappbike",
    scheme: "bookingappbike",
    privacy: "public",
    runtimeVersion: "1.0.0",
    platforms: [
        "ios",
        "android"
    ],
    androidStatusBar: {
        hidden: true,
        translucent: true
    },
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo1024x1024.png",
    splash: {
        "image": "./assets/images/splash.png",
        "resizeMode":'cover',
        "backgroundColor": "#ffffff"
    },
    updates: {
        "fallbackToCacheTimeout": 0,
        "url": "https://u.expo.dev/" + "53a1d936-cd69-401e-a729-a98471a06df7",
    },
    extra: {
        eas: {
          projectId: "53a1d936-cd69-401e-a729-a98471a06df7"
        }
    },
    assetBundlePatterns: [
        "**/*"
    ],
    packagerOpts: {
        config: "metro.config.js"
    },
    ios: {
        supportsTablet: true,
        usesAppleSignIn: true,
        bundleIdentifier: "com.ptg.bab",
        entitlements:{
            "com.apple.developer.devicecheck.appattest-environment": "production"
        },
        infoPlist: {
            "NSLocationAlwaysUsageDescription": "This app uses the always location access in the background for improved pickups and dropoffs, customer support and safety purpose.",
            "NSLocationAlwaysAndWhenInUseUsageDescription": "This app uses the always location access in the background for improved pickups and dropoffs, customer support and safety purpose.",
            "NSLocationWhenInUseUsageDescription": "For a reliable ride, App collects location data from the time you open the app until a trip ends. This improves pickups, support, and more.",
            "NSCameraUsageDescription": "This app uses the camera to take your profile picture.",
            "NSPhotoLibraryUsageDescription": "This app uses Photo Library for uploading your profile picture.",
            "ITSAppUsesNonExemptEncryption":false,
            "UIBackgroundModes": [
                "location",
                "fetch",
                "remote-notification"
            ]
        },
        privacyManifests: {
            "NSPrivacyAccessedAPITypes": [
              {
                "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryUserDefaults",
                "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
              },
              {
                "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryFileTimestamp",
                "NSPrivacyAccessedAPITypeReasons": ["3B52.1"]
              },
              {
                "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryDiskSpace",
                "NSPrivacyAccessedAPITypeReasons": ["E174.1"]
              },
              {
                "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategorySystemBootTime",
                "NSPrivacyAccessedAPITypeReasons": ["35F9.1"]
              }
            ]
        },
        config: {
            googleMapsApiKey: "gg-api-key"
        },
        googleServicesFile: "./GoogleService-Info.plist",
        buildNumber: "1.0.0"
    },
    android: {
        package: "com.ptg.bab",
        versionCode: 1,
        permissions: [
            "CAMERA",
            "READ_EXTERNAL_STORAGE",
            "WRITE_EXTERNAL_STORAGE",
            "ACCESS_FINE_LOCATION",
            "ACCESS_COARSE_LOCATION",
            "CAMERA_ROLL",
            "FOREGROUND_SERVICE",
            "FOREGROUND_SERVICE_LOCATION",
            "ACCESS_BACKGROUND_LOCATION",
            "SCHEDULE_EXACT_ALARM"
        ],
        blockedPermissions:["com.google.android.gms.permission.AD_ID"],
        googleServicesFile: "./google-services.json",
        config: {
            googleMaps: {
                apiKey: "gg-api-key"
            }
        }
    },
    plugins: [
        "expo-asset",
        "expo-font",
        "expo-apple-authentication",
        "expo-localization",
        "@react-native-firebase/app", 
        "@react-native-firebase/auth",
        [
            "expo-notifications",
            {
                sounds: [
                    "./assets/sounds/horn.wav",
                    "./assets/sounds/repeat.wav"
                ]
            }
        ],
        [
            "expo-build-properties",
            {
              "ios": {
                "useFrameworks": "static"
              }
            }
        ],
        [
            "expo-image-picker",
            {
              "photosPermission": "This app uses Photo Library for uploading your profile picture.",
              "cameraPermission": "This app uses the camera to take your profile picture."
            }
        ],
        [
            "expo-location",
            {
                "locationAlwaysAndWhenInUsePermission": "This app uses the always location access in the background for improved pickups and dropoffs, customer support and safety purpose.",
                "locationAlwaysPermission": "This app uses the always location access in the background for improved pickups and dropoffs, customer support and safety purpose.",
                "locationWhenInUsePermission": "For a reliable ride, App collects location data from the time you open the app until a trip ends. This improves pickups, support, and more.",
                "isIosBackgroundLocationEnabled": true,
                "isAndroidBackgroundLocationEnabled": true,
                "isAndroidForegroundServiceEnabled": true
            }
        ]
    ]
}
