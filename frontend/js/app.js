document.addEventListener('DOMContentLoaded', () => {
  const itemsList = document.getElementById('itemsList');
  const addForm = document.getElementById('addForm');
  const nameInput = document.getElementById('nameInput');

  async function loadItems() {
    try {
      const res = await fetch('/api/items');
      const items = await res.json();
      itemsList.innerHTML = '';
      items.forEach(it => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${it.id} — ${it.name}`;
        itemsList.appendChild(li);
      });
    } catch (err) {
      console.error('Erro ao carregar items', err);
    }
  }

  addForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const name = nameInput.value.trim();
    if (!name) return;
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!res.ok) throw new Error('Erro no POST');
      nameInput.value = '';
      await loadItems();
    } catch (err) {
      console.error('Erro ao adicionar item', err);
    }
  });

  loadItems();
});
