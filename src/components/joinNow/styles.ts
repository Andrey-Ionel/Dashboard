import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import { fonts } from '../../styles/fonts';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  borderRect: {
    borderRadius: 0,
  },
  input: {
    paddingTop: 15,
    paddingBottom: 10,
    lineHeight: 17,
  },
  imageWrapperStyle: {
    position: 'absolute',
    right: 15,
    top: 13,
  },
  imageStyles: {
    height: 30,
    width: 30,
  },
  passwordInput: {
    paddingRight: 95,
  },
  passwordContainer: {
    marginBottom: 25,
  },
  friendlyUAContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 2,
  },
  btn: {
    borderRadius: 0,
    backgroundColor: colors.backgroundPrimary,
    padding: 15,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '100%',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 18,
    fontFamily: fonts.ghotamBlack,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  iconWrapperStyle: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 15,
    top: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWithButton: {
    right: 60,
  },
  iconStyles: {
    width: 25,
    height: 25,
  },
  showWrapperStyle: {
    width: 40,
    height: 30,
    position: 'absolute',
    right: 15,
    top: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showText: {
    fontFamily: fonts.bebasNeue,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 15,
  },
  joinNowBtn: {
    marginTop: 15,
  },
  errorIcon: {
    height: 12,
    width: 13,
    bottom: 2,
  },
  errorMessage: {
    fontFamily: fonts.gotham,
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 13,
    letterSpacing: 0.5,
  },
  clearEmail: {
    right: 15,
  },
  errorNotification: {
    marginBottom: 20,
  },
  flex: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  divider: {
    height: 2,
    width: '100%',
    backgroundColor: colors.dividerBackground,
  },
});
