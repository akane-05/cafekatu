
import { CafeInfo } from '@/features/cafes/types'
import { APIClient } from '@/lib/axios'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

import { CafesQuery } from '@/features/cafes/types';

import axios from "axios";
import useSWR from "swr";


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

// export function useTest ({ props = defaultQuery }: { props?: CafesQuery}) {

//   const fetcher = (url: string): Promise<fetchPostReturnType> =>
// 		axios(url).then((res) => res.data);

//     const { data, error } = useSWR(`http://localhost:8080/testcafes` + new URLSearchParams({ per_page: props.per_page,page:props.page }), fetcher)


//   return {
//     data: data,
//     isLoading: !error && !data,
//     isError: error
//   }
// }

export function useTest () {

  const fetcher = (url: string): Promise<fetchPostReturnType> =>
		axios(url).then((res) => res.data);

    const { data, error } = useSWR(`http://localhost:8080/testcafes?` + new URLSearchParams({ per_page: defaultQuery.per_page,page:defaultQuery.page }), fetcher)


  return {
    data: data,
    isLoading: !error && !data,
    isError: error
  }
}
