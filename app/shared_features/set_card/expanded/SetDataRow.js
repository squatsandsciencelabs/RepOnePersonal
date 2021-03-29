import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class SetDataRow extends PureComponent {

    _onPressRow() {
        // temp just toggle remove
        if (this.props.item.removed) {
            this.props.onPressRestore();
        } else {
            this.props.onPressRemove();
        }
    }

    render() {
        var button = null;
        if (!this.props.item.removed) {
            button = (
                <Icon name="close" size={20} color="lightgray" style={{marginTop: -1, marginRight: 3}} />
            );
        } else {
            button = (
                <Icon name="undo" size={20} color="lightgray" style={{marginTop: -1, marginRight: 3}} />
            );
        }

        const dataStyle = this.props.item.removed ? styles.removedData : styles.data;
        
        return (
            <View style={[styles.border, {flex:1, alignItems:'stretch', backgroundColor:'white'}]}>
                <TouchableOpacity style={{flex:1}} onPress={ () => this._onPressRow() } >
                    <View style={styles.bar}>
                        <View style={styles.itemContainer}><Text style={dataStyle}> { this.props.item.repDisplay } </Text></View>
                        {this.props.item.columns.map(i => <View style={styles.itemContainer}><Text style={dataStyle}> { i } </Text></View>)}
                        {button}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    border: {
        borderColor: '#e0e0e0',
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    bar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        left: 0,
        right: 0,
        bottom: 0,
        height: 40,
        padding: 0,
        marginRight: 0,
    },
    itemContainer: {
        width: 45,
        height: 20,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    data: {
        textAlign: 'center',
        color: 'rgba(77, 77, 77, 1)',
    },
    removedData: {
        textAlign: 'center',
        color: 'lightgray',
    }
});

export default SetDataRow;
