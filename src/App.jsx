import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './views/Home'
import { Bugs } from './views/Bugs'
import { Fish } from './views/Fish'
import { SeaCreatures } from './views/SeaCreatures'
import moment from 'moment'
import { Navbar } from './components/Navbar'

export const App = () => {
  
  return (
    <React.Fragment>
      <header>
        <Navbar />
      </header>
      <main className={"season" + (Math.floor((parseInt(moment().format('MM')) % 12) / 3) + 1).toString()}>
        {/* This is where the background changes based on season. */}
        {/* <main style={{backgroundImage: `url('./static/images/season${Math.floor((parseInt(moment().format('MM'))%12)/3)}.png')`}}> */}
        <div >
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/bugs' element={<Bugs />} />
            <Route exact path='/fish' element={<Fish />} />
            <Route exact path='/seacreatures' element={<SeaCreatures />} />
          </Routes>
        </div>
      </main>
      <footer>

      </footer>
    </React.Fragment>
  )
}
