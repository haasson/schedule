// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app")
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfc78a5vd_N8QhNhBeptg4kQONXBCFdTg",
  authDomain: "seriozha-bot.firebaseapp.com",
  projectId: "seriozha-bot",
  storageBucket: "seriozha-bot.appspot.com",
  messagingSenderId: "591381153910",
  appId: "1:591381153910:web:8c27bd645a5d53f907f757",
  databaseURL: 'https://seriozha-bot-default-rtdb.asia-southeast1.firebasedatabase.app'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = app