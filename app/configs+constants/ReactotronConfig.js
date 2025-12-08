import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

if (__DEV__) {
    // development, enable reactotron
    Reactotron.configure({
        name: 'RepOne',
        host: '192.168.1.198',
    }) // controls connection & communication settings
        .use(reactotronRedux()) // add all built-in react native plugins
        .connect(); // let's connect!

    console.tron = {
        log: msg => {
            console.log(msg);
            Reactotron.log(msg);
        },
        display: obj => {
            console.log(obj.value);
            Reactotron.display(obj);
        },
    };
} else {
    // production, remove tron logs
    console.tron = {};
    console.tron.log = () => {};
    console.tron.display = () => {};
}
