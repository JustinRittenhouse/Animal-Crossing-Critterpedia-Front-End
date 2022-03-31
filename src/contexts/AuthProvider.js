// I'm using this connection from my project to firebase written by the allmighty Derek Hawkins of Coding Temple.
import { createContext, useContext, useEffect, useState } from "react";
import { browserLocalPersistence, getAuth, GoogleAuthProvider, onAuthStateChanged, setPersistence, signInWithPopup, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

export const AuthContext = createContext()

// Creating a custom React Hook for authentication uses.
export function useAuth() {
    return useContext( AuthContext )
}

export const AuthProvider = ( { children } ) => {

    const [currentUser, setCurrentUser] = useState({ loggedIn: false })
    let auth = getAuth()
    let provider = new GoogleAuthProvider()
    const db = getFirestore()
    
    // This allows the google sign in pop up window to show
    function signIn() {
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
        onAuthStateChanged( auth, ( user ) => {
            if ( user ) {

                // This queries the user by adding them to the Firebase as a reference.
                const userRef = doc( db, "users", user.uid )
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