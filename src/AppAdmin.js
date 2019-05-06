import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker.css'
import './styles.css'
import './prism.css'
import {authFetch} from './common/utils'
import AdminCalendar from './admin/AdminCalendar'
import AdminPedagogy from './admin/AdminPedagogy'
import AdminEvent from './admin/AdminEvent'
import AdminHeader from './admin/AdminHeader'
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
        this.setState({whoami})
      })
  }

  render() {
    if(this.state.whoami !== null) {
      let element;
      let header = <AdminHeader whoami={this.state.whoami} />;
      if(this.state.route === '#forms') {
        element = <FormsBuilder/>
      } else if(this.state.route.startsWith('#form')) {
        const formTitle = this.state.route.replace('#form_', '');
        element = <FormViewer formType="pilote" formTitle={formTitle} api="/admin/pilotes" keyname="email"/>
        header = <AdminHeader whoami={this.state.whoami} />;
      } else if(this.state.route === '#cooperators') {
        element = <FormViewer formTitle="Coopérateur" api="/admin/cooperators" keyname="titre"/>
      } else if(this.state.route === '#pedagogy') {
        element = <AdminPedagogy />
      } else if(this.state.route === '#event') {
        element = <AdminEvent />
      } else {
        element = <AdminCalendar />
      }
      return (
        <div className="app">
          {header}
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
