import React, { useState } from 'react'
import TextField from './textField'
import { Colors } from '../styles'
import { registerUser } from '../api/auth'
import { errorText as errorStyle, modalSeparatorText, modalSubtitle } from '../styles/labels'
import ModalHeader from './modalHeader'
import { AuthModalState } from './authModal'
import { separator } from '../styles/components'
import { Buttons } from '.'

interface RegisterModalProps {
  requestClose: () => void
  setAuthModalState: React.Dispatch<React.SetStateAction<AuthModalState>>
}

const RegisterModal: React.FC<RegisterModalProps> = ({ requestClose, setAuthModalState }) => {
  const [emailText, setEmailText] = useState<string | undefined>(undefined)
  const [passwordText, setPasswordText] = useState<string | undefined>(undefined)
  const [confirmText, setConfirmText] = useState<string | undefined>(undefined)
  const [errorText, setErrorText] = useState<string>('')

  const register = () => {
    if (!emailText) {
      setErrorText('Please provide an email address')
    } else if (!passwordText) {
      setErrorText('Please provide a password')
    } else if (!confirmText) {
      setErrorText('Please confirm your password')
    } else if (passwordText !== confirmText) {
      setErrorText('Passwords do not match')
    } else {
      registerUser(emailText, passwordText)
        .then(user => {
          console.log('Successfully registered user to Firebase auth', user)
          setAuthModalState('WELCOME')
        })
        .catch(err => {
          if (err.code === 'auth/email-already-in-use') {
            setErrorText('Email already in use')
          } else if (err.code === 'auth/invalid-email') {
            setErrorText('Invalid email address')
          } else if (err.code === 'auth/weak-password') {
            setErrorText('Password must be at least 6 characters')
          } else {
            setErrorText(err.message)
          }
        })
    }
  }

  return (
    <>
      <ModalHeader
        title="Register to tenerr"
        requestClose={requestClose}
        socialLogin
        setAuthModalState={setAuthModalState}
        setErrorText={setErrorText}
      />
      <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <div style={separator}></div>
        <span style={{ ...modalSeparatorText, margin: '0 10px' }}>OR</span>
        <div style={separator}></div>
      </div>
      <TextField title="Email" text={emailText} setText={setEmailText} />
      <TextField title="Password" text={passwordText} setText={setPasswordText} secure />
      <TextField title="Confirm Password" text={confirmText} setText={setConfirmText} secure />
      <Buttons.GreenButton title="Continue" onClick={register} id="register_button" style={{ marginTop: '10px' }} />
      {errorText ? (
        <label htmlFor="register_button" style={errorStyle}>
          {errorText}
        </label>
      ) : null}
      <div style={{ ...separator, margin: '4px 0' }}></div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <p style={modalSubtitle}>Already a member?&nbsp;</p>
        <Buttons.IconButton
          onClick={() => setAuthModalState('LOGIN')}
          style={{ ...modalSubtitle, color: Colors.green, fontWeight: 'bold' }}>
          Login here.
        </Buttons.IconButton>
      </div>
    </>
  )
}

export default RegisterModal
