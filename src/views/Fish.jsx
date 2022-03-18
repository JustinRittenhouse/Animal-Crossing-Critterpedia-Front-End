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


  return (
    <div className="itemGrid">
      {fish.map((fish) => (
        <div className="item" id={"item" + fish.id} key={"fish" + fish.id}>
          <p>{fish.name['name-USen']}</p>
          <img src={fish.icon_uri} />
        </div>
      ))}
    </div>
  )
}
