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
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/forms`)
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
            {this.state.forms.filter(form => form.type === 'pilote').map((form, id) =>
              <MenuItem key={id} eventKey={2+(id/10)} href={`/#form_${form.title}`}>{form.title}</MenuItem>
            )}
          </NavDropdown>
          <NavItem eventKey={4} href="/#cooperators">Gérer les coopérateurs</NavItem>
          <NavItem eventKey={5} href="/#event">Générer un événement</NavItem>
          <NavItem eventKey={6} href="/#forms">Éditer les formulaires</NavItem>
          <NavItem eventKey={7} href="/#pilotes">Voir les pilotes</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default AdminHeader
