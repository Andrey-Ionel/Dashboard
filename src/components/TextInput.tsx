import React, { FC, useCallback, useState } from 'react';
import {
  ReturnKeyTypeOptions,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Image, {
  ImageStyle,
  Source as ImageURISource,
} from 'react-native-fast-image';

import i18n from '../lib/translations';
import { HIT_SLOP_AREA, logError } from '../lib/constants';

import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { TextInputEndEditingEventData } from 'react-native/Libraries/Components/TextInput/TextInput';

import colors from '../styles/colors';
import { fonts } from '../styles/fonts';

import warning from '../assets/icons/warning.png';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    marginBottom: 30,
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
  textInputContainer: {
    width: '100%',
  },
  textInput: {
    width: '100%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    fontWeight: '500',
    fontSize: 17,
    lineHeight: 13,
    color: colors.textPopover,
    borderWidth: 1,
    borderColor: colors.separatorPrimary,
    paddingHorizontal: 20,
  },
  textInputError: {
    borderWidth: 2,
    borderColor: colors.textError,
  },
  activeInput: {
    borderWidth: 2,
  },
  errorMessage: {
    fontFamily: fonts.gotham,
    marginTop: 1,
    color: colors.textError,
    marginRight: 20,
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  errorIcon: {
    marginRight: 5,
    height: 12,
    width: 13,
    bottom: 2,
  },
});

export interface FormTextInputType extends Omit<TextInputProps, 'style'> {
  formFieldName: string;
  errorsMessage?: string;
  required?: boolean;
  requiredSymbol?: string;
  title?: string;
  innerButtonText?: string;
  placeholder?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  overwriteHandleChange?: boolean;
  setFormikField?: (
    field: string,
    value: any,
    shouldValidate?: boolean,
  ) => void;
  iconPress?: (value: any) => void;
  iconPressDisable?: boolean;
  iconUrl?: ImageURISource;
  errorIcon?: ImageURISource;
  containerStyles?: StyleProp<ViewStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  titleStyles?: StyleProp<TextStyle>;
  titleErrorStyles?: StyleProp<TextStyle>;
  requiredSymbolStyles?: StyleProp<TextStyle>;
  requiredSymbolErrorStyles?: StyleProp<TextStyle>;
  errorMessageStyle?: StyleProp<TextStyle>;
  placeholderStyles?: StyleProp<TextStyle>;
  innerButtonTextStyle?: StyleProp<TextStyle>;
  textInputContainerStyles?: StyleProp<TextStyle>;
  textInputStyles?: StyleProp<TextStyle>;
  textInputErrorStyles?: StyleProp<ViewStyle>;
  activeInputStyles?: StyleProp<ViewStyle>;
  imageWrapperStyle?: StyleProp<ViewStyle>;
  imageStyles?: StyleProp<ImageStyle>;
  errorContainerStyle?: StyleProp<ViewStyle>;
  errorIconStyle?: StyleProp<ImageStyle>;
  innerButton?: boolean;
  innerButtonWrapperStyle?: StyleProp<ViewStyle>;
  innerButtonPress?: (value: string) => void;
  mask?: string;
  submitForm?: () => Promise<void>;
  disabledValidateOnTouch?: boolean;
  touched?: boolean;
  innerButtonDisabled?: boolean;
  keyboardReturnKeyType?: ReturnKeyTypeOptions;
  accessibilityText?: string;
}

const TEXT_VARIABLES = {
  expDate: 'expDate',
  cardNumber: 'cardNumber',
  default: 'default',
};

type TextInputPropsOmit = Omit<TextInputProps, 'onChangeText'>;

