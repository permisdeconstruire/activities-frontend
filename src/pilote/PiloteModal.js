import _ from 'lodash'
import React from 'react'
import {
  Modal,
  Panel,
  Row,
  Button,
  Form,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';

import DatePicker from 'react-datepicker'
import { registerLocale }  from 'react-datepicker'
import fr from 'date-fns/locale/fr';
import {authFetch} from '../common/utils'
registerLocale('fr', fr);

const dateFormat = 'dd/MM/YYYY HH:mm'

class PiloteModal extends React.Component {

  defaultState() {
    return {
      step: 0,
      justification: '',
    }
  }

  constructor(props, context) {
    super(props, context);

    this.handleRegister = this.handleRegister.bind(this);
    this.handleUnregister = this.handleUnregister.bind(this);
    this.handleUnregistration = this.handleUnregistration.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
    this.handleChangeJustification = this.handleChangeJustification.bind(this);

    this.state = this.defaultState();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.currentEventId !== this.props.currentEventId) {
      const event = this.props.events.find(event => event._id === this.props.currentEventId)
      if(typeof(event) !== 'undefined') {
        const newState = this.defaultState();
        this.setState(newState);
      }
    }
  }

  handleRegister() {
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/pilote/activities/id/${this.props.currentEventId}`, {
      method: 'PUT',
      body: JSON.stringify({
        action: 'register',
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(() => {
      this.props.onClose();
      this.props.refresh();
    })
  }

  handleChangeJustification(event) {
    this.setState({justification: event.target.value});
  }

  handleUnregister() {
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/pilote/activities/id/${this.props.currentEventId}`, {
      method: 'PUT',
      body: JSON.stringify({
        action: 'unregister',
        justification: this.state.justification,
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(() => {
      this.props.onClose();
      this.props.refresh();
    })
  }

  handleRegistration() {
    this.setState({step: 1})
  }

  handleUnregistration() {
    this.setState({step: 2})
  }

  render() {
    const event = this.props.events.find(event => event._id === this.props.currentEventId)
    if(typeof(event) === 'undefined') {
      return (<></>);
    }
    let objectives = [];
    if(typeof(event.objectives) !== 'undefined') {
      objectives = event.objectives;
    }
    let participants = [];
    if(typeof(event.participants) !== 'undefined'){
       participants = event.participants;
    }

    let stepPanel;

    if(this.state.step === 0){
      stepPanel = (
        <>
        <Panel>
          <Panel.Heading>Je vais travailler les objectifs suivants</Panel.Heading>
          <Panel.Body>
            <Form horizontal>
              {
                objectives.sort((a,b) => a<b ? -1 : 1).map((objective, index) => (
                  <div key={`obj_${index}`}>
                  <Row key={`obj_${index}`}>
                    <Col sm={12} style={({textAlign:'justify'})}>
                      {objective}
                    </Col>
                  </Row>
                  <hr />
                  </div>
                ))
              }
            </Form>
          </Panel.Body>
        </Panel>
        <Panel>
          <Panel.Heading>Participants</Panel.Heading>
          <Panel.Body>
            <Row>
              <Col sm={12}>
                Intervenants : {event.cooperators.map(cooperator => cooperator.titre).join(' & ')}
              </Col>
            </Row>
            <hr/>
            <Row>
              {
                participants.map(participant => (
                  <Col sm={6} key={participant._id}>
                    {participant.pseudo}
                  </Col>
                ))
              }
            </Row>
          </Panel.Body>
        </Panel>
        </>
      )
    } else {
      stepPanel = (
        <Panel>
          <Panel.Heading>Justification</Panel.Heading>
          <Panel.Body>
            <Form horizontal>
              <FormControl style={({height:'200px'})} onChange={this.handleChangeJustification} componentClass="textarea" value={this.state.justification}  type="text" placeholder="Je ne peux plus venir car..." />
            </Form>
          </Panel.Body>
        </Panel>
      )
    }

    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton >
          {(typeof(event.promotion) !== 'undefined' && event.promotion._id !== 'none')
            ?
            <>
            <Modal.Title><b>{event.promotion.parcours}</b></Modal.Title>
            <Modal.Title>{event.promotion.level}</Modal.Title>
            <Modal.Title style={({marginTop: '30px'})}><b>{event.theme}</b> - {event.title}</Modal.Title>
            </>
            :
            <Modal.Title><b>{event.theme}</b> - {event.title}</Modal.Title>
          }
        </Modal.Header>
        <Modal.Body>
          {stepPanel}
        </Modal.Body>
        <Modal.Footer>
          {this.state.step === 0 &&
            <>
              {event.isRegistered ?
                <Button onClick={this.handleUnregistration} bsStyle="danger">Se désinscrire</Button>
              :
                <Button bsStyle="success" onClick={this.handleRegister}>S'inscrire</Button>
              }
            </>
          }
          {this.state.step === 2 &&
            <>
              <Button bsStyle="default" onClick={this.props.onClose}>Annuler</Button>
              {this.state.justification.length > 10 &&
                <Button onClick={this.handleUnregister} bsStyle="danger">Je me désinscris</Button>
              }
            </>
          }
        </Modal.Footer>
      </Modal>
    )
  }
}

export default PiloteModal
