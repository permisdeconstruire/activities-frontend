import _ from 'lodash'
import React from 'react'
import DatePicker from 'react-datepicker'
import { registerLocale }  from 'react-datepicker'
import fr from 'date-fns/locale/fr';
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

registerLocale('fr', fr);
const dateFormat = 'dd/MM/YYYY HH:mm'

class AdminPromotion extends React.Component {

  defaultState() {
    return {
      promotions: [],
      parcours: [],
      selected: 'none',
      currentPromotion: {
        parcoursId: 'none',
        name: '',
        parcours: '',
        level: '',
        pilotes: [],
        startDate: new Date(),
        endDate: new Date(0)
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
    this.addPilotes = this.addPilotes.bind(this);
    this.removePilotes = this.removePilotes.bind(this);
    this.selectPilotesToAdd = this.selectPilotesToAdd.bind(this);
    this.selectPilotesToRemove = this.selectPilotesToRemove.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeParcours = this.handleChangeParcours.bind(this);
    this.state = this.defaultState();
  }

  handleChangeParcours(event) {
    const parcours = this.state.parcours.find(p => p._id === event.target.value);
    const currentPromotion = this.state.currentPromotion;
    currentPromotion.parcours = parcours.title
    currentPromotion.level = parcours.level
    currentPromotion.parcoursId = parcours._id;
    this.setState({currentPromotion})
  }

  handleChangeDate(key, date) {
    const currentPromotion = this.state.currentPromotion;
    currentPromotion[key] = date;
    this.setState({currentPromotion})
  }

  selectPilotesToRemove(event) {
    const options = event.target.options;
    const selectedPilotesToRemove = []
    for(let i = 0; i < options.length; i += 1) {
      const option = options[i]
      if(option.selected) {
        selectedPilotesToRemove.push(option.value)
      }
    }
    this.setState({selectedPilotesToRemove});
  }

  selectPilotesToAdd(event) {
    const options = event.target.options;
    const selectedPilotesToAdd = []
    for(let i = 0; i < options.length; i += 1) {
      const option = options[i]
      if(option.selected) {
        selectedPilotesToAdd.push(option.value)
      }
    }
    this.setState({selectedPilotesToAdd});
  }

  removePilotes(event) {
    const currentPromotion = this.state.currentPromotion;
    for(let i = 0; i < this.state.selectedPilotesToRemove.length; i += 1) {
      const id = this.state.selectedPilotesToRemove[i];
      const a = currentPromotion.pilotes.findIndex(p => p._id === id)
      currentPromotion.pilotes.splice(a, 1);
    }
    this.setState({currentPromotion, selectedPilotesToAdd: [], selectedPilotesToRemove: []})
  }

  addPilotes(event) {
    const currentPromotion = this.state.currentPromotion;
    for(let i = 0; i < this.state.selectedPilotesToAdd.length; i += 1) {
      const _id = this.state.selectedPilotesToAdd[i];
      const pilote = this.state.pilotes.find(p => p._id === _id)
      currentPromotion.pilotes.push({
        _id,
        pseudo: pilote.pseudo,
      })
    }
    this.setState({currentPromotion, selectedPilotesToAdd: [], selectedPilotesToRemove: []})
  }

  handleChangePromotion(event) {
    const currentPromotion = this.state.currentPromotion
    currentPromotion.name = event.target.value;
    this.setState({currentPromotion});
  }

  delete(event) {
    const yes = window.confirm('Etes vous certain.e.s de vouloir supprimer cette promotion ?');
    if(yes) {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/promotions/id/${this.state.selected}`, {
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
        parcoursId: 'none',
        name: '',
        parcours: '',
        level: '',
        pilotes: [],
        startDate: new Date(),
        endDate: new Date(0)
      }
      this.setState({selected: event.target.value, currentPromotion});
    } else {
      const currentPromotion = this.state.promotions.find(p => p._id === event.target.value)
      currentPromotion.startDate = new Date(currentPromotion.startDate)
      currentPromotion.endDate = new Date(currentPromotion.endDate)
      this.setState({selected: event.target.value, currentPromotion});
    }

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
        const newState = this.defaultState();
        newState.promotions = res;
        newState.parcours = this.state.parcours;
        newState.pilotes = this.state.pilotes;
        this.setState(newState)
      })
  }

  componentDidMount() {
    this.updateParcours();
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/pilotes?filter=ph_statut%3A(%22Suivi%22)`)
      .then(res => {
        this.setState({pilotes: res});
      })
    this.updatePromotions();
  }

  handleSubmit() {
    if(this.state.selected === 'none') {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/promotions`, {
        method: 'POST',
        body: JSON.stringify({
          ...this.state.currentPromotion,
          startDate: this.state.currentPromotion.startDate.toISOString(),
          endDate: this.state.currentPromotion.endDate.toISOString(),
        }),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.updatePromotions()
      })
    } else {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/promotions/id/${this.state.selected}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...this.state.currentPromotion,
          startDate: this.state.currentPromotion.startDate.toISOString(),
          endDate: this.state.currentPromotion.endDate.toISOString(),
        }),
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
    const restPiloteToAdd = [];
    for(let i = 0; i < this.state.pilotes.length; i += 1) {
      const pilote = this.state.pilotes[i];
      const exists = this.state.currentPromotion.pilotes.find(p => p._id === pilote._id);
      if(typeof(exists) === 'undefined') {
        restPiloteToAdd.push({pseudo: pilote.pseudo, _id: pilote._id});
      }
    }

    return (
      <Row>
        <Col sm={2}>
          <FormControl onChange={this.select} value={this.state.selected} componentClass="select">
            <option key="none" value="none">-- Promotion --</option>
            {this.state.promotions.sort((a,b) => a.name<b.name ? -1 : 1).map((datum) => <option key={datum._id} value={datum._id}>{datum.name}</option>)}
          </FormControl>
          {this.state.selected !== 'none' &&
            <Button bsStyle="danger" onClick={this.delete}>Supprimer</Button>
          }
        </Col>
        <Col sm={8} style={({margin:'auto'})}>
          <Col sm={5} style={({margin:'auto'})}>
            <FormControl onChange={this.handleChangePromotion} value={this.state.currentPromotion.name} placeholder="Nom de la promotion" />
          </Col>
          <Col sm={6} style={({margin:'auto'})}>
            <FormControl onChange={this.handleChangeParcours} value={this.state.currentPromotion.parcoursId} componentClass="select">
              <option key="none" value="none">-- Parcours --</option>
              {this.state.parcours.sort((a,b) => `${a.title} - ${a.level}`<`${b.title} - ${b.level}` ? -1 : 1).map((datum) => <option key={datum._id} value={datum._id}>{`${datum.title} / ${datum.level}`}</option>)}
            </FormControl>
          </Col>
          <div style={({height: '60px'})}></div>
          <Col sm={6}>
            Démarrage de la promotion : <DatePicker
              todayButton={"Aujourd'hui"}
              selected={this.state.currentPromotion.startDate}
              onChange={this.handleChangeDate.bind(this, 'startDate')}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat={dateFormat}
              timeCaption="Heure"
              className="form-control"
            />
          </Col>
          <Col sm={6}>
          Fin de la promotion : <DatePicker
              todayButton={"Aujourd'hui"}
              selected={this.state.currentPromotion.endDate}
              onChange={this.handleChangeDate.bind(this, 'endDate')}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat={dateFormat}
              timeCaption="Heure"
              className="form-control"
            />
          </Col>
          <hr style={({height: '30px'})}></hr>
          <h3>Pilotes</h3>
          <Col sm={5} style={({margin:'auto'})}>
            <FormControl onChange={this.selectPilotesToAdd} value={this.state.selectedPilotesToAdd} componentClass="select" multiple={true} style={({height:'300px'})}>
              {restPiloteToAdd.sort((a,b) => a.pseudo<b.pseudo ? -1 : 1).map((datum) => <option key={datum._id} value={datum._id}>{datum.pseudo}</option>)}
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
          <div style={({textAlign: 'center'})}>
            {this.state.selected !== 'none' ?
              <Button style={({marginTop: '30px'})} bsStyle="success" onClick={this.handleSubmit}>Sauvegarder</Button>
              :
              <Button style={({marginTop: '30px'})} bsStyle="success" onClick={this.handleSubmit}>Créer nouvelle promotion</Button>
            }
          </div>
        </Col>
      </Row>

    )
  }
}

export default AdminPromotion
