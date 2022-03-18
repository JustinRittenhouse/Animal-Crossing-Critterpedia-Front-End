import React from 'react'

export const SingleBug = (props) =>
{

    const bug = props.data

    return (
        <React.Fragment>
            <p>${ (bug["name"]["name-USen"]) }</p>
        </React.Fragment>
    )

}