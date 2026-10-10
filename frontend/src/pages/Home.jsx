import React from 'react'
import {Link} from "react-router-dom"
import Login from './Login'

const Home = () => {
  return (
    <div>
        {/* <Login/> */}
        
        <Link to={'/login'}>Login</Link>
        <Link to={'/work'}>Work</Link>
        <Link to={'/work/:workId'}>Work</Link>
    </div>
  )
}

export default Home