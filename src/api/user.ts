import { get, getDatabase, onValue, ref, set, update } from 'firebase/database'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { auth, storage } from '../firebase'
import { AccountStatus } from './auth'
import { useEffect, useState } from 'react'

export type UserType = 'Customer' | 'Provider' | 'Admin'

export interface User {
  type: UserType
  id: string
  username: string
  profileURL?: string
  biography?: string
  location?: string // MARK: Change???
  status?: AccountStatus
  requestDetails?: string
}

export const createUser = async (user: User) => {
  const db = getDatabase()
  return await new Promise<User>((resolve, reject) => {
    set(ref(db, `Users/${user.type}/${user.id}`), {
      biography: user.biography ?? null,
      location: user.location ?? null,
      status: user.type === 'Provider' ? 'Pending' : null,
      username: user.username
    })
      .then(() => {
        console.log('Created new user in Realtime database')
        resolve({
          ...user
        })
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}

export const provideAdditionalDetails = async (user: User, details: string) => {
  const db = getDatabase()
  return await new Promise<void>((resolve, reject) => {
    update(ref(db, `Users/${user.type}/${user.id}`), {
      additionalDetails: details
    })
      .then(resolve)
      .catch(err => reject(err))
  })
}

export const updateProfilePic = async (uid: string, userType: UserType, photo: File) => {
  await new Promise<void>((resolve, reject) => {
    const profilePicRef = storageRef(storage, `profile_pictures/${uid}`)
    console.log('Begin uploading bytes', profilePicRef)
    uploadBytes(profilePicRef, photo)
      .then(result => {
        console.log('Uploaded image to storage')
        getDownloadURL(result.ref)
          .then(downloadURL => {
            console.log('Download url: ', downloadURL)
            const db = getDatabase()
            update(ref(db, `Users/${userType}/${uid}`), {
              profileURL: downloadURL
            })
              .then(() => {
                resolve()
              })
              .catch(err => {
                console.log('Error updating realtime database')
                reject(err)
              })
          })
          .catch(err => {
            console.log('Unable to get download URL of uploaded profile image.')
            reject(err)
          })
      })
      .catch(err => {
        console.log('Failed to upload image to storage. ')
        reject(err)
      })
  })
}

export interface UpdateUserParams {
  user: User
  info: {
    username?: string
    biography?: string
    location?: string
    status?: string
  }
}
export const updateUser = async (params: UpdateUserParams) => {
  const db = getDatabase()
  const currentUser = auth.currentUser

  await new Promise<void>((resolve, reject) => {
    if (currentUser === null) {
      reject(new Error('No user currently authenticated.'))
    } else {
      update(ref(db, `Users/${params.user.type}/${params.user.id}`), {
        ...params.info
      })
        .then(() => {
          console.log('Updated user in Realtime database')
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}

const getUserByType = async (type: UserType, uid: string) => {
  const db = getDatabase()
  const userRef = ref(db, `Users/${type}/${uid}`)

  return await new Promise<User | null>((resolve, reject) => {
    get(userRef)
      .then(snapshot => {
        if (!snapshot.exists()) {
          resolve(null)
        } else {
          const { biography, location, status, username, profileURL, requestDetails } = snapshot.val()
          const data: User = {
            id: uid,
            type,
            username,
            biography,
            location,
            profileURL,
            requestDetails,
            status
          }
          resolve(data)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const getUser = async (uid: string) => {
  return await new Promise<User>((resolve, reject) => {
    Promise.all([getUserByType('Admin', uid), getUserByType('Customer', uid), getUserByType('Provider', uid)])
      .then(results => {
        const user = results.find(result => result !== null)
        if (user === null || user === undefined) {
          reject(new Error(`User ${uid} does not exist in any user type`))
        } else {
          resolve(user)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const useGetUser = (uid: string) => {
  const [user, setUser] = useState<User | undefined>()

  useEffect(() => {
    const loadData = () => {
      const db = getDatabase()
      const usersRef = ref(db, 'Users')

      const unsubscribe = onValue(usersRef, (snapshot: any) => {
        const usersData = snapshot.val()

        for (const userType in usersData) {
          if (Object.prototype.hasOwnProperty.call(usersData, userType)) {
            const userRef = ref(db, `Users/${userType}/${uid}`)

            onValue(userRef, (snapshot: any) => {
              const userData = snapshot.val()

              if (userData) {
                const { biography, location, status, username, profileURL, requestDetails } = userData
                const data: User = {
                  id: uid,
                  type: userType as UserType,
                  username,
                  biography,
                  location,
                  profileURL,
                  requestDetails,
                  status
                }

                setUser(data)
              } else {
                setUser(undefined) // User not found
              }
            })
          }
        }
      })

      return () => {
        unsubscribe()
      }
    }

    loadData()
  }, [uid])

  return user
}

export const getCurrentUser = async () => {
  const currentUser = auth.currentUser

  return await new Promise<User>((resolve, reject) => {
    if (currentUser === null) {
      reject(new Error('No user currently authenticated.'))
    } else {
      getUser(currentUser.uid)
        .then(user => {
          resolve(user)
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}

export const getCustomers = async () => {
  const db = getDatabase()
  const usersRef = ref(db, 'Users/Customer')

  return await new Promise<User[]>((resolve, reject) => {
    get(usersRef)
      .then(snapshot => {
        const usersData = snapshot.val()
        const usersArray: User[] = []

        for (const userId in usersData) {
          const user = usersData[userId]
          usersArray.push({ id: userId, ...user })
        }
        resolve(usersArray)
      })
      .catch(err => reject(err))
  })
}
