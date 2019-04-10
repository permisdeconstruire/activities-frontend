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
  ControlLabel,
  FormControl,
} from 'react-bootstrap';

import DatePicker from 'react-datepicker'
import { registerLocale }  from 'react-datepicker'
import fr from 'date-fns/locale/fr';
import {authFetch, listPedagogy} from '../common/utils'
registerLocale('fr', fr);

const dateFormat = 'dd/MM/YYYY HH:mm'

const skills = require('../common/skills.json')

const status = [
  'Fermeture',
  'Autonomie',
  'Socio-éducatif',
  'Formative',
  'Individuelle',
]

const pillars = [
  'Bien vivre',
  'Bien-être psychologique',
  'Bien-être corporel',
  'Bien faire',
]


function getSuggestionValue(suggestion) {
  return suggestion
};

function renderSuggestion(suggestion) {
  return (
    <div>
      {suggestion}
    </div>
  )
}

class AdminModal extends React.Component {

  allPedagogy = []

  defaultState() {
    return {
      title: '',
      id: '',
      start: new Date(),
      end: new Date(),
      status: status[0],
      theme: '',
      contributor: '',
      pedagogy: [],
      cost: 0,
      estimated: 0,
      place: '',
      annotation: '',
      copilot: '',
      step:0,
      published: false,
      copyActivity: 'none',
      suggestions: {
        category: [],
        subCategory: [],
        theme: [],
      },
    };
  }

  constructor(props, context) {
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangePublished = this.handleChangePublished.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.addPedagogy = this.addPedagogy.bind(this);
    this.deletePedagogy = this.deletePedagogy.bind(this);
    this.handleChangePedagogy = this.handleChangePedagogy.bind(this);
    this.copyActivity = this.copyActivity.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.handleChangeSuggestion = this.handleChangeSuggestion.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.state = this.defaultState();
  }

