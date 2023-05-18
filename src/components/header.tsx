import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { Box } from '@mui/system'
import { useEffect, useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { signUserOut } from '../api/auth'
import { getUser } from '../api/user'
import Paths from '../paths'
import { Colors } from '../styles'
import AuthModal, { AuthModalState } from './authModal'
import ExtraButtons from './extraButtons'
import HeaderSearchBox from './headerSearchBox'
import Logo from './logo'
import UserContext from '../contexts/userContext'

export const PLACEHOLDER_ICON =
  'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortRound&accessoriesType=Sunglasses&hairColor=BrownDark&facialHairType=MoustacheFancy&facialHairColor=BrownDark&clotheType=BlazerShirt&eyeType=Side&eyebrowType=Angry&mouthType=Disbelief&skinColor=Pale'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { user, setUser } = useContext(UserContext)
  const [authModalState, setAuthModalState] = useState<AuthModalState>()
  const [isOnSplash, setIsOnSplash] = useState(location.pathname === Paths.Root)

  useEffect(() => {
    setIsOnSplash(location.pathname === Paths.Root)
  }, [location])

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, user => {
      //hacky fix below: For new users, this won't work as the realtime database won't finish creating the user in time, so it won't exist
      if (user) {
        getUser(user.uid)
          .then(result => setUser(result))
          .catch(err => {
            // Unable to get the user from the Firebase, indicates the user did not complete the onboarding process
            console.log(err)
            setUser(null)
            setAuthModalState('WELCOME')
          })
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }, [authModalState]) // hacky fix for the above

  const backgroundColor = isOnSplash ? Colors.another_gray : Colors.white
  const color = isOnSplash ? Colors.white : Colors.another_gray

  return (
    <header style={{ background: backgroundColor, color }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="0 1rem">
        <Logo color={color} />
        {!isOnSplash && <HeaderSearchBox />}

        <ExtraButtons
          isOnSplash={isOnSplash}
          user={user}
          handleSignIn={() => setAuthModalState('LOGIN')}
          handleServices={() => navigate(Paths.Services)}
          handleJoin={() => setAuthModalState('JOIN')}
          handleLogout={() => {
            signUserOut().then(() => {
              if (location.pathname.includes('profile')) {
                navigate(Paths.Launchpad)
              }
            })
          }}
          handleProfile={() => navigate(`/profile/${user?.id}`)}
          handleOrderHistory={() => navigate(`/orders/${user?.id}`)}
          avatarSource={user?.profileURL || PLACEHOLDER_ICON} // TODO: Replace placeholder, MUI Icons can't be a URL - find a fix at a later date
        />
        <AuthModal
          isOpen={authModalState !== undefined}
          requestClose={() => setAuthModalState(undefined)}
          authModalState={authModalState}
          setAuthModalState={setAuthModalState}
        />
      </Box>
    </header>
  )
}

export default Header
