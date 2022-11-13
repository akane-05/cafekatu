
import { CafeInfo } from '@/features/cafes/types'
import  apiClient,{accessToken}  from '@/lib/axios'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

import { CafesQuery,ReturnInfo } from '@/features/cafes/types';

import axios from "axios";
import useSWR from "swr";
import { requests } from '@/const/Consts';


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
//     const returnInfo = JSON.parse(JSON.stringify(data)) as ReturnInfo
//     returnInfo.status = status

//    return returnInfo
//   })
//   .catch((error) => {
//     const { data, status } = error.response;
//     const returnInfo = JSON.parse(JSON.stringify(data)) as ReturnInfo
//     returnInfo.status = status

//       return returnInfo
//     });
// }

export function useCafes ( props?: CafesQuery) {
    if (typeof props === "undefined") {
      props = defaultQuery;
    }

  const fetcher = (url: string) => apiClient.get(url,{ headers: {
          Authorization: `Bearer ${accessToken}`,
        }}).then(res => res.data)

  const { data: post, error } = useSWR(requests.cafes + new URLSearchParams({ per_page: props.per_page,page:props.page }), fetcher)

  console.log(post)

  return {
    returnInfo: post,
    isLoading: !error && !post,
    isError: error
  }

}
