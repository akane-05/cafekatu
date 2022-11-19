
import { CafeInfo } from '@/features/cafes/types'
import  apiClient  from '@/lib/axios'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

import { CafesQuery,Response } from '@/features/cafes/types';

import axios from "axios";
import useSWR from "swr";
import { requests } from '@/const/Consts';
// import { useToken } from '@/hooks/useToken'
import useToken  from '@/hooks/useToken'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'


export type fetchPostReturnType = {
	data: {
    cafes: CafeInfo[];
    message: string;
  };
};

const defaultQuery:CafesQuery = {
  per_page : "5",
  page :"1",
  search_words: ""
}

//   export function getCafes ( props?: CafesQuery) {
//     if (typeof props === "undefined") {
//       props = defaultQuery;
//     }

//   return apiClient.get(requests.cafes + new URLSearchParams({ per_page: props.per_page,page:props.page }), {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     }}).then((res) => {
//        const { data, status } = res;
//     const response = JSON.parse(JSON.stringify(data)) as response
//     response.status = status

//    return response
//   })
//   .catch((error) => {
//     const { data, status } = error.response;
//     const response = JSON.parse(JSON.stringify(data)) as response
//     response.status = status

//       return response
//     });
// }

export function useCafes ( props?: CafesQuery) {
  //const [token,setNewToken] = useToken()

//   const [token,setToken]= useState<string|undefined>()
//   useEffect(() => {
//     setToken(useToken());
// }, []);

    if (typeof props === "undefined") {
      props = defaultQuery;
    }

  const fetcher = (url: string) => apiClient.get(url,{ headers: {
          Authorization: `Bearer ${localStorage.getItem("token")
        }`,
        }}).then(res => res.data)

  const { data: post, error } = useSWR(requests.cafes + new URLSearchParams({ per_page: props.per_page,page:props.page }), fetcher)

  console.log(post)

  return {
    response: post,
    isLoading: !error && !post,
    isError: error
  }

}
