function colorActivity(status) {
  if (status === 'Autonomie') {
    return 'orangeActivity'
  } else if (status === 'Socio-éducatif') {
    return 'greenActivity'
  } else if (status === 'Formative') {
    return 'blueActivity'
  } else if (status === 'Individuelle') {
    return 'purpleActivity'
  } else if (status === 'Fermeture') {
    return 'grayActivity'
  }
}

function colorPillar(pillar) {
  if(pillar === 'Bien vivre') {
    return 'orangePillar'
  } else if (pillar === 'Bien-être psychologique') {
    return 'purplePillar'
  } else if (pillar === 'Bien-être corporel') {
    return 'bluePillar'
  } else if (pillar === 'Bien faire') {
    return 'greenPillar'
  }
}

function authFetch(url, options = {headers: {}}) {
  const newJwt = document.location.search.split('token=')[1];
  if(typeof(newJwt) !== 'undefined') {
    window.localStorage.setItem('jwtPDC', newJwt);
    window.history.pushState('', '', '/');
  }
  const newOptions = options;
  const jwt = window.localStorage.getItem('jwtPDC');
  if(typeof(jwt) === 'undefined') {
    document.location.href = `${process.env.REACT_APP_BACKEND}/v0/login`;
  }
  if(typeof(newOptions.headers) === 'undefined') {
    newOptions.headers = {};
  }
  newOptions.headers.Authorization = `Bearer ${decodeURIComponent(jwt)}`;
  return fetch(url, newOptions)
    .then(res => res.json(res))
    .catch(e => {
      document.location.href = `${process.env.REACT_APP_BACKEND}/v0/login`;
    })
}

function listPedagogy() {
  return fetch(`${process.env.REACT_APP_BACKEND}/v0/pedagogy`)
    .then(res => res.json())
}

function listCooperators() {
  return fetch(`${process.env.REACT_APP_BACKEND}/v0/cooperators`)
    .then(res => res.json())
}

function logout() {
  window.localStorage.removeItem('jwtPDC');
}

module.exports = {
  colorPillar,
  colorActivity,
  authFetch,
  listPedagogy,
  listCooperators,
  logout,
}
