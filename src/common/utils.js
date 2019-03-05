function colorPillar(pillar) {
  if(pillar === 'Bien vivre') {
    return 'greenPillar'
  } else if (pillar === 'Bien-être psychologique') {
    return 'purplePillar'
  } else if (pillar === 'Bien-être corporel') {
    return 'orangePillar'
  } else if (pillar === 'Bien faire') {
    return 'bluePillar'
  } else if (pillar === 'Fermeture') {
    return 'grayPillar'
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

module.exports = {
  colorPillar,
  authFetch,
}
