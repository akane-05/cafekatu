import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#CC74AB',
    },
    secondary: {
      main: '#A68897',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: ['Kaisei Decol'].join(','),
    button: {
      textTransform: 'none',
    },
  },
})

export default theme
