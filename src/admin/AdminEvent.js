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
import EventDivers from './Events/EventDivers'
import EventRdv from './Events/EventRdv'
import EventAppel from './Events/EventAppel'



const types = ['evaluation', 'divers', 'rdv', 'appel', 'courrier']

class AdminEvent extends React.Component {

  defaultState() {
    return {
      type: '',
      comment: '',
      data: {},
      pilote: 'none',
      piloteList: [],
    };
  }

  constructor(props, context) {
    super(props, context);
    this.handleChangeData = this.handleChangeData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = this.defaultState();
  }

  componentDidMount() {
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/pilotes`)
      .then(res => {
        this.setState({piloteList: res});
      })
  }

  handleChange(field, event){
    const newState = this.state;
    newState[field] = event.target.value
    if(field === 'type') {
      if(event.target.value === 'courrier') {
        newState.data = {status: 'relance'}
      } else if(event.target.value === 'evaluation') {
        newState.data = {}
      } else if(event.target.value === 'divers') {
        newState.data = {title: ''}
      } else if(event.target.value === 'rdv') {
        newState.data = {status: 'manque', justificatif: 'oui'}
      } else if(event.target.value === 'appel') {
        newState.data = {direction: 'in', who: '', answered: 'non'}
      }
    }
    this.setState(newState);
  }

  handleChangeData(data){
    this.setState({data})
  }

  handleSubmit(event) {
    const data = {
      type: this.state.type,
      comment: this.state.comment,
      pilote: this.state.pilote,
      data: this.state.data,
    }
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/events`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      const piloteList = this.state.piloteList;
      const newState = this.defaultState();
      newState.piloteList = piloteList;
      this.setState(newState);
    })
  }

  typeUI(type) {
    if(type === 'courrier') {
      return <EventCourrier data={this.state.data} onChange={this.handleChangeData} />
    }
    if(type === 'evaluation'){
      return <EventEvaluation data={this.state.data} onChange={this.handleChangeData} />
    }
    if(type === 'divers'){
      return <EventDivers data={this.state.data} onChange={this.handleChangeData} />
    }
    if(type === 'rdv'){
      return <EventRdv data={this.state.data} onChange={this.handleChangeData} />
    }
    if(type === 'appel'){
      return <EventAppel data={this.state.data} onChange={this.handleChangeData} />
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
            <Col sm={4}>
              <FormControl onChange={this.handleChange.bind(this, 'pilote')} value={this.state.pilote} componentClass="select">
                <option key="none" value="none">-- Pilote --</option>
                {this.state.piloteList.map(pilote => <option key={pilote.email} value={pilote.email}>{pilote.email}</option>)}
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalParticipants">
            <Col sm={6}>
              <FormControl style={({height:'200px', width:'920px'})} onChange={this.handleChange.bind(this, 'comment')} componentClass="textarea" value={this.state.comment}  type="text" placeholder="Commentaires" />
            </Col>
          </FormGroup>
          {this.typeUI(this.state.type)}
          <div style={({textAlign: 'center'})}><Button bsStyle="success" onClick={this.handleSubmit}>Envoyer</Button></div>
        </Form>
      </div>

    )
  }
}

export default AdminEvent
