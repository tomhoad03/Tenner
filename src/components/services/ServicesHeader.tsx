import { Stack } from '@mui/system'
import { useState } from 'react'
import { ServiceCategory } from '../../api/services'

type ServicesHeaderProps = {
  activeServiceCategory: ServiceCategory
  activeServiceCategoryMessage: string | undefined
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({ activeServiceCategory, activeServiceCategoryMessage }) => {
  return (
    <Stack
      direction={{ sm: 'column', md: 'row' }}
      spacing={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}
      justifyContent={{ xs: 'start', sm: 'start', md: 'space-between' }}
      alignItems={{ xs: 'space-around', sm: 'space-around', md: 'center' }}
      className="px-4 flex-row flex-grow">
      {
        // /////////////// //
        // CATEGORY HEADER //
        // /////////////// //
      }

      <Stack spacing={1}>
        <h1 className="text-4xl font-semibold">{activeServiceCategory}</h1>
        <p className="text-gray-500">{activeServiceCategoryMessage}</p>
      </Stack>
      {
        // /////// //
        // FILTERS //
        // /////// //
      }
      {/* <Stack
        direction="row"
        justifyContent={{
          xs: 'center',
          sm: 'center',
          md: 'end',
          lg: 'end',
          xl: 'end'
        }}
        spacing={3}
        className="flex-row flex-grow">
        <FilterButton title="Location" />

        <FilterButton title="Budget" />

        <FilterButton title="Availability" />
      </Stack> */}
    </Stack>
  )
}

type FilterButtonProps = {
  title: string
}

const FilterButton: React.FC<FilterButtonProps> = ({ title }) => {
  // ///// //
  // STATE //
  // ///// //

  const [isHovered, setIsHovered] = useState<boolean>(false)

  // ///////// //
  // COMPONENT //
  // ///////// //

  return (
    <div
      onMouseLeave={e => {
        setIsHovered(false)
      }}>
      {
        // ////// //
        // BUTTON //
        // ////// //
      }
      <div
        onMouseEnter={e => {
          setIsHovered(true)
        }}>
        <Stack
          className={`py-3 px-5 border border-gray-300 ${isHovered ? 'border-gray-600' : ''} rounded-lg cursor-pointer`}
          alignItems="center"
          width={150}>
          {title}
        </Stack>
      </div>
      {
        // ////// //
        // POP-UP //
        // ////// //
      }

      <Stack
        className={`relative pt-1 z-50 ${!isHovered ? 'scale-50 opacity-0' : 'scale-100 opacity 100'} transition-all`}
        alignItems={'flex-end'}>
        <Stack className="absolute p-4 bg-white border border-gray-300 rounded-lg" width={150} height={250} spacing={1}>
          {
            // ///// //
            // TITLE //
            // ///// //
          }
          <div className="font-medium"></div>
          {
            // ////// //
            // SLIDER //
            // ////// //
          }
          <div className="p-1">
            {
              // ///////////////// //
              // FILTER LOGIC HERE //
              // ///////////////// //
              // TODO
            }
          </div>
        </Stack>
      </Stack>
    </div>
  )
}

export default ServicesHeader
