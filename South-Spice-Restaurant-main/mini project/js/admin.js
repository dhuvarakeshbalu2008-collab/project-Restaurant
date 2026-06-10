let editingId = null;

function renderMenuTable() {
  const tbody = document.getElementById('menu-table-body');
  const menu = getMenu();
  tbody.innerHTML = menu.map(item => `
    <tr>
      <td><img src="${item.image}" alt="${item.name}" class="table-thumb" onerror="this.src='images/placeholder.svg'"></td>
      <td>${item.name}</td>
      <td>${formatCurrency(item.price)}</td>
      <td class="image-path">${item.image}</td>
      <td>
        <button type="button" class="btn btn-small btn-edit" data-id="${item.id}">Edit</button>
        <button type="button" class="btn btn-small btn-danger btn-delete" data-id="${item.id}">Delete</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => startEdit(btn.dataset.id));
  });
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteItem(btn.dataset.id));
  });
}

function resetForm() {
  editingId = null;
  document.getElementById('item-name').value = '';
  document.getElementById('item-price').value = '';
  document.getElementById('item-image').value = '';
  document.getElementById('form-title').textContent = 'Add Menu Item';
  document.getElementById('btn-cancel-edit').style.display = 'none';
}

function startEdit(id) {
  const item = getMenuItem(id);
  if (!item) return;
  editingId = id;
  document.getElementById('item-name').value = item.name;
  document.getElementById('item-price').value = item.price;
  document.getElementById('item-image').value = item.image;
  document.getElementById('form-title').textContent = 'Edit Menu Item';
  document.getElementById('btn-cancel-edit').style.display = 'inline-block';
}

function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('item-name').value.trim();
  const price = document.getElementById('item-price').value;
  const image = document.getElementById('item-image').value.trim();

  if (!name || !price || !image) {
    showAdminToast('Please fill all fields');
    return;
  }

  if (editingId) {
    updateMenuItem(editingId, { name, price, image });
    showAdminToast('Item updated');
  } else {
    addMenuItem({ name, price, image });
    showAdminToast('Item added');
  }

  resetForm();
  renderMenuTable();
}

function deleteItem(id) {
  const item = getMenuItem(id);
  if (!item) return;
  if (!confirm(`Delete "${item.name}" from menu?`)) return;
  deleteMenuItem(id);
  showAdminToast('Item deleted');
  if (editingId === id) resetForm();
  renderMenuTable();
}

function showAdminToast(message) {
  const toast = document.getElementById('admin-toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function renderSalesReport() {
  const year = parseInt(document.getElementById('report-year').value, 10);
  const month = parseInt(document.getElementById('report-month').value, 10);
  const sales = getSalesForMonth(year, month);

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  document.getElementById('report-orders').textContent = sales.length;
  document.getElementById('report-revenue').textContent = formatCurrency(totalRevenue);

  const tbody = document.getElementById('sales-table-body');
  if (sales.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="empty-row">No sales for this month</td></tr>';
    return;
  }

  tbody.innerHTML = sales.map(sale => {
    const itemsSummary = sale.items.map(i => `${i.name} (${i.qty})`).join(', ');
    return `
      <tr>
        <td>${formatDate(sale.date)}</td>
        <td>${itemsSummary}</td>
        <td>${formatCurrency(sale.total)}</td>
      </tr>
    `;
  }).join('');
}

function initReportFilters() {
  const now = new Date();
  const yearSelect = document.getElementById('report-year');
  const currentYear = now.getFullYear();
  for (let y = currentYear; y >= currentYear - 3; y--) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
  yearSelect.value = currentYear;
  document.getElementById('report-month').value = now.getMonth();
}

document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initReportFilters();

  const upiInput = document.getElementById('upi-id');
  upiInput.value = getUpiId();
  upiInput.addEventListener('change', () => {
    setUpiId(upiInput.value.trim());
    showAdminToast('UPI ID updated');
  });

  document.getElementById('menu-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('btn-cancel-edit').addEventListener('click', resetForm);
  document.getElementById('btn-refresh-report').addEventListener('click', renderSalesReport);

  renderMenuTable();
  renderSalesReport();
});
