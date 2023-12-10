import { Link } from 'react-router-dom'

const TitleCard = () => {
  return (
    <Link to="/">
        <img className="logo w-72" src="/logo.svg" alt="MovieVerse Logo" ></img>
    </Link>
  )
}

export default TitleCard