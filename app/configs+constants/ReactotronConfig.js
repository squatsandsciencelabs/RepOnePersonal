import { Settings } from "react-native";
import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

if (__DEV__) {
    // development, enable reactotron
    Reactotron
        .configure({
            name: 'RepOne',
            host: '192.168.1.102',
        }) // controls connection & communication settings
        .use(sagaPlugin()) // add all built-in react native plugins
        .use(reactotronRedux()) // add all built-in react native plugins
        .connect() // let's connect!

    console.tron = {
        log: (msg) => {
            console.log(msg);
            Reactotron.log(msg);
        },
        display: (obj) => {
            console.log(obj.value)
            Reactotron.display(obj);
        },
    };

    const host = Settings.get('reactotron_ip');
    console.tron.log(`host is ${host}`);
} else {
    const host = Settings.get('reactotron_ip');
    if (!host) {
        console.tron = {};
        console.tron.log = console.log;
        console.tron.display = () => { };
    } else {

        Reactotron
            .configure({
                name: 'RepOne',
                host,
            }) // controls connection & communication settings
            .use(sagaPlugin()) // add all built-in react native plugins
            .use(reactotronRedux()) // add all built-in react native plugins
            .connect() // let's connect!

        console.tron = {
            log: (msg) => {
                console.log(msg);
                Reactotron.log(msg);
            },
            display: (obj) => {
                console.log(obj.value)
                Reactotron.display(obj);
            },
        };
    }
}
