function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

function colorActivity(status, parcours) {
  if (status === 'Autonomie') {
    return 'autonomieActivity'
  } else if (status === 'Socio-éducatif') {
    return 'socioeducatifActivity'
  } else if (status === 'Fermeture') {
    return 'fermetureActivity'
  } else if (status === 'Individuelle') {
    return 'individuelleActivity';
  } else if (status === 'Parcours') {
    if(parcours === 'Élaboration de son projet professionnel') {
      return 'projetprofessionelActivity'
    } else if (parcours === 'La relation') {
      return 'larelationActivity'
    } else if (parcours === 'Les soins pour soi') {
      return 'lessoinspoursoiActivity'
    } else if (parcours === 'Boost ta candidature') {
      return 'boostersacandidatureActivity';
    } else if (parcours === 'Insertion sociale') {
      return 'insertionsocialeActivity';
    } else if (parcours === 'Conscience de soi') {
      return 'larelationActivity';
    }
  }
}

function authFetch(url, options = {headers: {}}) {
  const newJwt = getQueryVariable('token');
  if(typeof(newJwt) !== 'undefined') {
    window.localStorage.setItem('jwtPDC', newJwt);
    if(getQueryVariable('hide') === 'true') {
      window.history.pushState('', '', '/?hide=true');
    } else {
      window.history.pushState('', '', '/');
    }
  }
  const newOptions = options;
  const jwt = window.localStorage.getItem('jwtPDC');
  if(typeof(jwt) === 'undefined') {
    document.location.href = `${window.localStorage.getItem('PDC_AGENCE')}/v0/login`;
  }
  if(typeof(newOptions.headers) === 'undefined') {
    newOptions.headers = {};
  }
  newOptions.headers.Authorization = `Bearer ${decodeURIComponent(jwt)}`;
  return fetch(url, newOptions)
    .then(res => res.json(res))
    .catch(e => {
      document.location.href = `${window.localStorage.getItem('PDC_AGENCE')}/v0/login`;
    })
}

function listPedagogy() {
  return fetch(`${window.localStorage.getItem('PDC_AGENCE')}/v0/pedagogy`)
    .then(res => res.json())
}

function listCooperators() {
  return fetch(`${window.localStorage.getItem('PDC_AGENCE')}/v0/cooperators`)
    .then(res => res.json())
}

function logout() {
  window.localStorage.removeItem('jwtPDC');
  document.location.href = `${window.localStorage.getItem('PDC_AGENCE')}/v0/logout`;
}

function alert(text) {
  document.getElementById('alertContent').textContent = text;
  document.getElementById('alert').style.display = 'block';
}

module.exports = {
  colorActivity,
  authFetch,
  listPedagogy,
  listCooperators,
  logout,
  alert,
}
