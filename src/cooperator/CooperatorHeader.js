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

class CooperatorHeader extends React.Component {
  render(){
    return (
      <Navbar>
        <Nav>
          <NavItem eventKey={1} href="#cooperator">Gérer l'agenda</NavItem>
          <NavItem eventKey={4} href="#cooperator-event">Générer un événement</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default CooperatorHeader
