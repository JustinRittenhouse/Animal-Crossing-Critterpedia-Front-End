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

  
  const toggleActive = (e) => {
    if (e.currentTarget.className == "item inactive") {
      e.currentTarget.className = "item active"
    } else if (e.currentTarget.className == "item active") {
      e.currentTarget.className = "item inactive"
    } else {

    }
  }

  return (
    <div className="itemGrid" id="creatureGrid">
      {creatures.map((creature) => (
        <div className="item active" id={"item" + creature.id} key={"creature" + creature.id} onClick={(e)=>toggleActive(e)}>
          <p><b>{creature.name['name-USen']}</b></p>
          <img src={creature.icon_uri} />
          <p>Months: {creature.availability.isAllYear===true ? "All Year" : creature.availability["month-northern"]}</p>
          <p>Time: {creature.availability.isAllDay===true ? "All Day" : creature.availability.time}</p>
        </div>
      ))}
    </div>
  )
}
