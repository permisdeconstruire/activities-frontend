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

class PiloteHeader extends React.Component {
  render(){
    return (
      <div className="container">
        <Row>
          Bonjour {this.props.whoami.user.email}, bienvenue chez Permis de Construire.
        </Row>
      </div>
    );
  }
}

export default PiloteHeader
