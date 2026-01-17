import { createTheme } from '@mui/material/styles';

const modernLuxeTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#111827', 
      contrastText: '#fff', 
    },
    secondary: {
      main: '#D6A76C', 
    },
    background: {
      default: '#F4F4F5', 
      paper: '#FFFFFF',  
    },
    text: {
      primary: '#0B1220', 
      secondary: '#7B7F88', 
    },
  },
  typography: {
    fontFamily:'Poppins, sans-serif ',
  },
  shape: {
    borderRadius: 14,
  },
});

export default modernLuxeTheme;
