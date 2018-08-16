import firebase from 'firebase/app';
import 'firebase/database';

const config = require('./config.js');
const fbApp = firebase.initializeApp(config);

export default fbApp.database();
