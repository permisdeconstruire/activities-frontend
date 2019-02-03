import React from 'react'

class EventWrapper extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render(){
    let colorWrapper;
    if(this.props.event.pillar === 'Bien vivre') {
      colorWrapper = 'greenPillar'
    } else if (this.props.event.pillar === 'Bien-être psychologique') {
      colorWrapper = 'purplePillar'
    } else if (this.props.event.pillar === 'Bien-être corporel') {
      colorWrapper = 'orangePillar'
    } else if (this.props.event.pillar === 'Bien faire') {
      colorWrapper = 'bluePillar'
    }
    return (
      <div className={colorWrapper}>
        {this.props.children}
      </div>
    );
  }
}

export default EventWrapper
