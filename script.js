let items = [];

const customerInput = document.getElementById("customer-name");
const invoiceNumInput = document.getElementById("invoice-number");
const invoiceDateInput = document.getElementById("invoice-date");
const itemForm = document.getElementById("item-form");
const itemNameInput = document.getElementById("item-name");
const itemQtyInput = document.getElementById("item-qty");
const itemPriceInput = document.getElementById("item-price");
const tbody = document.getElementById("invoice-tbody");
const printBtn = document.getElementById("print-btn");

const previewCustomer = document.getElementById("preview-customer");
const previewInvNum = document.getElementById("preview-inv-num");
const previewDate = document.getElementById("preview-date");
const itemCountDisplay = document.getElementById("item-count-display");
const subtotalDisplay = document.getElementById("subtotal-display");
const taxDisplay = document.getElementById("tax-display");
const grandTotalDisplay = document.getElementById("grand-total");

// Default date formatting
const today = new Date();
const options = { weekday: 'long', month: 'long' };
previewDate.textContent = today.toLocaleDateString('en-US', options).toUpperCase();
invoiceDateInput.value = today.toISOString().split("T")[0];

customerInput.addEventListener("input", () => {
  previewCustomer.textContent = customerInput.value.trim() || "Bunnie's Mall";
});

invoiceNumInput.addEventListener("input", () => {
  previewInvNum.textContent = invoiceNumInput.value.trim() || "RCPT-042";
});

invoiceDateInput.addEventListener("change", () => {
  if (invoiceDateInput.value) {
    const d = new Date(invoiceDateInput.value);
    previewDate.textContent = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long' }).toUpperCase();
  }
});

function updateTotals() {
  const totalItemsCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const tax = subtotal * 0.18; // 18% Tax
  const grandTotal = subtotal + tax;

  itemCountDisplay.textContent = totalItemsCount;
  subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
  taxDisplay.textContent = `$${tax.toFixed(2)}`;
  grandTotalDisplay.textContent = `$${grandTotal.toFixed(2)}`;
}

function renderTable() {
  tbody.innerHTML = "";

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-row">
        <td colspan="4">Your receipt is empty. Add items using the control panel!</td>
      </tr>
    `;
    updateTotals();
    return;
  }

  items.forEach((item, index) => {
    const itemNumber = String(index + 1).padStart(2, '0');
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${itemNumber}</td>
      <td>${escapeHtml(item.name)}<br><small style="color:#847596">Qty: ${item.qty} × $${item.price.toFixed(2)}</small></td>
      <td class="text-right">$${item.lineTotal.toFixed(2)}</td>
      <td class="delete-col no-print">
        <button type="button" class="delete-btn" data-id="${item.id}">[X]</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateTotals();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

itemForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = itemNameInput.value.trim();
  const qty = parseInt(itemQtyInput.value, 10);
  const price = parseFloat(itemPriceInput.value);

  if (!name || Number.isNaN(qty) || qty <= 0 || Number.isNaN(price) || price <= 0) {
    return;
  }

  const newItem = {
    id: Date.now(),
    name,
    qty,
    price,
    lineTotal: qty * price
  };

  items.push(newItem);
  renderTable();

  itemNameInput.value = "";
  itemQtyInput.value = "1";
  itemPriceInput.value = "";
  itemNameInput.focus();
});

tbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.dataset.id);
    items = items.filter((item) => item.id !== id);
    renderTable();
  }
});

printBtn.addEventListener("click", () => {
  window.print();
});