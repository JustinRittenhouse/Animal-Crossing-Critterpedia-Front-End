import React, { useEffect, useState } from 'react'

export const SeaCreatures = () => {

  const [creatures, setSea] = useState([])

  const getSea = () => {
    fetch('http://acnhapi.com/v1/sea')
      .then(res => res.json())
      .then(data => {
        let creatures = []
        for (let [key, value] of Object.entries(data)) {
          creatures.push(value)
        }
        setSea(creatures)
      })
  }

  useEffect(() => {
    getSea()
  }, [])


  return (
    <div className="itemGrid" id="creatureGrid">
      {creatures.map((creature) => (
        <div className="item" id={"item" + creature.id} key={"creature" + creature.id}>
          <p>{creature.name['name-USen']}</p>
          <img src={creature.icon_uri} />
        </div>
      ))}
    </div>
  )
}
