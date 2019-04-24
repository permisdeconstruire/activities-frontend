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

class AdminHeader extends React.Component {
  render(){
    return (
      <div className="container">
        <Row>
          Bonjour {this.props.whoami.user.email}, bienvenue chez Permis de Construire.
        </Row>
        <Row>
          <Col sm={3}><a href="/#pilotes">Gérer les pilotes</a></Col>
          <Col sm={3}><a href="/#event">Générer un événement</a></Col>
          <Col sm={3}><a href="/#pedagogy">Gérer la pédagogie</a></Col>
          <Col sm={3}><a href="/#forms">Éditer les formulaires</a></Col>
        </Row>
      </div>
    );
  }
}

export default AdminHeader
