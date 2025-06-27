const games = [
  { title: 'Aventura Espacial', price: '$9.99', image: 'https://via.placeholder.com/300x150?text=Juego+1', desc: 'Explora el universo y descubre nuevos mundos.' },
  { title: 'Carreras Extrema', price: '$14.99', image: 'https://via.placeholder.com/300x150?text=Juego+2', desc: 'Velocidad y adrenalina en cada pista.' },
  { title: 'Puzzle Maestro', price: '$4.99', image: 'https://via.placeholder.com/300x150?text=Juego+3', desc: 'Desafía tu mente con intrincados acertijos.' }
];

function loadGames() {
  const container = document.getElementById('game-list');
  games.forEach(game => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${game.image}" class="card-img-top" alt="${game.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${game.title}</h5>
          <p class="card-text">${game.desc}</p>
          <div class="mt-auto fw-bold">${game.price}</div>
        </div>
      </div>`;
    container.appendChild(col);
  });
}

document.addEventListener('DOMContentLoaded', loadGames);
