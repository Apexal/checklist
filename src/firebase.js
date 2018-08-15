import firebase from 'firebase';

const config = require('./config.js');
// eslint-disable-next-line
console.log(config);
const fbApp = firebase.initializeApp(config);

export default fbApp.database();
