import { styles } from './styles';

export const commonInputProps = {
  errorIconStyle: styles.errorIcon,
  errorMessageStyle: styles.errorMessage,
  importantForAutofill: 'yes' as const,
};

export interface SignInFormFields {
  email: string;
  password: string;
}

export interface SignInComponentProps {
  onForgotPassword?: () => void;
  onError?: (value: string) => void;
  onUsernameChange?: (value: string) => void;
  email?: string;
  loading?: boolean;
}
