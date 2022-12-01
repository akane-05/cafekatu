import { ReactElement } from 'react'
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import SearchIcon from '@mui/icons-material/Search'
import { styled, alpha } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import * as React from 'react'
import { path } from '@/const/Consts'
import { useRouter } from 'next/router'
import * as Dialog from '@/context/MessageDialog'
import { useSetRecoilState, RecoilRoot } from 'recoil'
import { haveTokenState } from '@/globalStates/haveToken'
import { logout } from '@/features/login/api/logout'
import { useHaveToken } from '@/hooks/useHaveToken'

export default function Header() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  )
  const settings = ['マイページ', 'ログアウト']
  const router = useRouter()
  const dialog = Dialog.useDialogContext()
  const setHaveToken = useSetRecoilState(haveTokenState)
  const { haveToken, isAuthChecking } = useHaveToken()
  const visibility = haveToken ? 'visible' : 'hidden'

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleClickUserMenu = async (setting: string) => {
    if (setting == settings[0]) {
      setAnchorElUser(null)
      handleLink('マイページ')
    } else if (setting == settings[1]) {
      await dialog
        .confirm(Dialog.confirmDialog('ログアウトしますか？'))
        .then(() => {
          setAnchorElUser(null)
          logout()
          setHaveToken(false)
          dialog.confirm(Dialog.apiOKDialog('ログアウトしました！'))
          handleLink(path.top)
        })
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push({
      pathname: path.cafesList,
      query: { searchWord: searchWord },
    })
  }

  const handleLink = (path: string) => {
    router.push(path)
  }

  let searchWord: string
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    searchWord = e.target.value
  }

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }))

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }))

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }))

  return (
    <AppBar position="static" style={{ backgroundColor: '#CC74AB' }}>
      <Toolbar>
        {router.pathname == path.login || router.pathname == path.register ? (
          <Box sx={{ m: 0 }}>
            <Button
              size="medium"
              color="inherit"
              //onClick={() => handleLink(path.top)}
            >
              Cafe活
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ m: 0 }}>
              <Button
                size="medium"
                color="inherit"
                onClick={() => handleLink(path.top)}
              >
                Cafe活
              </Button>
            </Box>
            <form onSubmit={handleSubmit}>
              <Search
                sx={{
                  mr: 'auto',
                  ml: 'auto',
                  //visibility: haveToken ? 'visible' : 'hidden',
                }}
              >
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  id="searchWord"
                  placeholder="店舗名、住所..."
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={handleChange}
                  //value={values.searchWord}
                  type="text"
                />
              </Search>
            </form>
            <Box sx={{ flexGrow: 1 }} />
            <Box
              sx={{ flexGrow: 0 }}
              //sx={{ flexGrow: 0, visibility: haveToken ? 'visible' : 'hidden' }}
              textAlign="right"
            >
              <Tooltip title="設定を開く">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0 }}
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleClickUserMenu(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}
