import _ from 'lodash'
import React from 'react'
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
import {authFetch} from '../common/utils'
registerLocale('fr', fr);

const dateFormat = 'dd/MM/YYYY HH:mm'

const skills = require('../common/skills.json')

const pillars = [
  'Fermeture',
  'Bien vivre',
  'Bien-être psychologique',
  'Bien-être corporel',
  'Bien faire',
]

const themes = [
  'theme 1',
  'theme 2',
  'theme 3',
]

class AdminModal extends React.Component {

  defaultState() {
    return {
      title: '',
      id: '',
      start: new Date(),
      end: new Date(),
      pillar: pillars[0],
      theme: themes[0],
      contributor: '',
      pedagogy: [],
      cost: 0,
      place: '',
      annotation: '',
      copilot: '',
      step:0,
      copyActivity: 'none'
    };
  }

  constructor(props, context) {
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.addPedagogy = this.addPedagogy.bind(this);
    this.deletePedagogy = this.deletePedagogy.bind(this);
    this.handleChangePedagogy = this.handleChangePedagogy.bind(this);
    this.copyActivity = this.copyActivity.bind(this);
    this.state = this.defaultState();
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
      newState.pillar = activity.pillar;
      newState.theme = activity.theme;
      newState.contributor = activity.contributor;
      newState.pedagogy = activity.pedagogy;
      newState.cost = activity.cost;
      newState.place = activity.place;
      newState.annotation = activity.annotation;
      newState.copilot = activity.copilot;
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
    newState.pedagogy.push({rubric: skills[0].rubric, skill: skills[0].titles[0]})
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

  handleChange(field, event){
    const newState = {}
    newState[field] = event.target.value
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

  handleSubmit(event) {
    const id = this.state.id;
    const data = {
      title: this.state.title,
      start: this.state.start,
      end: this.state.end,
      pillar: this.state.pillar,
      theme: this.state.theme,
      contributor: this.state.contributor,
      pedagogy: this.state.pedagogy,
      cost: this.state.cost,
      place: this.state.place,
      annotation: this.state.annotation,
      copilot: this.state.copilot,
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
                <FormControl onChange={this.copyActivity} value={this.state.copyActivity} componentClass="select" placeholder={pillars[0]}>
                  <option key="none" value="none">-- Partir de zéro --</option>
                  {_.uniqBy(this.props.events, 'theme').map((event) => <option key={event.id} value={event.id}>{event.theme}</option>)}
                </FormControl>
              </Col>
            </FormGroup>
              <Panel>
                <Panel.Heading>Informations</Panel.Heading>
                <Panel.Body>
                  <FormGroup controlId="formHorizontalTitle">
                    <Col componentClass={ControlLabel} sm={2}>
                      Titre
                    </Col>
                    <Col sm={10}>
                      <FormControl value={this.state.title} onChange={this.handleChange.bind(this, 'title')} type="text" placeholder="Nouvelle activité" />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalPillarAndTheme">
                    <Col componentClass={ControlLabel} sm={2}>
                      Pilier
                    </Col>
                    <Col sm={4}>
                      <FormControl onChange={this.handleChange.bind(this, 'pillar')} value={this.state.pillar} componentClass="select" placeholder={pillars[0]}>
                        {pillars.map((pillar) => <option key={pillar} value={pillar}>{pillar}</option>)}
                      </FormControl>
                    </Col>

                    <Col componentClass={ControlLabel} sm={2}>
                      Theme
                    </Col>
                    <Col sm={4}>
                      <FormControl onChange={this.handleChange.bind(this, 'theme')} value={this.state.theme} componentClass="select" placeholder={themes[0]}>
                        {themes.map((theme) => <option key={theme} value={theme}>{theme}</option>)}
                      </FormControl>
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="formHorizontalPlaceAndCost">
                    <Col componentClass={ControlLabel} sm={2}>
                      Lieux
                    </Col>
                    <Col sm={6}>
                      <FormControl onChange={this.handleChange.bind(this, 'place')} value={this.state.place} type="text" placeholder="Stade de la Beaujoire" />
                    </Col>

                    <Col componentClass={ControlLabel} sm={2}>
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
                    <div key={pedagogy.rubric+pedagogy.skill+index}>
                    <FormGroup controlId="formHorizontalPedagogyRubric">
                      <Col componentClass={ControlLabel} sm={3}>
                        Rubrique
                      </Col>
                      <Col sm={9}>
                        <FormControl onChange={this.handleChangePedagogy.bind(this, index, 'rubric')} value={pedagogy.rubric} componentClass="select" placeholder={skills[0].rubric}>
                          {skills.map(({rubric}) => <option key={rubric+index} value={rubric}>{rubric}</option>)}
                        </FormControl>
                      </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalPedagogySkill">
                      <Col componentClass={ControlLabel} sm={3}>
                        Compétence
                      </Col>
                      <Col sm={8}>
                        <FormControl onChange={this.handleChangePedagogy.bind(this, index, 'skill')} value={pedagogy.skill} componentClass="select" placeholder={skills[0].titles[0]}>
                          {skills.find(({rubric}) => rubric === pedagogy.rubric).titles.map(skill => <option key={pedagogy.rubric+skill+index} value={skill}>{skill}</option>)}
                        </FormControl>
                      </Col>
                      <Col sm={0}>
                        <Button bsStyle="danger" onClick={this.deletePedagogy.bind(this, index)}>-</Button>
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
