import _ from 'lodash'
import React from 'react'
import {
  Modal,
  Panel,
  Row,
  Button,
  Form,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  Nav,
  NavItem,
} from 'react-bootstrap';

import DatePicker from 'react-datepicker'
import { registerLocale }  from 'react-datepicker'
import fr from 'date-fns/locale/fr';
import {authFetch, alert} from '../common/utils'
registerLocale('fr', fr);

const dateFormat = 'dd/MM/YYYY HH:mm'
const evaluations = [
  {name: 'Non évalué', value: 0},
  {name: 'Non réalisé', value: 1},
  {name: 'Partiellement réalisé', value: 2},
  {name: 'Réalisé', value: 3},
]

class CooperatorModal extends React.Component {

  defaultState() {
    return {
      step: 0,
      pedagogy: [],
      objectives: [],
      pilote: {_id: 'none', pseudo: '', pedagogy:[]},
      comments: [],
      evaluations: [],
      globalPiloteComments: '',
      globalActivityComments: '',
    }
  }

  constructor(props, context) {
    super(props, context);
    this.handleChangePilote = this.handleChangePilote.bind(this);
    this.handleChangeEvaluation = this.handleChangeEvaluation.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitDivers = this.handleSubmitDivers.bind(this);
    this.handleSubmitComments = this.handleSubmitComments.bind(this);
    this.handleSubmitSpecial = this.handleSubmitSpecial.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeGlobalPiloteComments = this.handleChangeGlobalPiloteComments.bind(this);
    this.handleChangeGlobalActivityComments = this.handleChangeGlobalActivityComments.bind(this);
    this.getEvent = this.getEvent.bind(this);

    this.state = this.defaultState();
  }

  getEvent(piloteId) {
    return authFetch(`${process.env.REACT_APP_BACKEND}/v0/cooperator/activities/id/${this.props.currentEventId}/pilote/${piloteId}`)
  }

