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
import {authFetch, colorPillar} from '../common/utils'
registerLocale('fr', fr);

const dateFormat = 'dd/MM/YYYY HH:mm'

class CooperatorModal extends React.Component {

  defaultState() {
    return {
      step: 0,
      pedagogy: [],
      justification: '',
    }
  }

  constructor(props, context) {
    super(props, context);

    this.handleRegister = this.handleRegister.bind(this);
    this.handleUnregister = this.handleUnregister.bind(this);
    this.handleUnregistration = this.handleUnregistration.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
    this.handleCheckPedagogy = this.handleCheckPedagogy.bind(this);
    this.handleChangeJustification = this.handleChangeJustification.bind(this);

    this.state = this.defaultState();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.currentEventId !== this.props.currentEventId) {
      const event = this.props.events.find(event => event.id === this.props.currentEventId)
      if(typeof(event) !== 'undefined') {
        const newState = this.defaultState();
        newState.pedagogy = JSON.parse(JSON.stringify(event.pedagogy));
        this.setState(newState);
      }
    }
  }

  handleCheckPedagogy(index, event) {
    const newPedagogy = this.state.pedagogy;
    if(typeof(newPedagogy[index].checked) === 'undefined'){
      newPedagogy[index].checked = false;
    }
    newPedagogy[index].checked = !newPedagogy[index].checked;

    this.setState({pedagogy: newPedagogy});
  }

  handleRegister() {
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/pilote/activities/id/${this.props.currentEventId}`, {
      method: 'PUT',
      body: JSON.stringify({
        action: 'register'
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
    const event = this.props.events.find(event => event.id === this.props.currentEventId)
    if(typeof(event) === 'undefined') {
      return (<></>);
    }
    let participants = [];
    if(typeof(event.participants) !== 'undefined'){
       participants = event.participants;
    }

    let stepPanel;

    if(this.state.step === 0){
      stepPanel = (
        <Panel>
          <Panel.Heading>Participants</Panel.Heading>
          <Panel.Body>
            <Row>
              <Col sm={6}>
                Intervenant : {event.contributor}
              </Col>
              <Col sm={6}>
                Copilote : {event.copilot}
              </Col>
            </Row>
            <hr/>
            <Row>
              {
                participants.map(participant => (
                  <Col sm={6} key={participant}>
                    {participant}
                  </Col>
                ))
              }
            </Row>
          </Panel.Body>
        </Panel>
      )
    } else if(this.state.step === 1) {
      stepPanel = (
        <Panel>
          <Panel.Heading>Je souhaite travailler les compétences suivantes</Panel.Heading>
          <Panel.Body>
            <Form horizontal>
              {
                this.state.pedagogy.map((pedagogy, index) => (
                  <>
                  <Row title={pedagogy.pillar} className={`pedagogyRow`} key={`peda_${index}`}>
                    <Col sm={12} style={({textAlign:'center'})}>
                      {`${pedagogy.objective}`}
                    </Col>
                    <Col sm={5} style={({fontWeight:'bold'})} className={colorPillar(pedagogy.pillar)}>
                      {pedagogy.pillar}
                    </Col>
                    <Col sm={5}>
                    {
                      Array.apply(null, {length: pedagogy.level}).map((k, i) => (
                        <span key={`star_${i}`} className="fa fa-star starChecked"></span>
                      ))
                    }
                    </Col>
                    <Col sm={2}>
                      <Button bsStyle={pedagogy.checked ? 'success' : 'default'} onClick={this.handleCheckPedagogy.bind(this, index)}>OK</Button>
                    </Col>
                  </Row>
                  <hr />
                  </>
                ))
              }
            </Form>
          </Panel.Body>
        </Panel>
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

    const allChecked = _.some(this.state.pedagogy, {checked: true})
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton >
          <Modal.Title>{event.title}</Modal.Title>
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
                <Button bsStyle="success" onClick={this.handleRegistration}>S'inscrire</Button>
              }
            </>
          }
          {this.state.step === 1 && allChecked &&
            <Button bsStyle="success" onClick={this.handleRegister}>Je m'engage à venir à l'activité</Button>
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

export default CooperatorModal
