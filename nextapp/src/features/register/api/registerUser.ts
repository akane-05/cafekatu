import axios from "axios";
import { RegisterInfo } from '@/features/register/types'

export function registerUser (info :RegisterInfo) {

    axios.post(`http://localhost:8080/register`, {
      info,
      })
      .then((res) => {
       return res.data.message
      })
      .catch((error) => {
        console.log(error);
        return error.data.error
      });
    };
