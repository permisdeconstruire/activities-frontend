import React from 'react'
import BigCalendar from 'react-big-calendar'

import moment from 'moment'
import localizer from 'react-big-calendar/lib/localizers/globalize'
import globalize from 'globalize'
import EventWrapper from '../common/EventWrapper'
import Event from '../common/Event'
import TimeSlotWrapper from '../common/TimeSlotWrapper'

require('globalize/lib/cultures/globalize.culture.fr')
const globalizeLocalizer = localizer(globalize)


function convertToBigCalendarEvents(events, whoami) {
  return events.map(event => {
    const newEvent = event;
    newEvent.start = new Date(newEvent.start)
    newEvent.end = new Date(newEvent.end)
    return newEvent;
  })
}

class PublicCalendar extends React.Component {

  defaultState() {
    return {
      events: [],
    };
  }

  constructor(props, context) {
    super(props, context);
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

  render() {
    return (
      <BigCalendar
        events={this.state.events}
        views={['work_week']}
        defaultView='work_week'
        culture='fr'
        components={({timeSlotWrapper: TimeSlotWrapper, event: Event, eventWrapper: EventWrapper})}
        selectable={false}
        min={moment().startOf('day').add(9, 'hours').toDate()}
        max={moment().startOf('day').add(17, 'hours').toDate()}
        localizer={globalizeLocalizer}
      />
    )
  }
}

export default PublicCalendar
