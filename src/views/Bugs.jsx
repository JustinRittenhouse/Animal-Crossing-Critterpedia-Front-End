import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

export const Bugs = () => {

  const [bugs, setBugs] = useState([])

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

  useEffect(() => {
    getBugs()
  }, [])

  const toggleActive = (e) => {
    // if (e.currentTarget.className == "item critInactive") {
    //   e.currentTarget.className = "item critActive"
    // } else if (e.currentTarget.className == "item critActive") {
    //   e.currentTarget.className = "item critInactive"
    // }
    e.currentTarget.classList.toggle("critInactive")
  }

  const selectAll = () => {
    alert('Boop')
    const items = document.getElementsByClassName('critInactive')
    for (let item in items) {
      item.classList.remove('critInactive')
    }
  }

  const selectNone = () => {
    
  }

  const toggleAll = () => {

  }

  return (
    <React.Fragment>
    <div className="itemGrid">
      {bugs.map((bug) => (
        <div className="item" id={"item" + bug.id} key={"bug" + bug.id} onClick={(e) => toggleActive(e)}>
          <p><b>{bug.name['name-USen']}</b></p>
          <img src={bug.icon_uri} />
          <p>Months: {bug.availability.isAllYear === true ? "All Year" : bug.availability["month-northern"]}</p>
          <p>Time: {bug.availability.isAllDay === true ? "All Day" : bug.availability.time}</p>
        </div>
      ))}
    </div>
    <div className='selectorsBox'>
      <ul className='selectors'>
        <li className='selector' onClick={() => selectAll()}>Select All</li>
        <li className='selectorSplitter'>|</li>
        <li className='selector' onClick={selectNone()}>Select None</li>
        <li className='selectorSplitter'>|</li>
        <li className='selector' onClick={toggleAll()}>Toggle All</li>
      </ul>
    </div>
    </React.Fragment>
  )
}
