// Remove accordion code, keep sorting, add global filter

// --- Sorting ---
document.querySelectorAll('th').forEach(th => {
  th.addEventListener('click', () => {
    const table = th.closest('table');
    if (!table) return;
    const index = Array.from(th.parentNode.children).indexOf(th);
    const currentSort = th.dataset.sortOrder || null;
    let newSort;
    if (!currentSort) {
      newSort = 'asc';
    } else if (currentSort === 'asc') {
      newSort = 'desc';
    } else {
      newSort = 'asc';
    }
    // Clear siblings’ sort
    Array.from(th.parentNode.children).forEach(sibling => {
      sibling.dataset.sortOrder = '';
      sibling.classList.remove('sort-asc', 'sort-desc');
    });
    // Set new sort on clicked
    th.dataset.sortOrder = newSort;
    th.classList.add('sort-' + newSort);

    sortTable(table, index, newSort);
  });
});

function sortTable(table, colIndex, sortOrder) {
  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll('tr'));
  rows.sort((a, b) => {
    const aText = a.children[colIndex]?.innerText?.toLowerCase() || '';
    const bText = b.children[colIndex]?.innerText?.toLowerCase() || '';

    // Attempt numeric compare
    const aNum = parseFloat(aText);
    const bNum = parseFloat(bText);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return (aNum - bNum) * (sortOrder === 'asc' ? 1 : -1);
    } else {
      // Fallback to string compare
      if (aText < bText) return sortOrder === 'asc' ? -1 : 1;
      if (aText > bText) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
  });

  rows.forEach(r => tbody.appendChild(r));
}

// --- Global Filter ---
const globalFilter = document.getElementById('global-filter');
if (globalFilter) {
  globalFilter.addEventListener('input', () => {
    const filterVal = globalFilter.value.toLowerCase();
    const table = document.getElementById('main-table');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(tr => {
      const rowText = tr.innerText.toLowerCase();
      tr.style.display = rowText.includes(filterVal) ? '' : 'none';
    });
  });
}
// --- Copy Table ---
const copyTableBtn = document.getElementById('copy-table-btn');
if (copyTableBtn) {
  copyTableBtn.addEventListener('click', () => {
    const table = document.getElementById('main-table');
    if (!table) return;

    const tableHtml = table.outerHTML;
    navigator.clipboard.writeText(tableHtml)
      .then(() => {
        alert('Table HTML copied to clipboard!');
      })
      .catch(err => {
        alert('Failed to copy table: ' + err);
      });
  });
}

// --- Copy Page HTML ---
const copyHtmlBtn = document.getElementById('copy-html-btn');
if (copyHtmlBtn) {
  copyHtmlBtn.addEventListener('click', () => {
    // Copy the entire page (including <html> and <head>):
    const fullPageHtml = document.documentElement.outerHTML;
    navigator.clipboard.writeText(fullPageHtml)
      .then(() => {
        alert('Full page HTML copied to clipboard!');
      })
      .catch(err => {
        alert('Failed to copy page HTML: ' + err);
      });
  });
}
