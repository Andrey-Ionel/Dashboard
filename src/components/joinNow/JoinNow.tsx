import React, { FC, useState } from 'react';
import {
  GestureResponderEvent,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Formik, FormikConfig, FormikProps } from 'formik';
import FormTextInput from '../TextInput';
import { ScreenWrapper } from '../ScreenWrapper';
import { Header } from '../Header';

import {
  defineSchema,
  regexSchemaPresets,
  textInputProps,
} from '../../lib/formikPresets';
import i18n from '../../lib/translations';
import { isIos } from '../../lib/constants';

import { commonInputProps, JoinNowProps, JoinNowFormFields } from './types';

import removeIcon from '../../assets/icons/removeIcon.png';
import { styles } from '../signIn';

const generateFormSchema = () =>
  defineSchema({
    nickname: regexSchemaPresets()
      .firstName()
      .required(i18n.t('errors.nickname')),
    email: regexSchemaPresets().email.required(i18n.t('errors.email')),
    password: regexSchemaPresets().createAccountPassword.required(
      i18n.t('errors.password'),
    ),
    confirmPassword: regexSchemaPresets().confirmAccountPassword.required(
      i18n.t('errors.password'),
    ),
  });

export const JoinNow: FC<JoinNowProps> = ({ navigation }) => {
  const [showRemove, setShowRemove] = useState<boolean>(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const onFocusPassword = (): void => {
    setShowRemove(true);
  };

  const onFocusConfirmPassword = (): void => {
    setShowConfirmRemove(true);
  };

  const goToSignIn = (): void => {
    navigation.navigate('SignIn');
  };

  const onPressIconPassword =
    (setFieldValue: (field: string, value: any) => void) => (): void => {
      setFieldValue('password', '');
      setShowRemove(false);
    };

  const onPressIconConfirmPassword =
    (setFieldValue: (field: string, value: any) => void) => (): void => {
      setFieldValue('confirmPassword', '');
      setShowConfirmRemove(false);
    };

  const onPressShowButton = (): void => {
    setShowPassword(!showPassword);
  };

  const onPressShowConfirmButton = (): void => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onLoginSubmit: FormikConfig<JoinNowFormFields>['onSubmit'] = async (
    values: JoinNowFormFields,
  ) => {
    console.log("'zxc', 'values'", values);
  };

  const formikConfig: FormikConfig<JoinNowFormFields> = {
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema: generateFormSchema(),
    initialValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: onLoginSubmit,
  };

  return (
    <ScreenWrapper
      screenStyle={styles.flex}
      needInSafeArea={true}
      fixedComponentTop={<Header title={'joinNow'} />}>
      <View style={styles.container}>
        <Formik {...formikConfig}>
          {(props: FormikProps<JoinNowFormFields>) => {
            const {
              handleSubmit,
              setFieldValue,
              errors,
              values,
              touched,
              setFieldTouched,
              isValid,
            } = props;

            const isPasswordValue = !!values.password.length;
            const isConfirmPasswordValue = !!values.confirmPassword.length;
            const isReadyToSubmit = isPasswordValue && isValid;

            const onSubmit = (event: GestureResponderEvent) => {
              handleSubmit(event as any);
            };

            const handleEmailChange = (
              field: string,
              value: any,
              shouldValidate?: boolean,
            ) => {
              return setFieldValue(field, value, shouldValidate);
            };

            const setNicknameTouched = () => {
              setFieldTouched('nickname', true);
            };

            const setEmailTouched = () => {
              setFieldTouched('email', true);
            };

            const onBlurPassword = (password?: string) => (): void => {
              if (!password?.length) {
                setShowRemove(false);
              }
              setFieldTouched('password', true);
            };

            const onBlurConfirmPassword =
              (confirmPassword?: string) => (): void => {
                if (!confirmPassword?.length) {
                  setShowConfirmRemove(false);
                }
                setFieldTouched('confirmPassword', true);
              };

            return (
              <KeyboardAvoidingView
                enabled
                behavior={isIos ? 'padding' : 'height'}>
                <FormTextInput
                  {...textInputProps.email}
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
                  imageStyles={styles.imageStyles}
                  onBlur={setNicknameTouched}
                />
                <FormTextInput
                  {...textInputProps.email}
                  textInputStyles={[styles.input, styles.borderRect]}
                  errorsMessage={errors.email || ''}
                  required={true}
                  title={'Email Address'}
                  formFieldName={'email'}
                  setFormikField={handleEmailChange}
                  value={values.email}
                  touched={!!touched.email}
                  imageWrapperStyle={[
                    styles.iconWrapperStyle,
                    styles.clearEmail,
                  ]}
                  {...commonInputProps}
                  imageStyles={styles.imageStyles}
                  onBlur={setEmailTouched}
                />
                <FormTextInput
                  {...textInputProps.currentPassword}
                  containerStyles={styles.passwordContainer}
                  textInputStyles={[styles.borderRect, styles.passwordInput]}
                  errorsMessage={errors.password || ''}
                  required={true}
                  iconUrl={showRemove && removeIcon}
                  imageWrapperStyle={[
                    styles.iconWrapperStyle,
                    isPasswordValue && styles.iconWithButton,
                  ]}
                  imageStyles={styles.iconStyles}
                  title={'Password'}
                  onFocus={onFocusPassword}
                  onBlur={onBlurPassword(values.password)}
                  iconPress={onPressIconPassword(setFieldValue)}
                  innerButton={isPasswordValue}
                  innerButtonText={
                    !showPassword
                      ? i18n.t('signInSection.show')
                      : i18n.t('signInSection.hide')
                  }
                  innerButtonWrapperStyle={styles.showWrapperStyle}
                  innerButtonTextStyle={styles.showText}
                  innerButtonPress={onPressShowButton}
                  setFormikField={setFieldValue}
                  value={values.password}
                  secureTextEntry={!showPassword}
                  touched={!!touched.password}
                  formFieldName={'password'}
                  {...commonInputProps}
                />
                <FormTextInput
                  {...textInputProps.currentPassword}
                  containerStyles={styles.passwordContainer}
                  textInputStyles={[styles.borderRect, styles.passwordInput]}
                  errorsMessage={errors.confirmPassword || ''}
                  required={true}
                  iconUrl={showConfirmRemove && removeIcon}
                  imageWrapperStyle={[
                    styles.iconWrapperStyle,
                    isConfirmPasswordValue && styles.iconWithButton,
                  ]}
                  imageStyles={styles.iconStyles}
                  title={'Confirm Password'}
                  onFocus={onFocusConfirmPassword}
                  onBlur={onBlurConfirmPassword(values.confirmPassword)}
                  iconPress={onPressIconConfirmPassword(setFieldValue)}
                  innerButton={isConfirmPasswordValue}
                  innerButtonText={
                    !showConfirmPassword
                      ? i18n.t('signInSection.show')
                      : i18n.t('signInSection.hide')
                  }
                  innerButtonWrapperStyle={styles.showWrapperStyle}
                  innerButtonTextStyle={styles.showText}
                  innerButtonPress={onPressShowConfirmButton}
                  setFormikField={setFieldValue}
                  value={values.confirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  touched={!!touched.confirmPassword}
                  formFieldName={'confirmPassword'}
                  {...commonInputProps}
                />
                <TouchableOpacity
                  onPress={onSubmit}
                  style={styles.btn}
                  disabled={!isReadyToSubmit}>
                  <Text style={styles.btnText}>
                    {i18n.t('signInSection.joinNow')}
                  </Text>
                </TouchableOpacity>
                <View style={styles.rowContainer}>
                  <Text style={styles.haveAccountText}>
                    {i18n.t('signInSection.haveAccount')}
                  </Text>
                  <TouchableOpacity onPress={goToSignIn}>
                    <Text style={styles.linkText}>
                      {i18n.t('signInSection.signIn')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            );
          }}
        </Formik>
      </View>
    </ScreenWrapper>
  );
};
