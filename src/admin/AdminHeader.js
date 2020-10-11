import React from 'react'
import {
  Row,
  Modal,
  Panel,
  Button,
  Form,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  ButtonToolbar,
  Navbar,
  Nav,
  NavDropdown,
  NavItem,
  MenuItem,
} from 'react-bootstrap';
import {authFetch, logout} from '../common/utils'

class AdminHeader extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.getForms = this.getForms.bind(this)
    this.state = {
      forms: []
    }
  }

  getForms() {
    authFetch(`${window.localStorage.getItem('PDC_AGENCE')}/v0/admin/forms`)
    .then(res => {
      this.setState({forms: res})
    })
  }

  componentDidMount() {
    this.getForms()
  }

  render(){
    return (
      <Navbar>
        <Nav>
          <NavItem eventKey={1} href="#admin">Gérer l'agenda</NavItem>
          <NavDropdown eventKey={2} title="Gérer les pilotes" id="basic-nav-dropdown" onClick={this.getForms}>
            {this.state.forms.filter(form => form.type === 'pilote').sort((a,b) => a.title<b.title ? -1 : 1).map((form, id) =>
              <MenuItem key={id} eventKey={2+(id/10)} href={`/#form_${form.title}`}>{form.title}</MenuItem>
            )}
          </NavDropdown>
          <NavItem eventKey={4} href="/#cooperators">Gérer les coopérateurs</NavItem>
          <NavItem eventKey={5} href="/#event">Générer un événement</NavItem>
          <NavDropdown eventKey={6} title="Outils" id="basic-nav-dropdown">
            <NavItem eventKey={61} href="/#forms">Éditer les formulaires</NavItem>
            <NavItem eventKey={63} href="/#parcours">Éditer les parcours</NavItem>
            <NavItem eventKey={63} href="/#promotion">Éditer les promotions</NavItem>
          </NavDropdown>
          <NavDropdown eventKey={8} title="Tableaux de bord" id="basic-nav-dropdown">
            <MenuItem eventKey={81} href="/#pilotes">Pilote</MenuItem>
            <MenuItem eventKey={82} href="https://kibana.pdc.bug.builders/app/kibana#/dashboard/3a183350-223f-11ea-bd6c-c5bcc858dc7a" target="_blank">Réunion de synthèse</MenuItem>
            <MenuItem eventKey={83} href="https://kibana.pdc.bug.builders/app/kibana#/dashboard/f26059f0-998d-11e9-ba12-c3b25781aada" target="_blank">Tous les pilotes</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}
export default AdminHeader
