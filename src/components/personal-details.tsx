import React, { SetStateAction } from 'react'
import { AccountStatus } from '../api/auth'
import { auth } from '../firebase'
import { Colors } from '../styles'
import { GreenButton } from './buttons'

interface PersonalDetailsProps {
  uid?: string
  username?: string
  location?: string
  status?: AccountStatus
  isServiceProvider?: boolean
  showRequestDetails?: React.Dispatch<SetStateAction<boolean>>
}

const PersonalDetailsComponent: React.FC<PersonalDetailsProps> = ({
  uid,
  username,
  location,
  status,
  isServiceProvider,
  showRequestDetails
}) => {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div>
        {username && (
          <p className={'text-1xl font-semibold'} style={{ margin: '5px 0px 5px 0px' }}>
            Username:
          </p>
        )}
        {auth.currentUser?.uid == uid && (
          <p className={'text-1xl font-semibold'} style={{ margin: '5px 0px 5px 0px' }}>
            Email:
          </p>
        )}
        {location && (
          <p className={'text-1xl font-semibold'} style={{ margin: '5px 0px 5px 0px' }}>
            Location:
          </p>
        )}
        {isServiceProvider && (
          <p className={'text-1xl font-semibold'} style={{ margin: '5px 0px 5px 0px' }}>
            Status:
          </p>
        )}
      </div>
      <div style={{ width: '80%' }}>
        {username && <p style={{ margin: '5px 0px 5px 15px' }}>{username}</p>}
        {auth.currentUser?.uid == uid && (
          <p style={{ margin: '5px 0px 5px 15px', overflow: 'clip', textOverflow: 'ellipsis' }}>
            {auth.currentUser?.email}
          </p>
        )}
        {location && <p style={{ margin: '5px 0px 5px 15px' }}>{location}</p>}
        {isServiceProvider && status == 'Approved' && (
          <p style={{ margin: '5px 0px 5px 15px', color: Colors.green }}>Approved</p>
        )}
        {isServiceProvider && status == 'Pending' && (
          <p style={{ margin: '5px 0px 5px 15px', color: Colors.gold }}>Pending</p>
        )}
        {isServiceProvider && status == 'Rejected' && (
          <p style={{ margin: '5px 0px 5px 15px', color: Colors.red }}>Rejected</p>
        )}
        {isServiceProvider && status == 'Request' && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
            <p style={{ margin: '5px 0px 5px 15px', color: Colors.gold }}>More details required</p>
            <GreenButton
              title="Provide more details"
              onClick={() => showRequestDetails && showRequestDetails(true)}
              style={{ width: '40%', marginLeft: '5px' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PersonalDetailsComponent
