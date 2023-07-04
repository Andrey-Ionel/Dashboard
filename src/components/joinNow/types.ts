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

export interface UserMetadata {
  /**
   * Returns the timestamp at which this account was created as dictated by the server clock
   * as an ISO Date string.
   */
  creationTime?: string;
  /**
   * Returns the last signin timestamp as dictated by the server clock as an ISO Date string.
   * This is only accurate up to a granularity of 2 minutes for consecutive sign-in attempts.
   */
  lastSignInTime?: string;
}

export interface UserInfo {
  /**
   * Returns the user's display name, if available.
   */
  displayName?: string;
  /**
   * Returns the email address corresponding to the user's account in the specified provider, if available.
   */
  email?: string;
  /**
   * The phone number normalized based on the E.164 standard (e.g. +16505550101) for the current user. This is null if the user has no phone credential linked to the account.
   */
  phoneNumber?: string;
  /**
   * Returns a url to the user's profile picture, if available.
   */
  photoURL?: string;
  /**
   * Returns the unique identifier of the provider type that this instance corresponds to.
   */
  providerId: string;
  /**
   * Returns a string representing the multi-tenant tenant id. This is null if the user is not associated with a tenant.
   */
  tenantId?: string;
  /**
   * Returns a user identifier as specified by the authentication provider.
   */
  uid: string;
}

export enum FactorId {
  PHONE = 'phone',
}

export interface MultiFactorInfo {
  /**
   * User friendly name for this factor.
   */
  displayName?: string;
  /**
   * Time the second factor was enrolled, in UTC.
   */
  enrollmentTime: string;
  /**
   * Type of factor.
   */
  factorId: FactorId;
  /**
   * Unique id for this factor.
   */
  uid: string;
}

export interface MultiFactor {
  enrolledFactors: MultiFactorInfo[];
}

export interface User {
  /**
   * The user's display name (if available).
   */
  displayName: string | null;
  /**
   * - The user's email address (if available).
   */
  email: string | null;
  /**
   * - True if the user's email address has been verified.
   */
  emailVerified: boolean;
  /**
   * Returns true if the user is anonymous; that is, the user account was created with
   * {@link auth#signInAnonymously} and has not been linked to another account
   * with {@link auth#linkWithCredential}.
   */
  isAnonymous: boolean;

  /**
   * Returns the {@link auth.UserMetadata} associated with this user.
   */
  metadata: UserMetadata;

  /**
   * Returns the {@link auth.MultiFactor} associated with this user.
   */
  multiFactor: MultiFactor | null;

  /**
   * Returns the phone number of the user, as stored in the Firebase project's user database,
   * or null if none exists. This can be updated at any time by calling {@link auth.User#updatePhoneNumber}.
   */
  phoneNumber: string | null;

  /**
   * The URL of the user's profile picture (if available).
   */
  photoURL: string | null;

  /**
   * Additional provider-specific information about the user.
   */
  providerData: UserInfo[];

  /**
   *  The authentication provider ID for the current user.
   *  For example, 'facebook.com', or 'google.com'.
   */
  providerId: string;

  /**
   *  - The user's unique ID.
   */
  uid: string;
}
