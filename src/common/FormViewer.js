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


function downloadURI(uri, name) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

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
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.select = this.select.bind(this);
    this.delete = this.delete.bind(this);
    this.state = this.defaultState();
  }

  select(event) {
    const datum = this.state.list.find(l => l._id === event.target.value)
    const newUserData = this.state.form.userData;

    newUserData.forEach(newUserDatum => {
      if(typeof(newUserDatum.name) !== 'undefined') {
        if(typeof(datum) !== 'undefined' && typeof(datum[newUserDatum.name]) !== 'undefined') {
          if(newUserDatum.type === 'checkbox-group') {
            newUserDatum.userData = datum[newUserDatum.name];
          } else if (newUserDatum.type === 'file') {

          } else {
            newUserDatum.userData = [datum[newUserDatum.name]];
          }
        } else {
          if(newUserDatum.type === 'checkbox-group') {
            newUserDatum.userData = [];
          } else {
            newUserDatum.userData = [''];
          }
        }
      }
    })
    const form = $(this.fv.current).formRender({
      formData: newUserData
    });
    if(typeof(datum) !== 'undefined') {
      const fileData = form.userData.filter(formLine => formLine.type === 'file');
      fileData.forEach(fileDatum => {
        const parent = $(this.state.form.instanceContainers[0]).find(`input[name="${fileDatum.name}"]`).parent()
        const divUploadedFile = $('<div class="uploadedFile"></div>');
        if(datum[fileDatum.name] !== '') {
          const mime = datum[fileDatum.name].split(';')[0].split(':')[1];
          let elem
          if(mime.startsWith('image')) {
            elem = $('<img>',{class: 'downloadable', width: '100px', src: datum[fileDatum.name]})
          } else {
            elem = $('<p>',{class: 'downloadable'}).text(fileDatum.name)
          }
          elem.click(() => {
            downloadURI(datum[fileDatum.name], fileDatum.name);
          })
          divUploadedFile.append(elem);
        }
        // divUploadedFile.appendChild()
        parent.append(divUploadedFile)
      })
    }

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
          if(newUserDatum.type === 'checkbox-group') {
            newUserDatum.userData = [];
          } else {
            newUserDatum.userData = [''];
          }
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
    let id = this.state.selected;
    const fileData = this.state.form.userData.filter(formLine => formLine.type === 'file');

    const filePromises = [];
    for(let i = 0; i < fileData.length; i += 1) {
      filePromises.push(new Promise((resolve, reject) => {
        const fileDatum = fileData[i];
        const fileInput = $(this.state.form.instanceContainers[0]).find(`input[name="${fileDatum.name}"]`)[0];
        if(fileInput.files.length > 0) {
          const file = fileInput.files[0]
          const fileReader = new FileReader();
          fileReader.onload = (event) => {
            const parent = $(this.state.form.instanceContainers[0]).find(`input[name="${fileDatum.name}"]`).parent()
            let divUploadedFile;
            if(parent.find('.uploadedFile').length === 0) {
              divUploadedFile = $('<div class="uploadedFile"></div>');
            } else {
              divUploadedFile = parent.find('.uploadedFile').first();
              divUploadedFile.empty();
            }

            const mime = event.target.result.split(';')[0].split(':')[1];
            let elem
            if(mime.startsWith('image')) {
              elem = $('<img>',{class: 'downloadable', width: '100px', src: event.target.result})
            } else {
              elem = $('<p>',{class: 'downloadable'}).text(fileDatum.name)
            }
            elem.click(() => {
              downloadURI(event.target.result, fileDatum.name);
            })
            divUploadedFile.append(elem);
            parent.append(divUploadedFile)

            resolve({name: fileDatum.name, data: event.target.result})
          };
          fileReader.readAsDataURL(file);
        } else {
          resolve({name: fileDatum.name, data: ''})
        }
      }))
    }

    Promise.all(filePromises)
      .then(files => {
        this.state.form.userData.filter(formLine => typeof(formLine.name) !== 'undefined').forEach(formLine => {
          if(formLine.type === 'checkbox-group') {
            data[formLine.name] = formLine.userData;
            if(typeof(data[formLine.name]) === 'undefined') {
              data[formLine.name] = [];
            }
          } else {
            if(formLine.type === 'file') {
              const file = files.find(f => f.name === formLine.name);
              data[formLine.name] = file.data;
            } else {
              data[formLine.name] = formLine.userData[0];
            }
          }
        })
        if (typeof(id) !== 'undefined' && id !== 'none') {
          return authFetch(`${process.env.REACT_APP_BACKEND}/v0${this.props.api}/id/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers:{
              'Content-Type': 'application/json'
            }
          })
        }
        return authFetch(`${process.env.REACT_APP_BACKEND}/v0${this.props.api}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers:{
            'Content-Type': 'application/json'
          }
        })
      })
      .then(res => {
        if(id === 'none') {
          id = res;
        }
        return authFetch(`${process.env.REACT_APP_BACKEND}/v0${this.props.api}`);
      })
      .then(res => {
        this.setState({list: res, selected: id});
        alert('Élément sauvegardé !')
      })
  }

  fv = createRef();

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.formTitle !== this.props.formTitle){
      this.update()
    }
  }

  update(selected) {
    const title = this.props.formTitle;
    let form;
    fetch(`${process.env.REACT_APP_BACKEND}/v0/forms/title/${this.props.formType}/${title}`)
    .then(res => res.json())
    .then(res => {
      form = $(this.fv.current).formRender({
        formData: res.formData
      });
      return authFetch(`${process.env.REACT_APP_BACKEND}/v0${this.props.api}`);
    })
    .then(res => {
      this.setState({form, title, list: res, selected: 'none'})
    })
  }

  componentDidMount() {
    this.update()
  }

  render() {
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
