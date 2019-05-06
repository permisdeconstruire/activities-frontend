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
      selectedForm: {_id: 'none', type: '', title: '', formData: ''}
    };
  }

  constructor(props, context) {
    super(props, context);

    this.selectForm = this.selectForm.bind(this);
    this.selectType = this.selectType.bind(this);
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
    if(typeof(selectedForm) !== 'undefined') {
      this.state.form.actions.setData(selectedForm.formData)
      this.setState({selectedForm});
    } else {
      this.state.form.actions.setData('')
      const defaultForm = this.defaultState();
      this.setState({selectedForm: defaultForm.selectedForm});
    }
  }

  selectType(event) {
    const oldSelectedForm = this.state.selectedForm;
    oldSelectedForm.type = event.target.value;
    this.setState({selectedForm: oldSelectedForm})
  }

  saveData() {
    if(this.state.selectedForm._id !== 'none') {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/forms/id/${this.state.selectedForm._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: this.state.selectedForm.title,
          type: this.state.selectedForm.type,
          formData: JSON.stringify(this.state.form.actions.getData())
        }),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.getForms(this.state.selectedForm._id)
        alert('Formulaire sauvegardé !')
      })
    } else {
      authFetch(`${process.env.REACT_APP_BACKEND}/v0/admin/forms`, {
        method: 'POST',
        body: JSON.stringify({
          title: this.state.selectedForm.title,
          type: this.state.selectedForm.type,
          formData: JSON.stringify(this.state.form.actions.getData())
        }),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.getForms(res)
        alert('Formulaire sauvegardé !')
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
          <FormGroup controlId="formHorizontalSelectForm">
            <Col componentClass={ControlLabel} sm={4}>
              Sélectionner type
            </Col>
            <Col sm={4}>
                <FormControl onChange={this.selectType} value={this.state.selectedForm.type} componentClass="select">
                  <option key="none" value="none">-- Type --</option>
                  <option key="pilote" value="pilote">Pilote</option>
                  <option key="cooperator" value="cooperator">Coopérateur</option>
                </FormControl>
            </Col>
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
