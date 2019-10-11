import moment from 'moment-timezone';

export function getDayLabel(day) {
  switch (day) {
    case '23':
    case '24':
      return 'Tutoriais';
    case '25':
    case '26':
    case '27':
      return 'Palestras';
    default:
      return 'Sprints';
  }
}

export function getFormattedTime(time) {
  return moment(time)
    .tz('America/Sao_Paulo')
    .format('HH[h]mm');
}
