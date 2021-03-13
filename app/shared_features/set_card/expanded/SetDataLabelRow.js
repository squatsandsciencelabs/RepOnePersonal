import React from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';

export default props => {
    return (
        <View style={[{flexDirection: 'column', alignItems: 'stretch', paddingTop: 5, paddingRight: 24, paddingLeft: 0, backgroundColor: 'white'}, styles.border, styles.container]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={styles.headerLabel}><Text style={styles.text}>REP</Text></View>
                {props.item.labels.map(l => <View style={styles.headerLabel}><Text style={styles.text}>{l}</Text></View>)}
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                <View style={styles.headerLabel}><Text style={styles.text}>#</Text></View>
                {props.item.units.map(u => <View style={styles.headerLabel}><Text style={styles.text}>{u}</Text></View>)}
            </View>
            <View style={styles.horizontalBorder}/>
        </View>
    );
};

const styles = StyleSheet.create({
    headerLabel: {
        flex: 1,
        width: 45,
        alignItems: 'center',
    },
    text: {
        color: 'lightgray'
    },
    container: {
        backgroundColor: 'white'
    },
    border: {
        borderColor: '#e0e0e0',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        // borderTopWidth: 1,
        paddingTop: 10, 
    },
    horizontalBorder: {
        backgroundColor: '#e0e0e0',
        opacity: 0.5,
        height: 1,
    },
});
