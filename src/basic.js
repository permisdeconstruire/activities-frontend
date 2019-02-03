import React from 'react'
import BigCalendar from 'react-big-calendar'
import DatePicker from 'react-datepicker'
import {
  Modal,
  Panel,
  Button,
  Form,
  FormGroup,
  Col,
  Popover,
  Tooltip,
  ControlLabel,
  FormControl,
  Checkbox
} from 'react-bootstrap';
import moment from 'moment'
import localizer from 'react-big-calendar/lib/localizers/globalize'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import globalize from 'globalize'
import fr from 'date-fns/locale/fr';
import EventWrapper from './EventWrapper'
import { registerLocale }  from 'react-datepicker'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)
registerLocale('fr', fr);
require('globalize/lib/cultures/globalize.culture.fr')
const globalizeLocalizer = localizer(globalize)

const dateFormat = 'DD/MM/YYYY HH:mm'

function momentFormat(date) {
  return moment(date).format(dateFormat);
}

const pillars = [
  '-- Pilier --',
  'Bien vivre',
  'Bien-être psychologique',
  'Bien-être corporel',
  'Bien faire',
]

const themes = [
  '-- Theme --',
  'theme 1',
  'theme 2',
  'theme 3',
]

const defaultState = {
  show: false,
  title: '',
  id: '',
  start: new Date(),
  end: new Date(),
  pillar: pillars[0],
  theme: themes[0],
  contributor: '',
  pedagogy: '',
  cost: 0,
  place: '',
  annotation: '',
  copilot: '',
  step:0,
  events: [],
};

function convertToBigCalendarEvents(events) {
  return events.map(event => {
    const newEvent = event;
    newEvent.id = newEvent._id;
    newEvent.start = new Date(newEvent.start)
    newEvent.end = new Date(newEvent.end)
    return newEvent;
  })
}

class AdminCalendar extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.onDoubleClickEvent = this.onDoubleClickEvent.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = defaultState;
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_BACKEND}/v0/activities`)
      .then(res => res.json())
      .then(events => {
        defaultState.events = convertToBigCalendarEvents(events);
        this.setState({events})
      })
  }

  onSelectSlot(slotInfo){
    this.setState({ show: true, start: slotInfo.start, end: slotInfo.end });
  }

  onDoubleClickEvent(event) {
    const newState = event;
    newState.show = true;
    this.setState(newState);
  }

  handleChangeDate(field, value){
    const newState = {}
    console.log(value);
    newState[field] = value;
    this.setState(newState);
  }

  handleChange(field, event){
    const newState = {}
    console.log(event);
    newState[field] = event.target.value
    this.setState(newState);
    // console.log(field, event);
  }

  handleDelete() {
    const yes = window.confirm('Etes vous certains de vouloir supprimer cet événement ?');
    if(yes) {
      fetch(`${process.env.REACT_APP_BACKEND}/v0/activities/id/${this.state.id}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(res => {
        this.handleClose();
        this.componentDidMount();
      })
    }
  }

  handleSubmit(event) {
    let data;
    let id;
    if(typeof(event.event) !== 'undefined'){
      id = event.event.id;
      data = {
        title: event.event.title,
        start: event.start,
        end: event.end,
        pillar: event.event.pillar,
        theme: event.event.theme,
        contributor: event.event.contributor,
        pedagogy: event.event.pedagogy,
        cost: event.event.cost,
        place: event.event.place,
        annotation: event.event.annotation,
        copilot: event.event.copilot,
      }
    } else {
      id = this.state.id;
      data = {
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
    }

    if(id !== '') {
      fetch(`${process.env.REACT_APP_BACKEND}/v0/activities/id/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(res => {
        this.handleClose();
        this.componentDidMount();
      })
    } else {
      fetch(`${process.env.REACT_APP_BACKEND}/v0/activities`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(res => {
        this.handleClose();
        this.componentDidMount();
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

  handleClose() {
    this.setState(defaultState);
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
      <>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.title !== '' ? this.state.title : 'Nouvelle activité'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.step === 0 ?
              <Form horizontal>
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
                          timeIntervals={15}
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
                          locale='fr'
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
                    <Button bsStyle="info" onClick={this.handleNavigation}>Suivant</Button>
                  </Col>
                </FormGroup>
              </Form>
              :
              <Form>
                <Panel>
                  <Panel.Heading>Détails</Panel.Heading>
                  <Panel.Body>
                    <FormGroup controlId="formHorizontalPedagogy">
                      <ControlLabel>Pédagogie</ControlLabel>
                      <FormControl style={({height:'200px'})} onChange={this.handleChange.bind(this, 'pedagogy')} componentClass="textarea" value={this.state.pedagogy}  type="text" placeholder="Expliquer la pédagogie de l'activité" />
                    </FormGroup>
                    <FormGroup controlId="formHorizontalAnnotation">
                      <ControlLabel>Annotations</ControlLabel>
                      <FormControl style={({height:'200px'})} onChange={this.handleChange.bind(this, 'annotation')} componentClass="textarea" value={this.state.annotation}  type="text" placeholder="Détails supplémentaires" />
                    </FormGroup>
                  </Panel.Body>
                </Panel>
                <FormGroup>
                  <Col>
                    <Button bsStyle="info" onClick={this.handleNavigation}>Précédent</Button>
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
            <Button onClick={this.handleClose} bsStyle="default">Fermer</Button>
          </Modal.Footer>
        </Modal>
        <DragAndDropCalendar
          resizable
          events={this.state.events}
          views={['work_week']}
          defaultView='work_week'
          culture='fr'
          components={({eventWrapper: EventWrapper})}
          selectable='ignoreEvents'
          onSelectSlot={this.onSelectSlot}
          onDoubleClickEvent={this.onDoubleClickEvent}
          min={moment().startOf('day').add(10, 'hours').toDate()}
          max={moment().startOf('day').add(18, 'hours').toDate()}
          localizer={globalizeLocalizer}
          onEventResize={this.handleSubmit}
          onEventDrop={this.handleSubmit}
        />
      </>
    )
  }
}

export default AdminCalendar
