import Modal from 'react-modal'
import SignInModal from './signInModal'
import RegisterModal from './registerModal'
import WelcomeModal from './welcomeModal'
import { Components } from '../styles'
import ForgottenPasswordModal from './forgottenPasswordModal'

export type AuthModalState = 'LOGIN' | 'JOIN' | 'WELCOME' | 'FORGOTTEN' | undefined

interface AuthModalProps {
  isOpen: boolean
  requestClose: () => void
  authModalState: AuthModalState
  setAuthModalState: React.Dispatch<React.SetStateAction<AuthModalState>>
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, requestClose, authModalState, setAuthModalState }) => {
  Modal.setAppElement('body')

  return (
    <Modal isOpen={isOpen} onRequestClose={requestClose} style={Components.modal}>
      {authModalState === 'LOGIN' ? (
        <SignInModal requestClose={requestClose} setAuthModalState={setAuthModalState} />
      ) : authModalState === 'JOIN' ? (
        <RegisterModal requestClose={requestClose} setAuthModalState={setAuthModalState} />
      ) : authModalState === 'WELCOME' ? (
        <WelcomeModal requestClose={requestClose} />
      ) : (
        <ForgottenPasswordModal requestClose={requestClose} />
      )}
    </Modal>
  )
}

export default AuthModal
