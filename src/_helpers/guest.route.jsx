import React, {Suspense} from "react";
import PropTypes from "prop-types";
import {Redirect, Route,} from "react-router-dom";
import {authenticationService} from "../_services";

export const GuestRoute = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={props => {
            return (!authenticationService.isAuthenticated() ? (
                <Suspense fallback={<div>Loading...</div>}>
                    <Component {...props} />
                </Suspense>
            ) : (
                <Redirect
                    to={{
                        pathname: "/",
                        state: {from: props.location}
                    }}
                />
            ));
        }}
    />
);

GuestRoute.propTypes = {
    location: PropTypes.object,
    component: PropTypes.func,
};
