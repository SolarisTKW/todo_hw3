import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
//
// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyAbNvw0IwjXUPXkBGDL3CDP0aobJGbr-5w",
    authDomain: "todohw3-a58d4.firebaseapp.com",
    databaseURL: "https://todohw3-a58d4.firebaseio.com",
    projectId: "todohw3-a58d4",
    storageBucket: "todohw3-a58d4.appspot.com",
    messagingSenderId: "260001994048",
    appId: "1:260001994048:web:f27c36787d2a296dd0d6a5",
    measurementId: "G-CL2FV7BW2C"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;