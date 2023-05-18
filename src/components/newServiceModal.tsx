import React, { SetStateAction, useState } from 'react'
import ModalHeader from './modalHeader'
import { errorText as errorStyle, textfieldLabel } from '../styles/labels'
import TextField from './textField'
import { separator, textField } from '../styles/components'
import { Buttons, TextArea } from '.'
import {
  addService,
  Availability,
  Day,
  groupAvailability,
  LocationData,
  NewServiceParam,
  ServiceCategory,
  updateService,
  uploadServiceImages
} from '../api/services'
import { ServiceModalState } from './serviceModal'
import { Colors } from '../styles'
import { Box, Chip, InputBase, MenuItem, Select, SelectChangeEvent, styled } from '@mui/material'
import CurrencyInput from 'react-currency-input-field'

interface NewServiceModalProps {
  serviceID?: string
  requestClose: () => void
  setModalState: React.Dispatch<SetStateAction<ServiceModalState>>
  location?: LocationData
  availability?: Availability
  title?: string
  category: ServiceCategory[]
  description?: string
  images: FileList | null
  price?: string
  setTitle: React.Dispatch<SetStateAction<string | undefined>>
  setCategory: React.Dispatch<SetStateAction<ServiceCategory[]>>
  setDescription: React.Dispatch<SetStateAction<string | undefined>>
  setImages: React.Dispatch<SetStateAction<FileList | null>>
  setPrice: React.Dispatch<SetStateAction<string | undefined>>
}

const NewServiceModal: React.FC<NewServiceModalProps> = ({
  serviceID,
  requestClose,
  setModalState,
  location,
  availability,
  title,
  category,
  description,
  images,
  price,
  setTitle,
  setCategory,
  setDescription,
  setImages,
  setPrice
}) => {
  const [errorText, setErrorText] = useState<string>('')

  const handleChange = (event: SelectChangeEvent<ServiceCategory[]>) => {
    const {
      target: { value }
    } = event
    setCategory(value as ServiceCategory[])
    return null
  }

  const createService = () => {
    if (!title) {
      setErrorText('Please provide a service title')
      return
    }
    if (!category) {
      setErrorText('Please provide a category')
      return
    }
    if (!description) {
      setErrorText('Please provide a description')
      return
    }
    if (!availability) {
      setErrorText('Please provide an availability')
      return
    }
    if (!location) {
      setErrorText('Please provide a location')
      return
    }
    if (!price) {
      setErrorText('Please provide a price')
      return
    }
    if (!Number(price)) {
      setErrorText('Please provide a valid price.')
      return
    }

    const newService: NewServiceParam = {
      description: description,
      name: title,
      price: Number(price),
      category: category,
      availability: availability,
      location: location
    }

    if (serviceID) {
      updateService(newService, serviceID)
        .then(() => {
          if (images && images?.length > 0) {
            uploadServiceImages(serviceID, images)
          }
          requestClose()
        })
        .catch(err => console.log(err))
    } else {
      addService(newService)
        .then(result => {
          if (images && images?.length > 0) {
            uploadServiceImages(result.id, images)
          }
          requestClose()
        })
        .catch(err => console.log(err))
    }
  }

  const BootstrapInput = styled(InputBase)(() => ({
    'label + &': {},
    '& .MuiInputBase-input': {}
  }))

  return (
    <>
      <ModalHeader
        title={serviceID ? 'Edit Service' : 'New Service'}
        requestClose={requestClose}
        socialLogin={false}
        setErrorText={setErrorText}
      />
      <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <div style={separator}></div>
      </div>
      <TextField title="Service Title" text={title} setText={setTitle} />
      <TextArea title="Description" text={description} setText={setDescription} />
      <div style={{ width: '100%', paddingBottom: '8px' }}>
        <label htmlFor="categoryBox" style={textfieldLabel}>
          Category
        </label>
        <Select
          sx={{ ...textField, maxHeight: 'none' }}
          value={category}
          multiple
          label="Category"
          onChange={handleChange}
          autoWidth
          input={<BootstrapInput />}
          labelId="category-label"
          id="categoryBox"
          renderValue={selected => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map(value => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}>
          {Object.values(ServiceCategory)
            .filter(key => isNaN(Number(key)) && key !== 'Search' && key !== 'All')
            .map(key => {
              return (
                <MenuItem
                  key={key}
                  value={key}
                  style={{ backgroundColor: category.includes(key) ? Colors.pale_gray : undefined }}>
                  {key}
                </MenuItem>
              )
            })}
        </Select>
      </div>
      <div style={{ width: '100%', paddingBottom: '8px' }}>
        <label htmlFor="availability" style={textfieldLabel}>
          Availability
        </label>
        <button
          style={{ ...textField, textAlign: 'left', maxHeight: 'none' }}
          onFocus={e => (e.target.style.borderColor = Colors.light_gray)}
          onBlur={e => (e.target.style.borderColor = Colors.pale_gray)}
          id="availability"
          onClick={() => setModalState('AVAILABILITY')}>
          {availability
            ? groupAvailability(availability).map((group, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}>
                    <p style={{ ...textField, border: 'none' }}>
                      {group.days.length === 1
                        ? Day[Number(group.days[0])]
                        : `${Day[Number(group.days[0])]}-${Day[Number(group.days[group.days.length - 1])]}`}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around'
                      }}>
                      {group.availability
                        .split('#')
                        .filter(elem => !!elem)
                        .map((timeRange, index) => {
                          return (
                            <p
                              key={index}
                              style={{
                                ...textField,
                                border: 'none',
                                margin: 0,
                                textAlign: 'right'
                              }}>
                              {timeRange}
                            </p>
                          )
                        })}
                    </div>
                  </div>
                )
              })
            : null}
        </button>
      </div>
      <div style={{ width: '100%', paddingBottom: '8px' }}>
        <label htmlFor="location" style={textfieldLabel}>
          Location
        </label>
        <button
          style={{ ...textField, textAlign: 'left', maxHeight: 'none' }}
          onFocus={e => (e.target.style.borderColor = Colors.light_gray)}
          onBlur={e => (e.target.style.borderColor = Colors.pale_gray)}
          id="location"
          onClick={() => setModalState('LOCATION')}>
          {location?.name}
        </button>
      </div>
      <div style={{ width: '100%', paddingBottom: '8px' }}>
        <label htmlFor="images" style={textfieldLabel}>
          Images
        </label>
        <input
          style={{ ...textField, textAlign: 'left' }}
          onFocus={e => (e.target.style.borderColor = Colors.light_gray)}
          onBlur={e => (e.target.style.borderColor = Colors.pale_gray)}
          id="images"
          type="file"
          accept="image/"
          multiple
          onChange={e => {
            setImages(e.target.files)
          }}
        />
      </div>
      <div style={{ width: '100%', paddingBottom: '8px' }}>
        <label htmlFor="price" style={textfieldLabel}>
          Price
        </label>
        <CurrencyInput
          id="price"
          style={textField}
          prefix="£"
          decimalsLimit={2}
          value={price}
          onValueChange={val => setPrice(val)}
        />
      </div>
      <Buttons.GreenButton onClick={createService} title="Continue" style={{ marginTop: '10px' }} id="login_button" />
      {errorText ? (
        <label htmlFor="login_button" style={errorStyle}>
          {errorText}
        </label>
      ) : null}
    </>
  )
}

export default NewServiceModal
