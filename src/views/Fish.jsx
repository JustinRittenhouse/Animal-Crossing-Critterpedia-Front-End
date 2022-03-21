import React, { useEffect, useState } from 'react'

export const Fish = () => {

  const [fish, setFish] = useState([])
  // missingBugs is very important. It keeps tracks of which bugs the user needs to time travel to
  // and it is the array that is saved to the user's database to save.
  const missingFish = new Set
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

  const toggleActive = (e) => {
    if (e.currentTarget.className == "item critInactive") {
      e.currentTarget.className = "item critActive"
      missingFish.delete(e.currentTarget.id)
    } else if (e.currentTarget.className == "item critActive") {
      e.currentTarget.className = "item critInactive"
      missingFish.add(e.currentTarget.id)
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
    let missingCopy = new Set(missingFish)
    // This will eventually be the list of dictionaries of months the user needs to travel to with their respective creatures.
    let travelMonths = []
    // This makes an array of all the total months each creature is available.
    // Then it finds the mode of the months, and returns that.
    // If any creatures are leftover, it runs again.
    // console.log(missingCopy.size)
    while (missingCopy.size > 0) {
      let monthArray = []
      let travelFish = []
      for (let oneFish of fish) {
        if (Array.from(missingCopy).includes(oneFish.id.toString())) {
          monthArray = [...monthArray, ...oneFish.availability["month-array-northern"]]
          travelFish.push(oneFish)
        }
      }
      let modeMonth = mode(monthArray)
      // travelMonths[modeMonth] = []
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
    // console.log(travelMonths)
    // This is just preference, but I want the months to display by efficiency.
    travelMonths.sort(function (x, y) { return Object.values(y).length - Object.values(x).length })
    // Time to make the actual HTML
    let results = document.createElement('results')
    results.innerHTML =
      `<div>
      <h2>You Need to Travel to...</h2>`
    for (let fishDict of travelMonths) {
      results.innerHTML +=
        `<div>
        <h4>${months[Object.keys(fishDict)[0]]}</h4>`
      // console.log(months[Object.keys(bugDict)[0]])
      for (let oneFish of Object.values(fishDict)[0]) {
        results.innerHTML +=
          `<div>
          <h6><b>${oneFish.name['name-USen']}</b></h6>
          <ul>
          <li>Times: ${oneFish.availability.time !== "" ? oneFish.availability.time : "All Day"}</li>
          <li>|</li>
          <li>You can find it in a ${oneFish.availability.location.toLowerCase()}.</li>
          </ul>
          </div>`
        // console.log(bug.name['name-USen'], bug.availability.time, bug.availability.location)
      }
      results.innerHTML += `</div>`
    }
    results.innerHTML += `</div>`
    document.querySelector("main").appendChild(results)
    document.querySelector("results").style["background-color"] = "darkslateblue"
  }

  return (
    <React.Fragment>
      <div className="itemGrid">
        {fish.map((fish) => (
          <div className="item critActive" id={fish.id} key={"fish" + fish.id} onClick={(e) => toggleActive(e)}>
            <p><b>{fish.name['name-USen']}</b></p>
            <img src={fish.icon_uri} />
            <p>Months: {fish.availability.isAllYear === true ? "All Year" : fish.availability["month-northern"]}</p>
            <p>Time: {fish.availability.isAllDay === true ? "All Day" : fish.availability.time}</p>
          </div>
        ))}
      </div>
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
    </React.Fragment>
  )
}
