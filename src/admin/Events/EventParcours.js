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

class EventRdv extends React.Component {
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
    if(field === 'level') {
      newProps[field] = parseInt(event.target.value, 10)
    } else {
      newProps[field] = event.target.value;
    }
    this.props.onChange(newProps)
  }

  render() {
    return (
      <>
        <FormGroup controlId="formHorizontalEventCourrier">
          <Col componentClass={ControlLabel} sm={4}>
            Parcours
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChange.bind(this, 'name')} value={this.props.data.name} componentClass="select">
              <option value="Aucun">Aucun</option>
              <option value="Projet professionnel">Projet professionnel</option>
              <option value="La Relation">La Relation</option>
              <option value="Insertion sociale">Insertion sociale</option>
              <option value="Booster sa candidature">Booster sa candidature</option>
              <option value="Les Soins pour Soi">Les Soins pour Soi</option>
              <option value="Coup de pouce">Coup de pouce</option>
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalEventCourrier">
          <Col componentClass={ControlLabel} sm={4}>
            Niveau
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChange.bind(this, 'level')} value={this.props.data.level} componentClass="select">
              <option key="0" value="0">0</option>
              <option key="1" value="1">1</option>
              <option key="2" value="2">2</option>
              <option key="3" value="3">3</option>
              <option key="4" value="4">4</option>
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalEventCourrier">
          <Col componentClass={ControlLabel} sm={4}>
            Événement
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChange.bind(this, 'what')} value={this.props.data.what} componentClass="select">
              <option value="start">Démarre</option>
              <option value="terminate">Termine</option>
              <option value="stop">Arrête</option>
            </FormControl>
          </Col>
        </FormGroup>
      </>

    )
  }
}

export default EventRdv
