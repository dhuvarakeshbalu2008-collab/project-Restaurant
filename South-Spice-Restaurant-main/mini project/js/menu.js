function renderMenu() {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  const menu = getMenu();
  grid.innerHTML = '';

  menu.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.svg'">
      <div class="menu-card-body">
        <h3>${item.name}</h3>
        <p class="price">${formatCurrency(item.price)}</p>
        <span class="add-hint">Click to add</span>
      </div>
    `;
    card.addEventListener('click', () => {
      addToCart(item);
      showToast(`${item.name} added to cart`);
    });
    grid.appendChild(card);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  renderMenu();
});
