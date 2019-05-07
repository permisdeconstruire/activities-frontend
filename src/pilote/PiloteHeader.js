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

class PiloteHeader extends React.Component {
  render(){
    return (
      <div className="container">
        <Row>
          Bonjour {this.props.whoami.pseudo}, bienvenue chez Permis de Construire.<a href="/" onClick={logout}>Se déconnecter</a>
        </Row>
      </div>
    );
  }
}

export default PiloteHeader
