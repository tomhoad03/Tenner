import { Stack } from '@mui/system'
import { useEffect, useState } from 'react'
import 'react-alice-carousel/lib/alice-carousel.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Service, ServiceCategory, getTrendingServices } from '../api/services'
import CategoryGrid from '../components/categoryGrid'
import HeaderSearchBox from '../components/headerSearchBox'
import ServicesList from '../components/services/ServicesList'

const Launchpad = () => {
  // ///// //
  // STATE //
  // ///// //

  const [trendingServices, setTrendingServices] = useState<Service[]>([])

  // /////// //
  // EFFECTS //
  // /////// //

  useEffect(() => {
    getTrendingServices()
      .then(result => setTrendingServices(result))
      .catch(err => console.log(err))
  }, [])

  // ///////// //
  // COMPONENT //
  // ///////// //

  return (
    <Stack>
      {
        // ////////////////////////// //
        // INTRO GRAPHIC + SEARCH BAR //
        // ////////////////////////// //
      }

      <Stack
        height={600}
        direction="column"
        className="bg-[#1B1A1D] items-center justify-center text-center"
        spacing={3}>
        <h1 className="text-4xl font-semibold text-white">Find the perfect freelance services for your needs</h1>
        <HeaderSearchBox iconBackgroundColor="green" />
      </Stack>

      <div className="p-3">
        {
          // ////////////////// //
          // POPULAR CATEGORIES //
          // ////////////////// //
        }

        <Stack spacing={1}>
          <h1 className="text-4xl font-semibold">Service Categories</h1>
          <CategoryGrid categories={Object.values(ServiceCategory)} />
        </Stack>

        {
          // ///////////////// //
          // TRENDING SERVICES //
          // ///////////////// //
        }

        <Stack spacing={1}>
          <h1 className="text-4xl font-semibold">Trending Services</h1>
          <ServicesList services={trendingServices} />
        </Stack>
      </div>
    </Stack>
  )
}

export default Launchpad
