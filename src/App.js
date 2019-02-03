import React from 'react'
import { render } from 'react-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker.css'
import './styles.css'
import './prism.css'
import Card from './Card'
import AdminCalendar from './basic'
import Dropdown from 'react-bootstrap/lib/Dropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'


class App extends React.Component {
  constructor(...args) {
    super(...args)
  }

  render() {
    return (
      <div className="app">
        <div className="jumbotron">
          <div className="container">
            Permis de construire agenda des activités.
          </div>
        </div>
        <div className="examples">
          <div className="example">
            <AdminCalendar />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
