import * as React from 'react';
import {
  Modal,
} from 'react-native';

import Vis from './3D/3DScreen';

export default function App(props) {

  return (
    <Modal
      transparent={true}
      visible={props.isShowing} >
        <Vis />
   </Modal>
  );
}