  handleSubmitSpecial(activityAction){
    const data = {
      pilote: {_id: this.state.pilote._id, pseudo: this.state.pilote.pseudo},
      activityAction,
    }
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/cooperator/activities/id/${this.props.currentEventId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        const newState = this.defaultState();
        const event = this.props.events.find(event => event.id === this.props.currentEventId)

        if(typeof(event.pedagogy) !== 'undefined') {
          newState.pedagogy = JSON.parse(JSON.stringify(event.pedagogy));
          newState.pedagogy.forEach(a => {
            newState.comments.push('')
            newState.evaluations.push(-1)
          })
        }
        if(typeof(event.objectives) !== 'undefined') {
          newState.objectives = JSON.parse(JSON.stringify(event.objectives));
          newState.objectives.forEach(a => {
            newState.comments.push('')
            newState.evaluations.push(-1)
          })
        }
        this.setState(newState);
      })
  }

  handleChangeGlobalPiloteComments({target}) {
    this.setState({globalPiloteComments: target.value});
  }

  handleChangeGlobalActivityComments({target}) {
    this.setState({globalActivityComments: target.value});
  }

  handleSubmitDivers(e) {
    const data = {
      pilote: {_id: this.state.pilote._id, pseudo: this.state.pilote.pseudo},
      comment: this.state.globalPiloteComments,
      data: {
        objective: 'Commentaire global',
        evaluation: -1,
      }
    }

    authFetch(`${process.env.REACT_APP_BACKEND}/v0/cooperator/activities/id/${this.props.currentEventId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => {
      alert('Commentaires envoyés.');
    })
  }

  handleSubmitComments(e) {
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/cooperator/activities/id/${this.props.currentEventId}/comment`, {
      method: 'PUT',
      body: JSON.stringify({comments: this.state.globalActivityComments}),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => {
      alert('Commentaires envoyés.');
    })
  }

  handleSubmit(activityAction) {
    const eventPromises = []
    this.handleSubmitSpecial(activityAction);
    for(let i = 0; i < this.state.pedagogy.length; i += 1){
      const data = {
        pilote: {_id: this.state.pilote._id, pseudo: this.state.pilote.pseudo},
        comment: this.state.comments[i],
        data: {
          ...this.state.pedagogy[i],
          evaluation: this.state.evaluations[i],
        }
      }

      eventPromises.push(authFetch(`${process.env.REACT_APP_BACKEND}/v0/cooperator/activities/id/${this.props.currentEventId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      }))
    }

    const event = this.props.events.find(event => event.id === this.props.currentEventId)
    for(let i = 0; i < this.state.objectives.length; i += 1){
      const data = {
        pilote: {_id: this.state.pilote._id, pseudo: this.state.pilote.pseudo},
        comment: this.state.comments[i],
        data: {
          parcours: event.promotion.parcours,
          promotion: event.promotion.name,
          objective: this.state.objectives[i],
          evaluation: this.state.evaluations[i],
        }
      }

      eventPromises.push(authFetch(`${process.env.REACT_APP_BACKEND}/v0/cooperator/activities/id/${this.props.currentEventId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      }))
    }

    Promise.all(eventPromises)
      .then(res => {
        alert('Évaluation envoyée.');
        const newState = this.defaultState();
        const event = this.props.events.find(event => event.id === this.props.currentEventId)
        if(typeof(event.pedagogy) !== 'undefined') {
          newState.pedagogy = JSON.parse(JSON.stringify(event.pedagogy));
          newState.pedagogy.forEach(a => {
            newState.comments.push('')
            newState.evaluations.push(-1)
          })
        }
        if(typeof(event.objectives) !== 'undefined') {
          newState.objectives = JSON.parse(JSON.stringify(event.objectives));
          newState.objectives.forEach(a => {
            newState.comments.push('')
            newState.evaluations.push(-1)
          })
        }
        this.setState(newState);
      })
  }

  handleChangeEvaluation(index, {target}) {
    const newEvaluations = this.state.evaluations;
    newEvaluations[index] = parseInt(target.value, 10);
    this.setState({evaluations: newEvaluations});
  }

  handleChangeComment(index, {target}) {
    const newComments = this.state.comments;
    newComments[index] = target.value;
    this.setState({comments: newComments});
  }

  handleChangePilote({target}) {
    const event = this.props.events.find(event => event._id === this.props.currentEventId)
    const selectedPilote = event.participants.find(pilote => pilote._id === target.value);
    if(typeof(selectedPilote) === 'undefined') {
      this.setState({pilote: {_id: 'none', pseudo: '', pedagogy: []}})
    } else {
      if(event.isCooperator) {
        this.getEvent(selectedPilote._id).then((events) => {
          const comments = events.evaluations.map(e => e.comment)
          const evaluations = events.evaluations.map(e => e.evaluation)

          this.setState({pilote: selectedPilote, comments, evaluations, globalPiloteComments: events.globalPiloteComments});
        })
      }
    }

  }

  handleSelect(e) {
    this.setState({step: e})
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.currentEventId !== this.props.currentEventId) {
      const event = this.props.events.find(event => event.id === this.props.currentEventId)
      if(typeof(event) !== 'undefined') {
        const newState = this.defaultState();
        if(typeof(event.cooperatorComments) !== 'undefined') {
          newState.globalActivityComments = event.cooperatorComments;
        }
        if(typeof(event.pedagogy) !== 'undefined') {
          newState.pedagogy = JSON.parse(JSON.stringify(event.pedagogy));
          newState.pedagogy.forEach(a => {
            newState.comments.push('')
            newState.evaluations.push(-1)
          })
        }
        if(typeof(event.objectives) !== 'undefined') {
          newState.objectives = JSON.parse(JSON.stringify(event.objectives));
          newState.objectives.forEach(a => {
            newState.comments.push('')
            newState.evaluations.push(-1)
          })
        }
        this.setState(newState);
      }
    }
  }

  render() {
    const event = this.props.events.find(event => event._id === this.props.currentEventId)
    if(typeof(event) === 'undefined') {
      return (<></>);
    }
    let panel;
    if(this.state.step === 0) {
      panel = (<Panel>
            <Panel.Heading>
                { (typeof(event.participants) !== 'undefined' && event.participants.length > 0)
                  ?
                    <FormControl onChange={this.handleChangePilote} value={this.state.pilote._id} componentClass="select">
                      <option key="none" value="none">------</option>
                      {event.participants.sort((a,b) => a.pseudo<b.pseudo ? -1 : 1).map((p) => <option key={p._id} value={p._id}>{p.pseudo}</option>)}
                    </FormControl>
                  :
                    <>Aucun inscrit</>
                }

            </Panel.Heading>
            <Panel.Body>
              <Form horizontal>
                {
                  this.state.pedagogy.sort((a,b) => a.category+a.subCategory+a.objective<b.category+b.subCategory+b.objective ? -1 : 1).map((pedagogy, index) => (
                    <div key={`peda_${index}`}>
                    <Row key={`peda_${index}`}>
                      <Col sm={12} style={({fontWeight:'bold', lineHeight: '20px'})}>
                        {
                          this.state.pilote.pedagogy.indexOf(pedagogy.objective) !== -1 ?
                            <><i className="fa fa-star starChecked"></i>{pedagogy.category}</>
                          :
                            <>{pedagogy.category}</>
                        }
                      </Col>
                      <Col sm={12} style={({lineHeight: '20px', marginLeft:'30px', marginBottom: '20px'})}>
                        {pedagogy.subCategory}
                      </Col>
                      <Col sm={2}><b>Objectif</b></Col>
                      <Col sm={10} style={({textAlign:'justify', marginBottom: '10px'})}>
                         {`${pedagogy.objective}`}
                      </Col>
                      <Col sm={2}><b>Critère</b></Col>
                      <Col sm={10} style={({textAlign:'justify', marginBottom: '20px'})}>
                        {`${pedagogy.indicator !== '' ? pedagogy.indicator : 'Non défini'}`}
                      </Col>
                      <Col sm={8}>
                        <FormControl onChange={this.handleChangeComment.bind(this, index)} value={this.state.comments[index]} type="text" readOnly={!event.isCooperator} placeholder="Commentaires" />
                      </Col>
                      <Col sm={4}>
                        <FormControl readOnly={!event.isCooperator} onChange={this.handleChangeEvaluation.bind(this, index)} value={this.state.evaluations[index]} componentClass="select">
                          <option key="none" value="-1">-- Evaluation --</option>
                          {evaluations.map(evaluation => <option key={evaluation.name} value={evaluation.value}>{evaluation.name}</option>)}
                        </FormControl>
                      </Col>
                    </Row>
                    <hr />
                    </div>
                  ))
                }
                {
                  this.state.objectives.sort((a,b) => a<b ? -1 : 1).map((objective, index) => (
                    <div key={`obj_${index}`}>
                    <Row key={`obj_${index}`}>
                      <Col sm={12} style={({fontWeight:'bold', lineHeight: '20px'})}>
                        {objective}
                      </Col>
                      <Col sm={8}>
                        <FormControl onChange={this.handleChangeComment.bind(this, index)} value={this.state.comments[index]} type="text" readOnly={!event.isCooperator} placeholder="Commentaires" />
                      </Col>
                      <Col sm={4}>
                        <FormControl readOnly={!event.isCooperator} onChange={this.handleChangeEvaluation.bind(this, index)} value={this.state.evaluations[index]} componentClass="select">
                          <option key="none" value="-1">-- Evaluation --</option>
                          {evaluations.map(evaluation => <option key={evaluation.name} value={evaluation.value}>{evaluation.name}</option>)}
                        </FormControl>
                      </Col>
                    </Row>
                    <hr />
                    </div>
                  ))
                }
              </Form>
            </Panel.Body>
          </Panel>)
    } else if(this.state.step === 1) {
      panel = (<Panel>
            <Panel.Heading>
                { (typeof(event.participants) !== 'undefined' && event.participants.length > 0)
                  ?
                    <FormControl onChange={this.handleChangePilote} value={this.state.pilote._id} componentClass="select">
                      <option key="none" value="none">------</option>
                      {event.participants.sort((a,b) => a.pseudo<b.pseudo ? -1 : 1).map((p) => <option key={p._id} value={p._id}>{p.pseudo}</option>)}
                    </FormControl>
                  :
                    <>Aucun inscrit</>
                }

            </Panel.Heading>
            <Panel.Body>
              <FormGroup controlId="formHorizontalAnnotation">
                <FormControl readOnly={!event.isCooperator} style={({height:'200px'})} onChange={this.handleChangeGlobalPiloteComments} componentClass="textarea" value={this.state.globalPiloteComments}  type="text" placeholder="Détails supplémentaires sur le pilote" />
              </FormGroup>
            </Panel.Body>
          </Panel>)
    } else if(this.state.step === 2) {
      panel = (<Panel>
            <Panel.Body>
              <FormGroup controlId="formHorizontalAnnotation">
                <FormControl readOnly={!event.isCooperator} style={({height:'200px'})} onChange={this.handleChangeGlobalActivityComments} componentClass="textarea" value={this.state.globalActivityComments}  type="text" placeholder="Détails supplémentaires sur l'activité" />
              </FormGroup>
            </Panel.Body>
          </Panel>)
    }
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton >
          <Modal.Title><b>{event.theme}</b> - {event.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Nav bsStyle="pills" activeKey={this.state.step} onSelect={this.handleSelect}>
            <NavItem eventKey={0}>
              Évaluation du pilote
            </NavItem>
            <NavItem eventKey={1}>
              Commentaires sur le pilote
            </NavItem>
            <NavItem eventKey={2}>
              Commentaires sur l'activité
            </NavItem>
          </Nav>
          {panel}
        </Modal.Body>
        <Modal.Footer>
        { event.isCooperator && this.state.pilote._id !== 'none' && this.state.step === 0 &&
          <>
            <Button onClick={this.handleSubmitSpecial.bind(this, 'missed')} bsStyle="danger">{this.state.pilote.pseudo} était absent</Button>
            <Button onClick={this.handleSubmit.bind(this, 'late')} bsStyle="primary">Évaluer mais en retard</Button>
            <Button onClick={this.handleSubmit.bind(this, 'done')} bsStyle="success">Évaluer</Button>
          </>
        }
        { event.isCooperator && this.state.pilote._id !== 'none' && this.state.step === 1 &&
          <>
            <Button onClick={this.handleSubmitDivers} bsStyle="success">Envoyer</Button>
          </>
        }
        { event.isCooperator && this.state.step === 2 &&
          <>
            <Button onClick={this.handleSubmitComments} bsStyle="success">Envoyer</Button>
          </>
        }
        </Modal.Footer>
      </Modal>
    )
  }
}

export default CooperatorModal
