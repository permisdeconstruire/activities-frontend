import $ from 'jquery';
import React, { Component, createRef } from 'react';
import ReactDOM from 'react-dom';
import {authFetch} from './utils'
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
window.jQuery = $;
window.$ = $;
require('jquery-ui-sortable');
require('formBuilder/dist/form-render.min');


class FormViewer extends React.Component {

  defaultState() {
    return {
      form: false,
      title: '',
      list: [],
      selected: 'none'
    };
  }

  constructor(props, context) {
    super(props, context);

    // this.selectForm = this.selectForm.bind(this);
    // this.handleChangeTitle = this.handleChangeTitle.bind(this);
    // this.saveData = this.saveData.bind(this)
    // this.getForms = this.getForms.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.select = this.select.bind(this);
    this.delete = this.delete.bind(this);
    this.state = this.defaultState();
  }

  select(event) {
    const datum = this.state.list.find(l => l._id === event.target.value)
    const newUserData = this.state.form.userData;

    newUserData.forEach(newUserDatum => {
      if(typeof(datum) !== 'undefined' && typeof(datum[newUserDatum.name]) !== 'undefined') {
        newUserDatum.userData[0] = datum[newUserDatum.name];
      } else {
        newUserDatum.userData[0] = '';
      }
    })
    const form = $(this.fv.current).formRender({
      formData: newUserData
    });
    this.setState({form, selected: event.target.value})
  }

  delete(event) {
    const yes = window.confirm('Etes vous certains de vouloir supprimer cet utilisateur ?');
    if(yes) {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0${this.props.api}/id/${this.state.selected}`, {
        method: 'DELETE'
      })
      .then(res => {
        return authFetch(`${process.env.REACT_APP_BACKEND}/v0${this.props.api}`);
      })
      .then(res => {
        const newUserData = this.state.form.userData;
        newUserData.forEach(newUserDatum => {
          newUserDatum.userData[0] = '';
        })
        const form = $(this.fv.current).formRender({
          formData: newUserData
        });

        this.setState({list: res, selected: 'none', form});
      })
    }
  }

  handleSubmit() {
    const data = {}

    this.state.form.userData.forEach(formLine => {
      data[formLine.name] = formLine.userData[0];
    })
    let id = this.state.selected;
    let promiseFetch;
    if (typeof(id) !== 'undefined' && id !== 'none') {
      promiseFetch = authFetch(`${process.env.REACT_APP_BACKEND}/v0${this.props.api}/id/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      })
    } else {
      promiseFetch = authFetch(`${process.env.REACT_APP_BACKEND}/v0${this.props.api}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      })
    }

    promiseFetch
      .then(res => {
        if(id === 'none') {
          id = res;
        }
        return authFetch(`${process.env.REACT_APP_BACKEND}/v0${this.props.api}`);
      })
      .then(res => {
        this.setState({list: res, selected: id});
      })
  }

  fv = createRef();
  componentDidMount() {
    const title = this.props.formTitle;
    let form;
    fetch(`${process.env.REACT_APP_BACKEND}/v0/forms/title/${title}`)
    .then(res => res.json())
    .then(res => {
      form = $(this.fv.current).formRender({
        formData: res.formData
      });
      return authFetch(`${process.env.REACT_APP_BACKEND}/v0${this.props.api}`);
    })
    .then(res => {
      this.setState({form, title, list: res})
    })
  }

  render() {
    console.log(this.state.selected);
    return (
      <Row>
        <Col sm={2}>
          <FormControl onChange={this.select} value={this.state.selected} componentClass="select">
            <option key="none" value="none">----</option>
            {this.state.list.map((datum) => <option key={datum._id} value={datum._id}>{datum[this.props.keyname]}</option>)}
          </FormControl>
          <Button bsStyle="danger" onClick={this.delete}>Supprimer</Button>
        </Col>
        <Col sm={8} style={({margin:'auto'})}>
          <div id="fb-viewer" ref={this.fv} />
          <Button bsStyle="success" onClick={this.handleSubmit}>Envoyer</Button>
        </Col>
      </Row>
    );
  }
}

export default FormViewer
