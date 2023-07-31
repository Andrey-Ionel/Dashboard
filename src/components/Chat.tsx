import React, {
  FC,
  JSX,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ScreenWrapper } from './ScreenWrapper';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { uId } from '../lib/UniqId';
import { Button } from './Button';
import { Header } from './Header';
import { ConfirmModal } from '../modals/ConfirmModal';

import colors from '../styles/colors';
import i18n from 'i18next';
import { isIos, logError } from '../lib/constants';
import { fonts } from '../styles/fonts';
import moment from 'moment';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    paddingTop: 20,
  },
  flex: {
    flex: 1,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  inputContainer: {
    backgroundColor: colors.backgroundSecondary,
    flexDirection: 'row',
  },
  textInput: {
    height: 55,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    fontSize: 17,
    lineHeight: 17,
    color: colors.textPopover,
    borderTopWidth: 1,
    borderColor: colors.separatorPrimary,
    paddingHorizontal: 20,
  },
  serverState: {
    height: 30,
    backgroundColor: colors.greenBackground,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  serverDisconnect: {
    backgroundColor: colors.textError,
  },
  serverMessage: {
    fontFamily: fonts.gotham,
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 13,
    letterSpacing: 0.5,
  },
  userMessage: {
    backgroundColor: colors.userMessageBackground,
    borderRadius: 12,
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    maxWidth: '90%',
  },
  otherMessage: {
    backgroundColor: colors.otherMessageBackground,
    borderRadius: 12,
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  messageDateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 12,
    padding: 10,
    margin: 10,
    alignSelf: 'center',
    maxWidth: '90%',
  },
  messageDateText: {
    fontFamily: fonts.gotham,
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  messageText: {
    fontFamily: fonts.gotham,
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 13,
  },
  messageTimeText: {
    fontFamily: fonts.gotham,
    fontWeight: '400',
    fontSize: 8,
    lineHeight: 10,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  btn: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    borderTopWidth: 1,
    borderColor: colors.separatorPrimary,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 18,
    fontFamily: fonts.ghotamBlack,
    textAlign: 'center',
    color: colors.textPrimary,
  },
});

interface SocketMessage {
  senderId: string;
  messageId: string;
  message: string;
  date: string;
}

export interface ChatProps {
  navigation: NavigationProp<ParamListBase>;
}

export const Chat: FC<ChatProps> = memo(({ navigation }) => {
  const [serverState, setServerState] = useState('Loading...');
  const [messageText, setMessageText] = useState('');
  const [inputFieldEmpty, setInputFieldEmpty] = useState<boolean>(true);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [serverMessages, setServerMessages] = useState<SocketMessage[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deletedMessageId, setDeletedMessageId] = useState<string>('');
  console.log("'zxc', 'serverMessages'", serverMessages);

  const { userInfo } = useContext(AuthContext);

  const scrollRef = useRef<ScrollView>(null);
  const ws = useRef(new WebSocket('wss://9yfysp-8080.csb.app/')).current;
  const messagesByDate = useMemo(
    () =>
      serverMessages?.reduce(
        (acc: { [date: string]: SocketMessage[] }, item) => {
          const messagesDate = moment(Number(item?.date || 0)).format(
            'dddd DD/MM/YYYY',
          );

          if (!acc[messagesDate]) {
            acc[messagesDate] = [item];
          } else {
            acc[messagesDate]?.push(item);
          }
          return acc;
        },
        {},
      ),
    [serverMessages],
  );

  useEffect(() => {
    getMessages().catch(e => logError(e?.message));
  }, []);

  useEffect(() => {
    const reconnectWebSocket = () => ws;

    ws.onopen = () => {
      setServerState('Connected!!!');
      setDisableButton(false);
    };
    ws.onclose = () => {
      setServerState('Disconnected. Check internet or server!');
      setTimeout(reconnectWebSocket, 1000);
      setDisableButton(true);
      handleReload();
    };
    ws.onerror = () => {
      const errorMessage = 'WebSocket error occurred.';
      setServerState(errorMessage);
      setDisableButton(true);
    };
    ws.onmessage = e => {
      const newMessage = JSON.parse(e?.data);
      setServerMessages(newMessage);
      setTimeout(handleScrollToBottom, 100);
    };
  }, [ws]);

  const dismissKeyboard = () => Keyboard.dismiss();
  const showKeyboard = () => Keyboard.isVisible();
  const uniqId = uId({ prefix: 'MSG' });

  const getMessages = async (): Promise<void> => {
    try {
      await axios.get('https://9yfysp-8080.csb.app/').then(response => {
        setServerMessages(response?.data);
        setTimeout(handleScrollToBottom, 100);
      });
    } catch (e: any) {
      logError(e?.message as Error);
    }
  };

  const deleteMessage = async (): Promise<void> => {
    try {
      await axios
        .delete(`https://9yfysp-8080.csb.app/${deletedMessageId}`)
        .then(() => getMessages());
    } catch (e: any) {
      logError(e?.message as Error);
    }
  };

  const handleReload = (): void => {
    navigation.reset({
      routes: [{ name: 'Home' }, { name: 'Chat' }],
    });
  };

  const handleScrollToBottom = (): void => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const showDeleteModal = (id: string) => (): void => {
    setDeletedMessageId(id);
    setShowModal(true);
  };

  const handleClose = (): void => {
    setDeletedMessageId('');
    setShowModal(false);
  };

  const goBack = (): void => {
    navigation.goBack();
  };

  const submitMessage = (): void => {
    if (inputFieldEmpty) {
      return;
    }
    const socketMessage = {
      senderId: userInfo?.uid,
      messageId: uniqId,
      message: messageText,
      date: Date.now().toString(),
    };
    ws.send(JSON.stringify(socketMessage));
    setMessageText('');
    setInputFieldEmpty(true);
  };

  const focus = (): void => {
    showKeyboard();
  };

  const blur = (): void => {
    dismissKeyboard();
  };

  const onChange = (text: string): void => {
    const empty = !text.length || !text.trim();
    setMessageText(text);
    setInputFieldEmpty(empty);
  };

  const renderBottomContent = (): JSX.Element => {
    return (
      <KeyboardAvoidingView
        enabled
        behavior={isIos ? 'padding' : undefined}
        keyboardVerticalOffset={isIos ? 115 : 0}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={'Type a message'}
              accessibilityLabel={i18n.t('accessibility.pleaseEnterMessage')}
              style={styles.textInput}
              onFocus={focus}
              onBlur={blur}
              value={messageText}
              onChangeText={onChange}
              onEndEditing={submitMessage}
              autoCorrect={false}
            />
            <Button
              btnStyle={styles.btn}
              textStyle={styles.btnText}
              onPress={submitMessage}
              title={'Send'}
              disabled={inputFieldEmpty || disableButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  const renderHeader = (): JSX.Element => {
    return (
      <>
        <Header title={'chat'} backButton goBack={goBack} />
        <View
          style={[
            styles.serverState,
            serverState?.includes('Disconnected') && styles.serverDisconnect,
          ]}>
          <Text style={styles.serverMessage}>{serverState}</Text>
        </View>
      </>
    );
  };

  return (
    <ScreenWrapper
      screenStyle={styles.wrapper}
      needInSafeArea={true}
      scroll={true}
      scrollViewProps={{ ref: scrollRef }}
      fixedComponentTop={renderHeader()}
      fixedComponentBottom={renderBottomContent()}>
      {Object.entries(messagesByDate)?.map(([date, messages]) => (
        <View key={date}>
          <View style={styles.messageDateContainer}>
            <Text style={styles.messageDateText}>{date}</Text>
          </View>
          {messages.map(item => {
            const isUser = item?.senderId === userInfo?.uid;
            const messagesTime = moment(Number(item?.date || 0)).format(
              'HH:MM',
            );
            return (
              <TouchableOpacity
                onLongPress={
                  isUser ? showDeleteModal(item.messageId) : undefined
                }
                style={isUser ? styles.userMessage : styles.otherMessage}
                key={item.messageId}>
                <Text style={styles.messageText}>{item.message}</Text>
                <Text style={styles.messageTimeText}>{messagesTime}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      {showModal && (
        <ConfirmModal
          title={i18n.t('deleteModal.title')}
          subtitle={i18n.t('deleteModal.subtitle')}
          modalVisible={showModal}
          closeModal={handleClose}
          onDelete={deleteMessage}
        />
      )}
    </ScreenWrapper>
  );
});
