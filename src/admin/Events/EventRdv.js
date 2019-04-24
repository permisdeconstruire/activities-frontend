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
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleChangeJustificatif = this.handleChangeJustificatif.bind(this);
    this.state = this.defaultState();
  }

  handleChangeStatus(event) {
    const newProps = this.props.data;
    newProps.status = event.target.value
    this.props.onChange(newProps)
  }

  handleChangeJustificatif(event) {
    const newProps = this.props.data;
    newProps.justificatif = event.target.value
    this.props.onChange(newProps)
  }

  render() {
    return (
      <>
        <FormGroup controlId="formHorizontalEventCourrier">
          <Col componentClass={ControlLabel} sm={4}>
            Status
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChangeStatus} value={this.props.data.status} componentClass="select">
              <option key="manque" value="manque">Manqué</option>
              <option key="retard" value="retard">En retard</option>
              <option key="present" value="present">Présent</option>
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalEventCourrier">
          <Col componentClass={ControlLabel} sm={4}>
            Justificatif
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChangeJustificatif} value={this.props.data.justificatif} componentClass="select">
              <option key="oui" value="oui">Oui</option>
              <option key="non" value="non">Non</option>
            </FormControl>
          </Col>
        </FormGroup>
      </>

    )
  }
}

export default EventRdv
