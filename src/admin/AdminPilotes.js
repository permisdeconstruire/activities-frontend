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

class AdminPilotes extends React.Component {

  defaultState() {
    return {
      options: {kibana:'#'},
      pilotes: [],
      pilote: {_id: 'none', pseudo: ''},
    };
  }

  constructor(props, context) {
    super(props, context);
    this.select = this.select.bind(this);
    this.state = this.defaultState();
  }

  select(event) {
    const pilote = this.state.pilotes.find(p => p._id === event.target.value);
    if(typeof(pilote) === 'undefined') {
      this.setState({pilote: {_id: 'none', pseudo:''}});
    } else {
      this.setState({pilote: {_id: pilote._id, pseudo: pilote.pseudo}});
    }
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/pilotes/id/${pilote._id}`)
      .then(res => {
        this.setState({data: res})
      })
  }

  update() {
    let pilotes;
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/pilotes`)
      .then(res => {
        pilotes = res;
        return authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/options`)
      })
      .then(res => {
        this.setState({pilotes, options: res})
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
      {typeof(this.state.data) !== 'undefined' &&
        <Row>
          <FilePilote pilote={this.state.pilote} data={this.state.data} />
        </Row>
      }
      </>
    )
  }
}

export default AdminPilotes

