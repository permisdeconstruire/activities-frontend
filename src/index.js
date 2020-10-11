import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

window.localStorage.setItem('PDC_AGENCE',
  window.location.hostname.endsWith('assopermisdeconstruire.org') ?
    `https://api.${window.location.hostname.split('.')[1]}.assopermisdeconstruire.org` :
    window.localStorage.getItem('PDC_AGENCE')
)

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
