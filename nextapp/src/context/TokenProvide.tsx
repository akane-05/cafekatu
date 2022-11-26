import { createContext, useContext } from 'react'
import React, { useState } from 'react'

export type GlogalState = {
  haveToken: boolean
  //updateState: null
}

const defaultValue: GlogalState = {
  haveToken: false,
  //updateState: null,
}

const TokenContext = createContext(defaultValue)

export function useTokenContext() {
  return useContext(TokenContext)
}

export function TokenProvide({ children }: { children: React.ReactNode }) {
  const [haveToken, sethaveToken] = useState<boolean>(false)

  const updateState = (value: boolean): void => {
    sethaveToken(value)
  }

  const glogalState: GlogalState = {
    haveToken,
    //updateState,
  }

  return (
    <TokenContext.Provider value={glogalState}>
      {children}
    </TokenContext.Provider>
  )
}
