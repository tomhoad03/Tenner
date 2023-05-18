import { useCallback, useEffect, useState, useRef } from 'react'
import { Availability, Day } from '../api/services'
import { BlackButton, GreenButton } from './buttons'
import ModalHeader from './modalHeader'
import AvailabilityForm, { AvailabilityFormProps } from './availabillityForm'
import { uid } from 'react-uid'

interface AvailabilityModalProps {
  requestClose: () => void
  setAvailability: React.Dispatch<React.SetStateAction<Availability | undefined>>
  availability?: Availability
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({ requestClose, setAvailability, availability }) => {
  const [avail, setAvail] = useState<AvailabilityFormProps[]>([])
  const formRefs = useRef(Array(avail.length).fill(null))

  const save = () => {
    const updatedAvailability: Availability = {}
    formRefs?.current?.forEach((ref: any) => {
      if (ref !== null) {
        const result: Availability = ref.availability()
        for (const [key, value] of Object.entries(result)) {
          const dayIndex = Object.keys(Day).indexOf(key)
          const day: Day = Day[dayIndex] as unknown as Day
          if (updatedAvailability[day]) {
            for (const val of value) {
              updatedAvailability[day]?.push(val)
            }
          } else {
            updatedAvailability[day] = value
          }
        }
      }
    })
    console.log('updated: ', updatedAvailability)
    setAvailability(updatedAvailability)
    requestClose()
  }

  const remove = (id: string) => {
    setAvail(prev => prev.filter(elem => elem.uid !== id))
  }

  useEffect(() => {
    if (availability) {
      const newAvail: AvailabilityFormProps[] = []
      for (let i = 0; i < 7; i++) {
        for (const [key, range] of Object.entries(availability)) {
          const day = Day[key as keyof typeof Day]
          if (day === i) {
            for (const rg of range) {
              const newItem = {
                day: Day[i],
                time: rg,
                remove: remove
              }
              newAvail.push({ uid: uid(newItem), ...newItem })
            }
          }
        }
      }
      console.log(newAvail)
      setAvail(newAvail)
    }
  }, [availability])

  const addDay = useCallback(() => {
    const newItem = {
      day: 'Monday',
      time: { startTime: { hour: 9, minute: 0 }, endTime: { hour: 17, minute: 0 } },
      remove: remove
    }
    setAvail(prev => [...prev, { uid: uid(newItem), ...newItem }])
  }, [setAvail])

  return (
    <>
      <ModalHeader title="Availabilty" requestClose={requestClose} />
      {avail.map((item, index) => {
        return (
          <AvailabilityForm
            key={item.uid}
            uid={item.uid}
            day={item.day}
            time={item.time}
            remove={remove}
            ref={(element: any) => {
              formRefs.current[index] = element
            }}
          />
        )
      })}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <BlackButton onClick={addDay} title="Add day" style={{ width: '40%' }} />
        <GreenButton onClick={save} title="Save" style={{ width: '40%' }} />
      </div>
    </>
  )
}

export default AvailabilityModal
