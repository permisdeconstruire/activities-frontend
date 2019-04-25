import React from 'react'
import BigCalendar from 'react-big-calendar'

import moment from 'moment'
import localizer from 'react-big-calendar/lib/localizers/globalize'
import globalize from 'globalize'
import EventWrapper from '../common/EventWrapper'
import Event from '../common/Event'
import TimeSlotWrapper from '../common/TimeSlotWrapper'
import CooperatorModal from './CooperatorModal'

require('globalize/lib/cultures/globalize.culture.fr')
const globalizeLocalizer = localizer(globalize)


function convertToBigCalendarEvents(events, whoami) {
  return events.map(event => {
    const newEvent = event;
    newEvent.id = newEvent._id;
    newEvent.start = new Date(newEvent.start)
    newEvent.end = new Date(newEvent.end)
    newEvent.isCooperator = false
    if(typeof(whoami) !== 'undefined' && typeof(event.cooperators) !== 'undefined') {
      newEvent.isCooperator = event.cooperators.indexOf(whoami.email) !== -1;
    }
    return newEvent;
  })
}

class CooperatorCalendar extends React.Component {

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
    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.refresh = this.refresh.bind(this);

    this.state = this.defaultState();
  }

  refresh() {
    fetch(`${process.env.REACT_APP_BACKEND}/v0/activities`)
      .then(res => res.json())
      .then(events => {
        this.setState({events: convertToBigCalendarEvents(events, this.props.whoami)})
      })
  }

  componentDidMount() {
    this.refresh();
  }

  onSelectEvent(event) {
    if(event.status !== 'Fermeture' && event.status !== 'Autonomie' && event.isCooperator) {
      this.setState({ show: true, currentEventId: event.id});
    }
  }

  handleClose() {
    this.setState({show: false, currentEventId: null});
  }

  render() {
    return (
      <>
        <CooperatorModal
          events={this.state.events}
          start={this.state.start}
          end={this.state.end}
          onClose={this.handleClose}
          currentEventId={this.state.currentEventId}
          show={this.state.show}
          refresh={this.refresh}
        />
        <BigCalendar
          whoami={this.props.whoami}
          events={this.state.events}
          views={['work_week']}
          defaultView='work_week'
          culture='fr'
          components={({timeSlotWrapper: TimeSlotWrapper, event: Event, eventWrapper: EventWrapper})}
          selectable={false}
          onSelectEvent={this.onSelectEvent}
          min={moment().startOf('day').add(9, 'hours').toDate()}
          max={moment().startOf('day').add(17, 'hours').toDate()}
          localizer={globalizeLocalizer}
        />
      </>
    )
  }
}

export default CooperatorCalendar
