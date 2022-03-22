// I'm using this link from my project to firebase written by the allmighty Derek Hawkins of Coding Temple.
import { createContext, useContext, useEffect, useState } from "react";
import { browserLocalPersistence, getAuth, GoogleAuthProvider, onAuthStateChanged, setPersistence, signInWithPopup, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

export const AuthContext = createContext()

// to make your own React Hook
export function useAuth() {
    return useContext( AuthContext )
}

export const AuthProvider = ( { children } ) => {

    const [currentUser, setCurrentUser] = useState({ loggedIn: false })
    let auth = getAuth()
    let provider = new GoogleAuthProvider()
    const db = getFirestore()
    
    function signIn() {
        // determine where and if we want to store the user's information who's trying to log in
        return setPersistence( auth, browserLocalPersistence )
                .then( () => {
                    signInWithPopup( auth, provider )
                        .then( result => {
                            console.log( 'User logged in successfully' )
                        } )
                } )
                .catch( err => console.error( err ) )
    }

    function logOut() {
        signOut( auth )
            .then( () => {
                setCurrentUser({ loggedIn: false })
                console.log( 'User logged out successfully' )
            } )
    }

    useEffect(() => {
        // console.log( currentUser )
        onAuthStateChanged( auth, ( user ) => {
            if ( user ) {

                // once the user logs in, we need to add them to the database as a reference
                // query the users collection to find the user
                const userRef = doc( db, 'users', user.uid )
                // if that user doesn't exist, add them to the database,
                // otherwise, if the user does exist, overwrite (don't duplicate) their information
                setDoc( userRef, { email: user.email, name: user.displayName }, { merge: true } )

                setCurrentUser({
                    id: user.uid,
                    name: user.displayName,
                    image: user.photoURL,
                    email: user.email,
                    loggedIn: true
                })
            }
        } )
    }, [ auth ])
    

    const values = {
        signIn, currentUser, logOut
    }

    return (
        <AuthContext.Provider value={ values }>
            { children }
        </AuthContext.Provider>
    )

}