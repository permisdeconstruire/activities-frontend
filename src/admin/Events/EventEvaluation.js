import _ from 'lodash'
import React from 'react'
import Autosuggest from 'react-autosuggest';
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
} from 'react-bootstrap';
import {authFetch, listPedagogy} from '../../common/utils'

const pillars = [
  'Bien vivre',
  'Bien-être psychologique',
  'Bien-être corporel',
  'Bien faire',
]

const evaluations = [
  {name: 'Non aquis', value: 0},
  {name: 'En cours d\'aquisition', value: 1},
  {name: 'Aquis', value: 2},
]


class EventEvaluation extends React.Component {

  defaultState() {
    return {
      allPedagogy: []
    };
  }

  constructor(props, context) {
    super(props, context);
    this.handleChangePedagogy = this.handleChangePedagogy.bind(this);
    this.state = this.defaultState();
  }

  handleChangePedagogy(field, event) {
    const newPedagogy = this.props.data;
    newPedagogy[field] = event.target.value;
    this.props.onChange(newPedagogy);
  }

  componentDidMount() {
    listPedagogy()
      .then(res => {
        this.setState({allPedagogy: res});
      })
  }

  handleSubmit(event) {

  }

  render() {
    const pedagogy = this.props.data;
    let critere = '';
    const obj = this.state.allPedagogy.find(p => p.category === pedagogy.category && p.subCategory === pedagogy.subCategory && p.objective === pedagogy.objective)
    if(typeof(obj) !== 'undefined') {
      critere = obj.evaluation;
    }
    return (
      <>
        <FormGroup controlId="formHorizontalPedagogyCategory">
          <Col sm={6}>
            <FormControl onChange={this.handleChangePedagogy.bind(this, 'category')} value={pedagogy.category} componentClass="select">
              <option key="none" value="none">-- Domaine --</option>
              {_.uniqBy(this.state.allPedagogy, 'category').map((p, j) => <option key={`category-${j}`} value={p.category}>{p.category}</option>)}
            </FormControl>
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChangePedagogy.bind(this, 'subCategory')} value={pedagogy.subCategory} componentClass="select">
              <option key="none" value="none">-- Sous-domaine --</option>
              {_.uniqBy(this.state.allPedagogy.filter(p => p.category === pedagogy.category), 'subCategory').map((p, j) => <option key={`subCategory-${j}`} value={p.subCategory}>{p.subCategory}</option>)}
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalPedagogyObjective">
          <Col sm={12}>
            <FormControl onChange={this.handleChangePedagogy.bind(this, 'objective')} value={pedagogy.objective} componentClass="select">
              <option key="none" value="none">-- Objectif --</option>
              {_.uniqBy(this.state.allPedagogy.filter(p => p.category === pedagogy.category && p.subCategory === pedagogy.subCategory), 'objective').map((p, j) => <option key={`objective-${j}`} value={p.objective}>{p.objective}</option>)}
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup style={({textAlign:'center'})}>
          <Col sm={0}>
            Lier l'objectif
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalPedagogyPillar">
          <Col sm={6}>
            <FormControl onChange={this.handleChangePedagogy.bind(this, 'pillar')} value={pedagogy.pillar} componentClass="select">
              <option key="none" value="none">-- Pillier --</option>
              {pillars.map(pillar => <option key={pillar} value={pillar}>{pillar}</option>)}
            </FormControl>
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChangePedagogy.bind(this, 'level')} value={pedagogy.level} componentClass="select">
              <option key="none" value="none">-- Niveau --</option>
              <option key="level-1" value="1">1) Découvrir</option>
              <option key="level-2" value="2">2) Comprendre</option>
              <option key="level-3" value="3">3) Choisir</option>
              <option key="level-4" value="4">4) Réaliser</option>
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalPedagogyNote">
          <Col componentClass={ControlLabel} sm={4}>
            Évaluation
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChangePedagogy.bind(this, 'evaluation')} value={pedagogy.evaluation} componentClass="select">
              <option key="none" value="none">-- Evaluation --</option>
              {evaluations.map(evaluation => <option key={evaluation.name} value={evaluation.value}>{evaluation.name}</option>)}
            </FormControl>
          </Col>
        </FormGroup>
        <Col>{critere}</Col>
      </>

    )
  }
}

export default EventEvaluation
