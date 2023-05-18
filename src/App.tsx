import { ThemeProvider } from '@mui/system'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components'
import { Launchpad, Layout, Orders, Profile, ProfileSettings, ServiceListing, Services } from './pages'
import Paths from './paths'
import UserProvider from './providers/userProvider'
import './styles/fonts.css' // For non-MUI components
import theme from './styles/theme'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <UserProvider>
          <Header />
          <Routes>
            <Route path={Paths.Root} element={<Layout />}>
              <Route index element={<Launchpad />} />
              <Route path={Paths.Services} element={<Services />} />
              <Route path={Paths.ServiceCategory} element={<Services />} />
              <Route path={Paths.Listing} element={<ServiceListing />} />
              <Route path={Paths.Profile} element={<Profile />} />
              <Route path={Paths.Orders} element={<Orders />} />
              <Route path={Paths.Settings} element={<ProfileSettings />} />
            </Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
export default App
