import React, { useState } from 'react'
import ModalHeader from './modalHeader'
import { Colors, Labels } from '../styles'
import { signIn } from '../api/auth'
import { errorText as errorStyle, modalSeparatorText, modalSubtitle } from '../styles/labels'
import TextField from './textField'
import { AuthModalState } from './authModal'
import { separator } from '../styles/components'
import { Buttons } from '.'

interface SignInModalProps {
  requestClose: () => void
  setAuthModalState: React.Dispatch<React.SetStateAction<AuthModalState>>
}

const SignInModal: React.FC<SignInModalProps> = ({ requestClose, setAuthModalState }) => {
  const [emailText, setEmailText] = useState<string | undefined>(undefined)
  const [passwordText, setPasswordText] = useState<string | undefined>(undefined)
  const [errorText, setErrorText] = useState<string>('')

  const login = () => {
    if (!emailText) {
      setErrorText('Please provide an email address')
      return
    }
    if (!passwordText) {
      setErrorText('Please provide a password')
      return
    }
    signIn(emailText, passwordText)
      .then(user => {
        console.log(user)
        requestClose()
      })
      .catch(err => {
        if (err.code === 'auth/invalid-email') {
          setErrorText('Invalid email address')
        } else if (err.code === 'auth/user-disabled') {
          setErrorText('Account disabled')
        } else if (err.code === 'auth/user-not-found') {
          setErrorText('Account not found')
        } else if (err.code === 'auth/wrong-password') {
          setErrorText('Incorrect password')
        } else {
          setErrorText(err.message)
        }
      })
  }

  return (
    <>
      <ModalHeader
        title="Login to tenerr"
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
      <button onClick={() => setAuthModalState('FORGOTTEN')}>
        <p style={Labels.errorText}>Forgotten password?</p>
      </button>
      <Buttons.GreenButton onClick={login} title="Continue" style={{ marginTop: '10px' }} id="login_button" />
      {errorText ? (
        <label htmlFor="login_button" style={errorStyle}>
          {errorText}
        </label>
      ) : null}
      <div style={{ ...separator, margin: '4px 0' }}></div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <p style={modalSubtitle}>Not a member yet?&nbsp;</p>
        <Buttons.IconButton
          onClick={() => setAuthModalState('JOIN')}
          style={{ ...modalSubtitle, color: Colors.green, fontWeight: 'bold' }}>
          Join now!
        </Buttons.IconButton>
      </div>
    </>
  )
}

export default SignInModal
