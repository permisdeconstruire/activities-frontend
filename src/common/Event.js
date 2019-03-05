import React from 'react'

class Event extends React.Component {

  render(){
    return (
      <>
        <div className='event-title'>{this.props.event.title} - {this.props.event.theme}</div>
        <div className='event-place'>
          <a href={`https://www.google.com/maps/search/${this.props.event.place}`} target="_blank" rel="noopener noreferrer">{this.props.event.place}</a>
        </div>
        <div className='event-annotation'>{this.props.event.annotation}</div>
        <div className='event-participants'>{this.props.event.contributor} & {this.props.event.copilot}</div>
      </>
    );
  }
}

export default Event
