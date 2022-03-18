import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthProvider'
// import { DataContext } from '../contexts/DataProvider'

export const Navbar = () =>
{

    // const { currentUser, signIn, logOut } = useAuth()
    // const { cart } = useContext( DataContext )

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">CRITTERPEDIA</Link>
            <button className="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
                aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="collapsibleNavId">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to="/bugs">Bugs </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/fish">Fish </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/seacreatures">Sea Creatures </Link>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    {/* { condition ? condition to execute if true : condition to execute if false } */}

                    {/* something = True
              print( 'hello' ) if something else print('goodbye') */}

                    {/* {
                        !currentUser.loggedIn
                            ?
                            <li className="nav-item">
                                <Link onClick={() => signIn()} to="." className="nav-link">Login</Link>
                            </li>
                            :
                            <li className="nav-item">
                                <Link onClick={() => logOut()} to="." className="nav-link">Logout</Link>
                            </li>
                    } */}
                </ul>
            </div>
        </nav>
    )
}
