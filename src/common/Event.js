import React from 'react'

class Event extends React.Component {

  render(){
    if(this.props.event.status === 'Fermeture') {
      return (
        <>
          <div className='event-title' style={({textAlign:'center'})}>Fermeture</div>
          {this.props.event.title !== '' &&
            <div className='event-title' style={({fontStyle: 'italic', marginTop:'3px', textAlign:'center'})}>{this.props.event.title}</div>
          }
        </>
      )
    }

    if(this.props.event.status === 'Autonomie') {
      return (
        <>
          <div className='new-rbc-event-label'>Autonomie</div>
          <div className='event-title' style={({textAlign:'center'})}>{this.props.event.theme}</div>
        </>
      )
    }

    return (
      <>
        <div className='new-rbc-event-label'>Activité {this.props.event.status}</div>
        <div className='event-title'><b>{this.props.event.theme}</b> - {this.props.event.title}</div>
        <div className='event-place'>
          <a href={`https://www.google.com/maps/search/${this.props.event.place}`} target="_blank" rel="noopener noreferrer">{this.props.event.place}</a>
        </div>
        <div className='event-annotation'>{this.props.event.annotation}</div>
        <div className='event-participants'>{this.props.event.cooperators.join(' & ')}</div>
      </>
    );
  }
}

export default Event
