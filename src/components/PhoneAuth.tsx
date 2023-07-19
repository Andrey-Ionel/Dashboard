import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Formik, FormikConfig, FormikProps } from 'formik';
import FormTextInput from './TextInput';
import { ScreenWrapper } from './ScreenWrapper';
import { Loading } from './Loading';
import { AuthContext } from '../context/AuthContext';
import PhoneInput from 'react-native-phone-input';
import ReactNativePhoneInput from 'react-native-phone-input';

import {
  defineSchema,
  regexSchemaPresets,
  textInputProps,
} from '../lib/formikPresets';
import i18n from '../lib/translations';
import { HIT_SLOP_AREA, isIos, logError, ONLY_NUMBERS } from '../lib/constants';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { fonts } from '../styles/fonts';
import colors from '../styles/colors';
import Image from 'react-native-fast-image';
import warning from '../assets/icons/warning.png';

const height = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  borderRect: {
    borderRadius: 0,
  },
  input: {
    paddingTop: 15,
    paddingBottom: 10,
    lineHeight: 17,
    fontSize: 17,
    fontWeight: '500',
  },
  phoneText: {
    lineHeight: 17,
    fontSize: 17,
    fontWeight: '500',
  },
  image: {
    height: 30,
    width: 30,
  },
  errorIcon: {
    marginRight: 5,
    height: 12,
    width: 13,
    bottom: 2,
  },
  errorMessage: {
    fontFamily: fonts.gotham,
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 13,
    letterSpacing: 0.5,
  },
  iconWrapperStyle: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 15,
    top: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    borderRadius: 0,
    backgroundColor: colors.backgroundPrimary,
    padding: 15,
    lineHeight: 22,
    fontSize: 18,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '100%',
    alignSelf: 'center',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 18,
    fontFamily: fonts.ghotamBlack,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  textInputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  textInput: {
    width: '100%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    fontWeight: '500',
    fontSize: 17,
    lineHeight: 13,
    color: colors.textPopover,
    borderWidth: 1,
    borderColor: colors.separatorPrimary,
    paddingHorizontal: 20,
  },
  flagStyle: {
    height: 27,
    width: 40,
  },
  halfScreenSize: {
    height: height / 2,
  },
  pickerButton: {
    fontSize: 17,
    fontFamily: fonts.bebasNeue,
    letterSpacing: 2,
  },
  activeInput: {
    borderWidth: 2,
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  errorInputMessage: {
    fontFamily: fonts.gotham,
    marginTop: 1,
    color: colors.textError,
    marginRight: 20,
  },
  textInputError: {
    borderWidth: 2,
    borderColor: colors.textError,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 3,
  },
  requiredSymbol: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 13,
    marginRight: 1,
  },
  requiredSymbolError: {
    color: colors.textError,
  },
  title: {
    fontFamily: fonts.gotham,
    color: colors.textPrimary,
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 13,
  },
  titleError: {
    color: colors.textError,
  },
  horizontal: {
    paddingHorizontal: 0,
  },
});

export interface PhoneAuthFormFields {
  nickname: string;
  otp: string;
}

export interface PhoneAuthProps {
  navigation: NavigationProp<ParamListBase>;
}

export const commonInputProps = {
  errorIconStyle: styles.errorIcon,
  errorMessageStyle: styles.errorMessage,
  importantForAutofill: 'yes' as const,
};

const generateFormSchema = () =>
  defineSchema({
    nickname: regexSchemaPresets()
      .firstName()
      .required(i18n.t('errors.nickname')),
  });

