import { useContext, useState } from 'react'
import { UserContext } from '../contexts/UserContext'

function ListFavorites() {
  const { favorites, getWeather, deleteFavorite } = useContext(UserContext)

  if (!favorites || favorites.length === 0) return null

  return (
    <div>
      <h3>Favorites</h3>
      <ul>
        {favorites.length > 0 &&
          favorites.map((fav, index) => (
            <li key={index}>
              <span onClick={() => getWeather(fav)}>
                {fav.address || `${fav.city}, ${fav.state}`}
              </span>
              <button onClick={() => deleteFavorite(fav)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default ListFavorites
