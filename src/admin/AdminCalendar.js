import React from 'react'
import BigCalendar from 'react-big-calendar'

import moment from 'moment'
import localizer from 'react-big-calendar/lib/localizers/globalize'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import globalize from 'globalize'
import EventWrapper from '../common/EventWrapper'
import Event from '../common/Event'
import AdminModal from './AdminModal'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)
require('globalize/lib/cultures/globalize.culture.fr')
const globalizeLocalizer = localizer(globalize)

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
    this.onDoubleClickEvent = this.onDoubleClickEvent.bind(this);
    this.refresh = this.refresh.bind(this);

    this.state = this.defaultState();
  }

  refresh() {
    fetch(`${process.env.REACT_APP_BACKEND}/v0/activities`)
      .then(res => res.json())
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

  onDoubleClickEvent(event) {
    this.setState({ show: true, currentEventId: event.id});
  }

  handleClose() {
    this.setState({ show: false, currentEventId: null, start: new Date(), end: new Date()});
  }

  handleSubmit(event) {
    const id = event.event.id;
    const data = {
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
          components={({event: Event, eventWrapper: EventWrapper})}
          selectable='ignoreEvents'
          onSelectSlot={this.onSelectSlot}
          onDoubleClickEvent={this.onDoubleClickEvent}
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
