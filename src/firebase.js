import * as firebase from 'firebase/app';
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: __letterjam.env.FIREBASE_API_KEY,
    authDomain: "letter-jam.firebaseapp.com",
    databaseURL: "https://letter-jam.firebaseio.com",
    projectId: "letter-jam"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const arrayUnion = firebase.firestore.FieldValue.arrayUnion;