import React, {Component} from 'react';
import {
    TouchableOpacity,
    Text,
    View,
} from 'react-native';
class ScalarView extends Component {

    _renderStart() {
        return this.props.start.map(p => {
            return <Text style={{color: 'white'}}>{p.x}, {p.y}, {p.z}</Text>;
        });
    }

    _renderEnd() {
        return this.props.end.map(p => {
            return <Text style={{color: 'white'}}>{p.x}, {p.y}, {p.z}</Text>;
        });
    }

    _renderResults() {
        const results = [];
        this.props.results.forEach(r => {
            if (r.rom !== null && r.averageStart !== null && r.averageEnd !== null) {
                results.push(<Text style={{color: 'white'}}>ROM {r.rom}, start {r.averageStart.x},{r.averageStart.y},{r.averageStart.z}, end {r.averageEnd.x},{r.averageEnd.y},{r.averageEnd.z}</Text>);
            }
        });
        return results;
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent:'space-around' }}>
                    <View style={{ flexDirection: 'row', justifyContent:'space-around', marginTop: 10}}>
                        <TouchableOpacity style={{backgroundColor: 'green', padding: 50}} onPress={()=> this.props.tappedLogStart()}>
                            <View style={{textAlign: 'center'}}>
                                <Text style={{color: 'white'}}>LOG START</Text>
                                {this._renderStart()}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: 'red', padding: 50}} onPress={()=> this.props.tappedLogEnd()}>
                            <View style={{textAlign: 'center'}}>
                                <Text style={{color: 'white'}}>LOG END</Text>
                                {this._renderEnd()}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{flex: 1, margin: 10, backgroundColor: 'blue'}} onPress={()=> this.props.tappedAddToRep(this.props.start, this.props.end)}>
                        <View style={{flex: 1, flexDirection: 'row', paddingLeft: 5, paddingTop: 5, }}>
                            <Text style={{paddingRight: 25, color: 'white'}}>ADD TO REP</Text>
                            <View style={{flex: 1}}>
                                {this._renderResults()}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default ScalarView;
