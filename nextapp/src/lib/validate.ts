export const validate = (obj: any, scheme: any) => {
  try {
    scheme.validateSync(obj, { abortEarly: false })
    return {}
  } catch (e: any) {
    const errorObj: any = {}
    const errorFields = e.inner
    errorFields.forEach((each: any) => {
      errorObj[each.path] = { message: each.message }
    })

    return errorObj
  }
}
