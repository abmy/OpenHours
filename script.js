const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1VqklVQ7OUa-mVv03hJ4uUJy70T_sQbLId2srYDuDi2A/pubhtml';

function init() {
  Tabletop.init({
    key: publicSpreadsheetUrl,
    callback: showInfo,
    simpleSheet: true
  });
}

function showInfo(data) {
  const now = new Date();
  const days = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
  const currentDay = days[now.getDay()];
  const currentTime = now.getHours() * 100 + now.getMinutes();

  data.forEach(row => {
    const day = row.Day;
    const open = row.Open.trim();
    const close = row.Close.trim();
    const rowEl = document.getElementById(day);
    if (!rowEl) return;

    if (open.toLowerCase() === 'lukket' || close.toLowerCase() === 'lukket') {
      rowEl.innerHTML = `<td>${day}</td><td colspan="3" class="closed-static">Lukket</td>`;
      if (day === currentDay) document.querySelector('.openorclosed').classList.add('closed');
      return;
    }

    rowEl.querySelector('.opens').textContent = open;
    rowEl.querySelector('.closes').textContent = close;

    if (day === currentDay) {
      rowEl.classList.add('today');
      const openTime = parseInt(open.replace(':', ''));
      const closeTime = parseInt(close.replace(':', ''));
      const statusEl = document.querySelector('.openorclosed');
      statusEl.classList.add(currentTime >= openTime && currentTime < closeTime ? 'open' : 'closed');
    }
  });
}

window.addEventListener('DOMContentLoaded', init);
