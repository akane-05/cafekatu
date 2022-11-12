import { RegisterInfo,ReturnInfo } from '@/features/register/types'
import  APIClient from '@/lib/axios'
import {requests} from '@/const/Consts'

export async function registerUser (info :RegisterInfo) :Promise<ReturnInfo> {
  const returnInfo : ReturnInfo = {
    mes: "",
    result: false,
  }

    return APIClient.post(requests.register, {
      info,
      })
      .then((res) => {
        returnInfo.mes = res.data.message
        returnInfo.result = true
       return returnInfo
      })
      .catch((error) => {
        console.log("エラー");
        // return error.response.data.error
        console.log(error.response.data.error);
        returnInfo.mes = error.response.data.error
        returnInfo.result = false
        return returnInfo
      });
    }
