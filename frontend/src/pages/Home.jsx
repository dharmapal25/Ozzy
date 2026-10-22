import {Link} from "react-router-dom"
import { LoadingComponent } from "../components/LoadingComponent"

const Home = () => {
  return (
    <div>
      <LoadingComponent/>
        <Link to={'/login'}>Login</Link>
        <Link to={'/work'}>Work</Link>
        <Link to={'/work/:workId'}>Work</Link>
    </div>
  )
}

export default Home