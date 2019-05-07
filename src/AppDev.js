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
import AdminCalendar from './admin/AdminCalendar'
import AdminHeader from './admin/AdminHeader'
import CooperatorCalendar from './cooperator/CooperatorCalendar'
import CooperatorHeader from './cooperator/CooperatorHeader'
import AdminPedagogy from './admin/AdminPedagogy'
import AdminEvent from './admin/AdminEvent'
import FormsBuilder from './admin/FormsBuilder'
import FormViewer from './common/FormViewer'


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
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/whoami`)
      .then(whoami => {
        console.log(whoami);
        this.setState({whoami})
      })
  }

  render() {
    if(this.state.whoami !== null) {
      let element;
      let header;
      if(this.state.route === '#admin') {
        element = <AdminCalendar />
        header = <AdminHeader whoami={this.state.whoami} />;
      } else if(this.state.route === '#cooperator') {
        element = <CooperatorCalendar whoami={this.state.whoami}/>
        // header = <CooperatorHeader whoami={this.state.whoami} />
      } else if(this.state.route === '#forms') {
        element = <FormsBuilder/>
        header = <AdminHeader whoami={this.state.whoami} />;
      } else if(this.state.route.startsWith('#form')) {
        const formTitle = this.state.route.replace('#form_', '');
        element = <FormViewer formType="pilote" formTitle={formTitle} api="/admin/pilotes" keyname="pseudo"/>
        header = <AdminHeader whoami={this.state.whoami} />;
      } else if(this.state.route === '#cooperators') {
        element = <FormViewer formType="cooperator" formTitle="Coopérateur" api="/admin/cooperators" keyname="titre"/>
        header = <AdminHeader whoami={this.state.whoami} />;
      } else if(this.state.route === '#pedagogy') {
        element = <AdminPedagogy />
      } else if(this.state.route === '#event') {
        element = <AdminEvent />
        header = <AdminHeader whoami={this.state.whoami} />;
      } else {
        element = <PiloteCalendar whoami={this.state.whoami}/>
      }
      return (
        <div className="app">
          {header && header}
          <div className="jumbotron">
            <div className="container">
              <Row>
                Bonjour {this.state.whoami.email}, bienvenue chez Permis de Construire. <a href="/" onClick={logout}>Se déconnecter</a>
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
