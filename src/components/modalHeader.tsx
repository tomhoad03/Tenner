import { getAdditionalUserInfo } from 'firebase/auth'
import { Buttons } from '.'
import { facebookSignIn, googleSignIn } from '../api/auth'
import { ReactComponent as CloseIcon } from '../icons/close.svg'
import { ReactComponent as FacebookIcon } from '../icons/facebook.svg'
import { ReactComponent as GoogleIcon } from '../icons/google.svg'
import { modalTitle } from '../styles/labels'
import { AuthModalState } from './authModal'

interface ModalHeaderProps {
  title: string
  requestClose: () => void
  socialLogin?: boolean
  setAuthModalState?: React.Dispatch<React.SetStateAction<AuthModalState>>
  setErrorText?: React.Dispatch<React.SetStateAction<string>>
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  requestClose,
  socialLogin,
  setAuthModalState,
  setErrorText
}) => {
  const google = () => {
    googleSignIn()
      .then(result => {
        const additionalInfo = getAdditionalUserInfo(result)
        if (additionalInfo?.isNewUser) {
          setAuthModalState && setAuthModalState('WELCOME')
        } else {
          requestClose()
        }
      })
      .catch(err => {
        if (err.code !== 'auth/popup-closed-by-user') {
          setErrorText && setErrorText(err.message)
        }
      })
  }

  const facebook = () => {
    facebookSignIn()
      .then(result => {
        const additionalInfo = getAdditionalUserInfo(result)
        if (additionalInfo?.isNewUser) {
          setAuthModalState && setAuthModalState('WELCOME')
        } else {
          requestClose()
        }
      })
      .catch(err => {
        if (err.code !== 'auth/popup-closed-by-user') {
          setErrorText && setErrorText(err.message)
        }
      })
  }

  return (
    <>
      <Buttons.IconButton style={{ position: 'absolute', top: 10, right: 10 }} onClick={requestClose}>
        <CloseIcon width={20} />
      </Buttons.IconButton>
      <text style={{ ...modalTitle, marginBottom: '8px' }}>{title}</text>
      {socialLogin ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Buttons.IconButton style={{ marginRight: '10px' }} onClick={google}>
            <GoogleIcon />
          </Buttons.IconButton>
          <Buttons.IconButton onClick={facebook}>
            <FacebookIcon />
          </Buttons.IconButton>
        </div>
      ) : null}
    </>
  )
}

export default ModalHeader
