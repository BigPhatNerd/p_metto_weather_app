import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ListFavorites from '../ListFavorites'
import { UserContext } from '../../contexts/UserContext'

describe('ListFavorites', () => {
  const mockFavorites = [
    { address: '123 Main St', city: 'New York', state: 'NY' },
    { address: '456 Elm St', city: 'Los Angeles', state: 'CA' },
    { address: '789 Oak St', city: 'Chicago', state: 'IL' },
  ]

  const mockGetWeather = jest.fn()
  const mockDeleteFavorite = jest.fn()

  const mockUserContextValue = {
    favorites: mockFavorites,
    getWeather: mockGetWeather,
    deleteFavorite: mockDeleteFavorite,
  }

  test('renders favorites list', () => {
    render(
      <UserContext.Provider value={mockUserContextValue}>
        <ListFavorites />
      </UserContext.Provider>
    )

    expect(screen.getByText('Favorites')).toBeInTheDocument()
    mockFavorites.forEach((favorite) => {
      expect(
        screen.getByText(
          favorite.address || `${favorite.city}, ${favorite.state}`
        )
      ).toBeInTheDocument()
    })
  })

  test('triggers getWeather on favorite item click', () => {
    render(
      <UserContext.Provider value={mockUserContextValue}>
        <ListFavorites />
      </UserContext.Provider>
    )

    const firstFavorite = screen.getByText(mockFavorites[0].address)
    fireEvent.click(firstFavorite)

    expect(mockGetWeather).toHaveBeenCalledWith(mockFavorites[0])
  })

  test('triggers deleteFavorite on delete button click', () => {
    render(
      <UserContext.Provider value={mockUserContextValue}>
        <ListFavorites />
      </UserContext.Provider>
    )

    const firstDeleteButton = screen.getAllByText('Delete')[0]
    fireEvent.click(firstDeleteButton)

    expect(mockDeleteFavorite).toHaveBeenCalledWith(mockFavorites[0])
  })
})
