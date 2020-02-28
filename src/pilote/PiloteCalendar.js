import React from 'react'
import BigCalendar from 'react-big-calendar'

import moment from 'moment'
import localizer from 'react-big-calendar/lib/localizers/globalize'
import globalize from 'globalize'
import EventWrapper from '../common/EventWrapper'
import Event from '../common/Event'
import TimeSlotWrapper from '../common/TimeSlotWrapper'
import PiloteModal from './PiloteModal'
import {authFetch, alert} from '../common/utils'

require('globalize/lib/cultures/globalize.culture.fr')
const globalizeLocalizer = localizer(globalize)

function convertToBigCalendarEvents(events, whoami) {
  return events.map(event => {
    const newEvent = event;
    newEvent.start = new Date(newEvent.start)
    newEvent.end = new Date(newEvent.end)
    newEvent.isRegistered = false
    if(typeof(whoami) !== 'undefined' && typeof(event.participants) !== 'undefined') {
      newEvent.isRegistered = event.participants.findIndex(participant => participant._id === whoami.roles.pilote) !== -1;
    }

    return newEvent;
  }).filter(event => {
    if(document.location.search.includes('hide=true')) {
      if(typeof(whoami) !== 'undefined' && typeof(event.participants) !== 'undefined' && event.participants.findIndex(participant => participant._id === whoami.roles.pilote) !== -1) {
        return event;
      }
      if(['Fermeture', 'Autonomie'].includes(event.status)) {
        return event;
      }
    } else {
        return event;
    }

  })
}

class PiloteCalendar extends React.Component {

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
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/pilote/activities`)
      .then(events => {
        this.setState({events: convertToBigCalendarEvents(events, this.props.whoami)})
      })
  }

  componentDidMount() {
    this.refresh();
  }

  onSelectEvent(event) {
    const tooLate = moment(event.start);
    if(moment().isBefore(tooLate)){
      if(['Fermeture', 'Autonomie', 'Individuelle'].indexOf(event.status) === -1) {
        this.setState({ show: true, currentEventId: event._id});
      } else if(event.status === 'Individuelle') {
        if(event.isRegistered){
          alert('Inscription à cette activité validée')
        } else {
          alert('Merci de contacter ton copilote pour l\'inscription à cette activité')
        }
      }
    } else {
      alert('Cette activité est passée')
    }
  }

  handleClose() {
    this.setState({show: false, currentEventId: null});
  }

  render() {
    return (
      <>
        <PiloteModal
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

export default PiloteCalendar
