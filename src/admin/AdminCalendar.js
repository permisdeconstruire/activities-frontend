import React from 'react'
import BigCalendar from 'react-big-calendar'

import moment from 'moment'
import localizer from 'react-big-calendar/lib/localizers/globalize'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import {
  Row,
  Modal,
  Panel,
  Button,
  Form,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';
import globalize from 'globalize'
import EventWrapper from '../common/EventWrapper'
import TimeSlotWrapper from '../common/TimeSlotWrapper'
import Event from '../common/Event'
import AdminModal from './AdminModal'
import {authFetch} from '../common/utils'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)
require('globalize/lib/cultures/globalize.culture.fr')
const globalizeLocalizer = localizer(globalize)

function convertToBigCalendarEvents(events, pilote = 'none') {
  return events.map(event => {
    const newEvent = event;
    newEvent.start = new Date(newEvent.start)
    newEvent.end = new Date(newEvent.end)
    newEvent.isRegistered = false
    if(pilote !== 'none' && typeof(event.participants) !== 'undefined') {
      newEvent.isRegistered = event.participants.findIndex(participant => participant._id === pilote) !== -1;
    }
    return newEvent;
  })
}

class AdminCalendar extends React.Component {

  defaultState() {
    return {
      show: false,
      events: [],
      start: new Date(),
      end: new Date(),
      selectedPilote: 'none',
      pilotes: [],
    };
  }

  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.selectPilote = this.selectPilote.bind(this);
    this.refresh = this.refresh.bind(this);

    this.state = this.defaultState();
  }

  refresh() {
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/activities`)
      .then(events => {
        this.setState({events: convertToBigCalendarEvents(events, this.state.selectedPilote)})
      })
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/pilotes?filter=NOT%20ph_statut%3A%22Termin%C3%A9%22`)
      .then(pilotes => {
        this.setState({pilotes})
      })
  }

  componentDidMount() {
    this.refresh();
  }

  selectPilote(e) {
    this.setState({selectedPilote: e.target.value, events: convertToBigCalendarEvents(this.state.events, e.target.value)})
  }

  onSelectSlot(slotInfo){
    if(this.state.selectedPilote === 'none') {
      this.setState({ show: true, start: slotInfo.start, end: slotInfo.end, currentEventId: '' });
    }
  }

  onSelectEvent(event) {
    if(this.state.selectedPilote === 'none') {
      this.setState({ show: true, currentEventId: event._id});
    } else {
      const pilote = this.state.pilotes.find(pilote => pilote._id === this.state.selectedPilote);
      if(event.isRegistered) {
        authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/activities/id/${event._id}/pilote`, {
          method: 'PUT',
          body: JSON.stringify({
            pilote,
            action: 'unregister',
          }),
          headers:{
            'Content-Type': 'application/json'
          }
        }).then(() => {
          this.refresh();
        })
      } else {
          authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/activities/id/${event._id}/pilote`, {
            method: 'PUT',
            body: JSON.stringify({
              pilote,
              action: 'register',
            }),
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(() => {
            this.refresh();
          })
      }
    }
  }

  handleClose() {
    this.setState({ show: false, currentEventId: null, start: new Date(), end: new Date()});
  }

  handleSubmit(event) {
    const id = event.event._id;
    const data = {
      start: event.start,
      end: event.end,
    }


    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/activities/id/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      this.handleClose();
      this.componentDidMount();
    })
  }

  render() {
    return (
      <>
        <AdminModal
          events={this.state.events}
          start={this.state.start}
          end={this.state.end}
          onClose={this.handleClose}
          currentEventId={this.state.currentEventId}
          show={this.state.show}
          refresh={this.refresh}
        />
        <FormControl onChange={this.selectPilote} value={this.state.selectedPilote} componentClass="select">
          <option key="none" value="none">--Choisir pilote à inscrire--</option>
          {this.state.pilotes.sort((a,b) => a.pseudo<b.pseudo ? -1 : 1).map((datum) => <option key={datum._id} value={datum._id}>{datum.pseudo}</option>)}
        </FormControl>
        <DragAndDropCalendar
          resizable
          events={this.state.events}
          views={['work_week']}
          defaultView='work_week'
          culture='fr'
          components={({timeSlotWrapper: TimeSlotWrapper, event: Event, eventWrapper: EventWrapper})}
          selectable='ignoreEvents'
          onSelectSlot={this.onSelectSlot}
          onSelectEvent={this.onSelectEvent}
          min={moment().startOf('day').add(9, 'hours').toDate()}
          max={moment().startOf('day').add(17, 'hours').toDate()}
          localizer={globalizeLocalizer}
          onEventResize={this.handleSubmit}
          onEventDrop={this.handleSubmit}
        />
      </>
    )
  }
}

export default AdminCalendar
