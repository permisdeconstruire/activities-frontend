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
import {authFetch, listPedagogy} from '../common/utils'

function getSuggestionValue(suggestion) {
  return suggestion
};

function renderSuggestion(suggestion) {
  return (
    <div>
      {suggestion}
    </div>//
  )
}

class AdminPedagogy extends React.Component {

  defaultState() {
    return {
      suggestions: {
        category: [],
        subCategory: [],
      },
      _id: '',
      category: '',
      subCategory: '',
      objective: '',
      evaluation: '',
      pedagogy: [],
    };
  }

  constructor(props, context) {
    super(props, context);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSuggestion = this.handleChangeSuggestion.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = this.defaultState();
  }

  updatePedagogy() {
    listPedagogy()
      .then(res => {
        const newState = this.defaultState();
        newState.pedagogy = res;
        this.setState(newState)
      })
  }

  componentDidMount() {
    this.updatePedagogy();
  }

  getSuggestions(field, value) {
    let suggestions;
    if(field === 'subCategory') {
      suggestions = _.uniqBy(this.state.pedagogy.filter(pedagogy => pedagogy.category === this.state.category), field).map(pedagogy => pedagogy[field])
    } else {
      suggestions = _.uniqBy(this.state.pedagogy, field).map(pedagogy => pedagogy[field])
    }

    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if(inputValue === '*') {
      return suggestions;
    }

    return inputLength === 0 ? [] : suggestions.filter(theme =>
      theme.toLowerCase().slice(0, inputLength) === inputValue
    );
  }

  onSuggestionsFetchRequested(field, { value }){
    const newState = {suggestions: this.state.suggestions}
    newState.suggestions[field] = this.getSuggestions(field, value)
    this.setState(newState);
  }

  onSuggestionsClearRequested(field){
    const newState = {suggestions: this.state.suggestions}
    newState.suggestions[field] = []
    this.setState(newState);
  }

  handleChange(field, event){
    const newState = {}
    if(field === '_id') {
      const pedagogy = this.state.pedagogy.find(pedagogy => pedagogy._id === event.target.value);
      newState.objective = pedagogy.objective;
      newState.evaluation = pedagogy.evaluation;
    }
    newState[field] = event.target.value
    this.setState(newState);
  }

  handleChangeSuggestion(field, event, { newValue }) {
    const newState = {}
    newState[field] = newValue
    this.setState(newState);
  }

  handleSubmit(event) {
    const id = this.state._id;
    const data = {
      category: this.state.category,
      subCategory: this.state.subCategory,
      objective: this.state.objective,
      evaluation: this.state.evaluation,
    }

    if(id !== '') {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/pedagogy/id/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.updatePedagogy()
      })
    } else {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/pedagogy`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.updatePedagogy()
      })
    }
  }

  render() {
    return (
      <div id="allPedagogy">
        <Row className="rowPedagogy">
          <Col>
            Domaine
          </Col>
          <Col>
            <Autosuggest
              suggestions={this.state.suggestions.category}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this, 'category')}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this, 'category')}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={({className: 'form-control', placeholder: 'Communiquer en français', value: this.state.category, onChange: this.handleChangeSuggestion.bind(this, 'category')})}
            />
          </Col>
        </Row>
        <Row className="rowPedagogy">
          <Col>
            Sous-domaine
          </Col>
          <Col>
            <Autosuggest
              suggestions={this.state.suggestions.subCategory}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this, 'subCategory')}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this, 'subCategory')}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={({className: 'form-control', placeholder: 'Lire', value: this.state.subCategory, onChange: this.handleChangeSuggestion.bind(this, 'subCategory')})}
            />
          </Col>
        </Row>
        <Row>
          <FormControl onChange={this.handleChange.bind(this, '_id')} value={this.state._id} componentClass="select">
            <option value="">-- Nouvel objectif --</option>
            {this.state.pedagogy.filter(pedagogy => pedagogy.category === this.state.category && pedagogy.subCategory === this.state.subCategory)
              .map(pedagogy => <option key={pedagogy._id} value={pedagogy._id}>{pedagogy.objective}</option>)}
          </FormControl>
        </Row>
        <hr/>
        <Row className="rowPedagogy">
          <Col>
            Objectif
          </Col>
          <Col>
            <FormControl value={this.state.objective} onChange={this.handleChange.bind(this, 'objective')} type="text" placeholder="Lire et comprendre un document usuel  (lettre, consignes, notices..)" />
          </Col>
        </Row>
        <Row className="rowPedagogy">
          <Col>
            Évaluation
          </Col>
          <Col>
            <FormControl value={this.state.evaluation} onChange={this.handleChange.bind(this, 'evaluation')} type="text" placeholder="Après lecture d'un document usuel, les informations communiquées sur celui-ci sont comprises" />
          </Col>
        </Row>
        <Row style={({textAlign: 'center'})}>
          <Button bsStyle="success" onClick={this.handleSubmit}>Valider</Button>
        </Row>

      </div>
    )
  }
}

export default AdminPedagogy
