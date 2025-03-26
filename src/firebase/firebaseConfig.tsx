import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getInstallations, getId } from "firebase/installations";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCnd3q0ZpkziTfRucsYN8u0iwgAccaV2lE",
  authDomain: "nas-app-service.firebaseapp.com",
  projectId: "nas-app-service",
  storageBucket: "nas-app-service.firebasestorage.app",
  messagingSenderId: "174371785389",
  appId: "1:174371785389:web:471f0ca4ba66a21d781424",
  measurementId: "G-BV1H2RB6E6",
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const installations = getInstallations(app);
const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      return registration;
    } catch (error) {
      console.error("❌ Lỗi khi đăng ký Service Worker:", error);
    }
  }
};

const getDeviceInfo = async () => {
  try {
    await registerServiceWorker();
    const token = await getToken(messaging, {
      vapidKey:
        "BNAENdUqlFgxfW31NWU7T9CalwuHf9k8dKuYzmnwsSnrBH1YpvGUorEBO0tgsRKkOOVMbPEn6ImiBPDa41TeCoE",
    });

    const deviceInfo = {
      Token: token,
      DeviceId: await getId(installations),
      IsVirtual: /android|iphone|ipad/i.test(navigator.userAgent)
        ? false
        : true,
      Manufacturer: navigator.vendor || "Unknown",
      OsVersion: navigator.appVersion,
      OperatingSystem: navigator.platform,
      AppName: navigator.appName,
      Platform: /android/i.test(navigator.userAgent)
        ? "android"
        : /iphone|ipad/i.test(navigator.userAgent)
        ? "ios"
        : "web",
    };
    return deviceInfo;
  } catch (error) {
    console.error("❌ Lỗi khi lấy Firebase Token:", error);
    return null;
  }
};
const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    if (payload.notification && payload.notification.title) {
      toast.success(payload.notification.title);
    }
  });
};
export { messaging, getDeviceInfo, onMessage, listenForMessages };
