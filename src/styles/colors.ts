export interface Theme {
  // Separator
  separatorPrimary: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textError: string;
  textPopover: string;
}

export const lightMode: Theme = {
  // Separator
  separatorPrimary: '#999999',

  // Text
  textPrimary: '#141414',
  textSecondary: '#fff',
  textError: '#CC0000',
  textPopover: '#231F20',
};

export default lightMode;
