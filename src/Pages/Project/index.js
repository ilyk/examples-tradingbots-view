import React from "react";
import LoadingOverlay from "react-loading-overlay";
import {Form, Formik} from "formik";
import {Api} from "../../_api";
import {handleError, history, Project} from "../../_helpers";
import {SaveButton, TextField} from "../Bots/Elements/Config";
import {withRouter} from "react-router";
import {Button} from "react-bootstrap";

export class ProjectPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: "",
            loaded: false,
            project: {id: "", name: "", base_currency: ""}
        }
        this.projectId = this.props.match.params.projectId
        this.api = Api.forProject(this.projectId)
        this.mounted = false
    }

    setState(state, callback) {
        if (!this.mounted) return
        super.setState(state, callback);
    }

    componentWillUnmount() {
        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true
        this.api.get()
            .then(p => {
                Project.currentId = p.id
                return p
            })
            .then(p => this.setState({project: p}))
            .catch(() => {
                this.setState({project: {id: this.projectId}})
                Project.currentId = this.projectId
            })
            .finally(() => this.setState({loaded: true}))
    }

    removeProject = () => {
        if (window.confirm(`Are you sure you want to remove project ${this.state.project.name} (${this.state.project.id})?`)) {
            if (window.confirm(`All bots, logs, exchanges WILL BE DESTROYED. Are you SURE?`)) {
                if (window.confirm(`This action CAN NOT BE UNDONE! Are you still sure?`)) {
                    this.api.delete()
                        .then(() => Project.loadProjects())
                        .then(() => Project.currentId = "")
                        .then(() => history.push("/"))
                        .catch(handleError(this))
                }
            }
        }
    }

    render = () => <LoadingOverlay active={!this.state.loaded} spinner text='Loading...'>
        <Formik initialValues={this.state.project} onSubmit={(values, actions) => {
            this.setState({loaded: false})
            this.setState({errorMessage: ""})
            this.api.save(values).then(p => this.setState({project: p}))
                .then(() => Project.currentId = "")
                .then(() => Project.loadProjects())
                .then(() => Project.currentId = this.state.project.id)
                .then(() => history.push("/projects/" + Project.currentId))
                .catch(handleError(this))
                .finally(() => actions.setSubmitting(false))
                .finally(() => this.setState({loaded: true}))
        }} enableReinitialize={true}>
            <Form className={"form-horizontal"}>
                {this.state.errorMessage &&
                <div className="alert alert-danger" role="alert"> {this.state.errorMessage} </div>}
                <h3>Project Config &mdash; {this.state.project.id}</h3>
                <div className={"row"}>
                    <TextField label={"Name"} name={"name"}/>
                    <TextField label={"Base Currency"} name={"base_currency"}/>
                </div>
                <SaveButton/>
                <Button block={true} variant={"danger"} size={"sm"} type={"button"} onClick={this.removeProject}>
                    Remove Project
                </Button>
            </Form>
        </Formik>
    </LoadingOverlay>
}

export default withRouter(ProjectPage)
