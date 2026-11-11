'use strict';

const designs = [
  { id:'anime-01', title:'Neon Ronin', category:'Anime', tags:['neon','samurai','japan'], subtitle:'ANIME SERIES', art:'art-ronin', edition:'01 / 06' },
  { id:'lux-01', title:'Obsidian', category:'Luxury', tags:['black','minimal','titanium'], subtitle:'PURE MATERIAL', art:'art-obsidian', edition:'02 / 06' },
  { id:'art-01', title:'Sakura Bloom', category:'Art', tags:['pink','japan','floral'], subtitle:'BOTANICAL STUDY', art:'art-sakura', edition:'03 / 06' },
  { id:'cyber-01', title:'Night Protocol', category:'Cyberpunk', tags:['neon','grid','future'], subtitle:'AFTER DARK', art:'art-cyber', edition:'04 / 06' },
  { id:'cinema-01', title:'Noir Frame', category:'Cinema', tags:['film','monochrome','dark'], subtitle:'CINEMA ARCHIVE', art:'art-noir', edition:'05 / 06' },
  { id:'auto-01', title:'Redline', category:'Automotive', tags:['racing','speed','motorsport'], subtitle:'MOTOR CLUB', art:'art-racing', edition:'06 / 06' },
];

let storedFavorites = [];
try { storedFavorites = JSON.parse(localStorage.getItem('card-studio-favorites') || '[]'); } catch (_) {}
const state = { category:'All', query:'', selectedId:'anime-01', favorites:Array.isArray(storedFavorites) ? storedFavorites : [], customImage:null, customBlob:null, customName:'Your artwork', zoom:100, brightness:100, position:50 };
const $ = (id) => document.getElementById(id);
const grid = $('designGrid');
const heroCard = $('heroCard');
const editorCard = $('editorCard');

