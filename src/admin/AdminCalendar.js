import React from 'react'
import BigCalendar from 'react-big-calendar'

import moment from 'moment'
import localizer from 'react-big-calendar/lib/localizers/globalize'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import globalize from 'globalize'
import EventWrapper from '../common/EventWrapper'
import TimeSlotWrapper from '../common/TimeSlotWrapper'
import Event from '../common/Event'
import AdminModal from './AdminModal'
import {authFetch} from '../common/utils'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)
require('globalize/lib/cultures/globalize.culture.fr')
const globalizeLocalizer = localizer(globalize)

function convertToBigCalendarEvents(events) {
  return events.map(event => {
    const newEvent = event;
    newEvent.start = new Date(newEvent.start)
    newEvent.end = new Date(newEvent.end)
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
    };
  }

  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.refresh = this.refresh.bind(this);

    this.state = this.defaultState();
  }

  refresh() {
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/activities`)
      .then(events => {
        this.setState({events: convertToBigCalendarEvents(events)})
      })
  }

  componentDidMount() {
    this.refresh();
  }

  onSelectSlot(slotInfo){
    this.setState({ show: true, start: slotInfo.start, end: slotInfo.end, currentEventId: '' });
  }

  onSelectEvent(event) {
    this.setState({ show: true, currentEventId: event._id});
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
