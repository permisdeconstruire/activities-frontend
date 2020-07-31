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
} from 'react-bootstrap';
import FilePilote from '../common/FilePilote'
import {authFetch} from '../common/utils'

const regexPilote = new RegExp('__PILOTE_ID_HERE__', 'gi');

const evaluationColor = {
  '-1': 'black',
  '0': '#7a7a7a',
  '1': '#e80000',
  '2': '#e89300',
  '3': '#00d107',
}

class AdminPilotes extends React.Component {

  defaultState() {
    return {
      options: {kibana:'#'},
      pilotes: [],
      allActivities: [],
      objectives: [],
      pilote: {_id: 'none', pseudo: ''},
    };
  }

  constructor(props, context) {
    super(props, context);
    this.select = this.select.bind(this);
    this.state = this.defaultState();
  }

  async select(event) {
    const pilote = this.state.pilotes.find(p => p._id === event.target.value);
    if(typeof(pilote) === 'undefined') {
      this.setState({pilote: {_id: 'none', pseudo:''}});
    } else {
      this.setState({pilote: {_id: pilote._id, pseudo: pilote.pseudo}});
    }

    const promotions = this.state.promotions.filter(p => typeof(p.pilotes.find(p2 => p2._id === pilote._id)) !== 'undefined' )
    const allActivities = []
    for(let i = 0; i < promotions.length; i += 1) {
      const promotion = promotions[i];
      allActivities.push({
        startDate: (new Date(promotion.startDate)).toLocaleDateString(),
        endDate: promotion.endDate.startsWith('20') ? (new Date(promotion.endDate)).toLocaleDateString() : 'en cours',
        name: promotion.name,
        parcours: promotion.parcours,
        sessions: []
      })

      const evaluations = await authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/activities/promotion/${promotion._id}/pilote/${pilote._id}?startDate=${promotion.startDate}`)

      const activities = await authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/activities/promotion/${promotion._id}`)
      for(let j = 0; j < activities.length; j += 1) {
        const activity = activities[j];
        const objectives = [];
        for(let k = 0; k < activity.objectives.length; k += 1) {
          const objective = activity.objectives[k];
          const evaluation = evaluations.find(e => e.objective === objective);
          if(typeof(evaluation) !== 'undefined') {
            objectives.push({
              evaluation: evaluation.evaluation,
              objective,
            })
          } else {
            objectives.push({
              evaluation: -1,
              objective,
            })
          }
        }

        allActivities[allActivities.length - 1].sessions.push({
          theme: activity.theme,
          title: activity.title,
          objectives,
        })
      }
    }

    this.setState({allActivities});
  }

  update() {
    let pilotes;
    let options;
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/pilotes`)
      .then(res => {
        pilotes = res;
        return authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/options`)
      })
      .then(res => {
        options = res
        return authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/promotions`)
      })
      .then(res => {
        this.setState({pilotes, options, promotions: res})
      })
  }

  componentDidMount() {
    this.update();
  }

  render() {
    return (
      <>
      <Row>
        <Col sm={2}>
          <FormControl onChange={this.select} value={this.state.pilote._id} componentClass="select">
            <option key="none" value="none">----</option>
            {this.state.pilotes.sort((a,b) => a.pseudo<b.pseudo ? -1 : 1).map((datum) => <option key={datum._id} value={datum._id}>{datum.pseudo}</option>)}
          </FormControl>
        </Col>
        <Col sm={8} style={({margin:'auto'})}>
          <a href={this.state.options.kibana.replace(regexPilote, this.state.pilote._id)} target="_blank">{this.state.pilote.pseudo}</a>
        </Col>
      </Row>
      {this.state.pilote.pseudo &&
        <Row>
          <Col sm={8} style={({margin:'auto'})}>
            <a href={`${process.env.REACT_APP_BACKEND}/v0/admin/pilotes/id/${this.state.pilote._id}/activities.pdf?token=${window.localStorage.getItem('jwtPDC')}`} target="_blank">Télécharger son agenda</a>
          </Col>
        </Row>
      }
      {
        this.state.allActivities.map((a,i) =>
          <Row key={`a_${i}`}>
            <Col sm={8} style={({margin: 'auto', 'marginTop': '10px'})}>
            <h3>Promotion {a.name} ({a.startDate} {a.endDate}) - {a.parcours}</h3>
            {
              a.sessions.map((s, j) =>
                  <div  key={`s_${j}`} >
                  <h4>{s.theme} {s.title}</h4>
                  <ul>
                    {
                      s.objectives.map((o, k) =>
                        <li key={`o_${k}`} style={({color: evaluationColor[o.evaluation]})}>{o.objective}</li>
                      )
                    }
                  </ul>
                  </div>
              )
            }
            </Col>
          </Row>
        )
      }
      </>
    )
  }
}

export default AdminPilotes

