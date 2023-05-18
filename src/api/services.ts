import {
  child,
  get,
  getDatabase,
  limitToFirst,
  onValue,
  push,
  query,
  ref,
  serverTimestamp,
  set,
  update
} from 'firebase/database'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'

import { auth, storage } from '../firebase'
import { useEffect, useState } from 'react'

export enum ServiceCategory {
  Search = 'Search',
  All = 'All',
  Cleaning = 'Cleaning',
  Babysitting = 'Babysitting',
  //'Pest Control' = 'Pest Control',
  Plumbing = 'Plumbing',
  'Electrical Repairs' = 'Electrical Repairs',
  Beauty = 'Beauty',
  'Graphics & Design' = 'Graphics & Design',
  Programming = 'Programming',
  'Music & Audio' = 'Music & Audio'
}

export enum RequestStatus {
  Pending = 'Pending',
  Rejected = 'Rejected',
  Approved = 'Approved',
  Cancelled = 'Cancelled',
  RequestDetails = 'RequestDetails',
  RequestReview = 'RequestReview',
  Delivered = 'Delivered'
}

interface Time {
  hour: number
  minute: number
}

export interface TimeRange {
  startTime: Time
  endTime: Time
}

export enum Day {
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
}

export type Availability = Partial<Record<Day, TimeRange[]>>

export interface LocationData {
  name?: string
  lat?: number
  lng?: number
  r?: number
}

export interface Service {
  id: string
  name: string
  providerID: string
  description: string
  pictures?: string[]
  price: number
  category: ServiceCategory[]
  availability: Availability
  location?: LocationData
}

// TODO: Handle pictures separately
export interface NewServiceParam {
  description: string
  name: string
  price: number
  category: ServiceCategory[]
  availability: Availability
  location?: LocationData
}

