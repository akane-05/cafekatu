import { PastPost } from '@/features/users/types'
import CustomPaper from '@/components/layouts/CustomPaper'
import CafeInfoCard from '@/components/elements/CafeInfoCard'
import CafeCard from '@/components/elements/CafeCard'
import ReviewCard from '@/components/elements/ReviewCard'
import { Review } from '@/features/reviews/types'
import { Box } from '@mui/material'

type Props = {
  pastPost: PastPost
}

export default function PastPostPaper(props: Props) {
  return (
    <>
      <CustomPaper>
        <CafeCard cafeInfo={props.pastPost.cafeInfo}></CafeCard>
        {props.pastPost.reviews.map((review: Review) => {
          return <ReviewCard key={review.id} review={review} pastPost={true} /> //keyを指定
        })}
      </CustomPaper>
      <Box sx={{ mb: 2 }}></Box>
    </>
  )
}
