import { Divider } from '@mui/material'
import { Stack } from '@mui/system'
import { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ServiceCategory } from '../../api/services'

type CategorySelectorProps = {
  categories: ServiceCategory[]
  activeCategory: ServiceCategory
  setActiveCategory: React.Dispatch<React.SetStateAction<ServiceCategory>>
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <Stack>
      <Divider />

      <Stack direction="row" spacing={3} className="overflow-auto px-4 py-3">
        {categories.map((category: ServiceCategory) => {
          if (category != ServiceCategory.Search) {
            return (
              <CategoryLabel
                key={category}
                category={category}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            )
          }
        })}
      </Stack>

      <Divider />
    </Stack>
  )
}

type CategoryLabelProps = {
  category: ServiceCategory
  activeCategory: ServiceCategory
  setActiveCategory: React.Dispatch<React.SetStateAction<ServiceCategory>>
}

const CategoryLabel: React.FC<CategoryLabelProps> = ({ category, activeCategory, setActiveCategory }) => {
  const navigate = useNavigate()

  // ///////// //
  // COMPONENT //
  // ///////// //

  return (
    <div
      className={`cursor-pointer whitespace-nowrap inline-flex  ${
        category === activeCategory ? 'font-medium text-black' : 'font-normal text-gray-500'
      }`}
      onClick={handleClick}>
      {category}
    </div>
  )

  // //////// //
  // HANDLERS //
  // //////// //

  function handleClick(event: MouseEvent) {
    setActiveCategory(category)
    // resetting the navigation
    navigate(`/services/${category}`)
  }
}

export default CategorySelector
