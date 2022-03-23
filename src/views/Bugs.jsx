import React, { useEffect, useState, useContext } from 'react'
import ReactDOM from 'react-dom'
import { useAuth } from '../contexts/AuthProvider'
import { DataContext } from '../contexts/DataProvider'
import { updateDoc, doc, collection, setDoc, getFirestore } from 'firebase/firestore'

export const Bugs = () => {

  const {db, getMissingCollection, saveMissingCollection} = useContext(DataContext)
  const { currentUser } = useAuth()
  const [bugs, setBugs] = useState([])
  // missingBugs is very important. It keeps tracks of which bugs the user needs to time travel to
  // and it is the array that is saved to the user's database to save.
  const missingBugs = new Set
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

  const getBugs = () => {
    fetch('https://acnhapi.com/v1/bugs')
      .then(res => res.json())
      .then(data => setBugs(Object.values(data)))
  }

  useEffect(() => {
    getBugs()
    getMissingCollection("missingBugs", missingBugs)
  }, [db])

  const toggleActive = (e) => {
    if (e.currentTarget.className == "item critInactive") {
      e.currentTarget.className = "item critActive"
      missingBugs.delete(e.currentTarget.id)
    } else if (e.currentTarget.className == "item critActive") {
      e.currentTarget.className = "item critInactive"
      missingBugs.add(e.currentTarget.id)
    }
    saveMissingCollection("bug", missingBugs)
  }

  // Both selectAll and selectNone would only change a few insects at time, which is why
  // I put the functionality inside of a while loop
  const selectAll = () => {
    while (document.getElementsByClassName('critInactive').length > 0) {
      let items = document.getElementsByClassName('critInactive')
      for (let item of items) {
        missingBugs.delete(item.id)
        item.classList.remove('critInactive')
        item.classList.add('critActive')
      }
    }
    saveMissingCollection("missingBugs", missingBugs)
  }

  const selectNone = () => {
    while (document.getElementsByClassName('critActive').length > 0) {
      let items = document.getElementsByClassName('critActive')
      for (let item of items) {
        missingBugs.add(item.id)
        item.classList.remove('critActive')
        item.classList.add('critInactive')
      }
      saveMissingCollection("missingBugs", missingBugs)
    }
  }

  const toggleAll = () => {
    let grid = document.getElementsByClassName('item')
    for (let item of grid) {
      if (item.classList.contains('critActive')) {
        missingBugs.add(item.id)
        item.classList.remove('critActive')
        item.classList.add('critInactive')
      } else if (item.classList.contains('critInactive')) {
        missingBugs.delete(item.id)
        item.classList.remove('critInactive')
        item.classList.add('critActive')
      }
    }
    saveMissingCollection("missingBugs", missingBugs)
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

  const timeTravel = () => {
    // This is the main functionality of the website.
    // First this makes a copy of missingBugs in case the user decides to change missingBugs later.
    let missingCopy = new Set(missingBugs)
    // This will eventually be the list of dictionaries of months the user needs to travel to with their respective creatures.
    let travelMonths = []
    // This makes an array of all the total months each creature is available.
    // Then it finds the mode of the months, and returns that.
    // If any creatures are leftover, it runs again.
    while (missingCopy.size > 0) {
      let monthArray = []
      let travelBugs = []
      for (let bug of bugs) {
        if (Array.from(missingCopy).includes(bug.id.toString())) {
          monthArray = [...monthArray, ...bug.availability["month-array-northern"]]
          travelBugs.push(bug)
        }
      }
      let modeMonth = mode(monthArray)
      let travelMonth = []
      for (let bug of travelBugs) {
        if (bug.availability["month-array-northern"].includes(modeMonth)) {
          travelMonth.push(bug)
          missingCopy.delete(bug.id.toString())
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
    let results = document.createElement('results')
    results.innerHTML =
      `<div>
    <h2>You Need to Travel to...</h2>`
    for (let bugDict of travelMonths) {
      results.innerHTML +=
        `<div>
      <h4>${months[Object.keys(bugDict)[0]]}</h4>`
      for (let bug of Object.values(bugDict)[0]) {
        results.innerHTML +=
          `<div>
        <h6><b>${bug.name['name-USen']}</b></h6>
        <ul>
        <li>Time: ${bug.availability.time !== "" ? bug.availability.time : "All Day"}</li>
        <li>Location: You can find it ${bug.availability.location.toLowerCase()}.</li>
        </ul>
        </div>`
      }
      results.innerHTML += `</div>`
    }
    results.innerHTML += `</div>`
    document.querySelector(".critterPage").appendChild(results)
    document.querySelector("results").style["background-color"] = "darkslateblue"
  }

  return (
    <React.Fragment>
      <div className='critterPage'>
        <div className="itemGrid">
          {bugs.map((bug) => (
            <div className="item critActive" id={bug.id} key={"bug" + bug.id} onClick={(e) => toggleActive(e)}>
              <p><b>{bug.name['name-USen']}</b></p>
              <img src={bug.icon_uri} />
              <p>Months: {bug.availability.isAllYear === true ? "All Year" : bug.availability["month-northern"]}</p>
              <p>Time: {bug.availability.isAllDay === true ? "All Day" : bug.availability.time}</p>
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
