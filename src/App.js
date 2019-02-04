import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker.css'
import './styles.css'
import './prism.css'
import AdminCalendar from './basic'


class App extends React.Component {

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
