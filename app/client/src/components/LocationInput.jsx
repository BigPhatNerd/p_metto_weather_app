/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useContext } from 'react'
import GoogleMapsLoader from './GoogleMapsLoader'
import { UserContext } from '../contexts/UserContext'

function LocationInput({ searchFormat }) {
  const {
    updateUserLocation,

    setLocation,
    getWeather,
    errorMessage,
  } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [loadingText, setLoadingText] = useState('Loading')
  const [inputValue, setInputValue] = useState({
    address: '',
    city: '',
    state: '',
    latitude: '',
    longitude: '',
  })
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
                state:
                  place.address_components[3]?.short_name ||
                  place.address_components[1].short_name,
              }
              setInputValue(locationData)
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
      const { latitude, longitude, address } = inputValue
      if (address === '') {
        return
      }
      if (latitude && longitude) {
        try {
          setLoading(true)
          const { success } = await getWeather(inputValue)
          if (success) {
            setLocation(inputValue)
          }
        } finally {
          setLoading(false)
        }
      } else {
        setValidationMessage('Please enter a valid address.')
      }
    } else if (searchFormat === 'city and state') {
      const { city, state } = inputValue
      if (city && state && state.length === 2) {
        try {
          setLoading(true)
          const { success } = await getWeather(inputValue)

          if (success) {
            setLocation(inputValue)
          }
        } finally {
          setLoading(false)
        }
      } else {
        setValidationMessage('Please enter both city and state.')
      }
    } else if (searchFormat === 'current location') {
      const { latitude, longitude, address } = inputValue
      if (latitude && longitude && address) {
        try {
          setLoading(true)
          setLocation(inputValue)
        } finally {
          setLoading(false)
        }
      } else {
        setValidationMessage(
          'Failed to get current location. Please try again.'
        )
      }
    }
    setInputValue({ address: '', city: '', state: '' })
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
      return (
        !inputValue.address || !inputValue.latitude || !inputValue.longitude
      )
    }
    if (searchFormat === 'city and state') {
      return (
        !inputValue.city || !inputValue.state || inputValue.state.length < 2
      )
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
            value={inputValue.address}
            onChange={({ target }) => {
              setValidationMessage('')
              setInputValue({ address: target.value })
            }}
            placeholder="Enter a location"
          />
        )}
        {searchFormat === 'city and state' && (
          <>
            <input
              type="text"
              value={inputValue.city}
              onChange={({ target }) =>
                setInputValue({ ...inputValue, city: target.value })
              }
              placeholder="Enter city"
            />
            <input
              type="text"
              value={inputValue.state}
              onChange={({ target }) => {
                let value = target.value.toUpperCase()
                if (value.length > 2) {
                  value = value.slice(0, 2)
                }
                setInputValue({ ...inputValue, state: value })
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
      {errorMessage &&
        (errorMessage.function === 'updateUserLocation' ||
          errorMessage.function === 'getWeather') && (
          <p style={{ color: 'red' }}>{errorMessage.message}</p>
        )}
      {loading && <p style={{ color: 'green' }}>{loadingText}</p>}
      {validationMessage && <p style={{ color: 'red' }}>{validationMessage}</p>}
    </div>
  )
}

export default LocationInput
