import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material'
import React, { useState } from 'react'
import { createContext, useContext } from 'react'

export type DialogOptions = {
  title: string
  message: string
  open: boolean
  choice?: boolean
}

// 確認ダイアログのオプション、タイトル、メッセージ、ボタンのラベルなどを指定
const DEFAULT_OPTIONS: DialogOptions = {
  title: '',
  message: '',
  open: false,
  choice: false,
}

const DialogContext = createContext(
  {} as {
    confirm: (options: DialogOptions) => Promise<void>
  },
)

const buildOptions = (options: DialogOptions): DialogOptions => {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
  }
}

export function MessageDialog({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<DialogOptions>({ ...DEFAULT_OPTIONS })

  const [resolveReject, setResolveReject] = useState<any>([])
  const [resolve, reject] = resolveReject

  const confirm = (options: DialogOptions): Promise<void> => {
    return new Promise((resolve, reject) => {
      setOptions(buildOptions(options))
      setResolveReject([resolve, reject])
    })
  }

  const handleClose = () => {
    setOptions({ ...options, open: false })
  }

  // const handleCancel = () => {
  //   // reject()
  //   handleClose()
  // }

  const handleConfirm = () => {
    resolve()
    handleClose()
  }

  return (
    <>
      <Dialog
        open={options.open}
        onClick={() => handleClose()}
        fullWidth={true}
        maxWidth="xs"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{options.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {options.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {options.choice ? (
            <>
              <Button onClick={() => handleClose()}>いいえ</Button>
              <Button onClick={() => handleConfirm()}>はい</Button>
            </>
          ) : (
            <>
              <Button onClick={() => handleConfirm()}>閉じる</Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <DialogContext.Provider
        value={{
          confirm,
        }}
      >
        {children}
      </DialogContext.Provider>
    </>
  )
}

export function useDialogContext() {
  return useContext(DialogContext)
}