function getSelected() { return designs.find((item) => item.id === state.selectedId) || designs[0]; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
function cardMarkup(design, role = 'gallery') {
  const title = escapeHtml(design.title).toUpperCase().replace(' ', '<br>');
  const titleId = role === 'editor' ? 'editorArtTitle' : role === 'hero' ? 'heroArtTitle' : '';
  return `<div class="card-grain"></div><div class="card-topline"><span class="card-brand">CARD STUDIO</span><span class="card-edition">${role === 'editor' ? 'CUSTOM' : design.edition}</span></div><div class="art-title" ${titleId ? `id="${titleId}"` : ''}>${title}</div><div class="card-chip" aria-label="Decorative chip"><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="card-bottom"><span>${escapeHtml(role === 'editor' ? 'CUSTOM ARTWORK' : design.subtitle || 'CUSTOM ARTWORK')}</span><span class="card-orbit">✳</span></div>`;
}
function setCardAppearance(element, design, role = 'gallery') {
  element.className = `bank-card ${design.art || ''}`;
  element.innerHTML = cardMarkup(design, role);
  if (state.customImage && (element === editorCard || element === heroCard)) {
    element.style.setProperty('--art-bg', `linear-gradient(#0002,#0002), url("${state.customImage}") center ${state.position}% / ${state.zoom}% auto no-repeat`);
    element.style.filter = `brightness(${state.brightness}%)`;
  } else {
    element.style.removeProperty('--art-bg');
    element.style.filter = '';
  }
}
function renderHero() {
  const design = state.customImage ? { title:state.customName, category:'CUSTOM', art:'', subtitle:'CUSTOM ARTWORK', edition:'CUSTOM' } : getSelected();
  setCardAppearance(heroCard, design, 'hero');
  $('heroArtTitle').innerHTML = escapeHtml(design.title).toUpperCase().replace(' ', '<br>');
  $('heroArtCategory').textContent = design.subtitle || 'CUSTOM ARTWORK';
  $('heroCaption').textContent = design.title.toUpperCase();
}
function renderGrid() {
  const visible = window.CardCatalog.filterDesigns(designs, { category:state.category, query:state.query });
  $('resultCount').textContent = `${String(visible.length).padStart(2,'0')} DESIGNS`;
  grid.innerHTML = visible.map((design) => `<article class="design-card" data-id="${design.id}" tabindex="0" aria-label="Select ${escapeHtml(design.title)}"><div class="design-thumb"><div class="bank-card ${design.art}">${cardMarkup(design)}</div><button class="heart-button ${state.favorites.includes(design.id) ? 'saved' : ''}" data-favorite="${design.id}" aria-label="${state.favorites.includes(design.id) ? 'Remove from' : 'Add to'} favorites">${state.favorites.includes(design.id) ? '♥' : '♡'}</button></div><div class="design-meta"><div><div class="design-title">${escapeHtml(design.title)}</div><div class="design-subtitle">${escapeHtml(design.category.toUpperCase())} · ${escapeHtml(design.subtitle)}</div></div><span class="design-arrow">↗</span></div></article>`).join('');
  $('emptyState').classList.toggle('hidden', visible.length !== 0);
}
function renderFavorites() {
  const saved = designs.filter((design) => state.favorites.includes(design.id));
  $('favoriteCount').textContent = `${String(saved.length).padStart(2,'0')} SAVED`;
  $('savedList').innerHTML = saved.length ? saved.map((design) => `<div class="saved-item"><div class="saved-swatch ${design.art}"></div><div><div class="saved-name">${escapeHtml(design.title)}</div><div class="saved-category">${escapeHtml(design.category.toUpperCase())}</div></div><button class="saved-remove" data-remove="${design.id}" aria-label="Remove ${escapeHtml(design.title)}">×</button></div>`).join('') : '<div class="saved-empty">Tap the heart on any design to save it here.</div>';
}
function selectDesign(id) {
  const found = designs.find((design) => design.id === id);
  if (!found) return;
  state.selectedId = id; if (state.customImage) URL.revokeObjectURL(state.customImage); state.customImage = null; state.customBlob = null;
  renderHero(); renderGrid();
}
function toggleFavorite(id) {
  state.favorites = window.CardCatalog.toggleFavorite(state.favorites, id);
  try { localStorage.setItem('card-studio-favorites', JSON.stringify(state.favorites)); } catch (_) {}
  renderGrid(); renderFavorites();
}
function exportCardPng() {
  const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 757;
  const ctx = canvas.getContext('2d'); const design = getSelected();
  const radius = 54; ctx.beginPath(); ctx.roundRect(0, 0, canvas.width, canvas.height, radius); ctx.clip();
  const gradients = {
    'art-ronin':['#11151e','#7c344c'], 'art-obsidian':['#08090b','#777777'], 'art-sakura':['#552c4b','#f1c4b5'],
    'art-cyber':['#071a28','#5b1d5b'], 'art-noir':['#111313','#77776d'], 'art-racing':['#211114','#ed6b45']
  };
  if (state.customImage) {
    const image = new Image(); image.onload = () => drawImage(image); image.src = state.customImage;
  } else {
    const colors = gradients[design.art] || ['#171923','#51566a']; const gradient = ctx.createLinearGradient(0, 0, 1200, 757);
    gradient.addColorStop(0, colors[0]); gradient.addColorStop(1, colors[1]); ctx.fillStyle = gradient; ctx.fillRect(0,0,1200,757); drawOverlay();
  }
  function drawImage(image) { ctx.save(); const scale = Math.max(1200/image.width,757/image.height) * (state.zoom/100); const w=image.width*scale,h=image.height*scale; ctx.filter=`brightness(${state.brightness}%)`; ctx.drawImage(image,(1200-w)/2,(757-h)*(state.position/100),w,h); ctx.restore(); drawOverlay(); }
  function drawOverlay() {
    const shade=ctx.createLinearGradient(0,0,1200,757); shade.addColorStop(0,'#00000033'); shade.addColorStop(1,'#00000022'); ctx.fillStyle=shade; ctx.fillRect(0,0,1200,757);
    ctx.fillStyle='#ffffff'; ctx.font='500 27px Arial'; ctx.fillText('CARD STUDIO',70,82); ctx.font='22px Arial'; ctx.fillText('CUSTOM ARTWORK',1010,82);
    ctx.font='bold 82px Arial'; const title=(state.customImage?state.customName:design.title).toUpperCase().split(' '); title.slice(0,2).forEach((word,i)=>ctx.fillText(word,70,390+i*86));
    ctx.fillStyle='#d6c89c'; ctx.strokeStyle='#786e53'; ctx.lineWidth=5; ctx.beginPath(); ctx.roundRect(70,590,130,96,15); ctx.fill(); ctx.stroke();
    ctx.strokeStyle='#6b624b'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(113,590);ctx.lineTo(113,686);ctx.moveTo(157,590);ctx.lineTo(157,686);ctx.moveTo(70,638);ctx.lineTo(200,638);ctx.stroke();
    canvas.toBlob((blob)=>{if(!blob)return;const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='card-studio-artwork.png';link.click();URL.revokeObjectURL(url);showToast('PNG exported');},'image/png');
  }
}

function showToast(message) {
  const toast = $('toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2400);
}
function openEditor() {
  $('editorModal').classList.remove('hidden'); document.body.style.overflow = 'hidden';
  const design = getSelected();
  setCardAppearance(editorCard, state.customImage ? {title:state.customName,art:''} : design, 'editor');
  $('editorArtTitle').innerHTML = escapeHtml(state.customImage ? state.customName : design.title).toUpperCase().replace(' ', '<br>');
}
function closeEditor() { $('editorModal').classList.add('hidden'); document.body.style.overflow = ''; }
function updateEditor() {
  state.zoom = Number($('zoomRange').value); state.brightness = Number($('brightnessRange').value); state.position = Number($('positionRange').value);
  $('zoomValue').textContent = `${state.zoom}%`; $('brightnessValue').textContent = `${state.brightness}%`; $('positionValue').textContent = `${state.position}%`;
  setCardAppearance(editorCard, {title:state.customName,art:getSelected().art}, 'editor');
}

$('categoryFilters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]'); if (!button) return;
  state.category = button.dataset.category;
  document.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.toggle('selected', chip === button));
  renderGrid();
});
$('searchInput').addEventListener('input', (event) => { state.query = event.target.value; renderGrid(); });
grid.addEventListener('click', (event) => {
  const favorite = event.target.closest('[data-favorite]');
  if (favorite) { event.stopPropagation(); toggleFavorite(favorite.dataset.favorite); return; }
  const card = event.target.closest('[data-id]'); if (card) { selectDesign(card.dataset.id); showToast(`${getSelected().title} selected`); }
});
grid.addEventListener('keydown', (event) => { if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-id]')) selectDesign(event.target.dataset.id); });
$('savedList').addEventListener('click', (event) => { const button = event.target.closest('[data-remove]'); if (button) toggleFavorite(button.dataset.remove); });
$('clearFilters').addEventListener('click', () => { state.category='All'; state.query=''; $('searchInput').value=''; document.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.toggle('selected', chip.dataset.category === 'All')); renderGrid(); });
$('openEditorTop').addEventListener('click', openEditor);
$('closeEditor').addEventListener('click', closeEditor);
$('editorModal').addEventListener('click', (event) => { if (event.target === $('editorModal')) closeEditor(); });
$('imageUpload').addEventListener('change', (event) => {
  const file = event.target.files && event.target.files[0]; if (!file) return;
  const validationError = window.CardPersistence.validateArtworkFile(file);
  if (validationError) { showToast(validationError); event.target.value = ''; return; }
  if (state.customImage) URL.revokeObjectURL(state.customImage);
  state.customBlob = file; state.customImage = URL.createObjectURL(file); state.customName = window.CardPersistence.artworkName(file.name);
  updateEditor(); $('editorArtTitle').textContent = state.customName.toUpperCase(); showToast('Image loaded on this device');
});
['zoomRange','brightnessRange','positionRange'].forEach((id) => $(id).addEventListener('input', updateEditor));
$('resetEditor').addEventListener('click', () => {
  $('zoomRange').value=100; $('brightnessRange').value=100; $('positionRange').value=50;
  if (state.customImage) URL.revokeObjectURL(state.customImage); state.customImage=null; state.customBlob=null; state.zoom=100; state.brightness=100; state.position=50; updateEditor();
  const design=getSelected(); setCardAppearance(editorCard,design); $('editorArtTitle').innerHTML=escapeHtml(design.title).toUpperCase().replace(' ','<br>'); showToast('Editor reset');
});
$('exportPng').addEventListener('click', exportCardPng);
$('saveCustom').addEventListener('click', async () => {
  if (!state.customImage || !state.customBlob) { showToast('Upload an image to create custom artwork'); return; }
  try {
    await window.CardPersistence.saveArtwork({ blob:state.customBlob, name:state.customName, zoom:state.zoom, brightness:state.brightness, position:state.position });
    renderHero(); closeEditor(); showToast('Artwork saved on this device');
  } catch (error) {
    showToast(error.message || 'Could not save artwork on this device');
  }
});
$('profileButton').addEventListener('click', () => showToast('Personal accounts are coming in a later build'));
document.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase()==='k') { event.preventDefault(); $('searchInput').focus(); } if (event.key==='Escape') closeEditor(); });

async function initializeApp() {
  try {
    const savedArtwork = await window.CardPersistence.loadArtwork();
    if (savedArtwork && savedArtwork.blob) {
      state.customBlob = savedArtwork.blob;
      state.customImage = URL.createObjectURL(savedArtwork.blob);
      state.customName = savedArtwork.name || 'Your artwork';
      state.zoom = savedArtwork.zoom || 100; state.brightness = savedArtwork.brightness || 100; state.position = savedArtwork.position ?? 50;
      $('zoomRange').value = state.zoom; $('brightnessRange').value = state.brightness; $('positionRange').value = state.position;
      $('zoomValue').textContent = `${state.zoom}%`; $('brightnessValue').textContent = `${state.brightness}%`; $('positionValue').textContent = `${state.position}%`;
    }
  } catch (_) { /* Browsers without IndexedDB can still use the editor and PNG export. */ }
  renderHero(); renderGrid(); renderFavorites();
}
initializeApp();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