export const PhoneAuth: FC<PhoneAuthProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const { loading, requestOTP, loginByPhone, setCode, confirm, setConfirm } =
    useContext(AuthContext);
  const phoneRef = useRef<ReactNativePhoneInput>(null);
  const isValidNumber = phoneRef?.current?.isValidNumber();

  useEffect(() => {
    setConfirm(null);
  }, []);

  const onLoginSubmit: FormikConfig<PhoneAuthFormFields>['onSubmit'] = async (
    values: PhoneAuthFormFields,
  ) => {
    if (!isValidNumber) {
      return;
    }
    confirm?.verificationId?.length
      ? loginByPhone(values.nickname, phoneNumber, navigation).catch(e =>
          logError(e),
        )
      : requestOTP(phoneNumber).catch(e => logError(e));
  };

  const handleChangePhoneNumber = (phone: string) => {
    setPhoneNumber(phone);
    setPhoneError(false);
  };

  const formikConfig: FormikConfig<PhoneAuthFormFields> = {
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema: generateFormSchema(),
    initialValues: {
      nickname: '',
      otp: '',
    },
    onSubmit: onLoginSubmit,
  };

  return (
    <ScreenWrapper screenStyle={styles.flex} needInSafeArea={true}>
      <View style={[styles.container, !!loading && styles.horizontal]}>
        <Formik {...formikConfig}>
          {(props: FormikProps<PhoneAuthFormFields>) => {
            const {
              handleSubmit,
              setFieldValue,
              errors,
              values,
              touched,
              setFieldTouched,
              isValid,
            } = props;

            const isReadyToSubmit = !!values.nickname.length && isValid;
            const otpCode = (values.otp + '')?.replace(ONLY_NUMBERS, '');

            const onSubmit = (event: GestureResponderEvent) => {
              if (!isValidNumber) {
                setPhoneError(true);
              }
              handleSubmit(event as any);
              setCode(values.otp);
            };

            const setTouched = (field: string) => () => {
              setFieldTouched(field, true);
            };

            return (
              <>
                {loading ? (
                  <Loading />
                ) : (
                  <KeyboardAvoidingView
                    enabled
                    behavior={isIos ? 'padding' : 'height'}>
                    <FormTextInput
                      {...textInputProps.nickname}
                      textInputStyles={[styles.input, styles.borderRect]}
                      errorsMessage={errors.nickname || ''}
                      required={true}
                      title={i18n.t('inputTitles.nickname')}
                      formFieldName={'nickname'}
                      setFormikField={setFieldValue}
                      value={values.nickname}
                      touched={!!touched.nickname}
                      imageWrapperStyle={styles.iconWrapperStyle}
                      {...commonInputProps}
                      imageStyles={styles.image}
                      onBlur={setTouched('nickname')}
                    />
                    <View style={styles.textInputContainer}>
                      <View style={styles.titleContainer}>
                        <Text
                          style={[
                            styles.requiredSymbol,
                            phoneError && styles.requiredSymbolError,
                          ]}>
                          {i18n.t('inputTitles.required')}
                        </Text>
                        <Text
                          style={[
                            styles.title,
                            phoneError && styles.titleError,
                          ]}>
                          {i18n.t('inputTitles.phoneNumber')}
                        </Text>
                      </View>
                      <PhoneInput
                        ref={phoneRef}
                        initialCountry={'ua'}
                        initialValue={phoneNumber}
                        style={[
                          styles.textInput,
                          phoneError && styles.textInputError,
                        ]}
                        textStyle={styles.phoneText}
                        onChangePhoneNumber={handleChangePhoneNumber}
                        flagStyle={styles.flagStyle}
                        pickerButtonColor={colors.textPrimary}
                        pickerItemStyle={styles.halfScreenSize}
                        cancelTextStyle={styles.pickerButton}
                        confirmTextStyle={styles.pickerButton}
                        accessibilityLabel={i18n.t('inputTitles.phoneNumber')}
                      />
                      {phoneError && (
                        <View style={styles.errorContainer}>
                          <Image source={warning} style={styles.errorIcon} />
                          <Text style={styles.errorInputMessage}>
                            {i18n.t('errors.phone')}
                          </Text>
                        </View>
                      )}
                    </View>
                    {!!confirm?.verificationId?.length && (
                      <FormTextInput
                        {...textInputProps.otp}
                        textInputStyles={[styles.input, styles.borderRect]}
                        errorsMessage={errors.otp || ''}
                        required={true}
                        title={i18n.t('inputTitles.otp')}
                        formFieldName={'otp'}
                        setFormikField={setFieldValue}
                        value={otpCode}
                        touched={!!touched.otp}
                        imageWrapperStyle={styles.iconWrapperStyle}
                        {...commonInputProps}
                        imageStyles={styles.image}
                        onBlur={setTouched('otp')}
                        maxLength={6}
                        placeholder={i18n.t('signInSection.otpPlaceholder')}
                      />
                    )}
                    <TouchableOpacity
                      onPress={onSubmit}
                      style={styles.btn}
                      hitSlop={HIT_SLOP_AREA}
                      disabled={!isReadyToSubmit}>
                      <Text style={styles.btnText}>
                        {confirm?.verificationId?.length
                          ? i18n.t('signInSection.confirmCode')
                          : i18n.t('signInSection.signIn')}
                      </Text>
                    </TouchableOpacity>
                  </KeyboardAvoidingView>
                )}
              </>
            );
          }}
        </Formik>
      </View>
    </ScreenWrapper>
  );
};
