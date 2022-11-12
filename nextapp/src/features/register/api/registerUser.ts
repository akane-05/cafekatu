import axios from "axios";
import { RegisterInfo,ReturnInfo } from '@/features/register/types'

export async function registerUser (info :RegisterInfo) :Promise<ReturnInfo> {
  const returnInfo : ReturnInfo = {
    mes: "",
    result: false,
  }

    return axios.post(`http://localhost:8080/register`, {
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
