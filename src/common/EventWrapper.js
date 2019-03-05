import React from 'react'
import {colorPillar} from './utils'

class EventWrapper extends React.Component {

  render(){
    return (
      <div className={`${colorPillar(this.props.event.pillar)} is-registered-${this.props.event.isRegistered}`}>
        {this.props.children}
      </div>
    );
  }
}

export default EventWrapper
