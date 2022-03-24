import React, { useContext, useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthProvider'
import { DataContext } from '../contexts/DataProvider'

export const Fish = () => {

  const { saveMissingCollection, getMissingCollection, missingCollection, loadFromDatabase } = useContext(DataContext)
  const { currentUser } = useAuth()
  const [fish, setFish] = useState([])
  const [missingFish, setMissingFish] = useState(new Set)
  // missingFish is very important. It keeps tracks of which fish the user needs to time travel to
  // and it is the array that is saved to the user's database to save.
  const getMissingFish = () => {
    setMissingFish(missingCollection)
  }

  const months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  }

  const getFish = () => {
    fetch('https://acnhapi.com/v1/fish')
      .then(res => res.json())
      .then(data => setFish(Object.values(data)))
  }

  useEffect(() => {
    getFish()
  }, [])
  
  useEffect(() => {
    getMissingFish()
    loadFromDatabase()
  }, [missingCollection])

  useEffect(() => {
    getMissingCollection("missingFish")
  }, [currentUser.loggedIn])

  const toggleActive = (e) => {
    if (e.currentTarget.className == "item critInactive") {
      e.currentTarget.className = "item critActive"
      missingFish.delete(e.currentTarget.id)
    } else if (e.currentTarget.className == "item critActive") {
      e.currentTarget.className = "item critInactive"
      missingFish.add(e.currentTarget.id)
    }
    if (currentUser.loggedIn) {
      saveMissingCollection("missingFish", missingFish)
    }
  }

  // Both selectAll and selectNone would only change a few fish at time, which is why
  // I put the functionality inside of a while loop
  const selectAll = () => {
    while (document.getElementsByClassName('critInactive').length > 0) {
      let items = document.getElementsByClassName('critInactive')
      for (let item of items) {
        missingFish.delete(item.id)
        item.classList.remove('critInactive')
        item.classList.add('critActive')
      }
    }
    if (currentUser.loggedIn) {
      saveMissingCollection("missingFish", missingFish)
    }
  }

  const selectNone = () => {
    while (document.getElementsByClassName('critActive').length > 0) {
      let items = document.getElementsByClassName('critActive')
      for (let item of items) {
        missingFish.add(item.id)
        item.classList.remove('critActive')
        item.classList.add('critInactive')
      }
    }
    if (currentUser.loggedIn) {
      saveMissingCollection("missingFish", missingFish)
    }
  }

  const toggleAll = () => {
    let grid = document.getElementsByClassName('item')
    for (let item of grid) {
      if (item.classList.contains('critActive')) {
        missingFish.add(item.id)
        item.classList.remove('critActive')
        item.classList.add('critInactive')
      } else if (item.classList.contains('critInactive')) {
        missingFish.delete(item.id)
        item.classList.remove('critInactive')
        item.classList.add('critActive')
      }
    }
    if (currentUser.loggedIn) {
      saveMissingCollection("missingFish", missingFish)
    }
  }

  // I pulled this from user ggorlen on stackoverflow.
  var mode = a => {
    a = a.slice().sort((x, y) => x - y);
    var bestStreak = 1;
    var bestElem = a[0];
    var currentStreak = 1;
    var currentElem = a[0];
    for (let i = 1; i < a.length; i++) {
      if (a[i - 1] !== a[i]) {
        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
          bestElem = currentElem;
        }
        currentStreak = 0;
        currentElem = a[i];
      }
      currentStreak++;
    }
    return currentStreak > bestStreak ? currentElem : bestElem;
  };

  // This function is specific to the fish because the grammar depends on the location.
  const fishLocation = (location) => {
    if (location == "Pier") {
      return "near the"
    } else if (location == "Sea") {
      return "in the"
    } else {
      return "in a"
    }
  }

  const timeTravel = () => {
    let results = document.createElement('results')
    if (missingFish.length > 0) {
    // This is the main functionality of the website.
    // First this makes a copy of missingBugs in case the user decides to change missingBugs later.
    let missingCopy = new Set(missingFish)
    // This will eventually be the list of dictionaries of months the user needs to travel to with their respective creatures.
    let travelMonths = []
    // This makes an array of all the total months each creature is available.
    // Then it finds the mode of the months, and returns that.
    // If any creatures are leftover, it runs again.
    while (missingCopy.size > 0) {
      let monthArray = []
      let travelFish = []
      for (let oneFish of fish) {
        if (missingCopy.has(oneFish.id.toString())) {
          monthArray = [...monthArray, ...oneFish.availability["month-array-northern"]]
          travelFish.push(oneFish)
        }
      }
      let modeMonth = mode(monthArray)
      let travelMonth = []
      for (let oneFish of travelFish) {
        if (oneFish.availability["month-array-northern"].includes(modeMonth)) {
          travelMonth.push(oneFish)
          missingCopy.delete(oneFish.id.toString())
        }
      }
      let fullTravelMonth = {}
      fullTravelMonth[modeMonth] = travelMonth
      travelMonths.push(fullTravelMonth)
    }
    // This is just preference, but I want the months to display by efficiency.
    travelMonths.sort(function (x, y) { return Object.values(y).length - Object.values(x).length })
    // If Time Travel results already exist, erase them.
    if (document.querySelector("results")) {
      document.querySelector(".critterPage").removeChild(document.querySelector("results"))
    }
    // Time to make the actual HTML
    results.innerHTML =
      `<h2>You Need to Travel to...</h2>`
    for (let fishDict of travelMonths) {
      results.innerHTML +=
        `<h4>${months[Object.keys(fishDict)[0]]}</h4>`
      for (let oneFish of Object.values(fishDict)[0]) {
        results.innerHTML +=
          `<h6><b>${oneFish.name['name-USen']}</b></h6>
          <ul class="fishList">
          <li>Time: ${oneFish.availability.time !== "" ? oneFish.availability.time : "All Day"}</li>
          <li>Location: You can find it ${fishLocation(oneFish.availability.location)} ${oneFish.availability.location.toLowerCase()}.</li>
          <li>Size: Its shadow is ${oneFish.shadow.includes("est") ? "the" : ""} ${oneFish.shadow.slice(0, oneFish.shadow.length - 4).toLowerCase()} size${oneFish.shadow.includes("est") ? "" : "d"}.</li>
          </ul>`
      }
    }
  } else {
    results.innerHTML =
    `<div>
    <h2>Congratulations on Catching Every Fish!</h2>
    </div>`
  }
  document.querySelector(".critterPage").appendChild(results)
}

  return (
    <React.Fragment>
      <div className='critterPage'>
        <div className="itemGrid">
          {fish.map((fish) => (
            <div className={"item " + (missingFish.has(fish.id) ? "critInactive" : "critActive")} id={fish.id} key={"fish" + fish.id} onClick={(e) => toggleActive(e)}>
              <p><b>{fish.name['name-USen']}</b></p>
              <img src={fish.icon_uri} />
              <p>Months: {fish.availability.isAllYear === true ? "All Year" : fish.availability["month-northern"]}</p>
              <p>Time: {fish.availability.isAllDay === true ? "All Day" : fish.availability.time}</p>
            </div>
          ))}
        </div>
        <div className='selectorsBox'>
          <ul className='selectors'>
            <li className='selector' onClick={() => selectAll()}>Catch All</li>
            <li className='selectorSplitter'>|</li>
            <li className='selector' onClick={() => selectNone()}>Catch None</li>
            <li className='selectorSplitter'>|</li>
            <li className='selector' onClick={() => toggleAll()}>Toggle All</li>
          </ul>
        </div>
        <div className='resultButtonBox' onClick={() => timeTravel()}>
          <h4 >Time Travel</h4>
        </div>
      </div>
    </React.Fragment>
  )
}
