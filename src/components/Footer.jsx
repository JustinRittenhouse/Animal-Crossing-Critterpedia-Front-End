import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {

    return (
        <React.Fragment>
            <div className='credits'>
            <div className='creditColumn'>
                <div className='creditGroup'>
                    <p>- Homepage art by &nbsp;</p>
                    <Link to="https://www.instagram.com/meliheyo_art/">meliheyo_art</Link>
                </div>
                <div className='creditGroup'>
                    <p>- Background art by &nbsp;</p>
                    <Link to="https://www.deviantart.com/biochao">Biochao</Link>
                </div>
            </div>
            <div className='creditColumn'>
                <div className='creditGroup'>
                    <p>- Fink Heavy font by &nbsp;</p>
                    <Link to="https://www.fontsmarket.com/fonts/yifei">yifei</Link>
                </div>
                <div className='creditGroup'>
                    <p>- Animal Crossing and its images are all properties of Nintendo Co., Ltd.</p>
                </div>
            </div>
            </div>
            <div className='selfGlorification'>
                <p>The Time Traveler's Critterpedia was created by Justin Rittenhouse</p>
            </div>
        </React.Fragment>
    )
}
