import { User, provideAdditionalDetails } from '../api/user'
import { Components, Labels } from '../styles'
import ModalHeader from './modalHeader'
import Modal from 'react-modal'
import TextArea from './textArea'
import { useState } from 'react'
import { GreenButton } from './buttons'

interface RequestProfileDetailsProps {
  user: User
  isOpen: boolean
  requestClose: () => void
}

const RequestProfileDetails: React.FC<RequestProfileDetailsProps> = ({ user, isOpen, requestClose }) => {
  const [response, setResponse] = useState<string>()

  return (
    <Modal isOpen={isOpen} onRequestClose={requestClose} style={Components.modal}>
      <ModalHeader title="Request Details" requestClose={requestClose} />
      <p style={{ ...Labels.textfieldLabel, textAlign: 'center', paddingBottom: '10px' }}>
        An admin has requested the following details from you, before approving your account:
      </p>
      <p style={{ ...Labels.textfieldLabel, textAlign: 'center', color: 'black' }}>
        {user.requestDetails ?? 'No specific details required. Please contact us for more information'}
      </p>
      <TextArea
        setText={setResponse}
        text={response}
        title="Your response"
        placeholder="Please type your response to the admin here."
        style={{ marginBottom: '10px' }}
      />
      <GreenButton
        title="Submit"
        onClick={() => {
          provideAdditionalDetails(user, response ?? '')
          requestClose()
        }}
      />
    </Modal>
  )
}

export default RequestProfileDetails
