import firebase from '@react-native-firebase/app';
import '@react-native-firebase/analytics';
import '@react-native-firebase/crashlytics';
import '@react-native-firebase/remote-config';

export const configure = () => {
    // setTimeout(() => {
    //     crashlytics().crash();
    // }, 10000);
};

let app = firebase.app();
app.analytics().setAnalyticsCollectionEnabled(true);

export default firebase;
