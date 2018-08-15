import firebase from 'firebase';

const config = require('./config.js');
const fbApp = firebase.initializeApp(config);

export default fbApp.database();
