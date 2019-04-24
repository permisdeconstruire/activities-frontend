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
import {authFetch, listPedagogy} from '../../common/utils'

class EventCourrier extends React.Component {
  allPedagogy = []

  defaultState() {
    return {
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = this.defaultState();
  }

  render() {
    return (
      <>
        <FormGroup controlId="formHorizontalEventCourrier">

        </FormGroup>
      </>

    )
  }
}

export default EventCourrier
