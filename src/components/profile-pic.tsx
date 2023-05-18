import { createUseStyles } from 'react-jss'
import { ProfilePicStyle } from '../styles'
import React from 'react'

import Avatar from '@mui/material/Avatar'

const useStyles = createUseStyles({ ...ProfilePicStyle })

const PLACEHOLDER_ICON =
  'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortRound&accessoriesType=Sunglasses&hairColor=BrownDark&facialHairType=MoustacheFancy&facialHairColor=BrownDark&clotheType=BlazerShirt&eyeType=Side&eyebrowType=Angry&mouthType=Disbelief&skinColor=Pale'

interface ProfilePicProps {
  profileURL?: string
}

const ProfilePicComponent: React.FC<ProfilePicProps> = ({ profileURL }) => {
  const classes = useStyles()
  return (
    <div className={classes.profilePicDiv}>
      <Avatar src={profileURL || PLACEHOLDER_ICON} className={classes.myProfilePic} />
      <span className={classes.onlineIndicator}></span>
    </div>
  )
}

export default ProfilePicComponent
