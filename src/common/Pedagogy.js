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
import {authFetch, listPedagogy} from './utils'

const pillars = [
  'Bien vivre',
  'Bien-être psychologique',
  'Bien-être corporel',
  'Bien faire',
]

const levels = {
  1: '1) Découvrir',
  2: '2) Comprendre',
  3: '3) Choisir',
  4: '4) Réaliser',
}

const evaluations = [
  {name: 'Non aquis', value: 0},
  {name: 'En cours d\'aquisition', value: 1},
  {name: 'Aquis', value: 2},
]


class Pedagogy extends React.Component {

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
    const newPedagogy = this.props.pedagogy;
    newPedagogy[field] = event.target.value;
    if(field === 'objective') {
      const obj = this.state.allPedagogy.find(p => p.category === this.props.pedagogy.category && p.subCategory === this.props.pedagogy.subCategory && p.objective === this.props.pedagogy.objective)
      if(typeof(obj) !== 'undefined') {
        newPedagogy.indicator = obj.indicator;
        newPedagogy.level = obj.level;
        if(obj.pillars.length === 1){
          newPedagogy.pillar = obj.pillars[0];
        }
      }
    }
    this.props.onChange(newPedagogy);
  }

  componentDidMount() {
    listPedagogy()
      .then(res => {
        this.setState({allPedagogy: res});
      })
  }

  genPillarOptions(objective) {
    if(typeof(objective) !== 'undefined' && typeof(objective.pillars) !== 'undefined'){
      return (
      <>
        {objective.pillars.map(pillar => <option key={pillar} value={pillar}>{pillar}</option>)}
      </>
      )
    }
  }

  render() {
    return (
      <>
        <FormGroup controlId="formHorizontalPedagogyCategory">
          <Col sm={6}>
            <FormControl onChange={this.handleChangePedagogy.bind(this, 'category')} value={this.props.pedagogy.category} componentClass="select">
              <option key="none" value="none">-- Domaine --</option>
              {_.uniqBy(this.state.allPedagogy, 'category').map((p, j) => <option key={`category-${j}`} value={p.category}>{p.category}</option>)}
            </FormControl>
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChangePedagogy.bind(this, 'subCategory')} value={this.props.pedagogy.subCategory} componentClass="select">
              <option key="none" value="none">-- Sous-domaine --</option>
              {_.uniqBy(this.state.allPedagogy.filter(p => p.category === this.props.pedagogy.category), 'subCategory').map((p, j) => <option key={`subCategory-${j}`} value={p.subCategory}>{p.subCategory}</option>)}
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalPedagogyObjective">
          <Col sm={12}>
            <FormControl onChange={this.handleChangePedagogy.bind(this, 'objective')} value={this.props.pedagogy.objective} componentClass="select">
              <option key="none" value="none">-- Objectif --</option>
              {_.uniqBy(this.state.allPedagogy.filter(p => p.category === this.props.pedagogy.category && p.subCategory === this.props.pedagogy.subCategory), 'objective').map((p, j) => <option key={`objective-${j}`} value={p.objective}>{p.objective}</option>)}
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalPedagogyLevel">
          <Col componentClass={ControlLabel} sm={3}>
            Niveau {this.props.pedagogy.level}
          </Col>
          <Col sm={9}>
            {this.props.pedagogy.indicator}
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalPedagogyPillar">
          <Col componentClass={ControlLabel} sm={4}>
            Lier l'objectif
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChangePedagogy.bind(this, 'pillar')} value={this.props.pedagogy.pillar} componentClass="select">
              <option key="none" value="none">-- Pillier --</option>
              {this.genPillarOptions(this.state.allPedagogy.find(p => p.level === this.props.pedagogy.level && p.category === this.props.pedagogy.category && p.subCategory === this.props.pedagogy.subCategory && p.objective === this.props.pedagogy.objective))}
            </FormControl>
          </Col>
        </FormGroup>
      </>
    )
  }
}

export default Pedagogy
