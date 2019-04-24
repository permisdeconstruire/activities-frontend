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
import {authFetch} from '../common/utils'
import EventCourrier from './Events/EventCourrier'
import EventEvaluation from './Events/EventEvaluation'

const types = ['evaluation', 'divers', 'rdv', 'appel', 'courrier']

class AdminEvent extends React.Component {

  defaultState() {
    return {
      type: '',
      comments: '',
      data: {},
    };
  }

  constructor(props, context) {
    super(props, context);
    this.handleChangeData = this.handleChangeData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = this.defaultState();
  }

  handleChange(field, event){
    const newState = this.state;
    newState[field] = event.target.value
    this.setState(newState);
  }

  handleChangeData(data){
    this.setState({data})
  }

  handleSubmit(event) {

  }

  typeUI(type) {
    if(type === 'courrier') {
      return <EventCourrier data={this.state.data} onChange={this.handleChangeData} />
    }
    if(type === 'evaluation'){
      return <EventEvaluation data={this.state.data} onChange={this.handleChangeData} />
    }
  }

  render() {
    return (
      <div style={({margin: 'auto', flex: 'auto'})}>
        <Form horizontal>
          <FormGroup controlId="formHorizontalType">
            <Col sm={4}>
              <FormControl onChange={this.handleChange.bind(this, 'type')} value={this.state.type} componentClass="select">
                <option key="none" value="none">-- Type d'événement --</option>
                {types.map(type => <option key={type} value={type}>{type}</option>)}
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalParticipants">
            <Col sm={6}>
              <FormControl style={({height:'200px', width:'920px'})} onChange={this.handleChange.bind(this, 'comments')} componentClass="textarea" value={this.state.comments}  type="text" placeholder="Commentaires" />
            </Col>
          </FormGroup>
          {this.typeUI(this.state.type)}
        </Form>
      </div>

    )
  }
}

export default AdminEvent
