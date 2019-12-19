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
import {authFetch, listPedagogy} from '../../common/utils'
import Pedagogy from '../../common/Pedagogy'

const evaluations = [
  {name: 'Non réalisé', value: 1},
  {name: 'Partiellement réalisé', value: 2},
  {name: 'Réalisé', value: 3},
]

class EventEvaluation extends React.Component {

  defaultState() {
    return {};
  }

  constructor(props, context) {
    super(props, context);
    this.handleChangeEvaluation = this.handleChangeEvaluation.bind(this)
    this.state = this.defaultState();
  }

  handleChangeEvaluation(event) {
    const newPedagogy = this.props.data;
    newPedagogy.evaluation = parseInt(event.target.value, 10);
    this.props.onChange(newPedagogy);
  }

  render() {
    return (
      <>
        <Pedagogy pedagogy={this.props.data} onChange={this.props.onChange} />
        <FormGroup controlId="formHorizontalPedagogyNote">
          <Col componentClass={ControlLabel} sm={4}>
            Évaluation
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChangeEvaluation} value={this.props.data.evaluation} componentClass="select">
              <option key="none" value="none">-- Evaluation --</option>
              {evaluations.map(evaluation => <option key={evaluation.name} value={evaluation.value}>{evaluation.name}</option>)}
            </FormControl>
          </Col>
        </FormGroup>
      </>
    )
  }
}

export default EventEvaluation
