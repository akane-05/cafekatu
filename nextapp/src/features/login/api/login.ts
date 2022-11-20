import { LoginInfo,Response } from '@/features/login/types'
import  apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
// import { useToken } from '@/hooks/useToken'
//import useToken  from '@/hooks/useToken'



export async function login (info :LoginInfo) :Promise<Response> {
  //const  [token, setNewToken]  = useToken()

    return apiClient.post(requests.login,
      JSON.stringify(info),
      )
      .then((res) => {
        const { data, status } = res;
        const response = JSON.parse(JSON.stringify(data)) as Response
        response.status = status
        //setNewToken(response.token)
        localStorage.setItem("token",response.token )

       return response
      })
      .catch((error) => {
        const { data, status } = error.response;
        // console.log("エラー");
        // console.log(error.response);
        // console.log(error.response.data);

      const response = JSON.parse(JSON.stringify(data)) as Response
      response.status = status

        // console.log(response);
        //console.log(response.message); //undefined

        return response
      });
    }
