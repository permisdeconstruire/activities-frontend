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

class AdminParcours extends React.Component {

  defaultState() {
    return {
      parcours: [],
      selectedTitle: 'none',
      selectedLevel: 'none',
      currentParcours: {
        title: '',
        level: '',
        sessions: [],
      }
    };
  }

  constructor(props, context) {
    super(props, context);
    this.select = this.select.bind(this);
    this.delete = this.delete.bind(this);
    this.selectLevel = this.selectLevel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddSession = this.handleAddSession.bind(this);
    this.handleRemoveSession = this.handleRemoveSession.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddObjective = this.handleAddObjective.bind(this);
    this.handleEditObjective = this.handleEditObjective.bind(this);
    this.handleRemoveObjective = this.handleRemoveObjective.bind(this);
    this.state = this.defaultState();
  }

  delete(event) {
    const yes = window.confirm('Etes vous certain.e.s de vouloir supprimer ce parcours ?');
    if(yes) {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/parcours/id/${this.state.selectedLevel}`, {
        method: 'DELETE'
      })
      .then(res => {
        this.updateParcours();
      })
    }
  }

  select(event) {
    if(event.target.value === 'none') {
      const currentParcours = {
        title: '',
        level: '',
        sessions: [],
      }
      this.setState({...this.state, selectedLevel: 'none', selectedTitle: event.target.value, currentParcours});
    } else {
      const currentParcours = this.state.currentParcours
      currentParcours.title = event.target.value;
      this.setState({...this.state, selectedLevel: 'none', selectedTitle: event.target.value, currentParcours});
    }

  }

  selectLevel(event) {
    if(event.target.value === 'none') {
      const currentParcours = this.state.currentParcours
      currentParcours.level = ''
      currentParcours.sessions = []
      console.log(this.state.parcours);
      this.setState({...this.state, selectedLevel: event.target.value, currentParcours});
    } else {
      const currentParcours = JSON.parse(JSON.stringify(this.state.parcours.find(p => p._id === event.target.value)))
      this.setState({...this.state, selectedLevel: event.target.value, currentParcours});
    }
  }

  handleRemoveObjective(index, index2) {
    const currentParcours = this.state.currentParcours;
    currentParcours.sessions[index].objectives.splice(index2, 1)
    this.setState({...this.state, currentParcours});
  }

  handleAddObjective(index) {
    const currentParcours = this.state.currentParcours;
    currentParcours.sessions[index].objectives.push('');
    this.setState({...this.state, currentParcours});
  }

  handleEditObjective(index, index2, event) {
    const currentParcours = this.state.currentParcours;
    currentParcours.sessions[index].objectives[index2] = event.target.value;
    this.setState({...this.state, currentParcours});
  }

  handleAddSession() {
    const currentParcours = this.state.currentParcours;
    currentParcours.sessions.push({
      title: '',
      objectives: [],
    })
    this.setState({...this.state, currentParcours});
  }

  handleRemoveSession(index) {
    const currentParcours = this.state.currentParcours;
    currentParcours.sessions.splice(index, 1)
    this.setState({...this.state, currentParcours});
  }

  updateParcours() {
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/parcours`)
      .then(res => {
        const newState = this.defaultState();
        newState.parcours = res;
        this.setState(newState)
      })
  }

  componentDidMount() {
    this.updateParcours();
  }

  handleChange(field, event) {
    const newState = this.state;
    newState.currentParcours[field] = event.target.value;
    this.setState(newState)
  }

  handleChangeSession(index, event) {
    const newState = this.state;
    newState.currentParcours.sessions[index].title = event.target.value;
    this.setState(newState)
  }

  handleSubmit() {
    if(this.state.selectedLevel === 'none') {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/parcours`, {
        method: 'POST',
        body: JSON.stringify(this.state.currentParcours),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.updateParcours()
      })
    } else {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/parcours/id/${this.state.selectedLevel}`, {
        method: 'PUT',
        body: JSON.stringify(this.state.currentParcours),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.updateParcours()
      })
    }
  }

  render() {
    return (
      <Row>
        <Col sm={2}>
          <FormControl onChange={this.select} value={this.state.selectedTitle} componentClass="select">
            <option key="none" value="none">-- Titre --</option>
            {_.uniqBy(this.state.parcours, 'title').sort((a,b) => a.title<b.title ? -1 : 1).map((datum) => <option key={datum.title} value={datum.title}>{datum.title}</option>)}
          </FormControl>
          <FormControl onChange={this.selectLevel} value={this.state.selectedLevel} componentClass="select">
            <option key="none" value="none">-- Niveau --</option>
            {this.state.parcours
              .sort((a,b) => a.level<b.level ? -1 : 1)
              .filter((datum) => datum.title === this.state.selectedTitle)
              .map((datum) => <option key={datum._id} value={datum._id}>{datum.level}</option>)}
          </FormControl>
          {this.state.selectedLevel !== 'none' &&
            <Button bsStyle="danger" onClick={this.delete}>Supprimer</Button>
          }
        </Col>
        <Col sm={8} style={({margin:'auto'})}>
          <div style={({height: '50px'})}>
            <Col sm={6}>
              <FormControl onChange={this.handleChange.bind(this, 'title')} value={this.state.currentParcours.title} placeholder="Titre du parcours" />
            </Col>
            <Col sm={6}>
              <FormControl onChange={this.handleChange.bind(this, 'level')} value={this.state.currentParcours.level} placeholder="Niveau et intitulé du niveau" />
            </Col>
          </div>
          <h3>Séances</h3>
          <Button bsStyle="success" onClick={this.handleAddSession}>Ajouter une séance</Button>
          <hr></hr>
          {this.state.currentParcours.sessions.map((parcour, index) =>
            <div style={({marginBottom: '30px'})} key={index}>
              <FormGroup key={index} controlId={`formHorizontalTypeSession_${index}`}>
                <Col sm={12}>
                  <FormControl onChange={this.handleChangeSession.bind(this, index)} value={this.state.currentParcours.sessions[index].title} placeholder="Titre de la séance" />
                </Col>
              </FormGroup>
                <h4>Objectifs <Button bsStyle="success" onClick={this.handleAddObjective.bind(this, index)}>+</Button></h4>
                <ul>
                {this.state.currentParcours.sessions[index].objectives.map((objective, index2) =>
                  <li key={`o_${index2}`}>
                    <Col sm={8}>
                      <FormControl onChange={this.handleEditObjective.bind(this, index, index2)} value={objective} placeholder="Objectif" />
                    </Col>
                    <Col>
                      <Button bsStyle="danger" onClick={this.handleRemoveObjective.bind(this, index, index2)}>-</Button>
                    </Col>
                  </li>
                )}
                </ul>
              <div style={({textAlign: 'right'})}><Button bsStyle="danger" onClick={this.handleRemoveSession.bind(this, index)}>Retirer cette séance</Button></div>
              <hr></hr>
            </div>
          )}

          <div style={({textAlign: 'center'})}>
            {this.state.selectedLevel !== 'none' ?
              <Button bsStyle="success" onClick={this.handleSubmit}>Sauvegarder</Button>
              :
              <Button bsStyle="success" onClick={this.handleSubmit}>Créer</Button>
            }
          </div>
        </Col>
      </Row>

    )
  }
}

export default AdminParcours
