import Grid from '@mui/system/Unstable_Grid/Grid'
import React from 'react'
import { Service } from '../../api/services'
import ServiceCard from './ServiceCard'

type ServicesListProps = {
  services: Service[] | undefined
}

const ServicesList: React.FC<ServicesListProps> = ({ services }) => {
  return services ? (
    <Grid container={true} direction="row" spacing={2} className="px-2">
      {services &&
        services.map(service => {
          return (
            <Grid key={service.id} xs={12} sm={6} md={4} lg={3} xl={2}>
              <ServiceCard service={service} />
            </Grid>
          )
        })}
    </Grid>
  ) : (
    <div className="flex justify-center items-center text-xl font-medium text-gray-500 h-[400px]">No services!</div>
  )
}

export default ServicesList
