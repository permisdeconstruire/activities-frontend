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
  Row,
} from 'react-bootstrap';

import DatePicker from 'react-datepicker'
import { registerLocale }  from 'react-datepicker'
import fr from 'date-fns/locale/fr';
import {authFetch, listCooperators} from '../common/utils'
registerLocale('fr', fr);

const dateFormat = 'dd/MM/YYYY HH:mm'

const skills = require('../common/skills.json')

const pillars = ['Les Soins pour Soi', 'Booster sa candidature', 'La Relation', 'Insertion sociale', 'Projet professionnel'];

const status = [
  'Fermeture',
  'Autonomie',
  'Socio-éducatif',
  'Individuelle',
  'Parcours',
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

  allCooperators = []
  allPilotes = []
  allPromotions = []

  defaultState() {
    return {
      title: '',
      _id: '',
      start: new Date(),
      end: new Date(),
      status: status[0],
      promotion: {
        _id: 'none',
        name: '',
        level: '',
        parcours: '',
      },
      sessions: [],
      level: '',
      theme: '',
      cooperators: ['none'],
      objectives: [],
      participants: [],
      cost: 0,
      estimated: 0,
      place: '',
      annotation: '',
      step:0,
      pilote: {_id: 'none', pseudo:''},
      published: true,
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

    this.handleChangePromotion = this.handleChangePromotion.bind(this);
    this.handleChangeSession = this.handleChangeSession.bind(this);

    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangePublished = this.handleChangePublished.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.addCooperator = this.addCooperator.bind(this);
    this.deleteCooperator = this.deleteCooperator.bind(this);
    this.handleChangeCooperator = this.handleChangeCooperator.bind(this);
    this.handleChangePilote = this.handleChangePilote.bind(this);

    this.handleRegisterPilote = this.handleRegisterPilote.bind(this);
    this.handleUnregisterPilote = this.handleUnregisterPilote.bind(this);

    this.genCopyActivity = this.genCopyActivity.bind(this);

    this.copyActivity = this.copyActivity.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.handleChangeSuggestion = this.handleChangeSuggestion.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.state = this.defaultState();
  }

  componentDidMount() {
    listCooperators()
      .then(res => {
        this.allCooperators = res;
        return authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/promotions`)
      })
      .then(res => {
        this.allPromotions = res;
      })
  }

  componentDidUpdate(prevProps, prevState) {
    this.allPilotes = this.props.allPilotes;
    if(prevProps.currentEventId !== this.props.currentEventId || prevProps.start.toString() !== this.props.start.toString() || prevProps.end.toString() !== this.props.end.toString()) {
      let newState;
      if(this.props.currentEventId === '' || this.props.currentEventId === null) {
        newState = this.defaultState();
        newState.start = this.props.start;
        newState.end = this.props.end;
        newState.step = 0;
        this.setState(newState);
      } else {
        newState = this.props.events.find(event => event._id === this.props.currentEventId)
        newState.step = 0;
        if(typeof(newState.promotion) !== 'undefined') {
          const promotion = this.allPromotions.find(p => p._id === newState.promotion._id)
          newState.promotion = promotion;
          authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/parcours/title/${promotion.parcours}`)
          .then((parcours) => {
            const sessions = [];
            for(let i = 0; i < parcours.length; i += 1) {
              for(let j = 0; j < parcours[i].sessions.length; j += 1) {
                const session = parcours[i].sessions[j];
                sessions.push({
                  ...session,
                  level: parcours[i].level,
                })
              }
            }
            newState.sessions = sessions;

            this.setState(newState);
          })
        } else {
          this.setState(newState);
        }
      }

    } else {
      const newState = this.props.events.find(e => e._id === this.props.currentEventId)
      if(typeof(newState) !== 'undefined' && (typeof(this.state.participants) !== typeof(newState.participants) || (typeof(newState.participants) !== 'undefined' && this.state.participants.toString() !== newState.participants.toString()))){
        if(typeof(newState.participants) === 'undefined'){
          newState.participants = [];
        }
        newState.step = 0;
        if(typeof(newState.promotion) !== 'undefined') {
          const promotion = this.allPromotions.find(p => p._id === newState.promotion._id)
          newState.promotion = promotion;
          authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/parcours/title/${promotion.parcours}`)
          .then((parcours) => {
            const sessions = [];
            for(let i = 0; i < parcours.length; i += 1) {
              for(let j = 0; j < parcours[i].sessions.length; j += 1) {
                const session = parcours[i].sessions[j];
                sessions.push({
                  ...session,
                  level: parcours[i].level,
                })
              }
            }
            newState.sessions = sessions;
            this.setState(newState);
          })
        } else {
          this.setState(newState);
        }
      }
    }
  }

  copyActivity(event) {
    if(event.target.value === 'none') {
      this.setState(this.defaultState());
    } else {
      const newState = this.state;
      newState.copyActivity = event.target.value;

      const activity = this.props.events.find(activity => activity._id === event.target.value)
      newState.title = activity.title;
      newState.status = activity.status;
      newState.objectives = activity.objectives;
      newState.theme = activity.theme;
      newState.cost = activity.cost;
      newState.estimated = activity.estimated;
      newState.place = activity.place;
      newState.annotation = activity.annotation;
      newState.cooperators = activity.cooperators;
      newState.published = true;
      this.setState(newState);
    }
  }

  handleUnregisterPilote(participant) {
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/activities/id/${this.state._id}/pilote`, {
      method: 'PUT',
      body: JSON.stringify({
        pilote: participant,
        action: 'unregister',
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(() => {
      this.props.refresh();
    })
  }

  registerPilote(participant, eventId) {
    return authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/activities/id/${eventId}/pilote`, {
      method: 'PUT',
      body: JSON.stringify({
        pilote: participant,
        action: 'register',
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    })
  }

  handleRegisterPilote(refresh = true) {
    this.registerPilote(this.state.pilote, this.state._id)
    .then(() => {
      if(refresh){
        this.props.refresh();
      }
    })
  }

  deleteCooperator(index) {
    const newCooperators = this.state.cooperators;
    newCooperators.splice(index, 1);
    this.setState({cooperators: newCooperators})
  }

  addCooperator() {
    const newState = this.state;
    newState.cooperators.push({_id: 'none', titre:'none'})
    this.setState(newState)
  }

  handleChangePilote(event) {
    const selectedPilote = this.allPilotes.find(pilote => pilote._id === event.target.value);
    this.setState({pilote: selectedPilote})
  }

  handleChangeCooperator(index, event) {
    const newCooperators = this.state.cooperators;
    const selectedCooperator = this.allCooperators.find(cooperator => cooperator._id === event.target.value);
    newCooperators[index] = {_id: selectedCooperator._id, titre: selectedCooperator.titre};
    this.setState({cooperators: newCooperators})
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

  handleChangeSession(event) {
    const session = this.state.sessions.find(s => s.title === event.target.value)
    const promotion = this.state.promotion
    if(typeof(session) !== 'undefined') {
      promotion.level = session.level;
      this.setState({theme: session.title, objectives: session.objectives, promotion});
    } else {
      promotion.level = '';
      this.setState({
        theme: '',
        objectives: [],
        promotion,
      })
    }
  }

  handleChangePromotion(event) {
    const promotion = this.allPromotions.find(p => p._id === event.target.value)
    if(typeof(promotion) !== 'undefined') {
      delete promotion.level;
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/parcours/title/${promotion.parcours}`)
        .then((parcours) => {
          const sessions = [];
          for(let i = 0; i < parcours.length; i += 1) {
            for(let j = 0; j < parcours[i].sessions.length; j += 1) {
              const session = parcours[i].sessions[j];
              sessions.push({
                ...session,
                level: parcours[i].level,
              })
            }
          }
          this.setState({promotion, sessions: sessions});
        })
    } else {
      this.setState({
        promotion: {
          id: 'none',
          name: '',
          level: '',
          parcours: '',
        },
        sessions: [],
      })
    }

  }

  handleChange(field, event){
    const newState = {}
    if(['level'].indexOf(field) !== -1) {
      newState[field] = parseInt(event.target.value, 10);
    } else {
      newState[field] = event.target.value
    }
    this.setState(newState);
  }

  handleChangeSuggestion({index, field}, event, { newValue }) {
    const newState = {}
    if(typeof(index) === 'undefined') {
      newState[field] = newValue
    }

    this.setState(newState);
  }

  handleDelete() {
    const yes = window.confirm('Etes vous certain.e.s de vouloir supprimer cet événement ?');
    if(yes) {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/activities/id/${this.state._id}`, {
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
    if(field === 'theme') {
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
    this.setState(newState);
  }

  onSuggestionsClearRequested(field){
    const newState = {suggestions: this.state.suggestions}
    newState.suggestions[field] = []
    this.setState(newState);
  }

  handleClose() {
    this.props.refresh();
    this.props.onClose();
  }

  handleSubmit(event) {
    const id = this.state._id;
    const data = {
      title: this.state.title,
      start: this.state.start,
      end: this.state.end,
      status: this.state.status,
      theme: this.state.theme,
      promotion: {
        _id: this.state.promotion._id,
        name: this.state.promotion.name,
        parcours: this.state.promotion.parcours,
        level: this.state.promotion.level,
      },
      objectives: this.state.objectives,
      cost: this.state.cost,
      estimated: this.state.estimated,
      place: this.state.place,
      annotation: this.state.annotation,
      cooperators: this.state.cooperators[0] === 'none' ? [] : this.state.cooperators,
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
        if(this.state.status === 'Parcours') {
          this.registerPilote(this.state.promotion.pilotes, this.state._id)
            .then(() => {
              this.props.onClose();
              this.props.refresh();
            })
        } else {
          this.props.onClose();
          this.props.refresh();
        }

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
        if(this.state.status === 'Parcours') {
          this.registerPilote(this.state.promotion.pilotes, res)
            .then(() => {
              this.props.onClose();
              this.props.refresh();
            })
        } else {
          this.props.onClose();
          this.props.refresh();
        }

      })
    }
  }

  handleNavigation(step) {
    this.setState({step})
  }

  genCopyActivity() {
    if(this.state.level === 0) {
      return _.uniqBy(this.props.events.filter(event => pillars.indexOf(event.status) === -1), 'theme').map((event) => <option key={event._id} value={event._id}>{event.theme}</option>)
    } else {
      return _.uniqBy(this.props.events.filter(event => this.state.level === event.level && this.state.status === event.status), 'theme').map((event) => <option key={event._id} value={event._id}>{event.theme}</option>)
    }
  }

  render() {
    let form;
    if(this.state.step === 0) {
      form = (
        <Form horizontal>
          <FormGroup controlId="formHorizontalClone">
            <Col componentClass={ControlLabel} sm={4}>
              Copier ancienne activité
            </Col>
            <Col sm={8}>
              <FormControl onChange={this.copyActivity} value={this.state.copyActivity} componentClass="select">
                <option key="none" value="none">-- Partir de zéro --</option>
                {this.genCopyActivity()}
              </FormControl>
            </Col>
          </FormGroup>
          <hr></hr>
          <FormGroup controlId="formHorizontalStatus">
            <Col componentClass={ControlLabel} sm={4}>
              Type d'activité
            </Col>
            <Col sm={8}>
                <FormControl onChange={this.handleChange.bind(this, 'status')} value={this.state.status} componentClass="select">
                  {status.map((status) => <option key={status} value={status}>{status}</option>)}
                </FormControl>
            </Col>
          </FormGroup>
            {this.state.status === 'Parcours' &&
              <Panel>
                <Panel.Heading>Parcours</Panel.Heading>
                <Panel.Body>
                  <Row style={({padding: '1em'})}>
                    <Col>
                      <FormControl onChange={this.handleChangePromotion} value={this.state.promotion._id} componentClass="select">
                        <option key="none" value="none">-- Promotion --</option>
                        {this.allPromotions.map((p) => <option key={p._id} value={p._id}>{`${p.name}`}</option>)}
                      </FormControl>
                    </Col>
                    <Col style={({marginTop: '20px', fontWeight: 'bold'})}>
                      {this.state.promotion.parcours}
                    </Col>
                    <Col>
                      {this.state.promotion.level}
                    </Col>
                    <Col style={({marginTop: '20px'})}>
                      <FormControl onChange={this.handleChangeSession} value={this.state.theme} componentClass="select">
                        <option key="none" value="">-- Séance --</option>
                        {this.state.sessions.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                      </FormControl>
                    </Col>
                  </Row>
                </Panel.Body>
              </Panel>
            }
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
              <FormGroup controlId="formHorizontalActivity">
                <Col componentClass={ControlLabel} sm={2}>
                  Activité
                </Col>
                <Col sm={10}>
                  <Autosuggest
                    suggestions={this.state.suggestions.theme}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this, {field: 'theme'})}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this, 'theme')}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={({className:"form-control", placeholder: 'Visite entreprise', value: this.state.theme, onChange: this.handleChangeSuggestion.bind(this, {field: 'theme'})})}
                  />
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
                    todayButton={"Aujourd'hui"}
                    selected={this.state.start}
                    onChange={this.handleChangeDate.bind(this, 'start')}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat={dateFormat}
                    timeCaption="Heure"
                    className="form-control"
                  />
                </Col>

                <Col componentClass={ControlLabel} sm={2}>
                  Fin
                </Col>
                <Col sm={4}>
                  <DatePicker
                    todayButton={"Aujourd'hui"}
                    selected={this.state.end}
                    onChange={this.handleChangeDate.bind(this, 'end')}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat={dateFormat}
                    timeCaption="Heure"
                    className="form-control"
                  />
                </Col>
              </FormGroup>
            </Panel.Body>
          </Panel>

          <Panel>
            <Panel.Heading>Intervenants</Panel.Heading>
            <Panel.Body>
              <FormGroup controlId="formHorizontalParticipants">
                {this.state.cooperators.map((cooperator, index) =>
                  <div key={index}>
                  <Col style={({marginBottom:'10px'})} key={index} sm={index > 0 ? 4 : 5}>
                    <FormControl onChange={this.handleChangeCooperator.bind(this, index)} value={cooperator._id} componentClass="select">
                      <option key="none" value="none">------</option>
                      {this.allCooperators.sort((a,b) => a.titre<b.titre ? -1 : 1).map((c) => <option key={c._id} value={c._id}>{c.titre}</option>)}
                    </FormControl>
                  </Col>
                  <Col sm={1}><a target="_blank" href={`${process.env.REACT_APP_BACKEND}/v0/admin/cooperators/id/${cooperator._id}?token=${window.localStorage.getItem('jwtPDC')}`} className="btn btn-sm btn-primary" title="Impersonate">😒</a></Col>
                  {index > 0 && (<Col sm={1}><Button bsSize="small" bsStyle="danger" onClick={this.deleteCooperator.bind(this, index)}>-</Button></Col>)}
                  </div>
                )}
              </FormGroup>
              <FormGroup>
                <Col style={({textAlign:'center'})}>
                  <Button bsStyle="success" onClick={this.addCooperator}>+</Button>
                </Col>
              </FormGroup>
            </Panel.Body>
          </Panel>

          <FormGroup>
            <Col sm={9}>
              <Button bsStyle="default" onClick={this.handleNavigation.bind(this, 2)}>Voir participants</Button>
            </Col>
            <Col sm={3}>
              <Button bsStyle="primary" onClick={this.handleNavigation.bind(this, 1)}>Suivant</Button>
            </Col>
          </FormGroup>
        </Form>
      )
    } else if(this.state.step === 1) {
      form = (
        <Form horizontal>
          <Panel>
            <Panel.Heading>Annotations</Panel.Heading>
            <Panel.Body>
              <FormGroup controlId="formHorizontalAnnotation">
                <FormControl style={({height:'200px'})} onChange={this.handleChange.bind(this, 'annotation')} componentClass="textarea" value={this.state.annotation}  type="text" placeholder="Détails supplémentaires" />
              </FormGroup>
            </Panel.Body>
          </Panel>
          {/* <Panel>
            <Panel.Heading>Pédagogie</Panel.Heading>
            <Panel.Body>
              {this.state.pedagogy.map((pedagogy, index) =>
                <div key={pedagogy.category+pedagogy.level+pedagogy.subCategory+index}>
                  <Pedagogy pedagogy={pedagogy} onChange={this.handleChangePedagogy.bind(this, index)} fixedLevel={this.state.level} fixedPillar={this.state.status} />
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
          </Panel> */}
          <FormGroup>
            <Col style={({marginLeft:'10px'})}>
              <Button bsStyle="primary" onClick={this.handleNavigation.bind(this, 0)}>Précédent</Button>
            </Col>
          </FormGroup>
        </Form>
      )
    } else if(this.state.step === 2) {
      form = (
        <>
          <Row>
            {
              this.state.participants.sort((a,b) => a.pseudo<b.pseudo ? -1 : 1).map(participant => (
                <Col sm={6} key={participant._id}>
                  {participant.pseudo}
                  <Button bsStyle="danger" onClick={this.handleUnregisterPilote.bind(this, participant)}>X</Button>
                </Col>
              ))
            }
          </Row>
          <hr />
          <Row>
            {this.state._id === '' ?
              <Col sm={12}>Merci de créer l'activité d'abord (Précédent puis Sauvegarder)</Col>
            :
            <>
              <Col sm={8}>
                <FormControl onChange={this.handleChangePilote} value={this.state.pilote._id} componentClass="select">
                  <option key="none" value="none">------</option>
                  {this.allPilotes.sort((a,b) => a.pseudo<b.pseudo ? -1 : 1).map((p) => <option key={p._id} value={p._id}>{p.pseudo}</option>)}
                </FormControl>
              </Col>
              <Col sm={3}>
                <Button bsStyle="primary" onClick={this.handleRegisterPilote}>Ajouter participant</Button>
              </Col>
            </>
            }
          </Row>
        </>
      )
    }

    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title><b>{this.state.theme !== '' ? this.state.theme : ''}</b> - {this.state.title !== '' ? this.state.title : 'Nouvelle activité'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {form}
        </Modal.Body>
        <Modal.Footer>
          {this.state.step !== 2 ?
            <>
              <Button bsStyle="success" onClick={this.handleSubmit}>Sauvegarder</Button>
              {this.state._id !== '' &&
                <Button onClick={this.handleDelete} bsStyle="danger">Supprimer</Button>
              }
              <Button onClick={this.handleClose} bsStyle="default">Fermer</Button>
            </>
              :
              <Button bsStyle="primary" onClick={this.handleNavigation.bind(this, 0)}>Précédent</Button>
          }
        </Modal.Footer>
      </Modal>
    )
  }
}

export default AdminModal
