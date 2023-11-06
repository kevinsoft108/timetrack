function formatDateString(time) {
  const format = "YYYY-MM-DDTHH:mm:ssZ";
  const year = time.getFullYear().toString();
  let month = (time.getMonth() + 1).toString();
  let day = time.getDate().toString();
  let hours = time.getHours().toString();
  let minutes = time.getMinutes().toString();
  let seconds = time.getSeconds().toString();

  month = month.length === 1 ? '0' + month : month;
  day = day.length === 1 ? '0' + day : day;
  hours = hours.length === 1 ? '0' + hours : hours;
  minutes = minutes.length === 1 ? '0' + minutes : minutes;
  seconds = seconds.length === 1 ? '0' + seconds : seconds;

  const formattedDate = format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('Z', 'Z');

  return formattedDate;
}

module.exports = formatDateString;