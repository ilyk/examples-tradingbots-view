import * as React from "react";
import {Button, Container} from "react-bootstrap";
import {Field, Form, Formik} from "formik";
import {authenticationService} from "../../_services";
import {handleError} from "../../_helpers";
import {Api} from "../../_api";

export class ProfilePage extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {
                username:"",
                password:"",
                firstName:"",
                lastName:""
            },
            errorMessage: "",
        }
        this.subscriptions = []
    }

    componentDidMount(): void {
        this.subscriptions.push(authenticationService.currentUser.subscribe(user => {
            user.password = ''
            this.setState({user: user});
        }))
    }

    componentWillUnmount() {
        for (const subscription of this.subscriptions) {
            if (typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe()
            }
        }
    }

    render() {
        return (
            <Container fluid={true}>
                <h3>Profile</h3>
                <Formik initialValues={this.state.user} onSubmit={(values, actions) => {
                    let that = this
                    that.setState({errorMessage: ''})
                    const {username, password, firstName, lastName} = values
                    const params = {username, firstName, lastName}
                    if (password !== '') {
                        params.password = password
                    }

                    Api.forUser(authenticationService.currentUserValue.username).updateProfile(values)
                        .then(authenticationService.updateCurrentUser)
                        .catch(handleError(that))
                        .finally(() => actions.setSubmitting(false))
                }} enableReinitialize={true}>
                    {({isSubmitting}) => (<Form className={"horizontal-form"}>
                        {this.state.errorMessage &&
                        <div className="alert alert-danger" role="alert"> {this.state.errorMessage} </div>}
                        <div className={"row"}>
                            <div className={"col-sm-6 mb-3"}>
                                <label htmlFor={"username"}><b>Username</b></label>
                                <Field id={"username"} name={"username"} readOnly className={"form-control"}/>
                            </div>
                            <div className={"col-sm-6 mb-3"}>
                                <label htmlFor={"password"}><b>Password</b></label>
                                <Field id={"password"} name={"password"} type={"password"} className={"form-control"}/>
                            </div>
                            <div className={"col-sm-6 mb-3"}>
                                <label htmlFor={"firstName"}><b>First Name</b></label>
                                <Field id={"firstName"} name={"firstName"} className={"form-control"}/>
                            </div>
                            <div className={"col-sm-6 mb-3"}>
                                <label htmlFor={"lastName"}><b>Last Name</b></label>
                                <Field id={"lastName"} name={"lastName"} className={"form-control"}/>
                            </div>
                            <div className={"col-sm-12 text-center"}>
                                <Button disabled={isSubmitting} type={"submit"} variant={"primary"}
                                        block={true}>Save</Button>
                            </div>
                        </div>
                    </Form>)}
                </Formik>
            </Container>
        );
    }
}