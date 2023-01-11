import React, {Suspense} from "react";
import PropTypes from "prop-types";
import {Redirect, Route,} from "react-router-dom";
import {authenticationService} from "../_services";

export const PrivateRoute = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={props => {
            return (authenticationService.isAuthenticated() ? (
                <Suspense fallback={<div>Loading...</div>}>
                    <Component {...props} />
                </Suspense>
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: {from: props.location}
                    }}
                />
            ));
        }}
    />
);

PrivateRoute.propTypes = {
    location: PropTypes.object,
    component: PropTypes.func,
};
