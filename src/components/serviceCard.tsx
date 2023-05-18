import { useNavigate } from 'react-router-dom'
import { Service } from '../api/services'
import { User, getUser } from '../api/user'
import { Colors, Labels } from '../styles'
import { useEffect, useState } from 'react'
import { IconButton } from './buttons'

interface ServiceCardProps {
  service: Service
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate()
  const [provider, setProvider] = useState<User>()

  useEffect(() => {
    getUser(service.providerID)
      .then(provider => setProvider(provider))
      .catch(err => console.log(err))
  }, [])

  return (
    <IconButton
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${Colors.light_gray}`,
        maxWidth: '20vw'
      }}
      onClick={() => navigate(`${service.id}`)}>
      {
        // Change PLACEHOLDER to some placeholder image
        // Currently none of the services have pictures I don't think...
      }
      <img
        src={service.pictures ? service.pictures[0] : require('../icons/sample_img.png')}
        style={{ maxHeight: '100%', maxWidth: '100%' }}
      />
      {
        // Container for the providers's pic and name
      }
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <img
          src={provider?.profileURL ?? 'PLACEHOLDER_ICON'}
          style={{ height: '50px', width: '50px', objectFit: 'contain' }}
        />
        <p style={Labels.smallText}>{provider?.username ?? 'Unkown user'}</p>
      </div>
      {
        // Finish off the rest of the ServiceCard here
      }
    </IconButton>
  )
}

export default ServiceCard
