import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SelectSearchFormat from '../SelectSearchFormat'
import { UserContext } from '../../contexts/UserContext'
import LocationInput from '../LocationInput'

jest.mock('../LocationInput', () => jest.fn(() => <div>LocationInput</div>))

describe('SelectSearchFormat', () => {
  const mockSetLocation = jest.fn()

  const mockUserContextValue = {
    setLocation: mockSetLocation,
  }

  test('renders the component', () => {
    render(
      <UserContext.Provider value={mockUserContextValue}>
        <SelectSearchFormat />
      </UserContext.Provider>
    )

    expect(screen.getByLabelText('Search Using Google API')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Search using city and state')
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Use Current Location')).toBeInTheDocument()
    expect(screen.getByText('LocationInput')).toBeInTheDocument()
  })

  test('handles format change', () => {
    render(
      <UserContext.Provider value={mockUserContextValue}>
        <SelectSearchFormat />
      </UserContext.Provider>
    )

    fireEvent.click(screen.getByLabelText('Search using city and state'))
    expect(screen.getByLabelText('Search using city and state').checked).toBe(
      true
    )
    expect(mockSetLocation).toHaveBeenCalledWith({
      address: '',
      city: '',
      state: '',
    })

    fireEvent.click(screen.getByLabelText('Use Current Location'))
    expect(screen.getByLabelText('Use Current Location').checked).toBe(true)
    expect(mockSetLocation).toHaveBeenCalledWith({
      address: '',
      city: '',
      state: '',
    })
  })

  test('renders LocationInput with correct searchFormat prop', () => {
    render(
      <UserContext.Provider value={mockUserContextValue}>
        <SelectSearchFormat />
      </UserContext.Provider>
    )

    fireEvent.click(screen.getByLabelText('Search using city and state'))
    expect(LocationInput).toHaveBeenCalledWith(
      { searchFormat: 'city and state' },
      {}
    )

    fireEvent.click(screen.getByLabelText('Use Current Location'))
    expect(LocationInput).toHaveBeenCalledWith(
      { searchFormat: 'current location' },
      {}
    )
  })
})
