import { Grid } from '@mui/material'
import { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ServiceCategory } from '../api/services'

type CategoryWheelProps = {
  categories: ServiceCategory[]
}

const CategoryGrid: React.FC<CategoryWheelProps> = ({ categories }) => {
  // return (
  //   <Stack direction="row" spacing={3} className="px-4 py-3 inline">
  //     {categories.map((category: ServiceCategory) => {
  //       if (category != ServiceCategory.Search) {
  //         return <CategoryCard key={category} category={category} />
  //       }
  //     })}
  //   </Stack>
  // )

  return (
    <Grid container={true} direction="row" spacing={2} className="px-2">
      {categories &&
        categories.map(category => {
          if (category != 'Search' && category != 'All') {
            return (
              <Grid key={category} xs={6} sm={4} md={3} lg={1.5}>
                <CategoryCard category={category} />
              </Grid>
            )
          }
        })}
    </Grid>
  )
}

type CategoryCardProps = {
  category: ServiceCategory
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const navigate = useNavigate()

  // ///////// //
  // COMPONENT //
  // ///////// //

  return (
    <div className="scale-100 hover:scale-105 transition-all">
      <div className={`cursor-pointer inline overflow-x-auto relative`} onClick={handleClick}>
        <img className="p-3 h-[320px] w-[200px]" src={require(`../icons/categories/${category}.png`)} />
        <div className="absolute top-4 left-4 text-xl text-white font-semibold">{category}</div>
      </div>
    </div>
  )

  // //////// //
  // HANDLERS //
  // //////// //

  function handleClick(event: MouseEvent) {
    // resetting the navigation
    navigate(`/services/${category}`)
  }
}

export default CategoryGrid
