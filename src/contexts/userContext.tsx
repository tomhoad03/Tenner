import { createContext } from 'react'
import { User } from '../api/user'

interface UserContextProps {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const UserContext = createContext<UserContextProps>({
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {}
})

export default UserContext
