import React, { FC } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { fonts } from '../styles/fonts';
import Image from 'react-native-fast-image';

const modalStyles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 150,
  },
  item: {
    fontFamily: fonts.gotham,
    fontSize: 22,
    letterSpacing: 0.3,
    paddingVertical: 5,
  },
  title: {
    fontFamily: fonts.ghotamBold,
    fontSize: 16,
    letterSpacing: 0.3,
    paddingVertical: 5,
  },
  subtitle: {
    fontFamily: fonts.gotham,
    fontSize: 16,
    letterSpacing: 0.3,
    paddingVertical: 5,
  },
  image: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
});

interface NotificationModalProps {
  title: string;
  subtitle: string;
  image: string;
  modalVisible: boolean;
  closeModal: () => void;
}

export const NotificationModal: FC<NotificationModalProps> = ({
  title,
  subtitle,
  image,
  modalVisible,
  closeModal,
}) => {
  if (!title?.length) {
    return null;
  }

  const closePress = () => {
    closeModal?.();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        closePress();
      }}>
      <TouchableOpacity style={modalStyles.modalWrapper} onPress={closePress}>
        <View style={modalStyles.modalView}>
          <TouchableOpacity onPress={closePress}>
            <View style={modalStyles.titleContainer}>
              <Text style={modalStyles.title}>{title}</Text>
              <Image style={modalStyles.image} source={{ uri: image }} />
            </View>
            <Text style={modalStyles.subtitle}>{subtitle}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
