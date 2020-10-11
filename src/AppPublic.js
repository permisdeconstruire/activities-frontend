import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker.css'
import { Row } from 'react-bootstrap';
import './styles.css'
import './prism.css'
import PublicCalendar from './public/PublicCalendar'

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <div className="jumbotron">
          <img src="/logo.png" />
          <div className="container" style={({display: 'inline-grid', textAlign: 'center'})}>
            <Row>
              Bienvenue chez Permis de Construire. <a href={`${window.localStorage.getItem('PDC_AGENCE')}/v0/activities.pdf`} target="_blank"> Télécharger l'agenda </a>
            </Row>
          </div>
        </div>
        <div className="examples">
          <div className="example">
            <PublicCalendar />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
