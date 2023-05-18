import React from 'react'
import editButton from '../icons/edit-button.svg'

const EditButtonComponent: React.FC<{ onClick?: React.MouseEventHandler<HTMLElement> }> = ({ onClick }) => {
  return (
    <a href="#" onClick={onClick} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <img src={editButton} alt={'edit-button'} style={{ height: '40px', width: '40px' }} />
    </a>
  )
}

export default EditButtonComponent
