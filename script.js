const publishedSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVvbF5YmqLpt2sEfUqgdFzPzzhdzNv-CC5BMjVmtgnParsaoyKFvumO7OylsleumOnYSQyZOr1sm2-/pubhtml';

function updateOpeningHours(data) {
  // Update table with sheet data
  data.forEach(row => {
    const dayRow = document.getElementById(row.Day);
    if (!dayRow) return;
    dayRow.querySelector('.opens').textContent = row.Open || '--:--';
    dayRow.querySelector('.closes').textContent = row.Close || '--:--';
  });

  highlightToday();
  updateOpenStatus();
}

function highlightToday() {
  const weekday = ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'];
  const now = new Date();
  const today = weekday[now.getDay()];

  // Remove previous highlight
  document.querySelectorAll('.today').forEach(row => row.classList.remove('today'));

  // Highlight today row
  const todayRow = document.getElementById(today);
  if (todayRow) {
    todayRow.classList.add('today');
  }
}

function updateOpenStatus() {
  const weekday = ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'];
  const now = new Date();
  const today = weekday[now.getDay()];
  const todayRow = document.getElementById(today);

  if (!todayRow) return;

  const openText = todayRow.querySelector('.opens').textContent;
  const closeText = todayRow.querySelector('.closes').textContent;

  const statusElem = document.querySelector('.openorclosed');

  if (openText.toLowerCase() === 'lukket' || openText === '--:--' || closeText === '--:--') {
    statusElem.textContent = 'Butikken er lukket';
    statusElem.classList.remove('open');
    statusElem.classList.add('closed');
    return;
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const [openHour, openMin] = openText.split(':').map(Number);
  const [closeHour, closeMin] = closeText.split(':').map(Number);

  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  if (nowMinutes >= openMinutes && nowMinutes <= closeMinutes) {
    statusElem.textContent = 'Butikken er åben';
    statusElem.classList.remove('closed');
    statusElem.classList.add('open');
  } else {
    statusElem.textContent = 'Butikken er lukket';
    statusElem.classList.remove('open');
    statusElem.classList.add('closed');
  }
}

Tabletop.init({
  key: publishedSheetURL,
  callback: updateOpeningHours,
  simpleSheet: true
});
