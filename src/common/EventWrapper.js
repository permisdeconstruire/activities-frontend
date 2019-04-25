import React from 'react'
import {colorActivity} from './utils'

class EventWrapper extends React.Component {

  render(){
    return (
      <div className={`${colorActivity(this.props.event.status)} is-registered-${this.props.event.isRegistered} is-cooperator-${this.props.event.isCooperator}`}>
        {this.props.children}
      </div>
    );
  }
}

export default EventWrapper
