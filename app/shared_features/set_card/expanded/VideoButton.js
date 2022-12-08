import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { generateThumbnail } from 'app/utility/VideoThumbnailGenerator';

class VideoButton extends Component {
    constructor(props) {
        super(props);
        this.state = { uri: null };
    }

    async componentDidMount() {
        if (this.props.videoFileURL) {
            await this._generateThumbnail();
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (
            this.props.isSaving !== prevProps.isSaving &&
            this.props.videoFileURL !== prevProps.videoFileURL &&
            this.props.videoFileURL &&
            !this.props.isSaving
        ) {
            this.setState({ uri: null });
            await waitUntilFileExists(this.props.videoFileURL);
            await this._generateThumbnail();
        }
    }

    async _generateThumbnail() {
        const uri = await generateThumbnail(this.props.videoFileURL);
        if (uri) {
            this.setState({ uri: uri });
        }
    }

    _tappedWatchVideo() {
        this.props.tappedWatch(this.props.setID, this.props.videoFileURL);
    }

    _tappedRecord() {
        this.props.tappedRecord(this.props.setID);
    }

    _tappedCommentary() {
        this.props.tappedCommentary(this.props.setID);
    }

    render() {
        switch (this.props.mode) {
            case 'record':
                return (
                    <TouchableOpacity style={{paddingLeft: 5}} onPress={()=> this._tappedRecord()}>
                        <View style={[{flex:1, flexDirection:'column'}, styles.button, styles.activeButton]}>
                            <Icon name="camera" size={20} color='rgba(47, 128, 227, 1)' style={{marginTop: 10, marginBottom: 5}} />
                            <Text style={styles.activeText}>Record</Text>
                            <Text style={styles.activeText}>Video</Text>
                        </View>
                    </TouchableOpacity>
                );
            case 'commentary':
                return (
                    <View style={{paddingLeft: 5}}>
                        <View style={[{flex:1}, styles.button, styles.grayButton]}>
                            <TouchableHighlight onPress={()=> this._tappedCommentary()} underlayColor='#e0e0e0'>
                                <View style={[styles.buttonContent, {flex:1, flexDirection:'column'}]}>
                                    <Icon name="camera" size={20} color='gray' style={{marginTop: 10, marginBottom: 5}} />
                                    <Text style={styles.grayText}>Add</Text>
                                    <Text style={styles.grayText}>Video Log</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                );
            case 'watch':
                // TODO: see if can make this a true image preview instead of a full video
                // probably requires RCTCameraRoll
                if (Platform.OS === 'ios') {
                    if (!this.props.videoFileURL) {
                        return (
                            <TouchableOpacity style={styles.videoButtonContainer} onPress={()=> this.props.tappedWatch(this.props.setID, this.props.videoFileURL) }>
                                <View style={styles.videoButton}>
                                </View>
                            </TouchableOpacity>
                        );
                    } else {
                        return (
                            <TouchableOpacity style={{paddingLeft: 5}} onPress={()=> this._tappedWatchVideo() }>
                                <View style={[{flex: 1}, styles.button, styles.blackButton]}>
                                    {this.state.uri !== null && (
                                        <Image
                                            style={[
                                                {
                                                    flex: 1,
                                                    flexDirection: 'column',
                                                },
                                                styles.imagePreview,
                                            ]}
                                            source={{
                                                uri: this.state.uri,
                                            }}
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    }
                } else {
                    return (
                        <TouchableOpacity style={{paddingLeft: 5}} onPress={()=> this._tappedWatchVideo() }>
                            <View style={[styles.button, styles.blackButton]}>
                                {this.state.uri !== null && (
                                    <Image
                                        style={[
                                            {
                                                flex: 1,
                                                flexDirection: 'column',
                                            },
                                            styles.imagePreview,
                                        ]}
                                        source={{
                                            uri: this.state.uri,
                                        }}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                }
            default:
                console.tron.log("video button props failed with mode " + this.props.mode);
                return null;
        }
    }
}

const styles = StyleSheet.create({
    button: {
        width: 75,
        height: 75,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderRadius: 5,
    },
    buttonContent: {
        width: 65,
        height: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePreview: {
        width: 75,
        height: 75,
    },
    activeButton: {
        backgroundColor: 'rgba(176, 208, 252, 1)',
        borderColor: 'rgba(176, 208, 252, 1)',
    },
    grayButton: {
        backgroundColor: 'rgba(239, 239, 239, 1)',
        borderColor: 'rgba(239, 239, 239, 1)',
    },
    blackButton: {
        backgroundColor: 'black',
        borderColor: 'black',
    },
    activeText: {
        color: 'rgba(47, 128, 227, 1)',
        fontSize: 11,
        fontWeight: '500'
    },
    grayText: {
        color: 'rgba(77, 77, 77, 1)',
        fontSize: 11
    },
});

// HELPERS

async function waitUntilFileExists(filePath) {
    return await new Promise(resolve => {
        const interval = setInterval(async () => {
            const exists = await ReactNativeBlobUtil.fs.exists(filePath);

            if (exists) {
                resolve();
                clearInterval(interval);
            }
        }, 500);
    });
}

export default VideoButton;
