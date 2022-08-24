import { NextPage } from 'next'
import Router from 'next/router'
import { Typography, Container, Grid, TextField, Button,Input,Span } from '@mui/material'
import theme from '../styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import styles from '/src/styles/layout.module.css'

export default function RegisterForm()  {

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    passwordCheck: '',
    nickName: ''
  })

  // 共通化したstate更新処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const [isRevealPassword, setIsRevealPassword] = useState(false);
  
  const togglePassword = (e: React.MouseEvent<HTMLInputElement>) => {
    const value:boolean = e.target.value
    setIsRevealPassword({value});
  }

  const handleClick = () => {
    // ログインAPIにPOSTする処理
  }


  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        rowSpacing={1}
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item xs={12}>
          <Input
            name="email"
            type="text"
            label="email"
            required
          value={formData.email}
          // error={hasNameError}
          onChange={handleChange}
          // helperText={hasNameError ? '名前を入力してください。' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            name="password"
            // type="password"
            type={isRevealPassword ? 'text' : 'password'}
            label="password"
            required
          value={formData.password}
          // error={handleChangePassword}
          onChange={handleChange}
          // helperText={hasNameError ? '名前を入力してください。' : ''}
          />

<span
	onClick={togglePassword}
        role="presentation"
	className={styles.passwordReveal}
    >
      {isRevealPassword ? (
	   <RemoveRedEyeIcon />
      ) : (
        <VisibilityOffIcon />
      )}
     </span>
        </Grid>

        <Grid item xs={12}>
          <Input
            name="passwordCheck"
            // type="password"
            type={isRevealPassword ? 'text' : 'password'}
            label="passwordCheck"
            required
          value={formData.passwordCheck}
          // error={handleChangePassword}
          onChange={handleChange}
          // helperText={hasNameError ? '名前を入力してください。' : ''}
          />

<span
	onClick={togglePassword}
        role="presentation"
	className={styles.passwordReveal}
    >
      {isRevealPassword ? (
	   <RemoveRedEyeIcon />
      ) : (
        <VisibilityOffIcon />
      )}
     </span>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
          // onClick={() => handleLink('./search/searchResult')}
          >
            登録
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
          // onClick={() => handleLink('./search/searchResult')}
          >
            Top
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default Home
