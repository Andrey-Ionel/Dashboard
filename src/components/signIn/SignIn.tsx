import React, { FC, useContext, useState } from 'react';
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

import { AuthContext } from '../../context/AuthContext';
import { Loading } from '../Loading';
import Image from 'react-native-fast-image';

import {
  commonInputProps,
  SignInComponentProps,
  SignInFormFields,
} from './types';

import i18n from '../../lib/translations';
import { HIT_SLOP_AREA, isIos } from '../../lib/constants';
import { styles } from './styles';

import removeIcon from '../../assets/icons/removeIcon.png';
import phoneIcon from '../../assets/icons/phoneGreen.png';

const generateFormSchema = () =>
  defineSchema({
    email: regexSchemaPresets().email.required(i18n.t('errors.email')),
    password: regexSchemaPresets().createAccountPassword.required(
      i18n.t('errors.password'),
    ),
  });

export const SignIn: FC<SignInComponentProps> = ({ navigation }) => {
  const { login, loading } = useContext(AuthContext);
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
    login(values?.email, values?.password, navigation);
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
                <View style={styles.friendlyUAContainer} />
                <TouchableOpacity
                  onPress={onSubmit}
                  hitSlop={HIT_SLOP_AREA}
                  style={styles.btn}
                  disabled={loading || !isReadyToSubmit}>
                  <Text style={styles.btnText}>
                    {i18n.t('signInSection.submit')}
                  </Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            );
          }}
        </Formik>
        <View style={styles.divider} />
        <TouchableOpacity
          onPress={goToPhoneAuth}
          hitSlop={HIT_SLOP_AREA}
          style={styles.btnPhone}>
          <Image style={styles.btnPhoneIcon} source={phoneIcon} />
          <Text style={styles.btnText}>
            {i18n.t('signInSection.signInWithPhone')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={styles.rowContainer}>
        <Text style={styles.haveAccountText}>
          {i18n.t('signInSection.dontHaveAccount')}
        </Text>
        <TouchableOpacity hitSlop={HIT_SLOP_AREA} onPress={goToJoinNow}>
          <Text style={styles.linkText}>{i18n.t('signInSection.joinNow')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};
