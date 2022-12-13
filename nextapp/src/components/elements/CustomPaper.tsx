import { Paper } from '@mui/material'
import { styled } from '@mui/system'

const CustomPaper = styled(Paper)(() => ({
  elevation: 2,
  margin: 'auto',
  margintop: 10,
  maxWidth: 800,
  backgroundColor: '#f6f1f3',
  padding: 8,
}))

export const LinkPaper = styled(Paper)(() => ({
  elevation: 0,
  margin: 'auto',
  maxWidth: 800,
  backgroundColor: 'transparent',
  padding: 2,
}))

export default CustomPaper
