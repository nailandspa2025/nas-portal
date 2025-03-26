importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCnd3q0ZpkziTfRucsYN8u0iwgAccaV2lE",
  authDomain: "nas-app-service.firebaseapp.com",
  projectId: "nas-app-service",
  storageBucket: "nas-app-service.firebasestorage.app",
  messagingSenderId: "174371785389",
  appId: "1:174371785389:web:471f0ca4ba66a21d781424",
  measurementId: "G-BV1H2RB6E6",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("🔔 Nhận thông báo trong background:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png",
  });
});
