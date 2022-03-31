import { getDocs, getDoc, getFirestore, query, collectionGroup, collection, addDoc, orderBy, doc, updateDoc, setDoc } from "firebase/firestore";
import { createContext, useCallback, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { Bugs, missingBugs } from "../views/Bugs";
import { Fish, missingFish } from "../views/Fish";
import { SeaCreatures, missingCreatures } from "../views/SeaCreatures"

export const DataContext = createContext()

export const DataProvider = (props) => {

    const db = getFirestore()
    const [missingCollection, setMissingCollection] = useState([db])
    const { currentUser } = useAuth()

    // For clarification, missingArray is the name in the Firebase, creatureArray is the actual set the page is using.
    // This function gets the user's saved data if they are logged in.
    const getMissingCollection = async (missingArray) => {
        const loadSet = new Set
        console.log(currentUser.loggedIn)
        if (currentUser.loggedIn) {
            const collectionRef = collection(db, `users/${currentUser.id}/${missingArray}`)
            const querySnapshot = await getDocs(collectionRef)
            querySnapshot.forEach((doc => {
                if (doc.data().missing) {
                    loadSet.add(doc.data().id)
                }
            }))
        }
        setMissingCollection(loadSet)
    }

    // This function saves the collection to the Firebase whenever a change is made.
    const saveMissingCollection = async (missingArray, creatureArray) => {
        if (missingArray == "missingCreatures") {
            for (let i = 1; i < 41; i++) {
                let docRef = doc(db, `users/${currentUser.id}/${missingArray}/${i.toString()}`)
                setDoc(docRef, { id: i.toString(), missing: (creatureArray.has(i.toString()) ? true : false) }, { merge: true })
            }
        } else {
            for (let i = 1; i < 81; i++) {
                let docRef = doc(db, `users/${currentUser.id}/${missingArray}/${i.toString()}`)
                setDoc(docRef, { id: i.toString(), missing: (creatureArray.has(i.toString()) ? true : false) }, { merge: true })
            }
        }
    }

    // This function is makes the user's collection displayed.
    const loadFromDatabase = () => {
        let grid = document.getElementsByClassName('item')
        for (let item of grid) {
            if (missingCollection.has(item.id)) {
                item.classList.remove('critActive')
                item.classList.add('critInactive')
            }
        }
    }

    const values = {
        saveMissingCollection, getMissingCollection, missingCollection, loadFromDatabase
    }

    return (
        <DataContext.Provider value={values} >
            {props.children}
        </DataContext.Provider>
    )
}