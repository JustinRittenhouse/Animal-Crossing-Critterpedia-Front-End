import React from 'react'
import { Link } from 'react-router-dom'
import caught from '../static/images/caught.png'
import buttons from '../static/images/buttons.png'
import results from '../static/images/results.png'

export const Home = () => {
  return (
    <React.Fragment>
      <div className='titleGroup'>
        <h3>The Time Traveler's</h3>
        <h1>Critterpedia</h1>
      </div>
      <div className="homeGrid">
        <img src="https://via.placeholder.com/150x250" />
        <div className="welcomeText">
          <h3>Welcome!</h3>
          <p>
            This is <b>The Time Traveler's Critterpedia</b>: a tool for Animal Crossing players to help complete their Critterpedias.
            When playing Animal Crossing: New Horizons, it's a lot of fun to find all of the critters, but inevitably you get
            at least one grayed out box where you're not sure what creature it represents, or what time of year to get that creature,
            or even where to get that creature. Looking up creatures one at a time is helpful, but can feel inefficient. This application
            will take the creatures you're missing, and tell you what months would be the best to "Time Travel" to, or wait until,
            in order to complete your Critterpedia.
          </p>
          <h4>How it Works</h4>
          <p>
            Start by going to the Critterpedia section you would like to focus on:
          </p>
          <div className="howItWorksLinks">
            <Link to="/bugs"><b>Bugs</b></Link>
            <Link to="/fish"><b>Fish</b></Link>
            <Link to="/seacreatures"><b>Sea Creatures</b></Link>
          </div>
          <p>
            By default, every creature is labeled as "caught," and it's layout is exactly like the Critterpedia in your game. Go
            through and click all of the boxes you have grayed out.
            <img src={ caught } id='caughtImg' alt='A grayed out honeybee labeled as "caught"'/> Should you need,
            you can select all or none of them as "caught" or you can toggle what you have selected. If you log in using
            Google, the page will save so that you can refer to it later. Once you have the Critterpedia matching your in-game
            one, you can click the <b>Time Travel</b> button. <img src={ buttons } id='buttonsImg' alt='The four buttons mentioned' /> Clicking this will run your
            Critterpedia through an algorithm to tell you what months you'll need to play in order to complete your collection,
            and it will order them from the month with the most possible catches to the least.
          </p>
          <img src={ results } id='resultsImg' alt='Example of what happens when you click "Time Travel"' />
          <p>
            Happy catching!
          </p>
        </div>
      </div>
    </React.Fragment>
  )
}
