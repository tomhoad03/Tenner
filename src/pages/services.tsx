import { Stack } from '@mui/system'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Service, ServiceCategory, getServices } from '../api/services'
import CategorySelector from '../components/services/CategorySelector'
import ServicesHeader from '../components/services/ServicesHeader'
import ServicesList from '../components/services/ServicesList'

interface Accum {
  title: string
  data: Service[]
}

const Services = () => {
  // ///// //
  // STATE //
  // ///// //

  const [services, setServices] = useState<Service[]>([])
  const { category } = useParams()
  const cat = ServiceCategory[category as keyof typeof ServiceCategory]
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(cat ?? ServiceCategory.All)
  const [searchParams, setSearchParams] = useSearchParams()

  console.log(cat)

  // /////// //
  // EFFECTS //
  // /////// //

  useEffect(() => {
    getServices()
      .then(result => setServices(result))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    // if the search is present -> need to update category
    if (searchParams.get('query')) {
      setActiveCategory(ServiceCategory.Search)
    }
  }, [searchParams])

  // Mapping of a ServiceCategory to a description
  const categoryDescriptions = new Map<ServiceCategory, string>([
    [ServiceCategory.Search, 'View the results of your search'],
    [ServiceCategory.All, 'All our services, in one place.'],
    [ServiceCategory.Cleaning, 'Get your home or office cleaned'],
    [ServiceCategory.Babysitting, 'Get someone to look after your child'],
    //[ServiceCategory['Pest Control'], 'Get rid of pests in your home or office'],
    [ServiceCategory.Plumbing, 'Get your plumbing issues fixed'],
    [ServiceCategory['Electrical Repairs'], 'Get your electrical issues fixed'],
    [ServiceCategory.Beauty, 'Get a beauty treatment'],
    [ServiceCategory['Music & Audio'], 'Find the perfect sound']
  ])

  // /////////////////////////// //
  // ACTIVE CATEGORY DESCRIPTION //
  // /////////////////////////// //

  const categoryDescription = useMemo(
    () => (activeCategory ? categoryDescriptions.get(activeCategory) : "Uh oh! We don't know what this category is!"),
    [activeCategory]
  )

  // //////////////////// //
  // SERVICES BY CATEGORY //
  // //////////////////// //

  const servicesByCategory = useMemo(
    () =>
      services
        .slice()
        .filter(s => s)
        .reduce((accum: Accum[], current) => {
          const allCategoryGroup = { title: 'All', data: services }
          accum.push(allCategoryGroup)
          if (current && current.category) {
            current.category.forEach(cat => {
              let categoryGroup = accum.find(x => x.title === cat)
              if (!categoryGroup) {
                categoryGroup = { title: cat, data: [] }
                accum.push(categoryGroup)
              }
              categoryGroup.data.push(current)
            })
          }
          return accum
        }, []),
    [services]
  )

  // /////////////////////////// //
  // SERVICES IN ACTIVE CATEGORY //
  // /////////////////////////// //

  // This memo would also be used to filter with the search text
  // We also store this as a memo for performance reasons
  const servicesInActiveCategory = useMemo(() => {
    const filtered = activeCategory
      ? servicesByCategory.find(item => item.title === activeCategory)?.data
      : servicesByCategory.find(item => item.title === 'All')?.data
    return filtered
  }, [activeCategory, servicesByCategory, searchParams])

  // /////////////////////////////// //
  // SERVICES MATCHING SEARCH STRING //
  // /////////////////////////////// //

  const searchTerms = useMemo(() => searchParams.get('query')?.trim().split(' '), [searchParams])

  const servicesMatchingSearchString = useMemo(() => {
    return services.filter(service => {
      if (searchTerms) {
        let matches = false
        searchTerms.forEach(searchTerm => {
          if (
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.location?.name?.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            matches = true
          }
        })
        //console.log(service.description + ' does not contain search terms: ' + searchTerms)
        return matches
      }
    })
  }, [services, searchTerms])

  // ///////// //
  // COMPONENT //
  // ///////// //

  return (
    <Stack spacing={2}>
      <CategorySelector
        categories={Object.values(ServiceCategory)}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {
        // /////////////// //
        // SERVICES HEADER //
        // /////////////// //
      }

      <ServicesHeader activeServiceCategory={activeCategory} activeServiceCategoryMessage={categoryDescription} />

      {
        // ///////////// //
        // SERVICES LIST //
        // ///////////// //
      }
      <ServicesList services={searchTerms ? servicesMatchingSearchString : servicesInActiveCategory} />
    </Stack>
  )
}

export default Services
