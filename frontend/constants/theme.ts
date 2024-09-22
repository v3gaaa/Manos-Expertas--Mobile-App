import { Platform } from 'react-native';

export const Theme = {
  colors: {
    bgColor: '#F5F5F5',
    white: '#FFFFFF',
    black: '#000000',
    green: '#14A436',
    grey: '#C0C0C0',
    almostWhite: '#E5E5E5',
    babyGrey: '#707070',
    bamxRed: '#E62D45',
    bamxGreen: '#14A436',
    bamxYellow: '#FCC307',
    bamxGrey: '#53575A',
    bamxBbyYellow: 'FCC307',
  },
  size: {
    xs: 14,
    sm: 16,
    ms: 18,
    md: 20,
    aftm: 22,
    lg: 25,
    xl: 40,
    h1: 35,
    h2: 30,
  },
  fontsWeight: {
    medium: '500',
    semibold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  },
  shadows: Platform.select({
    web: {
      boxShadow: '0px 2px 5px rgba(128, 128, 128, 0.3)',
    },
    default: {
      shadowColor: '#808080',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
  }),
};