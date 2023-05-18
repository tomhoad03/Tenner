import Carousel from 'react-material-ui-carousel'

interface ImageCarouselProps {
  images: string[]
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  return (
    <div style={{ zIndex: 0 }}>
      <Carousel animation="slide" autoPlay={false}>
        {images.map((image, i) => {
          return <img key={i} src={image} width={'100%'} />
        })}
      </Carousel>
    </div>
  )
}

export default ImageCarousel
