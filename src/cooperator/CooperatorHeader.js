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

class CooperatorHeader extends React.Component {
  render(){
    return (
      <div className="container">
        <Row>
          Bonjour {this.props.whoami.email}, bienvenue chez Permis de Construire. <a href="/" onClick={logout}>Se déconnecter</a>
        </Row>
        <Row>
          <Col sm={6}><a href="/">Agenda</a></Col>
          <Col sm={6}><a href="/#event">Générer un événement</a></Col>
        </Row>
      </div>
    );
  }
}

export default CooperatorHeader
