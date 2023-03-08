// TODO: expand this into multiple stylesheets that are legit shared across the application
// TODO: organize this, this is poorly used throughout the application

import { Platform, StyleSheet } from 'react-native';
import * as Device from 'app/utility/Device';

export const SETTINGS_PANEL_STYLES = StyleSheet.create({
    panel: {
        marginTop: 10,
        marginBottom: 0,
        marginLeft: 13,
        marginRight: 13,
        padding: 20,
        backgroundColor: 'white',
        borderColor: '#e0e0e0',
        borderWidth: 1,
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    subtitleText: {
        fontSize: 14,
        textAlign: 'center',
        color: 'rgba(77, 77, 77, 1)',
    },
    headerText: {
        fontSize: 20,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'rgba(77, 77, 77, 1)',
    },
    tappableText: {
        fontSize: 16,
        textAlign: 'center',
        color: 'rgba(47, 128, 237, 1)',
    },
    content: {
        flex: 1,
        padding: 10,
        paddingLeft: 5,
        paddingRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentItemList: {
        flex: 1,
        alignSelf: 'stretch',
        paddingLeft: 10,
        paddingRight: 10,
    },
    footer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    footerCancelText: {
        textAlign: 'center',
        color: 'crimson',
    },
    blueButton: {
        backgroundColor: 'rgba(47, 128, 237, 1)',
        borderRadius: 3,
        borderWidth: 3,
        borderColor: 'rgba(47, 128, 237, 1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
    },
});

export const HISTORY_STYLES = StyleSheet.create({
    editFilterModalBG: {
        backgroundColor: 'rgba(242, 242, 242, 1)',
    },
    tappableText: {
        color: 'rgba(47, 128, 237, 1)',
    },
});

export const EDIT_MODAL_STYLES = StyleSheet.create({
    textField: {
        height: 35,
        margin: 10,
        color: 'rgba(77, 77, 77, 1)',
        fontSize: 14,
        paddingBottom: Platform.OS === 'ios' ? 0 : 10,
    },
    container: {
        height: Platform.OS === 'ios' && !Device.hasNotch() ? 70 : 50,
        alignItems: 'center',
    },
    nav: {
        paddingTop: Platform.OS === 'ios' && !Device.hasNotch() ? 35 : 15,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
    },
    navTitle: {
        paddingTop: 15,
    },
    addButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(47, 128, 237, 1)',
        borderRadius: 5,
    },
    disabled: {
        opacity: 0.3,
    },
    addText: {
        color: 'white',
    },
    rowBorders: {
        borderColor: '#e0e0e0',
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
});
