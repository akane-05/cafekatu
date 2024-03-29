const reqPath = (path: string, id?: string): string => {
  const paths: { [key: string]: string } = {
    login: '/login',
    guest: '/guest',
    register: '/register',
    cafes: '/cafes',
    cafe: '/cafes/' + id,
    cafeFavorite: '/cafes/' + id + '/favorite',
    user: '/users/' + id,
    favorites: '/users/' + id + '/favorites',
    pastPosts: '/users/' + id + '/pastPosts',
    reviews: '/reviews',
    cafeReviews: '/reviews/' + id,
    review: '/reviews/' + id,
    prefectures: '/prefectures',
  }

  const reqPath = paths[path]

  return reqPath
}

const pagePath = (page: string, id?: string): string => {
  const paths: { [key: string]: string } = {
    top: '/',
    login: '/login',
    register: '/register',
    cafes: '/cafes',
    cafe: '/cafes/' + id,
    cafeRegister: '/cafes/register',
    mypage: '/users/' + id,
    favorites: '/users/' + id + '/favorites',
    pastPosts: '/users/' + id + '/pastPosts',
    withdrawal: '/users/' + id + '/withdrawal',
    error: '/error',
  }

  const pagePath = paths[page]

  return pagePath
}

const strage = {
  Token: 'CafeKatuJWTToken',
}

const ratingList: number[] = [
  0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5,
  1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0,
  3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5,
  4.6, 4.7, 4.8, 4.9, 5.0,
]

const errStatus: number[] = [401, 404, 500]

export { reqPath, pagePath, strage, ratingList, errStatus }
