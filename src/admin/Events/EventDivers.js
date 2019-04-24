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

class EventDivers extends React.Component {
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
    this.props.onChange({title: event.target.value})
  }

  render() {
    return (
      <>
        <FormGroup controlId="formHorizontalEventCourrier">
          <Col componentClass={ControlLabel} sm={4}>
            Titre
          </Col>
          <Col sm={6}>
            <FormControl value={this.props.data.title} onChange={this.handleChange} type="text" placeholder="Il s'est passé quelque chose" />
          </Col>
        </FormGroup>
      </>

    )
  }
}

export default EventDivers
