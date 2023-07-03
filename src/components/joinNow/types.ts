import { styles } from './styles';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

export const commonInputProps = {
  errorIconStyle: styles.errorIcon,
  errorMessageStyle: styles.errorMessage,
  importantForAutofill: 'yes' as const,
};

export interface JoinNowFormFields {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface JoinNowProps {
  navigation: NavigationProp<ParamListBase>;
}
