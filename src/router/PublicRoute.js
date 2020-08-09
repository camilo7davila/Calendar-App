import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export const PublicRoute = ({
    isAuthtenticated,
    component: Component,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            component={(props) => (
                (!isAuthtenticated)
                    ? (<Component {...props} />)
                    : (<Redirect to="/" />)
            )}
        />
    )
}

PublicRoute.propTypes = {
    isAuthtenticated: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired
} 