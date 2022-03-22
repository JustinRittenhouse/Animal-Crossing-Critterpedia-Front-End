import { getDocs, getDoc, getFirestore, query, collectionGroup, collection, addDoc, orderBy, doc, updateDoc, setDoc } from "firebase/firestore";
import { createContext, useCallback, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

export const DataContext = createContext()

export const DataProvider = (props) => {

    // const [ missingBugsSave, setmissingBugsSave ] = useState([])
    // const [ missingFishSave, setmissingFishSave ] = useState([])
    // const [ missingCreaturesSave, setmissingCreaturesSave ] = useState([])
    const { currentUser } = useAuth()

    const db = getFirestore()

    const getMissingCollection = useEffect(async (missingArray) => {
      const docRef = doc(db, `users/${currentUser.id}/missingCollections`, missingArray)
      const docSnap = await getDoc(docRef)
      // Note for future Justin: Finish setting missing list to this and changing the tiles accordingly.

      let grid = document.getElementsByClassName('item')
      for (let item of grid) {

      }
    }, [ db ])
    

    const saveMissingCollection = async (creatureType, creatureArray) => {
        let collectionRef = await collection(db, `users/${currentUser.id}/missingCollections`)
        if (creatureType === "bug") {
            await updateDoc(collectionRef, {
                missingBugs: creatureArray
            });
        } else if (creatureType === "creature") {
            await updateDoc(collectionRef, {
                missingCreatures: creatureArray
            });
        } else if (creatureType === "fish") {
            await updateDoc(collectionRef, {
                missingFish: creatureArray
            });
        }
    }


    // useEffect(() => {
    //     getPosts()
    // }, [getPosts])

    // useEffect(() => {
    //     console.log(firebaseApp)
    // }, [])

    const values = {
        saveMissingCollection
    }

    return (
        <DataContext.Provider value={values} >
            {props.children}
        </DataContext.Provider>
    )
}