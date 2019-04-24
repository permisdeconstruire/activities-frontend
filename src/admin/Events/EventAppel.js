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

class EventAppel extends React.Component {
  defaultState() {
    return {
    };
  }

  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.state = this.defaultState();
  }

  handleChange(field, event){
    const newProps = this.props.data;
    newProps[field] = event.target.value
    this.props.onChange(newProps)
  }

  render() {
    return (
      <>
        <FormGroup controlId="formHorizontalEventCourrier">
          <Col componentClass={ControlLabel} sm={4}>
            Appel
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChange.bind(this, 'direction')} value={this.props.data.direction} componentClass="select">
              <option key="in" value="in">Reçu</option>
              <option key="out" value="out">Donné</option>
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalEventCourrier">
          <Col componentClass={ControlLabel} sm={4}>
            Cet appel a-t-il été répondu ?
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChange.bind(this, 'answered')} value={this.props.data.answered} componentClass="select">
              <option key="oui" value="oui">Oui</option>
              <option key="non" value="non">Non</option>
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalEventCourrier">
          <Col componentClass={ControlLabel} sm={4}>
            Qui était l'interlocuteur ?
          </Col>
          <Col sm={6}>
            <FormControl value={this.props.data.who} onChange={this.handleChange.bind(this, 'who')} type="text" placeholder="Sa femme" />
          </Col>
        </FormGroup>
      </>

    )
  }
}

export default EventAppel
