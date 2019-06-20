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
} from 'react-bootstrap';

import DatePicker from 'react-datepicker'
import { registerLocale }  from 'react-datepicker'
import fr from 'date-fns/locale/fr';
import {authFetch, colorPillar} from '../common/utils'
registerLocale('fr', fr);

const dateFormat = 'dd/MM/YYYY HH:mm'
const evaluations = [
  {name: 'Non aquis', value: 0},
  {name: 'En cours d\'aquisition', value: 1},
  {name: 'Aquis', value: 2},
]

class CooperatorModal extends React.Component {

  defaultState() {
    return {
      step: 0,
      pedagogy: [],
      pilote: {_id: 'none', pseudo: '', pedagogy:[]},
      comments: [],
      evaluations: [],
    }
  }

  constructor(props, context) {
    super(props, context);
    this.handleChangePilote = this.handleChangePilote.bind(this);
    this.handleChangeEvaluation = this.handleChangeEvaluation.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitAbsent = this.handleSubmitAbsent.bind(this);

    this.state = this.defaultState();
  }

  handleSubmitAbsent(){
    const data = {
      pilote: {_id: this.state.pilote._id, pseudo: this.state.pilote.pseudo},
      missed: true,
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
        newState.pedagogy = JSON.parse(JSON.stringify(event.pedagogy));
        newState.pedagogy.forEach(a => {
          newState.comments.push('')
          newState.evaluations.push(-1)
        })
        this.setState(newState);
      })
  }

  handleSubmit(special) {
    const eventPromises = []
    for(let i = 0; i < this.state.pedagogy.length; i += 1){
      const data = {
        pilote: {_id: this.state.pilote._id, pseudo: this.state.pilote.pseudo},
        comment: this.state.comments[i],
        data: {
          ...this.state.pedagogy[i],
          evaluation: this.state.evaluations[i],
        }
      }

      eventPromises.push(authFetch(`${process.env.REACT_APP_BACKEND}/v0/cooperator/activities/id/${this.props.currentEventId}?special=${special}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      }))
    }

    Promise.all(eventPromises)
      .then(res => {
        const newState = this.defaultState();
        const event = this.props.events.find(event => event.id === this.props.currentEventId)
        newState.pedagogy = JSON.parse(JSON.stringify(event.pedagogy));
        newState.pedagogy.forEach(a => {
          newState.comments.push('')
          newState.evaluations.push(-1)
        })
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
      this.setState({pilote: selectedPilote})
    }

  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.currentEventId !== this.props.currentEventId) {
      const event = this.props.events.find(event => event.id === this.props.currentEventId)
      if(typeof(event) !== 'undefined') {
        const newState = this.defaultState();
        newState.pedagogy = JSON.parse(JSON.stringify(event.pedagogy));
        newState.pedagogy.forEach(a => {
          newState.comments.push('')
          newState.evaluations.push(-1)
        })
        this.setState(newState);
      }
    }
  }

  render() {
    const event = this.props.events.find(event => event._id === this.props.currentEventId)
    if(typeof(event) === 'undefined') {
      return (<></>);
    }
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton >
          <Modal.Title><b>{event.theme}</b> - {event.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Panel>
            <Panel.Heading>
              Évaluation du pilote

                { (typeof(event.participants) !== 'undefined' && event.participants.length > 0)
                  ?
                    <FormControl onChange={this.handleChangePilote} value={this.state.pilote._id} componentClass="select">
                      <option key="none" value="none">------</option>
                      {event.participants.sort((a,b) => a.pseudo<b.pseudo ? -1 : 1).map((p) => <option key={p._id} value={p._id}>{p.pseudo}</option>)}
                    </FormControl>
                  :
                    <> - Aucun inscrit</>
                }

            </Panel.Heading>
            <Panel.Body>
              <Form horizontal>
                {
                  this.state.pedagogy.sort((a,b) => a.category+a.subCategory+a.objective<b.category+b.subCategory+b.objective ? -1 : 1).map((pedagogy, index) => (
                    <div key={`peda_${index}`}>
                    <Row title={pedagogy.pillar} key={`peda_${index}`}>
                      <Col sm={12} style={({fontWeight:'bold', lineHeight: '20px'})} className={colorPillar(pedagogy.pillar)}>
                        {
                          this.state.pilote.pedagogy.indexOf(pedagogy.objective) !== -1 ?
                            <><i className="fa fa-star starChecked"></i>{pedagogy.category}</>
                          :
                            <>{pedagogy.category}</>
                        }
                      </Col>
                      <Col sm={12} style={({lineHeight: '20px', marginLeft:'30px', marginBottom: '20px'})} className={colorPillar(pedagogy.pillar)}>
                        {pedagogy.subCategory}
                      </Col>
                      <Col sm={2}><b>Objectif</b></Col>
                      <Col sm={10} style={({textAlign:'justify', marginBottom: '10px'})}>
                         {`${pedagogy.objective}`}
                      </Col>
                      <Col sm={2}><b>Critère</b></Col>
                      <Col sm={10} style={({textAlign:'justify', marginBottom: '20px'})}>
                        {`${pedagogy.indicator}`}
                      </Col>
                      <Col sm={8}>
                        <FormControl onChange={this.handleChangeComment.bind(this, index)} value={this.state.comments[index]} type="text" placeholder="Commentaires" />
                      </Col>
                      <Col sm={4}>
                        <FormControl onChange={this.handleChangeEvaluation.bind(this, index)} value={this.state.evaluations[index]} componentClass="select">
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
          </Panel>
        </Modal.Body>
        <Modal.Footer>
        { this.state.pilote._id !== 'none' &&
          <>
            <Button onClick={this.handleSubmitAbsent} bsStyle="danger">{this.state.pilote.pseudo} était absent</Button>
            <Button onClick={this.handleSubmit.bind(this, 'late')} bsStyle="primary">Évaluer mais en retard</Button>
            <Button onClick={this.handleSubmit} bsStyle="success">Évaluer</Button>
          </>
        }
        </Modal.Footer>
      </Modal>
    )
  }
}

export default CooperatorModal
