import { useState } from 'react'
import LocationInput from './LocationInput'

function SelectSearchFormat() {
  const [searchFormat, setSearchFormat] = useState('google')

  const handleFormatChange = (event) => {
    setSearchFormat(event.target.value)
  }

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            value="google"
            checked={searchFormat === 'google'}
            onChange={handleFormatChange}
          />
          Search Using Google API
        </label>
        <label>
          <input
            type="radio"
            value="city and state"
            checked={searchFormat === 'city and state'}
            onChange={handleFormatChange}
          />
          Search using city and state
        </label>
        <label>
          <input
            type="radio"
            value="current location"
            checked={searchFormat === 'current location'}
            onChange={handleFormatChange}
          />
          Use Current Location
        </label>
      </div>
      <LocationInput searchFormat={searchFormat} />
    </div>
  )
}

export default SelectSearchFormat
