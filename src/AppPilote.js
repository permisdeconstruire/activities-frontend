import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker.css'
import { Row } from 'react-bootstrap';
import './styles.css'
import './prism.css'
import PiloteCalendar from './pilote/PiloteCalendar'
import PiloteHeader from './pilote/PiloteHeader'
import {authFetch, logout} from './common/utils'

class App extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.changeRoute = this.changeRoute.bind(this)
    this.state = {
      whoami: null,
      route: document.location.hash,
    }
  }

  changeRoute() {
    this.setState({route: document.location.hash})
  }

  componentDidMount() {
    window.addEventListener("hashchange", this.changeRoute, false);
    authFetch(`${window.localStorage.getItem('PDC_AGENCE')}/v0/whoami`)
      .then(whoami => {
        this.setState({whoami})
      })
  }

  render() {
    if(this.state.whoami !== null) {
      const jwt = window.localStorage.getItem('jwtPDC');
      let element = <PiloteCalendar whoami={this.state.whoami}/>
      let header = <PiloteHeader whoami={this.state.whoami}/>
      return (
        <div className="app">
          <div className="jumbotron">
            <img src="/logo.png" />
            <div className="container" style={({display: 'inline-grid', textAlign: 'center'})}>
              <Row>
                Bonjour {this.state.whoami.pseudo}, bienvenue chez Permis de Construire. <a href="#" onClick={logout}>Se déconnecter</a> <a href={`${window.localStorage.getItem('PDC_AGENCE')}/v0/activities.pdf?token=${jwt}`} target="_blank"> Télécharger mon agenda </a>
              </Row>
            </div>
          </div>
          <div className="examples">
            <div className="example">
              {element}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div></div>
    )
  }
}

export default App;
