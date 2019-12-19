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
      const obj = this.state.allPedagogy.find(p => p.objective === this.props.pedagogy.objective)
      if(typeof(obj) !== 'undefined') {
        newPedagogy.indicator = obj.indicator;
        newPedagogy.category = obj.category;
        newPedagogy.subCategory = obj.subCategory;
        newPedagogy.type = obj.type;
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

  render() {
    let allPedagogy = this.state.allPedagogy;
    if(typeof(this.props.fixedPillar) !== 'undefined') {
      allPedagogy = allPedagogy.filter(p => p.pillar === this.props.fixedPillar)
    }

    if(allPedagogy.length === 0) {
      allPedagogy = this.state.allPedagogy.filter(p => typeof(this.props.fixedLevel) === 'undefined' || this.props.fixedLevel === 0 || p.level === this.props.fixedLevel)
    } else {
      if(typeof(this.props.fixedLevel) !== 'undefined' && this.props.fixedLevel !== 0) {
        allPedagogy = allPedagogy.filter(p => p.level === this.props.fixedLevel)
      }
    }
    return (
      <>
        <FormGroup controlId="formHorizontalPedagogyCategory">
          <Col sm={6}>
            <FormControl onChange={this.handleChangePedagogy.bind(this, 'category')} value={this.props.pedagogy.category} componentClass="select">
              <option key="none" value="none">-- Domaine --</option>
              {_.uniqBy(allPedagogy, 'category').map((p, j) => <option key={`category-${j}`} value={p.category}>{p.category}</option>)}
            </FormControl>
          </Col>
          <Col sm={6}>
            <FormControl onChange={this.handleChangePedagogy.bind(this, 'subCategory')} value={this.props.pedagogy.subCategory} componentClass="select">
              <option key="none" value="none">-- Sous-domaine --</option>
              {_.uniqBy(allPedagogy.filter(p => this.props.pedagogy.category === 'none' || p.category === this.props.pedagogy.category), 'subCategory').map((p, j) => <option key={`subCategory-${j}`} value={p.subCategory}>{p.subCategory}</option>)}
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalPedagogyObjective">
          <Col sm={12}>
            <FormControl onChange={this.handleChangePedagogy.bind(this, 'objective')} value={this.props.pedagogy.objective} componentClass="select">
              <option key="none" value="none">-- Objectif --</option>
              {_.uniqBy(allPedagogy.filter(p => (this.props.pedagogy.category === 'none' || p.category === this.props.pedagogy.category) && (this.props.pedagogy.subCategory === 'none' || p.subCategory === this.props.pedagogy.subCategory)), 'objective').map((p, j) => <option key={`objective-${j}`} value={p.objective}>{p.objective}</option>)}
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalPedagogyObjective">
          <Col sm={12}>
            <b>{this.props.pedagogy.type}</b>
          </Col>
          <Col sm={12}>
            {this.props.pedagogy.indicator}
          </Col>
        </FormGroup>
      </>
    )
  }
}

export default Pedagogy
