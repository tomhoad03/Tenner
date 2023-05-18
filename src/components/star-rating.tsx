import { createUseStyles } from 'react-jss'
import { StarRatingStyle } from '../styles'
import React from 'react'

import fullStar from '../icons/full-star.svg'
import halfStar from '../icons/half-star.svg'
import emptyStar from '../icons/empty-star.svg'

const useStyles = createUseStyles({ ...StarRatingStyle })

interface StarRatingProps {
  rating: number
  ratingCount?: number
}

// Creates the rating graphic
const getRating = (rating: number, n: number) => {
  if (Math.floor(rating) >= n) {
    return fullStar
  } else if (Math.floor(rating + 0.5) >= n) {
    return halfStar
  } else {
    return emptyStar
  }
}

const StarRatingComponent: React.FC<StarRatingProps> = ({ rating, ratingCount }) => {
  const classes = useStyles()
  return !isNaN(rating) ? (
    <div className={classes.myRatingDiv}>
      <img id="star1" src={getRating(rating, 1)} alt={'star1'} className={classes.myStar}></img>
      <img id="star2" src={getRating(rating, 2)} alt={'star2'} className={classes.myStar}></img>
      <img id="star3" src={getRating(rating, 3)} alt={'star3'} className={classes.myStar}></img>
      <img id="star4" src={getRating(rating, 4)} alt={'star4'} className={classes.myStar}></img>
      <img id="star5" src={getRating(rating, 5)} alt={'star5'} className={classes.myStar}></img>
      <p className={classes.myRating}>{rating.toFixed(1)}</p>
      {ratingCount == 0 || ratingCount != undefined ? <p className={classes.myRatingCount}>({ratingCount})</p> : null}
    </div>
  ) : (
    <div className={classes.myRatingDiv}></div>
  )
}

export default StarRatingComponent
