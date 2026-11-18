(() => {
  const KEY = 'letters-never-sent-private-draft-v1';
  const toField = document.getElementById('letter-to');
  const bodyField = document.getElementById('letter-body');
  const saveState = document.getElementById('save-state');
  const dialog = document.getElementById('delete-dialog');
  const toast = document.getElementById('toast');
  let timer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(timer);
    timer = window.setTimeout(() => toast.classList.remove('visible'), 2800);
  }

  function save() {
    try {
      const draft = { to: toField.value, body: bodyField.value };
      if (!draft.to && !draft.body) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, JSON.stringify(draft));
      saveState.textContent = 'Saved on this device';
    } catch (error) {
      saveState.textContent = 'This browser could not save';
    }
  }

  try {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      const draft = JSON.parse(saved);
      toField.value = typeof draft.to === 'string' ? draft.to : '';
      bodyField.value = typeof draft.body === 'string' ? draft.body : '';
      if (toField.value || bodyField.value) saveState.textContent = 'Draft restored from this device';
    }
  } catch (error) {
    saveState.textContent = 'Local storage unavailable';
  }

  let debounce;
  [toField, bodyField].forEach(field => field.addEventListener('input', () => {
    saveState.textContent = 'Saving…';
    window.clearTimeout(debounce);
    debounce = window.setTimeout(save, 250);
  }));

  document.getElementById('delete-draft').addEventListener('click', () => dialog.showModal());
  document.getElementById('save-draft').addEventListener('click', () => {
    window.clearTimeout(debounce);
    save();
    if (saveState.textContent === 'Saved on this device') showToast('Draft saved in this browser.');
    else showToast('This browser could not save the draft.');
  });
  document.getElementById('confirm-delete').addEventListener('click', event => {
    event.preventDefault();
    try { localStorage.removeItem(KEY); } catch (error) { /* Fields are cleared even when storage is unavailable. */ }
    toField.value = '';
    bodyField.value = '';
    saveState.textContent = 'Draft deleted';
    dialog.close();
    showToast('Your draft has been deleted from this browser.');
  });

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
})();
