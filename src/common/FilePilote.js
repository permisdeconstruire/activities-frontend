import _ from 'lodash'
import React from 'react'
import {
  Modal,
  Panel,
  Button,
  Form,
  FormGroup,
  Col,
  Row,
  ControlLabel,
  FormControl,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';

const evaluationName = ['Non évalué','Non réalisé','Partiellement réalisé','Réalisé'];

function genListGroupItem(objective, evaluations) {
  const evaluated = evaluations.filter(e => e.objective === objective.objective);
  if(evaluated.length === 0) {
    return (<ListGroupItem key={objective._id}>{objective.objective}</ListGroupItem>)
  }
  const score = evaluated.reduce((acc, e) => acc + e.evaluation, 0)/evaluated.length;
  const scoreString = evaluated.reduce((acc, e) => `${acc}, ${evaluationName[e.evaluation]}`, '');
  console.log(score)
  if(score === 0) {
    return (<ListGroupItem key={objective._id}>{objective.objective} ({evaluated.length} évaluation{evaluated.length>1?'s':''} : {scoreString.substring(2)})</ListGroupItem>)
  }

  if(score <= 1) {
    return (<ListGroupItem key={objective._id} bsStyle="danger">{objective.objective} ({evaluated.length} évaluation{evaluated.length>1?'s':''} : {scoreString.substring(2)})</ListGroupItem>)
  }

  if(score <= 2) {
    return (<ListGroupItem key={objective._id} bsStyle="warning">{objective.objective} ({evaluated.length} évaluation{evaluated.length>1?'s':''} : {scoreString.substring(2)})</ListGroupItem>)
  }


  return (<ListGroupItem key={objective._id} bsStyle="success">{objective.objective} ({evaluated.length} évaluation{evaluated.length>1?'s':''} : {scoreString.substring(2)})</ListGroupItem>)
}

class FilePilote extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    console.log(this.props.data);
    return (
      <Col sm={8} style={({margin: 'auto', 'marginTop': '10px'})}>
          <ListGroup>
            {this.props.data.objectives.map(o => genListGroupItem(o, this.props.data.evaluated))}
          </ListGroup>
      </Col>
    )
  }
}

export default FilePilote
