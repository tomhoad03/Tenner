import ModalHeader from './modalHeader'
import { useState } from 'react'
import TextField from './textField'
import { Labels } from '../styles'
import { GreenButton } from './buttons'
import { resetPassword } from '../api/auth'

interface ForgottenPasswordProps {
  requestClose: () => void
}

const ForgottenPasswordModal: React.FC<ForgottenPasswordProps> = ({ requestClose }) => {
  const [email, setEmail] = useState<string>()
  const [errorText, setErrorText] = useState<string>()
  const [success, setSuccess] = useState<boolean>(false)

  const reset = () => {
    if (!email) {
      setErrorText('Please enter an email address')
      return
    }

    resetPassword(email)
      .then(() => setSuccess(true))
      .catch(err => {
        if (err.code === 'auth/invalid-email') {
          setErrorText('Invalid email address')
        } else if (err.code === 'auth/user-not-found') {
          setErrorText('An account for this email address was not found')
        }
      })
  }

  return (
    <>
      <ModalHeader title="Forgotten Password" requestClose={requestClose} />
      <p style={{ ...Labels.textfieldLabel, textAlign: 'center' }}>
        Enter your email in the text field below to reset your password.
      </p>
      <TextField text={email} setText={setEmail} title="Email" />
      <p style={Labels.errorText}>{errorText}</p>
      {success && <p style={{ ...Labels.errorText, color: 'green' }}>Password reset email sent.</p>}
      <GreenButton title="Reset email" onClick={reset} />
    </>
  )
}
export default ForgottenPasswordModal
