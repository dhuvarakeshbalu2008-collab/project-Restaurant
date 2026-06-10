const MENU_KEY = 'restaurant_menu';
const SALES_KEY = 'restaurant_sales';
const UPI_KEY = 'restaurant_upi';

const DEFAULT_MENU = [
  { id: '1', name: 'Idly', price: 40, image: 'images/idly.svg' },
  { id: '2', name: 'Puttu', price: 50, image: 'images/puttu.svg' },
  { id: '3', name: 'Poori', price: 45, image: 'images/poori.svg' },
  { id: '4', name: 'Coffee', price: 20, image: 'images/coffee.svg' },
  { id: '5', name: 'Dosai', price: 60, image: 'images/dosai.svg' },
  { id: '6', name: 'Vada', price: 25, image: 'images/vada.svg' },
  { id: '7', name: 'Pazhampori', price: 30, image: 'images/pazhampori.svg' }
];

const DEFAULT_UPI = 'restaurant@upi';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function initStorage() {
  if (!localStorage.getItem(MENU_KEY)) {
    localStorage.setItem(MENU_KEY, JSON.stringify(DEFAULT_MENU));
  }
  if (!localStorage.getItem(SALES_KEY)) {
    localStorage.setItem(SALES_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(UPI_KEY)) {
    localStorage.setItem(UPI_KEY, DEFAULT_UPI);
  }
}

function getMenu() {
  initStorage();
  return JSON.parse(localStorage.getItem(MENU_KEY));
}

function saveMenu(menu) {
  localStorage.setItem(MENU_KEY, JSON.stringify(menu));
}

function getMenuItem(id) {
  return getMenu().find(item => item.id === id);
}

function addMenuItem(item) {
  const menu = getMenu();
  const newItem = {
    id: generateId(),
    name: item.name,
    price: Number(item.price),
    image: item.image
  };
  menu.push(newItem);
  saveMenu(menu);
  return newItem;
}

function updateMenuItem(id, updates) {
  const menu = getMenu();
  const index = menu.findIndex(item => item.id === id);
  if (index === -1) return null;
  menu[index] = {
    ...menu[index],
    name: updates.name,
    price: Number(updates.price),
    image: updates.image
  };
  saveMenu(menu);
  return menu[index];
}

function deleteMenuItem(id) {
  const menu = getMenu();
  const filtered = menu.filter(item => item.id !== id);
  saveMenu(filtered);
  return filtered.length < menu.length;
}

function getSales() {
  initStorage();
  return JSON.parse(localStorage.getItem(SALES_KEY));
}

function recordSale(items, total) {
  const sales = getSales();
  const sale = {
    id: generateId(),
    date: new Date().toISOString(),
    items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
    total: total,
    timestamp: Date.now()
  };
  sales.push(sale);
  localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  return sale;
}

function getSalesForMonth(year, month) {
  const sales = getSales();
  return sales.filter(sale => {
    const d = new Date(sale.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

function getUpiId() {
  initStorage();
  return localStorage.getItem(UPI_KEY) || DEFAULT_UPI;
}

function setUpiId(upi) {
  localStorage.setItem(UPI_KEY, upi);
}

function formatCurrency(amount) {
  return '₹' + Number(amount).toFixed(2);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
