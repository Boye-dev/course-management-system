import { createTheme } from '@mantine/core';
import { generateColors } from '@mantine/colors-generator';

export const theme = createTheme({
  colors: {
    brand: generateColors('#004282'),
    brandSecondary: generateColors('#DBBE50'),
  },
  fontFamily: 'Roboto, sans-serif',
  primaryColor: 'brand',
  primaryShade: 9,
  breakpoints: {
    xs: '20em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
});
