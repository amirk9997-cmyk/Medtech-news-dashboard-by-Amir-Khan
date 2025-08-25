(async function(){
  const scope = document.body.dataset.scope; // "global" or "india"
  const dataUrl = scope === 'india' ? 'data/india.json' : 'data/global.json';

  const grid = document.getElementById('grid');
  const tpl = document.getElementById('card-template');
  const chips = Array.from(document.querySelectorAll('.chip'));
  const searchInput = document.getElementById('searchInput');

  let items = [];
  try {
    const res = await fetch(dataUrl, {cache:'no-store'});
    items = await res.json();
  } catch (e) {
    console.error('Failed to load data', e);
    items = [];
  }

  let state = { filter:'all', q:'' };

  function render(){
    grid.innerHTML = '';
    const q = state.q.trim().toLowerCase();
    const filtered = items.filter(it => {
      const catOK = state.filter === 'all' || it.category === state.filter;
      const text = `${it.title} ${it.summary} ${it.source}`.toLowerCase();
      const qOK = !q || text.includes(q);
      return catOK && qOK;
    });

    filtered.forEach(it => {
      const node = tpl.content.cloneNode(true);
      const card = node.querySelector('.card');
      const imgA = node.querySelector('.image-link');
      const img = node.querySelector('.thumb');
      const cat = node.querySelector('.category');
      const date = node.querySelector('.date');
      const title = node.querySelector('.title');
      const sum = node.querySelector('.summary');
      const src = node.querySelector('.source');
      const read = node.querySelector('.readmore');

      img.src = it.image || 'https://picsum.photos/640/360?grayscale';
      img.alt = it.title;
      imgA.href = it.link;
      cat.textContent = it.category;
      date.textContent = new Date(it.published_at).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'2-digit'});
      title.textContent = it.title;
      sum.textContent = it.summary.length > 300 ? it.summary.slice(0,297)+'…' : it.summary;
      src.textContent = it.source;
      read.href = it.link;

      grid.appendChild(node);
    });
  }

  chips.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('active'));
      btn.classList.add('active');
      state.filter = btn.dataset.filter;
      render();
    });
  });

  searchInput.addEventListener('input', ()=>{
    state.q = searchInput.value;
    render();
  });

  render();
})();
