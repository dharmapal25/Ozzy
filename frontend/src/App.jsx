import React, { useEffect } from 'react'
import Home from './pages/Home'
import API from './services/api';

const App = () => {

  useEffect(() => {
    API.get("/test").then((data) => {
      console.log("DATA : ", data)
    }).catch((err) => console.log("ERROR : ", err))
  }, [])


  return (
    <div>
      <Home />
    </div>
  )
}

export default App