import { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'

function ListFavorites() {
  const { favorites } = useContext(UserContext)
  return (
    <div>
      <h3>Favorites</h3>
      <ul>
        {favorites &&
          favorites.map((fav, index) => (
            <li key={index}>Addres: {fav.address}</li>
          ))}
      </ul>
    </div>
  )
}

export default ListFavorites
