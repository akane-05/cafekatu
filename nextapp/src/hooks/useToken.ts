import  { useState, useEffect } from 'react'

const readToken = (): string|undefined  => {
    const token = localStorage.getItem("token");
    return token != null ? token : undefined;
  };

// export const useToken = ():[
//   string|undefined,
//   React.Dispatch<React.SetStateAction<string| undefined>>
// ] => {
//     const [token, setToken] = useState<string>();

//     useEffect(() => {
//         setToken(readToken());
//     }, []);

//       // 外部からのセッター呼び出し時にローカルストレージに値を保存する
//   // const setNewToken = useCallback(
//   //   (newToken: string) => {
//   //     localStorage.setItem("token",newToken )
//   //     setToken(newToken)
//   //   },
//   //   [setToken]
//   // )

//   return [token,setToken];

//   };

  // export default function useToken ():[string|undefined, React.Dispatch<React.SetStateAction<string| undefined>>]{
    export default function useToken ():string|undefined{

  const [token, setToken] = useState<string>();

      useEffect(() => {
          setToken(readToken());
      }, []);

        // 外部からのセッター呼び出し時にローカルストレージに値を保存する
    // const setNewToken = useCallback(
    //   (newToken: string) => {
    //     localStorage.setItem("token",newToken )
    //     setToken(newToken)
    //   },
    //   [setToken]
    // )

    //return [token,setToken];
    return token

    };
