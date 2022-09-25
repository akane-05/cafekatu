import { Paper } from '@mui/material'
import { styled } from '@mui/system'

const CustomPaper = styled(Paper)(() => ({
  elevation: 2,
  margin: 'auto',
  maxWidth: 800,
  backgroundColor: '#f6f1f3',
  padding: 8,
}))

export default CustomPaper
