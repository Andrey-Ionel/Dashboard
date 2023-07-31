import React, { FC } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '../components/Button';

import { fonts } from '../styles/fonts';
import colors from '../styles/colors';

const modalStyles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  modalView: {
    margin: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
    borderRadius: 0,
    backgroundColor: 'transparent',
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 18,
    fontFamily: fonts.ghotamBlack,
    textAlign: 'center',
    color: colors.textPrimary,
  },
});

interface NotificationModalProps {
  title: string;
  subtitle: string;
  modalVisible: boolean;
  closeModal: () => void;
  onDelete: () => Promise<void>;
}

export const ConfirmModal: FC<NotificationModalProps> = ({
  title,
  subtitle,
  modalVisible,
  closeModal,
  onDelete,
}) => {
  if (!title?.length) {
    return null;
  }

  const closePress = () => {
    closeModal?.();
  };

  const deletePress = () => {
    onDelete?.();
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
            </View>
            <Text style={modalStyles.subtitle}>{subtitle}</Text>
          </TouchableOpacity>
          <View style={modalStyles.btnWrapper}>
            <Button
              title={'Ok'}
              onPress={deletePress}
              btnStyle={modalStyles.btn}
              textStyle={modalStyles.btnText}
            />
            <Button
              title={'Cancel'}
              onPress={closePress}
              btnStyle={modalStyles.btn}
              textStyle={modalStyles.btnText}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
