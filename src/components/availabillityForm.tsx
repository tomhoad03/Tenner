import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Availability, Day, TimeRange } from '../api/services'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider, TimeField } from '@mui/x-date-pickers'

export type AvailabilityFormProps = {
  uid: string
  day: string
  time: TimeRange
  remove: (id: string) => void
}

const AvailabilityForm = forwardRef(function AvailabilityForm({ uid, day, time, remove }: AvailabilityFormProps, ref) {
  // TODO: Error checking (end time after start time)
  const [selectDay, setDay] = useState<string>(day)
  const [startTime, setStartTime] = useState<Dayjs | null>(
    dayjs(`2022-04-17T${time.startTime.hour}:${time.startTime.minute}`)
  )
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs(`2022-04-17T${time.endTime.hour}:${time.endTime.minute}`))
  const [errorText, setErrorText] = useState<string>()

  const stateRef = useRef({ selectDay, startTime, endTime })

  useEffect(() => {
    stateRef.current = { selectDay, startTime, endTime }
  }, [selectDay, startTime, endTime])

  useImperativeHandle(
    ref,
    function () {
      return {
        availability: () => {
          const { selectDay, startTime, endTime } = stateRef.current
          if (!startTime) {
            setErrorText('Select a start time')
            return
          }
          if (!endTime) {
            setErrorText('Select an end time')
            return
          }
          const availability: Availability = {}
          const day: Day = Day[selectDay as keyof typeof Day]
          const timeRange: TimeRange = {
            startTime: {
              hour: startTime.hour(),
              minute: startTime.minute()
            },
            endTime: {
              hour: endTime.hour(),
              minute: endTime.minute()
            }
          }
          availability[day] = [timeRange]
          return availability
        }
      }
    },
    []
  )

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target.value)
    setDay(event.target.value as string)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '10px' }}>
        <FormControl sx={{ m: 1, minWidth: 100 }}>
          <InputLabel id="day-label">Day</InputLabel>
          <Select value={selectDay} label="Day" onChange={handleChange} autoWidth labelId="day-label" id="dayBox">
            {Object.keys(Day)
              .filter(key => isNaN(Number(key)))
              .map(key => {
                return (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                )
              })}
          </Select>
        </FormControl>
        <div style={{ display: 'flex', flexDirection: 'row', maxWidth: '50%', alignItems: 'center' }}>
          <TimeField label="Start time" value={startTime} onChange={newVal => setStartTime(newVal)} ampm={false} />
          <TimeField label="End time" value={endTime} onChange={newVal => setEndTime(newVal)} ampm={false} />
          <IconButton aria-label="delete" size="small" onClick={() => remove(uid)}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </div>
      </div>
    </LocalizationProvider>
  )
})

export default AvailabilityForm
