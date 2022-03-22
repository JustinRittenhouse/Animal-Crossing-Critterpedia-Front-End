import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './views/Home'
import { Bugs } from './views/Bugs'
import { Fish } from './views/Fish'
import { SeaCreatures } from './views/SeaCreatures'
import moment from 'moment'
import { Navbar } from './components/Navbar'
import { useAuth } from './contexts/AuthProvider'

export const App = () => {

  const { signIn, currentUser, logOut } = useAuth()

  return (
    <React.Fragment>
      <header>
        <Navbar />
      </header>
      {/* This is where the background changes based on season. */}
      <main className={"season" + (Math.floor((parseInt(moment().format('MM')) % 12) / 3) + 1).toString()}>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/bugs' element={<Bugs />} />
          <Route exact path='/fish' element={<Fish />} />
          <Route exact path='/seacreatures' element={<SeaCreatures />} />
        </Routes>
      </main>
      <footer>

      </footer>
    </React.Fragment>
  )
}
