
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

// export function useCafes ({ props = defaultQuery }: { props?: CafesQuery}) {
  export function getCafes ( props?: CafesQuery) {
    if (typeof props === "undefined") {
      props = defaultQuery;
    }
    console.log('getCafesが走っている')

  return apiClient.get(requests.cafes + new URLSearchParams({ per_page: props.per_page,page:props.page }), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }}).then((res) => {
       const { data, status } = res;
    const returnInfo = JSON.parse(JSON.stringify(data)) as ReturnInfo
    returnInfo.status = status

   return returnInfo
  })
  .catch((error) => {
    const { data, status } = error.response;
    const returnInfo = JSON.parse(JSON.stringify(data)) as ReturnInfo
    returnInfo.status = status

      return returnInfo
    });


// const fetcher = (url: string): Promise<fetchPostReturnType> =>
	// 	axios(url).then((res) => res.data);

  //   const { data, error } = useSWR(`http://localhost:8080/cafes` + new URLSearchParams({ per_page: props.per_page,page:props.page }), fetcher)


  // return {
  //   data: data,
  //   isLoading: !error && !data,
  //   isError: error
  // }

}

// export function useTest () {

//   const fetcher = (url: string): Promise<fetchPostReturnType> =>
// 		axios(url).then((res) => res.data);

//     const { data, error } = useSWR(`http://localhost:8080/testcafes?` + new URLSearchParams({ per_page: defaultQuery.per_page,page:defaultQuery.page }), fetcher)


//   return {
//     data: data,
//     isLoading: !error && !data,
//     isError: error
//   }
// }
