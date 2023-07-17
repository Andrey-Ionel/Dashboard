import React, { FC, useContext, useRef, useState } from 'react';
import {
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
import { HIT_SLOP_AREA, isIos } from '../lib/constants';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { fonts } from '../styles/fonts';
import colors from '../styles/colors';

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
});

export interface PhoneAuthFormFields {
  nickname: string;
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

export const PhoneAuth: FC<PhoneAuthProps> = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const { loading } = useContext(AuthContext);
  const phoneRef = useRef<ReactNativePhoneInput>(null);

  const onLoginSubmit: FormikConfig<PhoneAuthFormFields>['onSubmit'] = async (
    values: PhoneAuthFormFields,
  ) => {
    console.log("'zxc', 'values'", values);
  };

  const formikConfig: FormikConfig<PhoneAuthFormFields> = {
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema: generateFormSchema(),
    initialValues: {
      nickname: '',
    },
    onSubmit: onLoginSubmit,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ScreenWrapper screenStyle={styles.flex} needInSafeArea={true}>
      <View style={styles.container}>
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

            const isNicknameValue = !!values.nickname.length;
            const isValidNumber = phoneRef?.current?.isValidNumber();
            const isReadyToSubmit = isNicknameValue && isValid && isValidNumber;

            const onSubmit = (event: GestureResponderEvent) => {
              handleSubmit(event as any);
            };

            const setTouched = (field: string) => () => {
              setFieldTouched(field, true);
            };

            return (
              <KeyboardAvoidingView
                enabled
                behavior={isIos ? 'padding' : 'height'}>
                <FormTextInput
                  {...textInputProps.nickname}
                  textInputStyles={[styles.input, styles.borderRect]}
                  errorsMessage={errors.nickname || ''}
                  required={true}
                  title={'Nickname'}
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
                  <PhoneInput
                    ref={phoneRef}
                    initialCountry={'ua'}
                    initialValue={phoneNumber}
                    style={styles.textInput}
                    textStyle={styles.phoneText}
                    onChangePhoneNumber={setPhoneNumber}
                    flagStyle={styles.flagStyle}
                  />
                </View>
                <TouchableOpacity
                  onPress={onSubmit}
                  style={styles.btn}
                  hitSlop={HIT_SLOP_AREA}
                  disabled={!isReadyToSubmit}>
                  <Text style={styles.btnText}>
                    {i18n.t('signInSection.joinNow')}
                  </Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            );
          }}
        </Formik>
      </View>
    </ScreenWrapper>
  );
};
