import * as yup from 'yup';
import { isIos, PHONE_NUMBER_LENGTH } from './constants';
import { FormTextInputType } from '../components/TextInput';
import i18n from './translations';

export function defineSchema(fields: yup.ObjectShape) {
  return yup.object().shape(fields);
}

const errorMessages = {
  required: i18n.t('errors.requiredField'),
  cc: i18n.t('errors.createCard'),
  expDate: i18n.t('errors.expDate'),
  cvv: i18n.t('errors.invalidCvv'),
};

export const zipRegExp = /^\d{5}(?:-\d{4})?$/;

export const regexSchemaPresets = () => {
  return {
    createAccountPassword: yup
      .string()
      .required('Password does not meet minimal requirements')
      .test(
        'test',
        'Password does not meet minimal requirements',
        item => !!item?.match(/(?=.*\d+)(?=.*[A-Za-z$@.!%*#?&]).{7,}/),
      ),
    confirmAccountPassword: yup
      .string()
      .required('Password does not meet minimal requirements')
      .test(
        'test',
        'Password does not meet minimal requirements',
        item => !!item?.match(/(?=.*\d+)(?=.*[A-Za-z$@.!%*#?&]).{7,}/),
      )
      .oneOf([yup.ref('password')], 'Passwords do not match'),
    phone: yup
      .string()
      .matches(/^[+]?[0-9]{1}[0-9 ]{3,20}$/, i18n.t('errors.phone')),
    phone2: yup
      .string()
      .length(PHONE_NUMBER_LENGTH, i18n.t('errors.phoneLength'))
      .matches(/^[0-9]{10}?$/, i18n.t('errors.phone')),
    email: yup.string().matches(
      // tslint:disable-next-line:ter-max-len
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
      'Please enter a valid email address',
    ),
    expDate: yup
      .string()
      .required(errorMessages.required)
      .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, errorMessages.expDate)
      .test('expDate', errorMessages.expDate, value => {
        if (!value) {
          return false;
        }
        const [month, year] = value.split('/');
        const dateString = `${month}/01/${year}`;
        return new Date(dateString).getTime() > new Date(Date.now()).getTime();
      }),
    firstName: () =>
      yup
        .string()
        .required(
          i18n.t('joinNowForm.inputTitles.firstName') +
            ' ' +
            i18n.t('errors.required'),
        )
        .matches(/^[a-z-]+$/i, i18n.t('errors.validationSpecialCharacters')),
    lastName: () =>
      yup
        .string()
        .required(
          i18n.t('joinNowForm.inputTitles.lastName') +
            ' ' +
            i18n.t('errors.required'),
        )
        .matches(/^[a-z-]+$/i, i18n.t('errors.validationSpecialCharacters')),
    emailForm: () =>
      yup
        .string()
        .email()
        .required(
          i18n.t('joinNowForm.inputTitles.email') +
            ' ' +
            i18n.t('errors.required'),
        ),
    city: () =>
      yup
        .string()
        .required(
          i18n.t('joinNowForm.inputTitles.city') +
            ' ' +
            i18n.t('errors.required'),
        )
        .matches(/^[a-z ]+$/i, i18n.t('errors.validationSpecialCharacters')),
    postalCode: () =>
      yup
        .string()
        .required(
          i18n.t('joinNowForm.inputTitles.postalCode') +
            ' ' +
            i18n.t('errors.required'),
        )
        .matches(zipRegExp, i18n.t('errors.zipCodeError')),
    state: () =>
      yup
        .string()
        .required(
          i18n.t('joinNowForm.inputTitles.stateCode') +
            ' ' +
            i18n.t('errors.required'),
        ),
    streetAddress: () =>
      yup
        .string()
        .required(
          i18n.t('joinNowForm.inputTitles.address1') +
            ' ' +
            i18n.t('errors.required'),
        ),
    phoneForm: () =>
      yup
        .string()
        .required(
          i18n.t('joinNowForm.inputTitles.phone') +
            ' ' +
            i18n.t('errors.required'),
        )
        .matches(
          /^[0-9!#$%^*_]+$/i,
          i18n.t('errors.validationSpecialCharacters'),
        )
        .max(10)
        .min(10),
    apt: yup
      .string()
      .matches(
        /^[a-z0-9!#$%^*_ .]+$/i,
        i18n.t('errors.validationSpecialCharacters'),
      ),
    cardName: yup
      .string()
      .trim()
      .required(errorMessages.required)
      .matches(/^[a-z -]+$/i, i18n.t('errors.validationName')),
  };
};

export type FormFieldType =
  | 'phone'
  | 'nickname'
  | 'firstName'
  | 'lastName'
  | 'address1'
  | 'address2'
  | 'city'
  | 'postalCode'
  | 'currentPassword'
  | 'newPassword'
  | 'email'
  | 'cardNumber'
  | 'name'
  | 'expDate'
  | 'securityCode';

export const textInputProps: Record<
  FormFieldType,
  Partial<FormTextInputType>
> = {
  nickname: {
    keyboardType: isIos ? 'name-phone-pad' : 'default',
    textContentType: 'givenName',
    returnKeyType: 'done',
  },
  firstName: {
    keyboardType: isIos ? 'name-phone-pad' : 'default',
    textContentType: 'givenName',
    returnKeyType: 'done',
  },
  lastName: {
    keyboardType: isIos ? 'name-phone-pad' : 'default',
    textContentType: 'familyName',
    returnKeyType: 'done',
  },
  address1: {
    autoComplete: 'street-address',
    keyboardType: 'name-phone-pad',
    textContentType: 'streetAddressLine1',
    returnKeyType: 'done',
  },
  address2: {
    keyboardType: 'default',
    textContentType: 'streetAddressLine2',
    returnKeyType: 'done',
  },
  city: {
    keyboardType: 'default',
    textContentType: 'addressCity',
    returnKeyType: 'done',
  },
  postalCode: {
    autoComplete: 'postal-code',
    keyboardType: 'numeric',
    textContentType: 'postalCode',
    returnKeyType: 'done',
  },
  phone: {
    autoComplete: 'tel',
    keyboardType: 'phone-pad',
    textContentType: 'telephoneNumber',
    returnKeyType: 'done',
  },
  email: {
    autoComplete: 'email',
    keyboardType: 'email-address',
    textContentType: 'emailAddress',
    returnKeyType: 'done',
    autoCapitalize: 'none',
  },
  currentPassword: {
    autoComplete: 'password',
    textContentType: 'password',
    returnKeyType: 'done',
    secureTextEntry: true,
  },
  newPassword: {
    autoComplete: 'password',
    textContentType: 'newPassword',
    returnKeyType: 'done',
    secureTextEntry: true,
  },
  cardNumber: {
    autoComplete: 'cc-number',
    keyboardType: 'numeric',
  },
  name: {
    autoComplete: 'name',
    textContentType: 'givenName',
    keyboardType: 'default',
  },
  expDate: {
    autoComplete: 'cc-exp',
    keyboardType: 'numeric',
  },
  securityCode: {
    autoComplete: 'cc-csc',
    keyboardType: 'numeric',
    secureTextEntry: true,
  },
};
