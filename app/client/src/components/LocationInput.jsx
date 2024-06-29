/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useContext } from 'react'
import GoogleMapsLoader from './GoogleMapsLoader'
import { UserContext } from '../contexts/UserContext'

function LocationInput({ searchFormat }) {
  const {
    updateUserLocation,
    location,
    setLocation,
    getWeather,
    errorMessage,
  } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [loadingText, setLoadingText] = useState('Loading')

  const inputRef = useRef(null)

  useEffect(() => {
    let intervalId

    if (loading) {
      let count = 0
      intervalId = setInterval(() => {
        setLoadingText(`Loading${'.'.repeat(count % 4)}`)
        count++
      }, 500)
    } else {
      setLoadingText('Loading')
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [loading])

  useEffect(() => {
    if (searchFormat === 'google') {
      const initAutocomplete = () => {
        if (window.google) {
          const autocomplete = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ['address'],
            }
          )

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace()
            if (place.geometry) {
              const { lat, lng } = place.geometry.location

              const locationData = {
                latitude: lat(),
                longitude: lng(),
                address: place.formatted_address,
                city: place.address_components[1].long_name,
                state: place.address_components[3].short_name,
              }
              setLocation(locationData)
              setValidationMessage('')
            } else {
              setValidationMessage('Please select a valid location')
            }
          })
        }
      }
      initAutocomplete()
    }
  }, [searchFormat])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (searchFormat === 'google') {
      const { latitude, longitude, address } = location
      if (address === '') {
        return
      }
      if (latitude && longitude) {
        try {
          setLoading(true)
          await getWeather(location)
        } finally {
          setLoading(false)
        }
      } else {
        setValidationMessage('Please enter a valid address.')
      }
    } else if (searchFormat === 'city and state') {
      const { city, state } = location
      if (city && state && state.length === 2) {
        try {
          setLoading(true)
          await getWeather({ city, state })
        } finally {
          setLoading(false)
        }
      } else {
        setValidationMessage('Please enter both city and state.')
      }
    } else if (searchFormat === 'current location') {
      const { latitude, longitude, address } = location
      if (latitude && longitude && address) {
        try {
          setLoading(true)
          await getWeather(location)
        } finally {
          setLoading(false)
        }
      } else {
        setValidationMessage(
          'Failed to get current location. Please try again.'
        )
      }
    }
  }

  const handleGeolocation = async () => {
    if (navigator.geolocation) {
      setLoading(true)
      try {
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        )
        const { latitude, longitude } = position.coords
        const geocoder = new window.google.maps.Geocoder()
        const latlng = new window.google.maps.LatLng(latitude, longitude)

        const results = await new Promise((resolve, reject) =>
          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK') {
              resolve(results)
            } else {
              reject(new Error('Geocoder failed due to: ' + status))
            }
          })
        )

        if (results[0]) {
          const locationData = {
            latitude,
            longitude,
            address:
              results[0].address_components[0].long_name +
              ' ' +
              results[0].address_components[1].long_name,
            city: results[0].address_components[2].long_name,
            state: results[0].address_components[4].short_name,
          }
          setLocation(locationData)
          updateUserLocation(locationData)
          await getWeather(locationData)
        }
      } finally {
        setLoading(false)
      }
    } else {
      console.error('Geolocation is not supported by this browser.')
      setValidationMessage('Geolocation is not supported by this browser')
      setTimeout(() => setValidationMessage(''), 3000)
    }
  }

  const isButtonDisabled = () => {
    if (validationMessage) return true
    if (loading) return true
    if (searchFormat === 'google') {
      return !location.address || !location.latitude || !location.longitude
    }
    if (searchFormat === 'city and state') {
      return !location.city || !location.state || location.state.length < 2
    }
  }

  return (
    <div>
      {searchFormat === 'google' && <GoogleMapsLoader onLoad={() => {}} />}
      <form onSubmit={handleSubmit}>
        {searchFormat === 'google' && (
          <input
            ref={inputRef}
            type="text"
            value={location.address}
            onChange={({ target }) => {
              if (target.value === '') {
                setValidationMessage('')
              }

              setLocation({ address: target.value })
            }}
            placeholder="Enter a location"
          />
        )}
        {searchFormat === 'city and state' && (
          <>
            <input
              type="text"
              value={location.city}
              onChange={({ target }) =>
                setLocation({ ...location, city: target.value })
              }
              placeholder="Enter city"
            />
            <input
              type="text"
              value={location.state}
              onChange={({ target }) => {
                let value = target.value.toUpperCase()
                if (value.length > 2) {
                  value = value.slice(0, 2)
                }
                setLocation({ ...location, state: value })
              }}
              placeholder="Enter state"
              maxLength="2"
            />
          </>
        )}
        {searchFormat === 'current location' && (
          <button type="button" onClick={handleGeolocation} disabled={loading}>
            Use Current Location
          </button>
        )}
        {searchFormat !== 'current location' && !isButtonDisabled() && (
          <button disabled={isButtonDisabled()} type="submit">
            Get Weather
          </button>
        )}
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {loading && <p style={{ color: 'green' }}>{loadingText}</p>}
      {validationMessage && <p style={{ color: 'red' }}>{validationMessage}</p>}
    </div>
  )
}

export default LocationInput
