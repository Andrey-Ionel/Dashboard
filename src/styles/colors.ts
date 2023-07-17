export interface Theme {
  // Background
  systemBackgroundGradient: string[];
  backgroundPrimary: string;
  backgroundSecondary: string;
  dividerBackground: string;
  greenBackground: string;

  // Separator
  separatorPrimary: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textError: string;
  textPopover: string;
  link: string;
}

export const lightMode: Theme = {
  // Background
  systemBackgroundGradient: ['#fff', '#EBEBEB', '#CDCDCD', '#828C91'],
  backgroundPrimary: '#141414',
  backgroundSecondary: '#fff',
  dividerBackground: '#EBEBEB',
  greenBackground: '#367c55',

  // Separator
  separatorPrimary: '#999999',

  // Text
  textPrimary: '#141414',
  textSecondary: '#fff',
  textError: '#CC0000',
  textPopover: '#231F20',
  link: '#033654',
};

export default lightMode;
