import React, { useEffect, useState } from 'react'
import { BugContext } from '../contexts/BugProvider'

export const Fish = () => {

  const [fish, setFish] = useState([])

  const getFish = () => {
    fetch('http://acnhapi.com/v1/fish')
      .then(res => res.json())
      .then(data => {
        let fish = []
        for (let [key, value] of Object.entries(data)) {
          fish.push(value)
        }
        setFish(fish)
      })
  }

  useEffect(() => {
    getFish()
  }, [])

  const toggleActive = (e) => {
    if (e.currentTarget.className == "item critInactive") {
      e.currentTarget.className = "item critActive"
    } else if (e.currentTarget.className == "item critActive") {
      e.currentTarget.className = "item critInactive"
    } else {

    }
  }

  return (
    <div className="itemGrid">
      {fish.map((fish) => (
        <div className="item critActive" id={"item" + fish.id} key={"fish" + fish.id} onClick={(e)=>toggleActive(e)}>
          <p><b>{fish.name['name-USen']}</b></p>
          <img src={fish.icon_uri} />
          <p>Months: {fish.availability.isAllYear===true ? "All Year" : fish.availability["month-northern"]}</p>
          <p>Time: {fish.availability.isAllDay===true ? "All Day" : fish.availability.time}</p>
        </div>
      ))}
    </div>
  )
}
