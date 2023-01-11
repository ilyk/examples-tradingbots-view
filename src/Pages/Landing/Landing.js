import {Jumbotron} from "react-bootstrap";
import * as React from "react";

export class Landing extends React.Component {
    render() {
        return (
            <Jumbotron fluid={true}>
                <h1>MMachine.</h1>
                <p>...connecting...</p>
            </Jumbotron>
        );
    }
}
