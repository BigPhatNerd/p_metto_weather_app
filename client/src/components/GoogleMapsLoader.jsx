/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

const GoogleMapsLoader = ({ onLoad }) => {
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    })

    loader.load().then(() => {
      if (onLoad) onLoad()
    })
  }, [onLoad])

  return null
}

export default GoogleMapsLoader
