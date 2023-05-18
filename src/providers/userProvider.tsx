import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { User, getUser } from '../api/user'
import UserContext from '../contexts/userContext'

interface UserProviderProps {
  children: React.ReactNode
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        getUser(user.uid)
          .then(result => setUser(result))
          .catch(err => {
            console.log(err)
            setUser(null)
          })
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }, [])

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export default UserProvider
