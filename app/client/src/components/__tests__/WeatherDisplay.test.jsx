import React from 'react'
import { render, screen } from '@testing-library/react'
import WeatherDisplay from '../WeatherDisplay'
import { UserContext } from '../../contexts/UserContext'

describe('WeatherDisplay', () => {
  const mockWeather = {
    main: {
      temp: 293.15,
      feels_like: 293.15,
      temp_min: 293.15,
      temp_max: 293.15,
      humidity: 50,
      pressure: 1013,
    },
    wind: {
      speed: 5,
      deg: 90,
    },
    clouds: {
      all: 20,
    },
    sys: {
      sunrise: 1627872000,
      sunset: 1627922400,
    },
    weather: [
      {
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      },
    ],
    name: 'Test City',
  }

  const mockLocation = {
    city: 'Test City',
    state: 'TS',
  }

  const mockFavorites = []

  const mockUserContextValue = {
    addFavorite: jest.fn(),
    weather: mockWeather,
    errorMessage: null,
    location: mockLocation,
    favorites: mockFavorites,
  }

  test('renders weather information', () => {
    render(
      <UserContext.Provider value={mockUserContextValue}>
        <WeatherDisplay />
      </UserContext.Provider>
    )

    expect(screen.getByText('Weather in Test City')).toBeInTheDocument()
    expect(screen.getByText('Clear (clear sky)')).toBeInTheDocument()
    expect(screen.getByText('Temperature: 68.00°F')).toBeInTheDocument()
  })

  test('renders add to favorites button', () => {
    render(
      <UserContext.Provider value={mockUserContextValue}>
        <WeatherDisplay />
      </UserContext.Provider>
    )

    expect(
      screen.getByRole('button', { name: /add to favorites/i })
    ).toBeInTheDocument()
  })
})
