import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth'
import { auth } from '../firebase'

export type AccountStatus = 'Pending' | 'Approved' | 'Rejected' | 'Request'

export const registerUser = async (email: string, password: string) => {
  return await new Promise<User>((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(credential => {
        // MARK: Set UserType
        console.log('Created new user. Sending verification email.')
        sendEmailVerification(credential.user)
          .then(() => {
            console.log('Verification email sent to: ', email)
          })
          .catch(err => {
            console.log(new Error(`Verification error failed to send: ${err}`))
          })
        resolve(credential.user)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}

export const signIn = async (email: string, password: string) => {
  return await new Promise<UserCredential>((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(credential => {
        resolve(credential)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}

export const resetPassword = async (email: string) => {
  const auth = getAuth()

  return await new Promise<void>((resolve, reject) => {
    sendPasswordResetEmail(auth, email)
      .then(resolve)
      .catch(err => reject(err))
  })
}

export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider()

  return await new Promise<UserCredential>((resolve, reject) => {
    signInWithPopup(auth, provider)
      .then(user => {
        resolve(user)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const facebookSignIn = async () => {
  const provider = new FacebookAuthProvider()

  return await new Promise<UserCredential>((resolve, reject) => {
    signInWithPopup(auth, provider)
      .then(user => {
        resolve(user)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const signUserOut = async () => {
  return await new Promise<void>((resolve, reject) => {
    signOut(auth)
      .then(() => {
        console.log('User signed out')
        resolve()
      })
      .catch(err => {
        console.log(new Error(`Failed to sign user out: ${err}`))
        reject(err)
      })
  })
}

export const deleteAccount = () => {
  return null
}
