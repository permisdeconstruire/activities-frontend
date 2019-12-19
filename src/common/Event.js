import React from 'react'

const parcours = ['Projet professionnel', 'La Relation', 'Les Soins pour Soi', 'Booster sa candidature', 'Insertion sociale']

class Event extends React.Component {

  render(){
    if(this.props.event.status === 'Fermeture') {
      return (
        <>
          <div className='event-title' style={({textAlign:'center'})}>Fermeture</div>
          {this.props.event.theme !== '' &&
            <div className='event-title' style={({fontStyle: 'italic', marginTop:'3px', textAlign:'center'})}>{this.props.event.theme}</div>
          }
        </>
      )
    }

    if(this.props.event.status === 'Autonomie') {
      return (
        <>
          <div className='event-title' style={({textAlign:'center', color: 'black'})}>Autonomie</div>
          {this.props.event.theme !== '' &&
            <div className='event-title' style={({fontStyle: 'italic', color: 'black', marginTop:'3px', textAlign:'center'})}>{this.props.event.theme}</div>
          }
        </>
      )
    }

    let prefix = 'Activité';
    if(parcours.indexOf(this.props.event.status) !== -1) {
      prefix = 'Parcours';
    }
    return (
      <>
        <div className='new-rbc-event-label'>{prefix} {this.props.event.status}</div>
        <div className='event-title'><b>{this.props.event.theme}</b> - {this.props.event.title}</div>
        <div className='event-place'>
          <a href={`https://www.google.com/maps/search/${this.props.event.place}`} target="_blank" rel="noopener noreferrer">{this.props.event.place}</a>
        </div>
        <div className='event-annotation'>{this.props.event.annotation}</div>
        <div className='event-participants'>{this.props.event.cooperators.map(cooperator => cooperator.titre).join(' & ')}</div>
      </>
    );
  }
}

export default Event