// tslint:disable-next-line:cyclomatic-complexity
const FormTextInput: FC<FormTextInputType> = props => {
  const {
    title,
    containerStyles,
    titleStyles,
    titleErrorStyles,
    titleContainerStyle,
    requiredSymbolStyles,
    requiredSymbolErrorStyles,
    iconUrl,
    placeholder,
    textInputContainerStyles,
    textInputStyles,
    textInputErrorStyles,
    required,
    requiredSymbol,
    imageStyles,
    onBlur,
    onFocus,
    overwriteHandleChange,
    activeInputStyles,
    imageWrapperStyle,
    iconPress,
    keyboardType,
    keyboardReturnKeyType,
    errorsMessage,
    errorMessageStyle,
    maxLength,
    innerButton,
    errorIcon,
    errorContainerStyle,
    errorIconStyle,
    innerButtonPress,
    innerButtonWrapperStyle,
    innerButtonText,
    setFormikField,
    formFieldName,
    value,
    innerButtonTextStyle,
    defaultValue,
    disabledValidateOnTouch,
    iconPressDisable,
    touched,
    innerButtonDisabled,
    accessibilityText,
  } = props;
  const [inputValue, setInputValue] = useState<string>(defaultValue || '');
  const [activeInput, setActiveInput] = useState<boolean>(false);

  const touchedValidation: boolean = !disabledValidateOnTouch
    ? !!touched
    : true;

  const isError = !!errorsMessage && touchedValidation;

  const formatZip = (zipCode: string): string => {
    if (zipCode.length > 5) {
      const trimmed = zipCode.replace(/-/g, '');
      return `${trimmed.substring(0, 5)}-${trimmed.substring(5)}`;
    } else {
      return zipCode;
    }
  };

  // @note(handleChange) text only
  const handleChange = (text: string): void => {
    if (!overwriteHandleChange) {
      if (formFieldName === 'postalCode') {
        setInputValue(formatZip(text));
        setFormikField?.(formFieldName, formatZip(text));
      } else {
        setInputValue(text);
        setFormikField?.(formFieldName, text);
      }
    }
  };

  const handlePressInnerButton = async () => {
    if (innerButtonPress) {
      innerButtonPress(inputValue || '');
    }
    if (props.submitForm) {
      props.submitForm().catch(e => logError(e));
    }
  };

  const handleFocus = () => {
    setActiveInput(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setActiveInput(false);
    onBlur?.();
  };

  const handleEndEditing: TextInputProps['onEndEditing'] = useCallback(
    (event: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
      const text =
        props.autoComplete === 'password'
          ? event.nativeEvent.text
          : event.nativeEvent.text.trim();

      setFormikField?.(formFieldName, text);

      props.onEndEditing?.({
        ...event,
        nativeEvent: {
          ...event.nativeEvent,
          text,
        },
      });
    },
    [props, setFormikField, formFieldName],
  );

  const keyboardTypeValue = keyboardType || (TEXT_VARIABLES.default as any);
  const returnKeyType = keyboardReturnKeyType ?? 'default';
  const isPasswordInput = formFieldName.toLowerCase().includes('password');

  return (
    <View style={[styles.container, containerStyles]}>
      {!!title && (
        <View style={[styles.titleContainer, titleContainerStyle]}>
          {!!required && (
            <Text
              style={[
                styles.requiredSymbol,
                requiredSymbolStyles,
                isError && styles.requiredSymbolError,
                isError && requiredSymbolErrorStyles,
              ]}>
              {requiredSymbol || i18n.t('inputTitles.required')}
            </Text>
          )}
          <Text
            style={[
              styles.title,
              titleStyles,
              isError && styles.titleError,
              isError && titleErrorStyles,
            ]}>
            {title}
          </Text>
        </View>
      )}
      <View style={[styles.textInputContainer, textInputContainerStyles]}>
        <TextInput
          accessibilityLabel={`${i18n.t('accessibility.pleaseEnter')} ${
            accessibilityText || title
          }`}
          style={[
            styles.textInput,
            activeInput && styles.activeInput,
            activeInputStyles,
            textInputStyles,
            isError && styles.textInputError,
            isError && textInputErrorStyles,
          ]}
          keyboardType={keyboardTypeValue}
          returnKeyType={returnKeyType}
          value={value}
          maxLength={maxLength}
          onEndEditing={handleEndEditing}
          placeholder={placeholder}
          autoCapitalize={'none'}
          {...(props as TextInputPropsOmit)}
          onBlur={handleBlur}
          onChangeText={handleChange}
          onFocus={handleFocus}
        />
        {!!iconUrl && (
          <TouchableOpacity
            hitSlop={HIT_SLOP_AREA}
            style={imageWrapperStyle}
            onPress={iconPress}
            disabled={!!iconPressDisable}>
            <Image source={iconUrl} style={imageStyles} />
          </TouchableOpacity>
        )}
        {!!innerButton && (
          <TouchableOpacity
            style={innerButtonWrapperStyle}
            hitSlop={HIT_SLOP_AREA}
            onPress={handlePressInnerButton}
            disabled={
              innerButtonDisabled || isPasswordInput ? false : !!errorsMessage
            }>
            <Text style={innerButtonTextStyle}>{innerButtonText}</Text>
          </TouchableOpacity>
        )}
      </View>
      {isError && (
        <View style={[styles.errorContainer, errorContainerStyle]}>
          <Image
            source={errorIcon || warning}
            style={[styles.errorIcon, errorIconStyle]}
          />
          <Text style={[styles.errorMessage, errorMessageStyle]}>
            {errorsMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default FormTextInput;
