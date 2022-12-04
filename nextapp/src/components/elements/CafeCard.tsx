// import { NextPage } from 'next'
// import Router from 'next/router'
import {
  Grid,
  TextField,
  Button,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  CardActions,
  Hidden,
  IconButton,
  Rating,
} from '@mui/material'
import React, { useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Cafe, CafeInfo } from '@/features/cafes/types'
import { path } from '@/const/Consts'
import { useRouter } from 'next/router'
import { postFavorite } from '@/features/cafes/api/postFavorite'
import { deleteFavorite } from '@/features/cafes/api/deleteFavorite'
import * as Dialog from '@/context/MessageDialog'
import { useSetRecoilState, RecoilRoot } from 'recoil'
import { haveTokenState } from '@/globalStates/haveToken'

type Props = {
  cafeInfo: CafeInfo
}

export default function CafeCard(props: Props) {
  const router = useRouter() //useRouterフックを定義して
  const setHaveToken = useSetRecoilState(haveTokenState)

  const [isFavorite, setIsFavorite] = React.useState<boolean>(
    props.cafeInfo.is_favorite,
  )
  const [cafeInfo] = useState(props.cafeInfo)
  const dialog = Dialog.useDialogContext()

  const handleClickFavorite = async () => {
    let res
    if (!isFavorite) {
      res = await postFavorite(cafeInfo.id)
    } else {
      res = await deleteFavorite(cafeInfo.id)
    }

    if (res.status == 200) {
      setIsFavorite(!isFavorite)
    } else {
      if (res.status == 401) {
        setHaveToken(false)
      }
      dialog.confirm(Dialog.apiErrorDialog(res.status, res.error))
    }
  }

  const handleLink = (path: string) => {
    router.push({
      pathname: path,
      query: { id: cafeInfo.id },
    })
  }

  const handleMouseDownFavorite = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  return (
    <Card sx={{ mt: 1, mb: 1 }}>
      <Grid container>
        <Grid item xs={12} sm={3}>
          <CardMedia
            component="img"
            // sx={{ width: 151 }}
            image="/cake.jpg"
            alt="写真の説明"
            sx={{ width: '100%', height: '100%' }}
          />
        </Grid>

        <Grid item xs={12} sm={9}>
          <CardContent>
            <Grid
              container
              direction="row-reverse"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item xs={12} sm={1}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <IconButton
                    aria-label="favorite"
                    onClick={handleClickFavorite}
                    onMouseDown={handleMouseDownFavorite}
                    edge="end"
                    sx={{ mr: 1 }}
                  >
                    {isFavorite ? (
                      <FavoriteIcon color="primary" />
                    ) : (
                      <FavoriteBorderIcon color="primary" />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={11}>
                <Typography component="div" variant="h5" sx={{ mb: 1 }}>
                  {cafeInfo.name}
                </Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} sm={3}>
                <Rating
                  name="star-rating"
                  readOnly
                  value={cafeInfo.rating}
                  precision={0.1}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mr: 3 }}
                >
                  {cafeInfo.rating}
                </Typography>
              </Grid>
              <Grid item xs={0} sm={6}>
                <Hidden></Hidden>
              </Grid>
            </Grid>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {cafeInfo.prefecture}
              {cafeInfo.city}
              {cafeInfo.street}
            </Typography>

            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleLink(path.cafeDatail)}
              >
                詳細
              </Button>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}