export const addService = async (service: NewServiceParam) => {
  const currentUser = auth.currentUser
  const db = getDatabase()
  const newServiceRef = push(child(ref(db), 'Services')).key

  return await new Promise<Service>((resolve, reject) => {
    if (currentUser === null) {
      reject(new Error('No current user authenticated'))
    } else if (newServiceRef === null) {
      reject(new Error('Failed to create service request key'))
    } else {
      set(ref(db, `Services/${newServiceRef}`), {
        providerID: currentUser.uid,
        ...service
      })
        .then(() => {
          console.log(`Successfully created new service with key: ${newServiceRef}`)
          resolve({
            id: newServiceRef,
            providerID: currentUser.uid,
            ...service
          })
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}

export const updateService = async (service: NewServiceParam, uid: string) => {
  const currentUser = auth.currentUser
  const db = getDatabase()

  return await new Promise<Service>((resolve, reject) => {
    if (currentUser === null) {
      reject(new Error('No current user authenticated'))
    } else if (uid === null) {
      reject(new Error('No service request key provided'))
    } else {
      update(ref(db, `Services/${uid}`), {
        providerID: currentUser.uid,
        ...service
      })
        .then(() => {
          console.log(`Successfully updated the service with key: ${uid}`)
          resolve({
            id: uid,
            providerID: currentUser.uid,
            ...service
          })
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}

const uploadServiceImage = async (serviceID: string, image: File) => {
  return await new Promise<string>((resolve, reject) => {
    const imageRef = storageRef(storage, `service_pictures/${serviceID}/${image.name}`)
    uploadBytes(imageRef, image)
      .then(result => {
        getDownloadURL(result.ref)
          .then(url => resolve(url))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

export const uploadServiceImages = async (serviceID: string, images: FileList) => {
  return await new Promise<void>((resolve, reject) => {
    for (let i = 0; i < images.length; i++) {
      const promises = []

      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        promises.push(uploadServiceImage(serviceID, img))
      }

      Promise.all(promises)
        .then(urls => {
          console.log(urls)
          const db = getDatabase()
          update(ref(db, `Services/${serviceID}`), {
            pictures: urls
          })
            .then(() => {
              console.log('success')
              resolve()
            })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    }
  })
}

export const getService = async ({ id }: { id: string }) => {
  const db = getDatabase()
  const serviceRef = ref(db, `Services/${id}`)
  return await new Promise<Service>((resolve, reject) => {
    get(serviceRef)
      .then(snapshot => {
        if (!snapshot.exists()) {
          reject(new Error('Service reference does not exist'))
        } else {
          const { name, providerID, category, price, availability, location, description, pictures } = snapshot.val()
          resolve({
            id,
            name,
            providerID,
            category,
            price,
            availability,
            location,
            description,
            pictures
          })
        }
      })
      .catch(err => reject(err))
  })
}

export interface ServiceRequest {
  id: string
  customerID: string
  serviceID: string
  providerID: string
  reviewID: string
  description: string
  cost: number
  status: RequestStatus
  timestamp: object
  completionTimestamp?: number
  location?: LocationData
}

export interface NewServiceRequestParam {
  serviceID: string
  providerID: string
  description: string
  cost: number
  location?: LocationData
}

export const newServiceRequest = async (request: NewServiceRequestParam) => {
  const currentUser = auth.currentUser
  const db = getDatabase()
  const newRequestRef = push(child(ref(db), 'ServiceRequests')).key
  const newReviewRef = push(child(ref(db), 'ServiceReviews')).key

  return await new Promise<ServiceRequest>((resolve, reject) => {
    if (currentUser === null) {
      reject(new Error('No user currently authenticated.'))
    } else if (newRequestRef === null) {
      reject(new Error('Failed to create a new request key.'))
    } else if (newReviewRef === null) {
      reject(new Error('Failed to create a new review key'))
    } else {
      set(ref(db, `ServiceRequests/${newRequestRef}`), {
        customerID: currentUser.uid,
        reviewID: newReviewRef,
        status: RequestStatus.Pending,
        timestamp: serverTimestamp(),
        ...request
      })
        .then(() => {
          console.log(`Successfully created new service request with key: ${newRequestRef}`)
          resolve({
            id: newRequestRef,
            customerID: currentUser.uid,
            reviewID: newReviewRef,
            status: RequestStatus.Pending,
            timestamp: serverTimestamp(),
            ...request
          })
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}

export const updateServiceRequest = async (serviceRequest: ServiceRequest) => {
  const currentUser = auth.currentUser
  const db = getDatabase()

  return await new Promise<ServiceRequest>((resolve, reject) => {
    if (currentUser === null) {
      reject(new Error('No current user authenticated'))
    } else if (serviceRequest.id === null) {
      reject(new Error('No service request key provided'))
    } else {
      update(ref(db, `ServiceRequests/${serviceRequest.id}`), {
        ...serviceRequest
      })
        .then(() => {
          console.log(`Successfully updated the service request with key: ${serviceRequest.id}`)
          resolve({
            ...serviceRequest
          })
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}

export interface ServiceReview {
  id: string
  status: boolean
  serviceID: string
  serviceRequestID: string
  customerID: string
  providerID: string
  description: string
  timestamp: object
  rating: number
}

export interface NewServiceReviewParam {
  id: string
  serviceRequestID: string
  serviceID: string
  customerID: string
  providerID: string
  description: string
  rating: number
}

export const newReview = async (review: NewServiceReviewParam) => {
  const currentUser = auth.currentUser
  const db = getDatabase()

  return await new Promise<ServiceReview>((resolve, reject) => {
    if (currentUser === null) {
      reject(new Error('No current user authenticated'))
    } else if (review.id === null) {
      reject(new Error('Failed to create review request key'))
    } else {
      set(ref(db, `ServiceReviews/${review.id}`), {
        ...review,
        status: true
      })
        .then(() => {
          console.log(`Successfully created new review with key: ${review.id}`)
          resolve({
            timestamp: serverTimestamp(),
            status: true,
            ...review
          })
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}

export const updateServiceReview = async (review: ServiceReview) => {
  const currentUser = auth.currentUser
  const db = getDatabase()

  return await new Promise<ServiceReview>((resolve, reject) => {
    if (currentUser === null) {
      reject(new Error('No current user authenticated'))
    } else if (review.id === null) {
      reject(new Error('No service review key provided'))
    } else {
      update(ref(db, `ServiceReviews/${review.id}`), {
        ...review
      })
        .then(() => {
          console.log(`Successfully updated the service review with key: ${review.id}`)
          resolve({
            ...review
          })
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}

export const useGetServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const db = getDatabase()

  useEffect(() => {
    const loadData = () => {
      const servicesRef = ref(db, 'Services')

      const unsubscribe = onValue(servicesRef, (snapshot: any) => {
        const servicesData = snapshot.val()
        const servicesArray: Service[] = []

        for (const serviceId in servicesData) {
          const service = servicesData[serviceId]
          servicesArray.push({ id: serviceId, ...service })
        }

        setServices(servicesArray)
      })

      return () => {
        unsubscribe()
      }
    }

    loadData()
  }, [])

  return services
}

export const getServices = async () => {
  const db = getDatabase()
  const servicesRef = ref(db, 'Services')

  return await new Promise<Service[]>((resolve, reject) => {
    get(servicesRef)
      .then(snapshot => {
        const servicesData = snapshot.val()
        const servicesArray: Service[] = []

        for (const serviceId in servicesData) {
          const service = servicesData[serviceId]
          servicesArray.push({ id: serviceId, ...service })
        }
        resolve(servicesArray)
      })
      .catch(err => reject(err))
  })
}

export const getTrendingServices = async () => {
  const db = getDatabase()
  const servicesRef = query(ref(db, 'Services'), limitToFirst(20))

  return await new Promise<Service[]>((resolve, reject) => {
    get(servicesRef)
      .then(snapshot => {
        const servicesData = snapshot.val()
        const servicesArray: Service[] = []

        for (const serviceId in servicesData) {
          const service = servicesData[serviceId]
          servicesArray.push({ id: serviceId, ...service })
        }
        resolve(servicesArray)
      })
      .catch(err => reject(err))
  })
}

export type ReviewSummary = {
  rating: number
  total: number
  numRatings: string
}

export const getReviewSummary = (reviews: ServiceReview[]): ReviewSummary => {
  const sumOfRatings = reviews.reduce((sum, review) => sum + review.rating, 0)
  const numberOfRatings = reviews.length
  const numRatings = numberOfRatings <= 1000 ? `${numberOfRatings}` : `${Math.floor(numberOfRatings / 1000)}k~`

  return {
    rating: numberOfRatings != 0 ? Math.round((sumOfRatings / numberOfRatings) * 100) / 100 : 0,
    total: numberOfRatings ?? 0,
    numRatings: numRatings
  }
}

export const getServiceReviews = async (id: string) => {
  return await new Promise<ServiceReview[]>((resolve, reject) => {
    getAllServiceReviews()
      .then(reviews => resolve(reviews.filter(review => review.serviceID === id)))
      .catch(err => reject(err))
  })
}

export const getProfileServiceReviews = async (id: string) => {
  return await new Promise<ServiceReview[]>((resolve, reject) => {
    getAllServiceReviews()
      .then(reviews => resolve(reviews.filter(review => review.providerID === id)))
      .catch(err => reject(err))
  })
}

export const getAllServiceReviews = async () => {
  const db = getDatabase()
  const reviewsRef = ref(db, 'ServiceReviews')

  return await new Promise<ServiceReview[]>((resolve, reject) => {
    get(reviewsRef)
      .then(snapshot => {
        const reviewsData = snapshot.val()
        const reviewsArray: ServiceReview[] = []

        for (const reviewId in reviewsData) {
          const review = reviewsData[reviewId]
          reviewsArray.push({ id: reviewId, ...review })
        }
        resolve(reviewsArray)
      })
      .catch(err => reject(err))
  })
}

export const getServiceRequests = async () => {
  const db = getDatabase()
  const serviceRequestsRef = ref(db, 'ServiceRequests')

  return await new Promise<ServiceRequest[]>((resolve, reject) => {
    get(serviceRequestsRef)
      .then(snapshot => {
        const serviceRequestsData = snapshot.val()
        const serviceRequestsArray: ServiceRequest[] = []

        for (const serviceRequestId in serviceRequestsData) {
          const serviceRequest = serviceRequestsData[serviceRequestId]
          serviceRequestsArray.push({ id: serviceRequestId, ...serviceRequest })
        }
        resolve(serviceRequestsArray)
      })
      .catch(err => reject(err))
  })
}

export const getServiceRequest = async (serviceRequestID: string) => {
  const db = getDatabase()
  const serviceRequestsRef = ref(db, 'ServiceRequests')
  return await new Promise<ServiceRequest>((resolve, reject) => {
    get(child(serviceRequestsRef, serviceRequestID))
      .then(snapshot => {
        const serviceRequestData = snapshot.val()
        if (serviceRequestData) {
          resolve(serviceRequestData)
        } else {
          reject(new Error('Service request not found'))
        }
      })
      .catch(err => reject(err))
  })
}

interface DayGroup {
  days: number[]
  availability: string
}

export const groupAvailability = (availability: Availability) => {
  const groups: DayGroup[] = []

  let currentGroup: DayGroup = {
    days: [],
    availability: ''
  }
  for (let i = 0; i < 7; i++) {
    for (const [key, range] of Object.entries(availability)) {
      if (Number(key) === i || key === Day[i]) {
        let timeRange = ''
        for (const rg of range) {
          timeRange = timeRange + timeRangeToString(rg) + '#'
        }
        timeRange = timeRange.trimEnd()

        const prevDay = currentGroup.days[currentGroup.days.length - 1]
        if (i === prevDay + 1 && timeRange === currentGroup.availability) {
          currentGroup.days.push(i)
        } else {
          currentGroup.days.length > 0 && groups.push(currentGroup)
          currentGroup = {
            days: [i],
            availability: timeRange
          }
        }
      }
    }
  }
  currentGroup.days.length > 0 && groups.push(currentGroup)
  return groups
}

const timeRangeToString = (range: TimeRange) => {
  return `${range.startTime.hour.toString().padStart(2, '0')}:${range.startTime.minute
    .toString()
    .padStart(2, '0')}-${range.endTime.hour.toString().padStart(2, '0')}:${range.endTime.minute
    .toString()
    .padStart(2, '0')}`
}
