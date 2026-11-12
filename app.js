
// CampusFlow front-end interactions and JavaScript form validation.

function doSearch(inputId, tableId) {
  const q = document.getElementById(inputId)?.value.toLowerCase() || '';
  document.querySelectorAll('#' + tableId + ' tbody tr').forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
}

function demoSubmit(e, msg = 'Saved successfully!') {
  e.preventDefault();
  alert(msg);
  e.target.reset();
}

function removeRow(btn) {
  if (confirm('Delete this record?')) btn.closest('tr').remove();
}

function demoLogin(e, target) {
  e.preventDefault();
  location.href = target;
}

// Validate every form before its existing demo submit/login handler runs.
// Capture phase ensures invalid data is stopped before inline form handlers.
document.addEventListener('submit', function (event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  const fields = Array.from(form.querySelectorAll('input, select, textarea'));
  let firstInvalid = null;

  fields.forEach(field => {
    field.setCustomValidity('');
    if (field.disabled || field.type === 'hidden') return;

    const label = field.closest('.field')?.querySelector('label')?.textContent?.trim()
      || field.getAttribute('aria-label')
      || field.placeholder
      || 'This field';

    const value = field.value.trim();

    if (field.required && !value) {
      field.setCustomValidity(`${label} is required.`);
    } else if (value && field.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailPattern.test(value)) {
        field.setCustomValidity('Enter a valid email address, for example name@example.com.');
      }
    } else if (value && field.type === 'password' && value.length < 8) {
      field.setCustomValidity('Password must contain at least 8 characters.');
    } else if (value && /student\s*id/i.test(label) && !/^[A-Za-z0-9-]{3,15}$/.test(value)) {
      field.setCustomValidity('Student ID must be 3–15 characters and use letters, numbers or hyphens.');
    } else if (value && /name/i.test(label) && !/^[\p{L}][\p{L}\s.'-]{1,49}$/u.test(value)) {
      field.setCustomValidity('Enter a valid name using letters only.');
    } else if (value && /phone/i.test(label) && !/^\+?[0-9\s()-]{7,16}$/.test(value)) {
      field.setCustomValidity('Enter a valid phone number (7–16 digits, spaces or + allowed).');
    }

    if (!field.checkValidity() && !firstInvalid) firstInvalid = field;
  });

  if (firstInvalid) {
    event.preventDefault();
    event.stopImmediatePropagation();
    firstInvalid.reportValidity();
    firstInvalid.focus();
  }
}, true);

// Clear a field's previous validation message as soon as the user edits it.
document.addEventListener('input', event => {
  if (event.target.matches('input, select, textarea')) {
    event.target.setCustomValidity('');
  }
});
document.addEventListener('change', event => {
  if (event.target.matches('input, select, textarea')) {
    event.target.setCustomValidity('');
  }
});
