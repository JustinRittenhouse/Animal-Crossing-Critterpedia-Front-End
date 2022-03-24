import { getDocs, getDoc, getFirestore, query, collectionGroup, collection, addDoc, orderBy, doc, updateDoc, setDoc } from "firebase/firestore";
import { createContext, useCallback, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { Bugs, missingBugs } from "../views/Bugs";
import { Fish, missingFish } from "../views/Fish";
import { SeaCreatures, missingCreatures } from "../views/SeaCreatures"

export const DataContext = createContext()

export const DataProvider = (props) => {

    // const [ missingBugsSave, setmissingBugsSave ] = useState([])
    // const [ missingFishSave, setmissingFishSave ] = useState([])
    // const [ missingCreaturesSave, setmissingCreaturesSave ] = useState([])
    const db = getFirestore()
    const [missingCollection, setMissingCollection] = useState([db])
    const { currentUser } = useAuth()


    // For clarification, missingArray is the name in the Firebase, creatureArray is the actual array the page is using.
    // const getMissingCollection = async (missingArray, creatureArray) => {
    //     if (currentUser.loggedIn) {
    //         const docRef = doc(db, `users/${currentUser.id}/missingCollections`, missingArray)
    //         const docSnap = await getDoc(docRef)
    //         console.log(docSnap)

    //         // First, change the missing array to what's saved in the database.
    //         creatureArray = docSnap.data()

    //         // Change the creature tiles accordingly.
    //         let grid = document.getElementsByClassName('item')
    //         for (let item of grid) {
    //             if (docSnap.data().includes(item.id)) {
    //                 item.className = "item critInactive"
    //             } else {
    //                 item.className = "item critActive"
    //             }
    //         }
    //     }
    // }

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

    // useEffect(() => {
    //     // getMissingCollection("missingCreatures")
    // }, [currentUser.loggedIn])

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

    const loadFromDatabase = () => {
        let grid = document.getElementsByClassName('item')
        for (let item of grid) {
            if (missingCollection.has(item.id)) {
                item.classList.remove('critActive')
                item.classList.add('critInactive')
            }
        }
    }

    // const saveMissingCollection = async (missingArray, creatureArray) => {
    //     if (currentUser.loggedIn) {
    //         let collectionRef = await collection(db, `users/${currentUser.id}/${missingArray}`)
    //         console.log(collectionRef)
    //         if (missingArray === "missingBugs") {
    //             if (collectionRef.missingBugs) {
    //                 await updateDoc(collectionRef, {
    //                     missingBugs: creatureArray
    //                 });
    //             } else {
    //                 await setDoc(collectionRef, {
    //                     missingBugs: creatureArray
    //                 });
    //             }
    //         } else if (missingArray === "missingCreatures") {
    //             if (collectionRef.missingCreatures) {
    //                 await updateDoc(collectionRef, {
    //                     missingCreatures: creatureArray
    //                 });
    //             } else {
    //                 await setDoc(collectionRef, {
    //                     missingCreatures: creatureArray
    //                 });
    //             }
    //         } else if (missingArray === "missingFish") {
    //             if (collectionRef.missingCreatures) {
    //                 await updateDoc(collectionRef, {
    //                     missingFish: creatureArray
    //                 });
    //             } else {
    //                 await setDoc(collectionRef, {
    //                     missingFish: creatureArray
    //                 })
    //             }
    //         }
    //         // console.log('saved?')
    //     }
    // }

    const values = {
        saveMissingCollection, getMissingCollection, missingCollection, loadFromDatabase
    }

    return (
        <DataContext.Provider value={values} >
            {props.children}
        </DataContext.Provider>
    )
}