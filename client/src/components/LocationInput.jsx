/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useContext } from 'react'
import GoogleMapsLoader from './GoogleMapsLoader'
import { UserContext } from '../contexts/UserContext'

function LocationInput({ searchFormat }) {
  const { updateUserLocation, location, setLocation, getWeather, setWeather } =
    useContext(UserContext)
  // const [location, setLocation] = useState({ address: '' })
  const [validationMessage, setValidationMessage] = useState('')
  const inputRef = useRef(null)

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
              const formattedAddress = formatAddress(place.address_components)
              const locationData = {
                latitude: lat(),
                longitude: lng(),
                address: formattedAddress,
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
    } else if (searchFormat === 'current location') {
      handleGeolocation()
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
          const weatherData = await getWeather(location)
          setWeather(weatherData)
        } catch (error) {
          setValidationMessage(
            error.response ? error.response.data.message : error.message
          )
          setTimeout(() => setValidationMessage(''), 3000)
        }
      } else {
        setValidationMessage('Please enter a valid address.')
      }
    } else if (searchFormat === 'city and state') {
      const { city, state } = location
      if (city && state && state.length === 2) {
        try {
          const weatherData = await getWeather({ city, state })
          setWeather(weatherData)
        } catch (error) {
          setValidationMessage(
            error.response ? error.response.data.message : error.message
          )
          setTimeout(() => setValidationMessage(''), 3000)
        }
      } else {
        setValidationMessage('Please enter both city and state.')
      }
    } else if (searchFormat === 'current location') {
      const { latitude, longitude, address } = location
      if (latitude && longitude && address) {
        try {
          const weatherData = await getWeather(location)
          setWeather(weatherData)
        } catch (error) {
          setValidationMessage(
            error.response ? error.response.data.message : error.message
          )
          setTimeout(() => setValidationMessage(''), 3000)
        }
      } else {
        setValidationMessage(
          'Failed to get current location. Please try again.'
        )
      }
    }
  }

  function formatAddress(addressComponents) {
    let streetNumber = ''
    let route = ''
    let locality = ''
    let state = ''
    let postalCode = ''

    addressComponents.forEach((component) => {
      const type = component.types[0]
      switch (type) {
        case 'street_number':
          streetNumber = component.long_name
          break
        case 'route':
          route = component.short_name
          break
        case 'locality':
          locality = component.long_name
          break
        case 'administrative_area_level_1':
          state = component.short_name
          break
        case 'postal_code':
          postalCode = component.long_name
          break
        default:
          break
      }
    })

    const formattedAddress = `${streetNumber} ${route}\n${locality}, ${state} ${postalCode}`
    return formattedAddress
  }

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const geocoder = new window.google.maps.Geocoder()
          const latlng = new window.google.maps.LatLng(latitude, longitude)

          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK') {
              if (results[0]) {
                const infoToFormat = results[0].address_components
                updateUserLocation({
                  latitude,
                  longitude,
                  address: formatAddress(infoToFormat),
                })
                setValidationMessage('')
              } else {
                console.error('No results found')
                setValidationMessage('No results found')
              }
            } else {
              console.error('Geocoder failed due to: ' + status)
              setValidationMessage('Geocoder failed')
            }
          })
        },
        (error) => {
          console.error('Error occurred while fetching geolocation: ', error)
          setValidationMessage('Error occurred while fetching geolocation')
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
      setValidationMessage('Geolocation is not supported by this browser')
    }
  }

  const isButtonDisabled = () => {
    if (validationMessage) {
      return true
    }
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
          <button type="button" onClick={handleGeolocation}>
            Use Current Location
          </button>
        )}
        {searchFormat !== 'current location' && (
          <button disabled={isButtonDisabled()} type="submit">
            Get Weather
          </button>
        )}
      </form>
      {validationMessage && <p style={{ color: 'red' }}>{validationMessage}</p>}
    </div>
  )
}

export default LocationInput