  componentDidMount() {
    listPedagogy()
      .then(res => {
        this.allPedagogy = res;
      })
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.currentEventId !== this.props.currentEventId || prevProps.start.toString() !== this.props.start.toString() || prevProps.end.toString() !== this.props.end.toString()) {
      let newState;
      if(this.props.currentEventId === '') {
        newState = this.defaultState();
        newState.start = this.props.start;
        newState.end = this.props.end;
      } else {
        newState = this.props.events.find(event => event.id === this.props.currentEventId)
      }
      this.setState(newState);
    }
  }

  copyActivity(event) {
    if(event.target.value === 'none') {
      this.setState(this.defaultState());
    } else {
      const newState = this.state;
      newState.copyActivity = event.target.value;

      const activity = this.props.events.find(activity => activity.id === event.target.value)
      newState.title = activity.title;
      newState.status = activity.status;
      newState.theme = activity.theme;
      newState.contributor = activity.contributor;
      newState.pedagogy = activity.pedagogy;
      newState.cost = activity.cost;
      newState.estimated = activity.estimated;
      newState.place = activity.place;
      newState.annotation = activity.annotation;
      newState.copilot = activity.copilot;
      newState.published = false;
      this.setState(newState);
    }
  }

  deletePedagogy(index) {
    const newPedagogy = this.state.pedagogy;
    newPedagogy.splice(index, 1);
    this.setState({pedagogy: newPedagogy})
  }

  addPedagogy() {
    const newState = this.state;
    newState.pedagogy.push({category: '', subCategory: '', objective: ''})
    this.setState(newState)
  }

  handleChangePedagogy(index, field, event) {
    const newPedagogy = this.state.pedagogy;
    newPedagogy[index][field] = event.target.value;
    this.setState({pedagogy: newPedagogy})
  }

  handleChangeDate(field, value){
    const newState = {}
    newState[field] = value;
    this.setState(newState);
  }

  handleChangePublished(){
    const newState = {}
    newState.published = !this.state.published;
    this.setState(newState);
  }

  handleChange(field, event){
    console.log(event.target.value);
    const newState = {}
    newState[field] = event.target.value
    this.setState(newState);
  }

  handleChangeSuggestion({index, field}, event, { newValue }) {
    const newState = {}
    if(typeof(index) === 'undefined') {
      newState[field] = newValue
    } else {
      newState.pedagogy = this.state.pedagogy;
      newState.pedagogy[index][field] = newValue
    }

    this.setState(newState);
  }

  handleDelete() {
    const yes = window.confirm('Etes vous certains de vouloir supprimer cet événement ?');
    if(yes) {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/activities/id/${this.state.id}`, {
        method: 'DELETE'
      })
      .then(res => {
        this.props.onClose();
        this.props.refresh();
      })
    }
  }

  getSuggestions(field, index, value) {
    let suggestions;
    if(field === 'subCategory') {
      suggestions = _.uniqBy(this.allPedagogy.filter(pedagogy => pedagogy.category === this.state.pedagogy[index].category), field).map(pedagogy => pedagogy[field])
    } else if(field === 'category') {
      suggestions = _.uniqBy(this.allPedagogy, field).map(pedagogy => pedagogy[field])
    } else if(field === 'theme') {
      suggestions = _.uniqBy(this.props.events, 'theme').map(event => event.theme)
    }

    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : suggestions.filter(theme =>
      theme.toLowerCase().slice(0, inputLength) === inputValue
    );
  }

  onSuggestionsFetchRequested({field, index}, { value }){
    const newState = {suggestions: this.state.suggestions}
    newState.suggestions[field] = this.getSuggestions(field, index, value)
    console.log(field, newState.suggestions[field])
    this.setState(newState);
  }

  onSuggestionsClearRequested(field){
    const newState = {suggestions: this.state.suggestions}
    newState.suggestions[field] = []
    this.setState(newState);
  }

  handleSubmit(event) {
    const id = this.state.id;
    const data = {
      title: this.state.title,
      start: this.state.start,
      end: this.state.end,
      status: this.state.status,
      theme: this.state.theme,
      contributor: this.state.contributor,
      pedagogy: this.state.pedagogy,
      cost: this.state.cost,
      estimated: this.state.estimated,
      place: this.state.place,
      annotation: this.state.annotation,
      copilot: this.state.copilot,
      published: this.state.published,
    }

    if(id !== '') {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/activities/id/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.props.onClose();
        this.props.refresh();
      })
    } else {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/activities`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.props.onClose();
        this.props.refresh();
      })
    }
  }

  handleNavigation() {
    if(this.state.step === 0){
      this.setState({step: 1})
    } else {
      this.setState({step: 0})
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.title !== '' ? this.state.title : 'Nouvelle activité'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.step === 0 ?
            <Form horizontal>
              <FormGroup controlId="formHorizontalClone">
              <Col componentClass={ControlLabel} sm={4}>
                Copier ancienne activité
              </Col>
              <Col sm={8}>
                <FormControl onChange={this.copyActivity} value={this.state.copyActivity} componentClass="select">
                  <option key="none" value="none">-- Partir de zéro --</option>
                  {_.uniqBy(this.props.events, 'theme').map((event) => <option key={event.id} value={event.id}>{event.theme}</option>)}
                </FormControl>
              </Col>
            </FormGroup>
              <Panel>
                <Panel.Heading>Informations</Panel.Heading>
                <Panel.Body>
                  <FormGroup controlId="formHorizontalPublshed">
                    <Col componentClass={ControlLabel} sm={2}>
                      Publier
                    </Col>
                    <Col componentClass={ControlLabel} sm={10} style={({textAlign: 'left'})}>
                      <input type="checkbox" className="btn-sm" checked={this.state.published ? 'checked' : ''} onChange={this.handleChangePublished}/>
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalTitle">

                    <Col componentClass={ControlLabel} sm={2}>
                      Titre
                    </Col>
                    <Col sm={10}>
                      <FormControl value={this.state.title} onChange={this.handleChange.bind(this, 'title')} type="text" placeholder="Nouvelle activité" />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalStatusAndTheme">
                    <Col componentClass={ControlLabel} sm={2}>
                      Status
                    </Col>
                    <Col sm={4}>
                      <FormControl onChange={this.handleChange.bind(this, 'status')} value={this.state.status} componentClass="select">
                        {status.map((status) => <option key={status} value={status}>{status}</option>)}
                      </FormControl>
                    </Col>

                    <Col componentClass={ControlLabel} sm={2}>
                      Theme
                    </Col>
                    <Col sm={4}>
                      <Autosuggest
                        suggestions={this.state.suggestions.theme}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this, {field: 'theme'})}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this, 'theme')}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={({placeholder: 'Visite entreprise', value: this.state.theme, onChange: this.handleChangeSuggestion.bind(this, {field: 'theme'})})}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="formHorizontalPlace">
                    <Col componentClass={ControlLabel} sm={2}>
                      Lieux
                    </Col>
                    <Col sm={8}>
                      <FormControl onChange={this.handleChange.bind(this, 'place')} value={this.state.place} type="text" placeholder="Stade de la Beaujoire" />
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="formHorizontalCost">
                    <Col componentClass={ControlLabel} sm={3}>
                      Prévisionnel
                    </Col>
                    <Col sm={2}>
                      <FormControl onChange={this.handleChange.bind(this, 'estimated')} value={this.state.estimated} type="text" placeholder="0" />
                    </Col>
                    <Col componentClass={ControlLabel} sm={3}>
                      Coût
                    </Col>
                    <Col sm={2}>
                      <FormControl onChange={this.handleChange.bind(this, 'cost')} value={this.state.cost} type="text" placeholder="0" />
                    </Col>
                  </FormGroup>
                </Panel.Body>
              </Panel>

              <Panel>
                <Panel.Heading>Date et heure</Panel.Heading>
                <Panel.Body>
                  <FormGroup controlId="formHorizontalDate">
                    <Col componentClass={ControlLabel} sm={2}>
                      Début
                    </Col>
                    <Col sm={4}>
                      <DatePicker
                        selected={this.state.start}
                        onChange={this.handleChangeDate.bind(this, 'start')}
                        showTimeSelect
                        showTimeSelectOnly
                        locale='fr'
                        dateFormat={dateFormat}
                        timeCaption="Heure"
                      />
                    </Col>

                    <Col componentClass={ControlLabel} sm={2}>
                      Fin
                    </Col>
                    <Col sm={4}>
                      <DatePicker
                        selected={this.state.end}
                        onChange={this.handleChangeDate.bind(this, 'end')}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        dateFormat={dateFormat}
                        timeCaption="Heure"
                      />
                    </Col>
                  </FormGroup>
                </Panel.Body>
              </Panel>

              <Panel>
                <Panel.Heading>Participants</Panel.Heading>
                <Panel.Body>
                  <FormGroup controlId="formHorizontalParticipants">
                    <Col componentClass={ControlLabel} sm={2}>
                      Intervenant
                    </Col>
                    <Col sm={4}>
                      <FormControl onChange={this.handleChange.bind(this, 'contributor')} value={this.state.contributor} type="text" placeholder="Jean-Michel" />
                    </Col>

                    <Col componentClass={ControlLabel} sm={2}>
                      Copilote
                    </Col>
                    <Col sm={4}>
                      <FormControl onChange={this.handleChange.bind(this, 'copilot')} value={this.state.copilot} type="text" placeholder="Gladys" />
                    </Col>
                  </FormGroup>
                </Panel.Body>
              </Panel>

              <FormGroup>
                <Col smOffset={10} sm={10}>
                  <Button bsStyle="primary" onClick={this.handleNavigation}>Suivant</Button>
                </Col>
              </FormGroup>
            </Form>
            :
            <Form horizontal>
              <Panel>
                <Panel.Heading>Annotations</Panel.Heading>
                <Panel.Body>
                  <FormGroup controlId="formHorizontalAnnotation">
                    <FormControl style={({height:'200px'})} onChange={this.handleChange.bind(this, 'annotation')} componentClass="textarea" value={this.state.annotation}  type="text" placeholder="Détails supplémentaires" />
                  </FormGroup>
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Heading>Pédagogie</Panel.Heading>
                <Panel.Body>
                  {this.state.pedagogy.map((pedagogy, index) =>
                    <div key={pedagogy.category+pedagogy.subCategory+index}>
                    <FormGroup controlId="formHorizontalPedagogyCategory">
                      <Col sm={6}>
                        <FormControl onChange={this.handleChangePedagogy.bind(this, index, 'category')} value={pedagogy.category} componentClass="select">
                          <option key="none" value="none">-- Domaine --</option>
                          {_.uniqBy(this.allPedagogy, 'category').map((p, j) => <option key={`category-${j}`} value={p.category}>{p.category}</option>)}
                        </FormControl>
                      </Col>
                      <Col sm={6}>
                        <FormControl onChange={this.handleChangePedagogy.bind(this, index, 'subCategory')} value={pedagogy.subCategory} componentClass="select">
                          <option key="none" value="none">-- Sous-domaine --</option>
                          {_.uniqBy(this.allPedagogy.filter(p => p.category === pedagogy.category), 'subCategory').map((p, j) => <option key={`subCategory-${j}`} value={p.subCategory}>{p.subCategory}</option>)}
                        </FormControl>
                      </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalPedagogyObjective">
                      <Col sm={12}>
                        <FormControl onChange={this.handleChangePedagogy.bind(this, index, 'objective')} value={pedagogy.objective} componentClass="select">
                          <option key="none" value="none">-- Objectif --</option>
                          {_.uniqBy(this.allPedagogy.filter(p => p.category === pedagogy.category && p.subCategory === pedagogy.subCategory), 'objective').map((p, j) => <option key={`objective-${j}`} value={p.objective}>{p.objective}</option>)}
                        </FormControl>
                      </Col>
                    </FormGroup>
                    <FormGroup style={({textAlign:'center'})}>
                      <Col sm={0}>
                        Lier l'objectif
                      </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalPedagogyPillar">
                      <Col sm={6}>
                        <FormControl onChange={this.handleChangePedagogy.bind(this, index, 'pillar')} value={pedagogy.pillar} componentClass="select">
                          <option key="none" value="none">-- Pillier --</option>
                          {pillars.map(pillar => <option key={pillar} value={pillar}>{pillar}</option>)}
                        </FormControl>
                      </Col>
                      <Col sm={6}>
                        <FormControl onChange={this.handleChangePedagogy.bind(this, index, 'level')} value={pedagogy.level} componentClass="select">
                          <option key="none" value="none">-- Niveau --</option>
                          <option key="level-1" value="1">1) Découvrir</option>
                          <option key="level-2" value="2">2) Comprendre</option>
                          <option key="level-3" value="3">3) Choisir</option>
                          <option key="level-4" value="4">4) Réaliser</option>
                        </FormControl>
                      </Col>
                    </FormGroup>
                    <FormGroup style={({textAlign:'center'})}>
                      <Col sm={0}>
                        <Button bsStyle="danger" onClick={this.deletePedagogy.bind(this, index)}>Supprimer</Button>
                      </Col>
                    </FormGroup>
                    <hr/>
                    </div>
                  )}
                  <FormGroup>
                    <Col style={({textAlign:'center'})}>
                      <Button bsStyle="success" onClick={this.addPedagogy}>+</Button>
                    </Col>
                  </FormGroup>
                </Panel.Body>
              </Panel>
              <FormGroup>
                <Col style={({marginLeft:'10px'})}>
                  <Button bsStyle="primary" onClick={this.handleNavigation}>Précédent</Button>
                </Col>
              </FormGroup>
            </Form>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="success" onClick={this.handleSubmit}>Sauvegarder</Button>
          {this.state.id !== '' &&
            <Button onClick={this.handleDelete} bsStyle="danger">Supprimer</Button>
          }
          <Button onClick={this.props.onClose} bsStyle="default">Fermer</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default AdminModal
