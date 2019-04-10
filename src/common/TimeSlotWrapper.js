import React from 'react'

const publicHolidays = [{"date": "2019-01-01", "nom_jour_ferie": "Jour de l'an"}, {"date": "2019-04-22", "nom_jour_ferie": "Lundi de Pâques"}, {"date": "2019-05-01", "nom_jour_ferie": "Fête du travail"}, {"date": "2019-05-08", "nom_jour_ferie": "Victoire des alliés"}, {"date": "2019-05-30", "nom_jour_ferie": "Ascension"}, {"date": "2019-06-10", "nom_jour_ferie": "Lundi de Pentecôte"}, {"date": "2019-07-14", "nom_jour_ferie": "Fête Nationale"}, {"date": "2019-08-15", "nom_jour_ferie": "Assomption"}, {"date": "2019-11-01", "nom_jour_ferie": "Toussaint"}, {"date": "2019-11-11", "nom_jour_ferie": "Armistice"}, {"date": "2019-12-25", "nom_jour_ferie": "Noël"}, {"date": "2020-01-01", "nom_jour_ferie": "Jour de l'an"}, {"date": "2020-04-13", "nom_jour_ferie": "Lundi de Pâques"}, {"date": "2020-05-01", "nom_jour_ferie": "Fête du travail"}, {"date": "2020-05-08", "nom_jour_ferie": "Victoire des alliés"}, {"date": "2020-05-21", "nom_jour_ferie": "Ascension"}, {"date": "2020-06-01", "nom_jour_ferie": "Lundi de Pentecôte"}, {"date": "2020-07-14", "nom_jour_ferie": "Fête Nationale"}, {"date": "2020-08-15", "nom_jour_ferie": "Assomption"}, {"date": "2020-11-01", "nom_jour_ferie": "Toussaint"}, {"date": "2020-11-11", "nom_jour_ferie": "Armistice"}, {"date": "2020-12-25", "nom_jour_ferie": "Noël"}]
const defaultTimes = [
  {
    start: 0,
    end: 9,
    color: '#858585',
    text: 'Fermeture'
  },
  {
    start: 12.5,
    end: 14,
    color: '#858585',
    text: 'Fermeture'
  },
]

function getDefaultTime(date) {
  const currentDay = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`
  const currentHour = date.getHours() + date.getMinutes()/60;

  const publicHoliday = publicHolidays.find(h => h.date === currentDay)
  if(typeof(publicHoliday) !== 'undefined') {
    return {
      color: '#858585',
      text: publicHoliday.nom_jour_ferie,
    }
  }


  const defaultTime = defaultTimes.find(time => {
    if(currentHour >= time.start && currentHour < time.end) {
      return true;
    }
  })

  return defaultTime
}

class TimeSlotWrapper extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render(){
    const time = getDefaultTime(this.props.value);

    if(this.props.children._owner.return.stateNode) {
      return this.props.children
    }

    let style = {};

    if(typeof(time) === 'undefined') {
      style.backgroundColor = '#ffb77e';
      return (
        <div className='rbc-time-slot'>
          <div className='rbc-event' style={style}>
            Sur rendez-vous
          </div>
        </div>
      )
    }

    style.backgroundColor = time.color;

    return (
      <div className='rbc-time-slot'>
        <div className='rbc-event' style={style}>
          {time.text}
        </div>
      </div>
    )
  }
}

export default TimeSlotWrapper
