import { LoginInfo,ReturnInfo } from '@/features/login/types'
import  apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { isLoggedIn, setAuthTokens, clearAuthTokens} from 'axios-jwt'

export async function login (info :LoginInfo) :Promise<ReturnInfo> {

    return apiClient.post(requests.login,
      JSON.stringify(info),
      )
      .then((res) => {
        const { data, status } = res;
        const returnInfo = JSON.parse(JSON.stringify(data)) as ReturnInfo
        returnInfo.status = status

        setAuthTokens({
          accessToken: returnInfo.token,
          refreshToken: ""
      })

       return returnInfo
      })
      .catch((error) => {
        const { data, status } = error.response;
        // console.log("エラー");
        // console.log(error.response);
        // console.log(error.response.data);

      const returnInfo = JSON.parse(JSON.stringify(data)) as ReturnInfo
      returnInfo.status = status

        // console.log(returnInfo);
        //console.log(returnInfo.message); //undefined

        return returnInfo
      });
    }
