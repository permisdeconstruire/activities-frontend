import $ from 'jquery';
import React, { Component, createRef } from 'react';
import ReactDOM from 'react-dom';
import {
  Modal,
  Panel,
  Button,
  Form,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';
import {authFetch} from '../common/utils'
window.jQuery = $;
window.$ = $;
require('jquery-ui-sortable');
require('formBuilder');



class FormsBuilder extends React.Component {

  defaultState() {
    return {
      form: false,
      forms: [],
      selectedForm: {_id: 'none', title: '', formData: ''}
    };
  }

  constructor(props, context) {
    super(props, context);

    this.selectForm = this.selectForm.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.saveData = this.saveData.bind(this)
    this.getForms = this.getForms.bind(this);
    this.handleDelete = this.handleDelete.bind(this)
    this.openForm = this.openForm.bind(this)
    this.state = this.defaultState();
  }

  handleDelete() {
    const yes = window.confirm('Etes vous certains de vouloir supprimer ce formulaire ?');
    if(yes) {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/forms/id/${this.state.selectedForm._id}`, {
        method: 'DELETE'
      })
      .then(res => {
        this.getForms('none');
      })
    }
  }

  openForm() {
    window.open(`/#form=${this.state.selectedForm.title}`, '_blank');
  }

  getForms(id) {
    authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/forms`)
    .then(res => {
      let newSelectedForm = this.state.selectedForm;
      if(id && id !== 'none'){
        newSelectedForm = res.find(form => form._id === id);
      } else if(id) {
        newSelectedForm = this.defaultState().selectedForm;
      }
      this.setState({selectedForm: newSelectedForm, forms: res})
    })
  }

  selectForm(event) {
    const selectedForm = this.state.forms.find(form => form._id === event.target.value)
    this.state.form.actions.setData(selectedForm.formData)
    this.setState({selectedForm});
  }

  saveData() {
    if(this.state.selectedForm._id !== 'none') {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/forms/id/${this.state.selectedForm._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: this.state.selectedForm.title,
          formData: JSON.stringify(this.state.form.actions.getData())
        }),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.getForms(this.state.selectedForm._id)
      })
    } else {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/forms`, {
        method: 'POST',
        body: JSON.stringify({
          title: this.state.selectedForm.title,
          formData: JSON.stringify(this.state.form.actions.getData())
        }),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.getForms(res)
      })
    }
  }

  handleChangeTitle(event) {
    const newSelectedForm = this.state.selectedForm;
    newSelectedForm.title = event.target.value;
    this.setState({selectedForm: newSelectedForm});
  }

  fb = createRef();
  componentDidMount() {
    const form = $(this.fb.current).formBuilder({
      i18n: {
        locale: 'fr-FR',
        location: '/lang/',
      },
      onSave: this.saveData,
    });

    this.setState({form})

    this.getForms()
  }

  render() {
    return (
      <>
        <Form horizontal>
          <FormGroup controlId="formHorizontalSelectForm">
            <Col componentClass={ControlLabel} sm={4}>
              Sélectionner formulaire
            </Col>
            <Col sm={4}>
              <FormControl onChange={this.selectForm} value={this.state.selectedForm._id} componentClass="select">
                <option key="none" value="none">-- Partir de zéro --</option>
                {this.state.forms.map((form) => <option key={form._id} value={form._id}>{form.title}</option>)}
              </FormControl>
            </Col>
            {this.state.selectedForm._id !== 'none' &&
              (
                <Col sm={2}>
                  <Button onClick={this.openForm} bsStyle="success">Voir</Button><Button onClick={this.handleDelete} bsStyle="danger">Supprimer</Button>
                </Col>
              )
            }
          </FormGroup>
          <FormGroup controlId="formHorizontalTitle">
            <Col componentClass={ControlLabel} sm={4}>
              Titre
            </Col>
            <Col sm={4}>
              <FormControl value={this.state.selectedForm.title} onChange={this.handleChangeTitle} type="text" placeholder="Nouveau formulaire" />
            </Col>
          </FormGroup>
        </Form>
        <div id="fb-editor" ref={this.fb} />
      </>
    );
  }
}

export default FormsBuilder
