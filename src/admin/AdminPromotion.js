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

class AdminPromotion extends React.Component {

  defaultState() {
    return {
      promotions: [],
      parcours: [],
      selected: 'none',
      currentPromotion: {
        _id: '',
        name: '',
        parcours: '',
        level: '',
        pilotes: [],
      },
      pilotes: [],
      selectedPilotesToAdd: [],
      selectedPilotesToRemove: [],
    };
  }

  constructor(props, context) {
    super(props, context);
    this.select = this.select.bind(this);
    this.delete = this.delete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangePromotion = this.handleChangePromotion.bind(this);
    this.handleChangeParcours = this.handleChangeParcours.bind(this);

    this.state = this.defaultState();
  }

  handleChangeParcours(event) {

  }

  handleChangePromotion(event) {
    const currentPromotion = this.state.currentPromotion
    currentPromotion.name = event.target.value;
    this.setState(...this.state, currentPromotion);
  }

  delete(event) {
    const yes = window.confirm('Etes vous certain.e.s de vouloir supprimer cette promotion ?');
    if(yes) {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/promotions/id/${this.state.selectedLevel}`, {
        method: 'DELETE'
      })
      .then(res => {
        this.updatePromotions();
      })
    }
  }

  select(event) {
    if(event.target.value === 'none') {
      const currentPromotion = {
        title: '',
        level: '',
        sessions: [],
      }
      this.setState({...this.state, selectedLevel: 'none', selectedTitle: event.target.value, currentPromotion});
    } else {
      const currentPromotion = this.state.currentPromotion
      currentPromotion.title = event.target.value;
      this.setState({...this.state, selectedLevel: 'none', selectedTitle: event.target.value, currentPromotion});
    }

  }

  selectLevel(event) {
    if(event.target.value === 'none') {
      const currentPromotion = this.state.currentPromotion
      currentPromotion.level = ''
      currentPromotion.sessions = []
      console.log(this.state.promotions);
      this.setState({...this.state, selectedLevel: event.target.value, currentPromotion});
    } else {
      const currentPromotion = JSON.parse(JSON.stringify(this.state.promotions.find(p => p._id === event.target.value)))
      this.setState({...this.state, selectedLevel: event.target.value, currentPromotion});
    }
  }

  handleRemoveObjective(index, index2) {
    const currentPromotion = this.state.currentPromotion;
    currentPromotion.sessions[index].objectives.splice(index2, 1)
    this.setState({...this.state, currentPromotion});
  }

  handleAddObjective(index) {
    const currentPromotion = this.state.currentPromotion;
    currentPromotion.sessions[index].objectives.push('');
    this.setState({...this.state, currentPromotion});
  }

  handleEditObjective(index, index2, event) {
    const currentPromotion = this.state.currentPromotion;
    currentPromotion.sessions[index].objectives[index2] = event.target.value;
    this.setState({...this.state, currentPromotion});
  }

  handleAddSession() {
    const currentPromotion = this.state.currentPromotion;
    currentPromotion.sessions.push({
      title: '',
      objectives: [],
    })
    this.setState({...this.state, currentPromotion});
  }

  handleRemoveSession(index) {
    const currentPromotion = this.state.currentPromotion;
    currentPromotion.sessions.splice(index, 1)
    this.setState({...this.state, currentPromotion});
  }

  updateParcours() {
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/parcours`)
      .then(res => {
        const newState = this.state;
        newState.parcours = res;
        this.setState(newState)
      })
  }

  updatePromotions() {
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/promotions`)
      .then(res => {
        const newState = this.state;
        newState.promotions = res;
        this.setState(newState)
      })
  }

  componentDidMount() {
    this.updateParcours();
    this.updatePromotions();
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/pilotes?filter=ph_statut%3A(%22Suivi%22)`)
      .then(res => {
        this.setState({pilotes: res});
      })
  }

  handleChange(field, event) {
    const newState = this.state;
    newState.currentPromotion[field] = event.target.value;
    this.setState(newState)
  }

  handleChangeSession(index, event) {
    const newState = this.state;
    newState.currentPromotion.sessions[index].title = event.target.value;
    this.setState(newState)
  }

  handleSubmit() {
    if(this.state.selectedLevel === 'none') {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/promotions`, {
        method: 'POST',
        body: JSON.stringify(this.state.currentPromotion),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.updatePromotions()
      })
    } else {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/promotions/id/${this.state.selectedLevel}`, {
        method: 'PUT',
        body: JSON.stringify(this.state.currentPromotion),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.updatePromotions()
      })
    }
  }

  render() {
    return (
      <Row>
        <Col sm={2}>
          <FormControl onChange={this.select} value={this.state.selectedTitle} componentClass="select">
            <option key="none" value="none">-- Promotion --</option>
            {this.state.promotions.sort((a,b) => a.name<b.name ? -1 : 1).map((datum) => <option key={datum._id} value={datum._id}>{datum.name}</option>)}
          </FormControl>
          {this.state.selected !== 'none' &&
            <Button bsStyle="danger" onClick={this.delete}>Supprimer</Button>
          }
        </Col>
        <Col sm={8} style={({margin:'auto'})}>
          <Col sm={4} style={({margin:'auto'})}>
            <FormControl onChange={this.handleChangePromotion} value={this.state.currentPromotion.name} placeholder="Nom de la promotion" />
          </Col>
          <Col sm={6} style={({margin:'auto'})}>
            <FormControl onChange={this.handleChangeParcours} value={this.state.currentPromotion._id} componentClass="select">
              <option key="none" value="none">-- Parcours --</option>
              {this.state.parcours.sort((a,b) => `${a.title} - ${a.level}`<`${b.title} - ${b.level}` ? -1 : 1).map((datum) => <option key={datum._id} value={datum._id}>{`${datum.title} / ${datum.level}`}</option>)}
            </FormControl>
          </Col>
          <hr></hr>
          <h3>Pilotes</h3>
          <Col sm={5} style={({margin:'auto'})}>
            <FormControl onChange={this.selectPilotesToAdd} value={this.state.selectedPilotesToAdd} componentClass="select" multiple="true" style={({height:'300px'})}>
              {this.state.pilotes.sort((a,b) => a.pseudo<b.pseudo ? -1 : 1).map((datum) => <option key={datum._id} value={datum._id}>{datum.pseudo}</option>)}
            </FormControl>
          </Col>
          <Col sm={1} style={({height:'300px', lineHeight: '150px'})}>
            <Button bsStyle="success" onClick={this.addPilotes}>-></Button>
            <Button bsStyle="danger" onClick={this.removePilotes}>&lt;-</Button>
          </Col>
          <Col sm={5} style={({margin:'auto'})}>
            <FormControl onChange={this.selectPilotesToRemove} value={this.state.selectedPilotesToRemove} componentClass="select" multiple="true" style={({height:'300px'})}>
              {this.state.currentPromotion.pilotes.sort((a,b) => a.pseudo<b.pseudo ? -1 : 1).map((datum) => <option key={datum._id} value={datum._id}>{datum.pseudo}</option>)}
            </FormControl>
          </Col>
        </Col>
      </Row>

    )
  }
}

export default AdminPromotion
