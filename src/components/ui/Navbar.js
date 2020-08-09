import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { startLogout } from '../../actions/auth';
import { eventLogutAction } from '../../actions/events';

export const Navbar = () => {

    const { name } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(startLogout())
        dispatch(eventLogutAction())
    }

    return (
        <div className="navbar navbar-dark bg-dark mb-4">
            <span className="navbar-brand">
                {name || 'logueese'}
            </span>
            <button 
                className="btn btn-outline-danger"
                onClick={handleLogout}
            >
                <i className="fas fa-sign-out-alt"></i>
                <span> Salir</span>
            </button>
        </div>
    )
}
