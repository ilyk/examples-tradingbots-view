import * as React from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";

import './signin.css'
import logo from "../../logo.svg";
import {Image} from "react-bootstrap";
import {handleError, history} from "../../_helpers";
import {authenticationService} from "../../_services";

class LoginPage extends React.Component {
    constructor() {
        super();
        this.state = {
            errorMessage: ""
        }
    }

    componentDidMount() {

    };

    render() {
        return (
            <div className="text-center">
                <h1>MMachine // Admin</h1>

                <Formik
                    initialValues={{username: "", password: ""}}
                    onSubmit={async values => {
                        this.setState({errorMessage: ""})
                        const {username, password} = values;
                        authenticationService.login(username, password)
                            .then(() => history.push('/'))
                            .catch(handleError(this))
                    }}
                    validationSchema={Yup.object().shape({
                        username: Yup.string()
                            .required("Required"),
                        password: Yup.string()
                            .required("Required")
                    })}
                >
                    {({isSubmitting, errors}) => (
                        <Form className={"form-signin"}>
                            <Image className={"mb-4"} width={72} height={72} src={logo}/>
                            {this.state.errorMessage &&
                            <div className="alert alert-danger" role="alert"> {this.state.errorMessage} </div>}
                            <label htmlFor="email" className="sr-only">
                                Username
                            </label>
                            <Field
                                name="username"
                                placeholder="Username:"
                                type="text" className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                autoFocus="autofocus"
                            />
                            <ErrorMessage name="username">
                                {msg => <div className="invalid-feedback">{msg}</div>}
                            </ErrorMessage>
                            <label htmlFor="email" className="sr-only">
                                Password
                            </label>
                            <Field
                                name="password"
                                placeholder="Password:"
                                type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            />
                            <ErrorMessage name="password">
                                {msg => <div className="invalid-feedback">{msg}</div>}
                            </ErrorMessage>

                            <button type="submit" disabled={isSubmitting}
                                    className={"btn btn-lg btn-primary btn-block"}>
                                {isSubmitting ? "Please wait..." : "Sign in"}
                            </button>
                            {/*<div className="text-left"><Debug/></div>*/}
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}

export {LoginPage};
