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
import PublicCalendar from './public/PublicCalendar'
import AdminCalendar from './admin/AdminCalendar'
import AdminHeader from './admin/AdminHeader'
import CooperatorCalendar from './cooperator/CooperatorCalendar'
import CooperatorHeader from './cooperator/CooperatorHeader'
import AdminParcours from './admin/AdminParcours'
import AdminPromotion from './admin/AdminPromotion'
import AdminPilotes from './admin/AdminPilotes'
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
    authFetch(`${window.localStorage.getItem('PDC_AGENCE')}/v0/whoami`)
      .then(whoami => {
        this.setState({whoami})
      })
  }

  render() {
    if(this.state.whoami !== null) {
      let name = this.state.whoami.email
      if(this.state.whoami.pseudo) {
        name = this.state.whoami.pseudo;
      }

      let element;
      let header;
      if(this.state.route === '#admin') {
        element = <AdminCalendar />
        header = <AdminHeader whoami={this.state.whoami} />;
      } else if(this.state.route === '#cooperator') {
        element = <CooperatorCalendar whoami={this.state.whoami}/>
        header = <CooperatorHeader whoami={this.state.whoami} />
      } else if(this.state.route === '#public') {
        element = <PublicCalendar />
        // header = <CooperatorHeader whoami={this.state.whoami} />
      } else if(this.state.route === '#forms') {
        element = <FormsBuilder/>
        header = <AdminHeader whoami={this.state.whoami} />;
      } else if(this.state.route === '#parcours') {
        element = <AdminParcours/>
        header = <AdminHeader whoami={this.state.whoami} />;
      } else if(this.state.route === '#promotion') {
        element = <AdminPromotion/>
        header = <AdminHeader whoami={this.state.whoami} />;
      } else if(this.state.route.startsWith('#form')) {
        const formTitle = this.state.route.replace('#form_', '');
        element = <FormViewer formType="pilote" formTitle={formTitle} api="/admin/pilotes" keyname="pseudo" special="?filter=NOT%20ph_statut%3A%28%22Termin%C3%A9%20Jamais%20vu%22%2C%22Termin%C3%A9%20Accueilli%22%2C%22Pas%20d%27effet%20imm%C3%A9diat%22%2C%22Projet%20de%20vie%20valid%C3%A9%22%2C%20%22Projet%20de%20vie%20travaill%C3%A9%22%29"/>
        header = <AdminHeader whoami={this.state.whoami} />;
      } else if(this.state.route === '#pilotes') {
        element = <AdminPilotes />
        header = <AdminHeader whoami={this.state.whoami} />;
      } else if(this.state.route === '#cooperators') {
        element = <FormViewer formType="cooperator" formTitle="Coopérateur" api="/admin/cooperators" keyname="titre" special=""/>
        header = <AdminHeader whoami={this.state.whoami} />;
      } else if(this.state.route === '#event') {
        element = <AdminEvent type="admin"/>
        header = <AdminHeader whoami={this.state.whoami} />;
      } else if(this.state.route === '#cooperator-event') {
        element = <AdminEvent type="cooperator" />
        header = <CooperatorHeader whoami={this.state.whoami} />;
      } else {
        element = <PiloteCalendar whoami={this.state.whoami}/>
      }
      const jwt = window.localStorage.getItem('jwtPDC');
      return (
        <div className="app">
          {header && header}
          <div className="jumbotron">
            <img src="/logo.png" />
            <div className="container" style={({display: 'inline-grid', textAlign: 'center'})}>
              <Row>
                Bonjour {name}, bienvenue chez Permis de Construire. <a href="#" onClick={logout}>Se déconnecter</a> <a href={`${window.localStorage.getItem('PDC_AGENCE')}/v0/activities.pdf?token=${jwt}`} target="_blank"> Télécharger l'agenda </a>
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
