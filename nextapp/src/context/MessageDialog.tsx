// import { NextPage } from 'next'
// import Router from 'next/router'
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
}

// 確認ダイアログのオプション、タイトル、メッセージ、ボタンのラベルなどを指定
const DEFAULT_OPTIONS: DialogOptions = {
  title: '',
  message: '',
  open: false,
}

const DialogContext = createContext(
  {} as {
    handleSetDialogOptions: (dialogOptions: DialogOptions) => void
    confirm: boolean
  },
)

export function MessageDialog({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<DialogOptions>({ ...DEFAULT_OPTIONS })
  const [confirm, setConfirm] = useState<boolean>(false)

  const handleSetDialogOptions = (dialogOptions: DialogOptions) =>
    setOptions(dialogOptions)

  const handleClose = (e: boolean) => {
    setOptions({ ...options, open: e })
  }

  const handleConfirm = (e: boolean) => {
    setConfirm(e)
  }

  return (
    <>
      <Dialog
        open={options.open}
        onClick={() => handleClose(false)}
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
          <Button onClick={() => handleClose(false)}>閉じる</Button>
          <Button onClick={() => handleConfirm(true)}>ok</Button>
        </DialogActions>
      </Dialog>

      <DialogContext.Provider
        value={{
          handleSetDialogOptions,
          confirm,
          // handleOpen,
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
