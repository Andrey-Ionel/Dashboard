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
import { Loading } from '../Loading';
import { AuthContext } from '../../context/AuthContext';

import {
  defineSchema,
  regexSchemaPresets,
  textInputProps,
} from '../../lib/formikPresets';
import i18n from '../../lib/translations';
import { HIT_SLOP_AREA, isIos } from '../../lib/constants';

import { commonInputProps, JoinNowProps, JoinNowFormFields } from './types';

import removeIcon from '../../assets/icons/removeIcon.png';
import { styles } from './styles';

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
  const { createNewAccount, loading } = useContext(AuthContext);

  const onFocus = (field: string) => () => {
    if (field === 'password') {
      setShowRemove(true);
    } else {
      setShowConfirmRemove(true);
    }
  };

  const goToSignIn = (): void => {
    navigation.navigate('SignIn');
  };

  const onPressIconPassword =
    (setFieldValue: (field: string, value: any) => void, field: string) =>
    (): void => {
      if (field === 'password') {
        setFieldValue('password', '');
        setShowRemove(false);
      } else {
        setFieldValue('confirmPassword', '');
        setShowConfirmRemove(false);
      }
    };

  const onPressShowButton = (field: string) => () => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const onLoginSubmit: FormikConfig<JoinNowFormFields>['onSubmit'] = async (
    values: JoinNowFormFields,
  ) => {
    createNewAccount(
      values?.email,
      values?.password,
      values?.nickname,
      navigation,
    );
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

  if (loading) {
    return <Loading />;
  }

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

            const setTouched = (field: string) => () => {
              setFieldTouched(field, true);
            };

            const onBlur = (password: string, field: string) => (): void => {
              if (field === 'password') {
                if (!password?.length) {
                  setShowRemove(false);
                }
                setFieldTouched('password', true);
              } else {
                if (!password?.length) {
                  setShowConfirmRemove(false);
                }
                setFieldTouched('confirmPassword', true);
              }
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
                  title={i18n.t('inputTitles.nickname')}
                  formFieldName={'nickname'}
                  setFormikField={setFieldValue}
                  value={values.nickname}
                  touched={!!touched.nickname}
                  imageWrapperStyle={styles.iconWrapperStyle}
                  {...commonInputProps}
                  imageStyles={styles.imageStyles}
                  onBlur={setTouched('nickname')}
                />
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
                  onBlur={setTouched('email')}
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
                  onFocus={onFocus('password')}
                  onBlur={onBlur(values.password, 'password')}
                  iconPress={onPressIconPassword(setFieldValue, 'password')}
                  innerButton={isPasswordValue}
                  innerButtonText={
                    !showPassword
                      ? i18n.t('signInSection.show')
                      : i18n.t('signInSection.hide')
                  }
                  innerButtonWrapperStyle={styles.showWrapperStyle}
                  innerButtonTextStyle={styles.showText}
                  innerButtonPress={onPressShowButton('password')}
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
                  title={i18n.t('inputTitles.confirmPassword')}
                  onFocus={onFocus('confirmPassword')}
                  onBlur={onBlur(values.confirmPassword, 'confirmPassword')}
                  iconPress={onPressIconPassword(
                    setFieldValue,
                    'confirmPassword',
                  )}
                  innerButton={isConfirmPasswordValue}
                  innerButtonText={
                    !showConfirmPassword
                      ? i18n.t('signInSection.show')
                      : i18n.t('signInSection.hide')
                  }
                  innerButtonWrapperStyle={styles.showWrapperStyle}
                  innerButtonTextStyle={styles.showText}
                  innerButtonPress={onPressShowButton('confirmPassword')}
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
      <View style={styles.divider} />
      <View style={styles.rowContainer}>
        <Text style={styles.haveAccountText}>
          {i18n.t('signInSection.haveAccount')}
        </Text>
        <TouchableOpacity hitSlop={HIT_SLOP_AREA} onPress={goToSignIn}>
          <Text style={styles.linkText}>{i18n.t('signInSection.signIn')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};
