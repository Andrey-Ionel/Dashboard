import React, { FC, useContext, useState } from 'react';
import {
  GestureResponderEvent,
  KeyboardAvoidingView,
  View,
} from 'react-native';

import { Formik, FormikConfig, FormikProps } from 'formik';
import FormTextInput from '../TextInput';
import { ScreenWrapper } from '../ScreenWrapper';
import { Header } from '../Header';
import { Button } from '../Button';
import { Footer } from '../Footer';
import { Loading } from '../Loading';
import { AuthContext } from '../../context/AuthContext';

import {
  defineSchema,
  regexSchemaPresets,
  textInputProps,
} from '../../lib/formikPresets';

import {
  commonInputProps,
  SignInComponentProps,
  SignInFormFields,
} from './types';

import i18n from '../../lib/translations';
import { isIos } from '../../lib/constants';
import { styles } from './styles';

import removeIcon from '../../assets/icons/removeIcon.png';
import phoneIcon from '../../assets/icons/phoneGreen.png';
import googleIcon from '../../assets/icons/googleIcon.png';

const generateFormSchema = () =>
  defineSchema({
    email: regexSchemaPresets().email.required(i18n.t('errors.email')),
    password: regexSchemaPresets().createAccountPassword.required(
      i18n.t('errors.password'),
    ),
  });

export const SignIn: FC<SignInComponentProps> = ({ navigation }) => {
  const { login, loading, loginWithGoogle } = useContext(AuthContext);
  const [showRemove, setShowRemove] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onFocusPassword = (): void => {
    setShowRemove(true);
  };

  const onBlurPassword = (password?: string) => (): void => {
    if (!password?.length) {
      setShowRemove(false);
    }
  };

  const onPressIconPassword =
    (setFieldValue: (field: string, value: any) => void) => (): void => {
      setFieldValue('password', '');
      setShowRemove(false);
    };

  const onPressShowButton = (): void => {
    setShowPassword(!showPassword);
  };

  const goToJoinNow = (): void => {
    navigation.navigate('JoinNow');
  };

  const goToPhoneAuth = (): void => {
    navigation.navigate('PhoneAuth');
  };

  const onLoginSubmit: FormikConfig<SignInFormFields>['onSubmit'] = async (
    values: SignInFormFields,
  ) => {
    login(values?.email, values?.password);
  };

  const formikConfig: FormikConfig<SignInFormFields> = {
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema: generateFormSchema(),
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: onLoginSubmit,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ScreenWrapper
      screenStyle={styles.flex}
      needInSafeArea={true}
      fixedComponentTop={<Header title={'signIn'} />}>
      <View style={styles.container}>
        <Formik {...formikConfig}>
          {(props: FormikProps<SignInFormFields>) => {
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

            const setEmailTouched = () => {
              setFieldTouched('email', true);
            };

            return (
              <KeyboardAvoidingView
                enabled
                behavior={isIos ? 'padding' : 'height'}>
                <FormTextInput
                  {...textInputProps.email}
                  textInputStyles={[styles.input, styles.borderRect]}
                  errorsMessage={errors.email || ''}
                  required={true}
                  title={i18n.t('inputTitles.emailAddress')}
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
                  title={i18n.t('inputTitles.password')}
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
                <View style={styles.friendlyUAContainer} />
                <Button
                  title={i18n.t('signInSection.submit')}
                  onPress={onSubmit}
                  disabled={loading || !isReadyToSubmit}
                  btnStyle={styles.btn}
                  textStyle={styles.btnText}
                />
              </KeyboardAvoidingView>
            );
          }}
        </Formik>
        <View style={styles.divider} />
        <Button
          title={i18n.t('signInSection.signInWithPhone')}
          onPress={goToPhoneAuth}
          icon={phoneIcon}
          btnStyle={styles.btnPhone}
          textStyle={styles.btnText}
          imageStyle={styles.btnPhoneIcon}
        />
        <Button
          title={i18n.t('signInSection.signInWithGoogle')}
          onPress={loginWithGoogle}
          icon={googleIcon}
          btnStyle={styles.btnGoogle}
          textStyle={styles.btnText}
          imageStyle={styles.btnGoogleIcon}
        />
      </View>
      <Footer
        onPress={goToJoinNow}
        text={i18n.t('signInSection.dontHaveAccount')}
        linkText={i18n.t('signInSection.joinNow')}
      />
    </ScreenWrapper>
  );
};
