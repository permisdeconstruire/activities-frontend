import _ from 'lodash'
import React from 'react'
import Autosuggest from 'react-autosuggest';
import {
  Modal,
  Panel,
  Button,
  Form,
  FormGroup,
  Col,
  Row,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';

class EventCourrier extends React.Component {
  defaultState() {
    return {
    };
  }

  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.state = this.defaultState();
  }

  handleChange(event) {
    this.props.onChange({status: event.target.value})
  }

  render() {
    return (
      <>
        <FormGroup controlId="formHorizontalEventCourrier">
          <Col componentClass={ControlLabel} sm={4}>
            Type de courrier
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChange} value={this.props.data.status} componentClass="select">
              <option key="relance" value="relance">Relance</option>
              <option key="fin" value="fin">Fin</option>
              <option key="autre" value="autre">Autre</option>
            </FormControl>
          </Col>
        </FormGroup>
      </>

    )
  }
}

export default EventCourrier
