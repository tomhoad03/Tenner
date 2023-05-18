import React, { useEffect, useState } from 'react'
import ModalHeader from './modalHeader'
import { errorText as errorStyle } from '../styles/labels'
import { separator } from '../styles/components'
import { Buttons, TextArea } from '.'
import Modal from 'react-modal'
import { Components } from '../styles'
import TextField from './textField'
import { updateUser, UpdateUserParams, User } from '../api/user'

export type EditProfileModalState = 'NEW' | undefined

interface EditProfileModalProps {
  isOpen: boolean
  requestClose: () => void
  user?: User
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, requestClose, user }) => {
  const [username, setUsername] = useState<string | undefined>('')
  const [biography, setBiography] = useState<string | undefined>('')
  const [errorText, setErrorText] = useState<string>('')

  useEffect(() => {
    setUsername(user?.username)
    setBiography(user?.biography)
  }, [user])

  const editProfile = () => {
    if (!username) {
      setErrorText('Please provide a username')
      return
    }
    if (!user) {
      setErrorText('Please provide a valid user')
      return
    }

    const updatedUser: UpdateUserParams = {
      user: user,
      info: {
        username: username,
        biography: biography
      }
    }

    updateUser(updatedUser)
      .then(() => requestClose())
      .catch(err => console.log(err))
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={requestClose} style={Components.modal}>
      <ModalHeader title="Edit Profile" requestClose={requestClose} socialLogin={false} setErrorText={setErrorText} />
      <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <div style={separator}></div>
      </div>

      <TextField title="Username" text={username} setText={setUsername} />
      <TextArea title="Biography" text={biography} setText={setBiography} />

      <Buttons.GreenButton
        onClick={editProfile}
        title="Continue"
        style={{ marginTop: '10px' }}
        id="edit_profile_button"
      />
      {errorText ? (
        <label htmlFor="edit_profile_button" style={errorStyle}>
          {errorText}
        </label>
      ) : null}
    </Modal>
  )
}

export default EditProfileModal
