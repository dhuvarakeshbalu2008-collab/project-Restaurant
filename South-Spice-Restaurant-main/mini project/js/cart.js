let cart = [];

function addToCart(item) {
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: 1
    });
  }
  renderCart();
}

function updateQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  renderCart();
}

function clearCart(silent) {
  cart = [];
  renderCart();
  if (!silent) showToast('Cart cleared');
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  const list = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const printBill = document.getElementById('print-bill');
  if (!list || !totalEl) return;

  if (cart.length === 0) {
    list.innerHTML = '<p class="empty-cart">No items yet. Click menu items to add.</p>';
  } else {
    list.innerHTML = cart.map(item => `
      <div class="cart-row">
        <div class="cart-row-info">
          <span class="cart-name">${item.name}</span>
          <span class="cart-line-price">${formatCurrency(item.price * item.qty)}</span>
        </div>
        <div class="qty-controls">
          <button type="button" class="qty-btn" onclick="updateQty('${item.id}', -1)" aria-label="Decrease">−</button>
          <span class="qty">${item.qty}</span>
          <button type="button" class="qty-btn" onclick="updateQty('${item.id}', 1)" aria-label="Increase">+</button>
        </div>
      </div>
    `).join('');
  }

  const total = getCartTotal();
  totalEl.textContent = formatCurrency(total);

  if (printBill) {
  printBill.innerHTML = `
    <div class="bill-header">
      <h2>South Spice Restaurant</h2>
      <p>${new Date().toLocaleString('en-IN')}</p>
    </div>
    <table class="bill-table">
      <thead>
        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
      </thead>
      <tbody>
        ${cart.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${formatCurrency(item.price * item.qty)}</td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr><td colspan="2"><strong>Total</strong></td><td><strong>${formatCurrency(total)}</strong></td></tr>
      </tfoot>
    </table>
    <p class="bill-footer">Thank you! Visit again.</p>
  `;
  }
}

function openPayModal() {
  if (cart.length === 0) {
    showToast('Cart is empty');
    return;
  }

  const modal = document.getElementById('pay-modal');
  const summary = document.getElementById('pay-summary');
  const qrContainer = document.getElementById('qr-code');
  const total = getCartTotal();

  summary.innerHTML = cart.map(item =>
    `<p>${item.name} × ${item.qty} — ${formatCurrency(item.price * item.qty)}</p>`
  ).join('') + `<p class="pay-total"><strong>Total: ${formatCurrency(total)}</strong></p>`;

  qrContainer.innerHTML = '';
  const upiId = getUpiId();
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=South%20Spice%20Restaurant&am=${total.toFixed(2)}&cu=INR`;

  if (typeof QRCode !== 'undefined') {
    new QRCode(qrContainer, {
      text: upiLink,
      width: 180,
      height: 180,
      colorDark: '#1a1a1a',
      colorLight: '#ffffff'
    });
  }

  modal.classList.add('open');
}

function closePayModal() {
  document.getElementById('pay-modal').classList.remove('open');
}

function confirmPayment() {
  const total = getCartTotal();
  recordSale(cart, total);
  clearCart(true);
  closePayModal();
  showToast('Payment recorded. Thank you!');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-clear').addEventListener('click', clearCart);
  document.getElementById('btn-print').addEventListener('click', () => window.print());
  document.getElementById('btn-pay').addEventListener('click', openPayModal);
  document.getElementById('btn-close-modal').addEventListener('click', closePayModal);
  document.getElementById('btn-confirm-pay').addEventListener('click', confirmPayment);

  document.getElementById('pay-modal').addEventListener('click', e => {
    if (e.target.id === 'pay-modal') closePayModal();
  });

  renderCart();
});
