import React, { FC, useState } from 'react';
import {
  GestureResponderEvent,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Formik, FormikConfig, FormikProps } from 'formik';
import * as yup from 'yup';
import FormTextInput from '../TextInput';
import { ScreenWrapper } from '../ScreenWrapper';
import { SignInHeader } from './SignInHeader';

import {
  defineSchema,
  regexSchemaPresets,
  textInputProps,
} from '../../lib/formikPresets';
import i18n from '../../lib/translations';
import { isIos } from '../../lib/constants';

import {
  commonInputProps,
  SignInComponentProps,
  SignInFormFields,
} from './types';

import removeIcon from '../../assets/icons/removeIcon.png';
import { styles } from './styles';

const generateFormSchema = () =>
  defineSchema({
    email: regexSchemaPresets().email.required(i18n.t('errors.email')),
    password: yup.string().required(i18n.t('errors.password')),
  });

export const SignInComponent: FC<SignInComponentProps> = ({
  onForgotPassword,
  email,
  loading,
}) => {
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

  const goToForgotPassword = (): void => {
    onForgotPassword?.();
  };

  const onLoginSubmit: FormikConfig<SignInFormFields>['onSubmit'] = async (
    values: SignInFormFields,
  ) => {
    console.log("'zxc', 'values'", values);
  };

  const formikConfig: FormikConfig<SignInFormFields> = {
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema: generateFormSchema(),
    initialValues: {
      email: email || '',
      password: '',
    },
    onSubmit: onLoginSubmit,
  };

  return (
    <ScreenWrapper
      screenStyle={styles.flex}
      needInSafeArea={true}
      fixedComponentTop={<SignInHeader />}>
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
                <View style={styles.friendlyUAContainer}>
                  <TouchableOpacity onPress={goToForgotPassword}>
                    <Text style={styles.forgotText}>
                      {/*{i18n.string(keys.signInSection.forgotPassword)}*/}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={onSubmit}
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
      </View>
    </ScreenWrapper>
  );
};
