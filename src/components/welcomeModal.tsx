import ModalHeader from './modalHeader'
import { useState } from 'react'
import CustomerIcon from '../icons/customer.svg'
import { Colors, Labels } from '../styles'
import TextField from './textField'
import Select, { StylesConfig } from 'react-select'
import { errorText as errorStyle, modalSubtitle } from '../styles/labels'
import { User, createUser, updateProfilePic } from '../api/user'
import { auth } from '../firebase'
import TextArea from './textArea'
import { Buttons } from '.'
import { signUserOut } from '../api/auth'

interface WelcomeModalProps {
  requestClose: () => void
}

const roles = [
  { value: 'Customer', label: 'Customer' },
  { value: 'Provider', label: 'Provider' }
]

type OptionType = {
  value: string
  label: string
}

export const selectStyles: StylesConfig<OptionType> = {
  control: (_styles, { isFocused }) => ({
    borderRadius: '10px',
    border: `3px solid ${isFocused ? Colors.light_gray : Colors.pale_gray}`,
    outline: 'none',
    padding: '4px',
    display: 'flex'
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    fontFamily: 'Poppins',
    backgroundColor: isFocused ? Colors.light_gray : undefined,
    color: isFocused ? 'white' : Colors.light_gray
  }),
  singleValue: styles => ({
    ...styles,
    color: Colors.light_gray,
    fontFamily: 'Poppins'
  })
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ requestClose }) => {
  const [image, setImage] = useState<File | undefined>()
  const [username, setUsername] = useState<string>()
  const [selectedRole, setSelectedRole] = useState(roles.find(role => role.value === 'Customer'))
  const [description, setDescription] = useState<string>()
  const [errorText, setErrorText] = useState<string>('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (role: any) => {
    setSelectedRole(role)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      //const uploadedImage = URL.createObjectURL(event.target.files[0])
      setImage(event.target.files[0])
    }
  }

  const create = () => {
    if (!username) {
      setErrorText('Enter a username')
    } else {
      const uid = auth.currentUser?.uid
      if (!uid) {
        setErrorText('Unable to find login session')
      } else {
        const role = selectedRole?.value
        if (!(role === 'Customer' || role === 'Provider')) {
          setErrorText('Error: unknown role')
        } else {
          const newUser: User = {
            id: uid,
            type: role,
            username: username,
            biography: role === 'Provider' ? description : undefined
          }
          createUser(newUser)
            .then(user => {
              console.log('New user created', user)
              if (image) {
                updateProfilePic(uid, role, image)
                  .then(() => {
                    console.log('Successfully uploaded profile pic')
                  })
                  .catch(err => {
                    console.log('Failed to upload profile pic', err)
                  })
              }
              requestClose()
            })
            .catch(err => {
              console.log(err.message)
              setErrorText(err.message)
            })
        }
      }
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ModalHeader title="Welcome to tenerr" requestClose={requestClose} />
      <input type="file" id="upload-button" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Buttons.IconButton onClick={() => document.getElementById('upload-button')?.click()}>
          <img
            src={image ? URL.createObjectURL(image) : CustomerIcon}
            id="image"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%'
            }}
          />
        </Buttons.IconButton>
        <Buttons.IconButton onClick={() => document.getElementById('upload-button')?.click()}>
          <label htmlFor="image" style={{ ...modalSubtitle, color: Colors.green, cursor: 'pointer' }}>
            Select picture
          </label>
        </Buttons.IconButton>
      </div>
      <TextField title="Username" setText={setUsername} />
      <div style={{ paddingBottom: '8px' }}>
        <label htmlFor="select" style={{ ...modalSubtitle }}>
          Role
        </label>
        <Select value={selectedRole} onChange={handleChange} options={roles} styles={selectStyles} />
      </div>
      <div style={{ flex: 1, paddingBottom: '8px' }}>
        {selectedRole?.value === 'Provider' ? (
          <TextArea
            title="Description"
            placeholder="Enter a description about who you are and the services you offer. This is one of the first things your customers will see!"
            setText={setDescription}
          />
        ) : null}
      </div>
      <Buttons.GreenButton onClick={create} title="Continue" id="continue_button" />
      {errorText ? (
        <label htmlFor="continue_button" style={errorStyle}>
          {errorText}
        </label>
      ) : null}
      <Buttons.IconButton
        onClick={() => {
          signUserOut().then(() => requestClose())
        }}>
        <p style={Labels.modalSubtitle}>Sign Out</p>
      </Buttons.IconButton>
    </div>
  )
}

export default WelcomeModal
