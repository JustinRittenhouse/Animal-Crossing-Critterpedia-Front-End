import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

export const Bugs = () => {

  const [bugs, setBugs] = useState([])
  const [months, setMonths] = useState([])
  const missingBugs = new Set

  const getBugs = () => {
    fetch('https://acnhapi.com/v1/bugs')
      .then(res => res.json())
      .then(data => {
        let bugs = []
        for (let [key, value] of Object.entries(data)) {
          bugs.push(value)
        }
        setBugs(bugs)
      })
  }

  const getMonths = () => {
    fetch("src/contexts/months.json")
      .then(res => res.json())
      .then(data => setMonths(data))
  }

  useEffect(() => {
    getBugs()
    setMonths()
  }, [])

  const toggleActive = (e) => {
    if (e.currentTarget.className == "item critInactive") {
      e.currentTarget.className = "item critActive"
      missingBugs.delete(e.currentTarget.id)
    } else if (e.currentTarget.className == "item critActive") {
      e.currentTarget.className = "item critInactive"
      missingBugs.add(e.currentTarget.id)
    }
    // console.log(missingBugs)
    // e.currentTarget.classList.toggle("critInactive")
  }

  const selectAll = () => {
    alert('Boop')
    const items = document.getElementsByClassName('critInactive')
    for (let item in items) {
      item.classList.remove('critInactive')
    }
  }

  const selectNone = () => {
    alert('Beep')
  }

  const toggleAll = () => {
    alert('Bop')
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
    // console.log(missingCopy.size)
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
      // travelMonths[modeMonth] = []
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
    console.log(travelMonths)
    travelMonths.sort(function(x, y) {return Object.values(y).length - Object.values(x).length})
    for (let bugDict of travelMonths) {
      console.log(Object.keys(bugDict)[0])
      for (let bug of Object.values(bugDict)[0]) {
        console.log(bug.name['name-USen'], bug.availability.time, bug.availability.location)
      }
    }
  }

  return (
    <React.Fragment>
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
      {/* <div className='boxBox'> */}
      <div className='selectorsBox'>
        <ul className='selectors'>
          <li className='selector' onClick={() => selectAll()}>Select All</li>
          <li className='selectorSplitter'>|</li>
          <li className='selector' onClick={() => selectNone()}>Select None</li>
          <li className='selectorSplitter'>|</li>
          <li className='selector' onClick={() => toggleAll()}>Toggle All</li>
        </ul>
      </div>
      <div className='resultButtonBox' onClick={() => timeTravel()}>
        <h4 >Time Travel</h4>
      </div>
      {/* </div> */}
    </React.Fragment>
  )
}
