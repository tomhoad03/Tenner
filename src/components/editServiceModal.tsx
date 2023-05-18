/*import React, { useState } from 'react'
import ModalHeader from './modalHeader'
import { errorText as errorStyle } from '../styles/labels'
import TextField from './textField'
import { separator } from '../styles/components'
import { Buttons } from '.'
import { Availability, NewServiceParam, Service, ServiceCategory, updateService } from '../api/services'

interface EditServiceModalProps {
  requestClose: () => void
  existingService: Service | undefined
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ requestClose, existingService }) => {
  const [title, setTitle] = useState<string | undefined>(existingService?.name)
  const [category, setCategory] = useState<ServiceCategory[] | undefined>(existingService?.category)
  const [description, setDescription] = useState<string | undefined>(existingService?.description)
  const [availability, setAvailability] = useState<Availability | undefined>(existingService?.availability)
  const [location, setLocation] = useState<string | undefined>(undefined)
  const [workRadius, setWorkRadius] = useState<string | undefined>(existingService?.coverage)
  const [images, setImages] = useState<string[] | undefined>(existingService?.pictures)
  const [price, setPrice] = useState<number | undefined>(existingService?.price)
  const [errorText, setErrorText] = useState<string>('')

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
    if (!workRadius) {
      setErrorText('Please provide a workRadius')
      return
    }
    if (!price) {
      setErrorText('Please provide a price')
      return
    }
    if (price) {
      setErrorText('Please provide a valid price.')
      return
    }

    const updatedService: NewServiceParam = {
      description: description,
      name: title,
      pictures: images,
      price: price,
      category: category,
      availability: availability,
      coverage: workRadius
    }

    updateService(updatedService, existingService?.id as string)
      .then(requestClose)
      .catch(err => console.log(err))
  }

  return (
    <>
      <ModalHeader title="Edit Service" requestClose={requestClose} socialLogin={false} setErrorText={setErrorText} />
      <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <div style={separator}></div>
      </div>
      <TextField title="Service Title" text={title} setText={setTitle} />
      <TextField title="Description" text={description} setText={setDescription} />
      <TextField title="Category" text={category?.toString()} setText={setTitle} />
      <TextField title="Availability" text={availability?.toString()} setText={setTitle} />
      <TextField title="Location" text={location} setText={setLocation} />
      <TextField title="Work Radius" text={workRadius} setText={setWorkRadius} />
      <TextField title="Images" text={images?.toString()} setText={setTitle} />
      <TextField title="Price" text={price?.toString()} setText={setTitle} />
      <Buttons.GreenButton onClick={createService} title="Continue" style={{ marginTop: '10px' }} id="login_button" />
      {errorText ? (
        <label htmlFor="login_button" style={errorStyle}>
          {errorText}
        </label>
      ) : null}
    </>
  )
}

export default EditServiceModal*/
