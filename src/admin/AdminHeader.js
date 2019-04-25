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
} from 'react-bootstrap';

import {logout} from '../common/utils'

class AdminHeader extends React.Component {
  render(){
    return (
      <div className="container">
        <Row>
          Bonjour {this.props.whoami.email}, bienvenue chez Permis de Construire. <a href="/" onClick={logout}>Se déconnecter</a>
        </Row>
        <Row>
          <Col sm={3}><a href="/">Gérer l'agenda</a></Col>
          <Col sm={3}><a href="/#pilotes">Gérer les pilotes</a></Col>
          <Col sm={3}><a href="/#event">Générer un événement</a></Col>
          <Col sm={3}><a href="/#forms">Éditer les formulaires</a></Col>
        </Row>
      </div>
    );
  }
}

export default AdminHeader
