'use strict';

const designs = [
  { id:'anime-01', title:'Neon Ronin', category:'Anime', tags:['neon','samurai','japan'], subtitle:'ANIME SERIES', art:'art-ronin', edition:'01 / 06', image:'https://images.unsplash.com/photo-1553128992-241b0d2ff982?auto=format&fit=crop&w=1200&q=80', imageSource:'Unsplash' },
  { id:'lux-01', title:'Obsidian', category:'Luxury', tags:['black','minimal','titanium'], subtitle:'PURE MATERIAL', art:'art-obsidian', edition:'02 / 06', image:'https://images.unsplash.com/photo-1741298856762-1ff2f1204bc8?auto=format&fit=crop&w=1200&q=80', imageSource:'Unsplash' },
  { id:'art-01', title:'Sakura Bloom', category:'Art', tags:['pink','japan','floral'], subtitle:'BOTANICAL STUDY', art:'art-sakura', edition:'03 / 06', image:'https://images.unsplash.com/photo-1560147000-40ee5f2bd85c?auto=format&fit=crop&w=1200&q=80', imageSource:'Unsplash' },
  { id:'cyber-01', title:'Night Protocol', category:'Cyberpunk', tags:['neon','grid','future'], subtitle:'AFTER DARK', art:'art-cyber', edition:'04 / 06', image:'https://images.unsplash.com/photo-1553128992-241b0d2ff982?auto=format&fit=crop&w=1200&q=80', imageSource:'Unsplash' },
  { id:'cinema-01', title:'Noir Frame', category:'Cinema', tags:['film','monochrome','dark'], subtitle:'CINEMA ARCHIVE', art:'art-noir', edition:'05 / 06', image:'https://images.unsplash.com/photo-1686343916755-9b411972c06e?auto=format&fit=crop&w=1200&q=80', imageSource:'Unsplash' },
  { id:'auto-01', title:'Redline', category:'Automotive', tags:['racing','speed','motorsport'], subtitle:'MOTOR CLUB', art:'art-racing', edition:'06 / 06', image:'https://images.unsplash.com/photo-1686440778198-731426f81e0d?auto=format&fit=crop&w=1200&q=80', imageSource:'Unsplash' },
];

let storedFavorites = [];
try { storedFavorites = JSON.parse(localStorage.getItem('card-studio-favorites') || '[]'); } catch (_) {}
const state = { category:'All', query:'', selectedId:'anime-01', favorites:Array.isArray(storedFavorites) ? storedFavorites : [], customImage:null, customBlob:null, customName:'Your artwork', zoom:100, brightness:100, position:50, quizStickers:[], quizFinish:'gloss' };
const $ = (id) => document.getElementById(id);
const grid = $('designGrid');
const heroCard = $('heroCard');
const editorCard = $('editorCard');
const walletCard = $('walletCard');

function getSelected() { return designs.find((item) => item.id === state.selectedId) || designs[0]; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
function cardMarkup(design, role = 'gallery') {
  const title = escapeHtml(design.title).toUpperCase().replace(' ', '<br>');
  const titleId = role === 'editor' ? 'editorArtTitle' : role === 'hero' ? 'heroArtTitle' : '';
  const subtitleId = role === 'hero' ? 'heroArtCategory' : '';
  const imageMarkup = design.image ? `<img class="preset-art-image" src="${escapeHtml(design.image)}" alt="" loading="lazy" decoding="async" />` : '';
  return `${imageMarkup}<div class="card-grain"></div><div class="card-topline"><span class="card-brand">CARD STUDIO</span><span class="card-edition">${role === 'editor' ? 'CUSTOM' : design.edition}</span></div><div class="art-title" ${titleId ? `id="${titleId}"` : ''}>${title}</div><div class="card-chip" aria-label="Decorative chip"><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="card-bottom"><span ${subtitleId ? `id="${subtitleId}"` : ''}>${escapeHtml(role === 'editor' ? 'CUSTOM ARTWORK' : design.subtitle || 'CUSTOM ARTWORK')}</span><span class="card-orbit">✳</span></div>`;
}
function setCardAppearance(element, design, role = 'gallery') {
  const roleClass = element === editorCard ? 'editor-card' : element === walletCard ? 'wallet-card' : '';
  element.className = `bank-card ${design.art || ''} ${roleClass}`.trim();
  element.innerHTML = cardMarkup(design, role);
  if (element === editorCard || element === heroCard || element === walletCard) {
    const stickers = state.quizStickers.map((sticker, index) => `<span class="quiz-sticker sticker-${index + 1}">${escapeHtml(sticker)}</span>`).join('');
    const finish = state.quizFinish && state.quizFinish !== 'gloss' ? `<div class="card-finish-overlay finish-${state.quizFinish}"></div>` : '';
    if (stickers || finish) element.insertAdjacentHTML('beforeend', `<div class="quiz-stickers">${stickers}</div>${finish}`);
  }
  if (state.customImage && (element === editorCard || element === heroCard || element === walletCard)) {
    const artwork = document.createElement('img');
    artwork.className = 'custom-art-image';
    artwork.alt = state.customName || 'Uploaded artwork';
    artwork.src = state.customImage;
    artwork.style.objectPosition = `center ${state.position}%`;
    artwork.style.transform = `scale(${state.zoom / 100})`;
    artwork.style.filter = `brightness(${state.brightness}%)`;
    element.prepend(artwork);
    element.style.filter = '';
  } else {
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
  grid.innerHTML = visible.map((design) => `<article class="design-card" data-id="${design.id}" tabindex="0" aria-label="Select ${escapeHtml(design.title)}"><div class="design-thumb"><div class="bank-card ${design.art}">${cardMarkup(design)}</div><button class="heart-button ${state.favorites.includes(design.id) ? 'saved' : ''}" data-favorite="${design.id}" aria-label="${state.favorites.includes(design.id) ? 'Remove from' : 'Add to'} favorites">${state.favorites.includes(design.id) ? '♥' : '♡'}</button></div><div class="design-meta"><div><div class="design-title">${escapeHtml(design.title)}</div><div class="design-subtitle">${escapeHtml(design.category.toUpperCase())} · ${escapeHtml(design.subtitle)}</div><div class="design-source">IMAGE · ${escapeHtml(design.imageSource || 'CARD STUDIO')}</div></div><span class="design-arrow">↗</span></div></article>`).join('');
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
function openWalletPreview() {
  const design = state.customImage ? { title:state.customName, art:'', subtitle:'CUSTOM ARTWORK', edition:'CUSTOM' } : getSelected();
  const preview = window.CardWallet.createWalletPreviewState({ title:design.title });
  setCardAppearance(walletCard, design, 'wallet');
  $('walletPreviewName').textContent = preview.title;
  $('walletModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeWalletPreview() { $('walletModal').classList.add('hidden'); document.body.style.overflow = 'hidden'; }

let quizState = null;
const quizStickers = ['✨', '🌸', '🔥', '💎', '🦋', '⭐', '🍀', '🎀', '😎', '💖'];
function quizPreviewMarkup(design) {
  const previewDesign = state.customImage ? { ...design, title:state.customName, subtitle:'CUSTOM ARTWORK', edition:'CUSTOM', art:'', image:null } : design;
  const image = state.customImage ? `<img class="custom-art-image" src="${escapeHtml(state.customImage)}" alt="${escapeHtml(state.customName)}" style="object-position:center ${state.position}%;transform:scale(${state.zoom / 100});filter:brightness(${state.brightness}%);" />` : '';
  const stickers = (quizState?.stickers || []).map((sticker, index) => `<span class="quiz-sticker sticker-${index + 1}">${sticker}</span>`).join('');
  return `<div class="quiz-preview bank-card ${previewDesign.art || ''}">${image}${cardMarkup(previewDesign)}<div class="quiz-stickers">${stickers}</div></div>`;
}
function renderQuiz() {
  if (!quizState) return;
  const design = designs.find((item) => item.id === quizState.selectedId) || designs[0];
  $('quizProgress').textContent = `${quizState.step} / 3`;
  $('quizProgressBar').style.width = `${(quizState.step / 3) * 100}%`;
  const preview = quizPreviewMarkup(design);
  if (quizState.step === 1) {
    $('quizStepContent').innerHTML = `<div class="quiz-copy"><div class="eyebrow">STEP 01</div><h2 id="quizTitle">Pick your <em>design.</em></h2><p>Choose a starting point. You can still make it yours in the next step.</p></div>${preview}<div class="quiz-design-options" role="radiogroup" aria-label="Pick a design">${designs.map((item) => `<button class="quiz-design-option ${item.id === quizState.selectedId ? 'selected' : ''}" data-quiz-action="design" data-id="${item.id}" aria-pressed="${item.id === quizState.selectedId}"><span class="quiz-option-swatch ${item.art}"></span><span>${escapeHtml(item.title)}</span></button>`).join('')}</div><button class="button button-primary quiz-next" data-quiz-action="next">Continue <span>→</span></button>`;
  } else if (quizState.step === 2) {
    $('quizStepContent').innerHTML = `<div class="quiz-copy"><div class="eyebrow">STEP 02</div><h2 id="quizTitle">Make it <em>yours.</em></h2><p>Add a name, photo, or both.</p></div>${preview}<label class="quiz-name-label" for="quizName">Your name<input id="quizName" type="text" maxlength="24" value="${escapeHtml(quizState.name)}" placeholder="Add your name" /></label><label class="upload-zone quiz-upload" for="quizImageUpload"><span class="upload-symbol">＋</span><strong>${state.customImage ? 'Change photo' : 'Add photo'}</strong><small>JPG, PNG, WEBP or iPhone HEIC · local only</small><input id="quizImageUpload" type="file" accept=".jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif" /></label><div class="quiz-choice-group"><span class="quiz-choice-label">Font</span><div class="quiz-choice-row">${[['bold','Bold'],['classic','Classic'],['script','Script'],['mono','Mono']].map(([value,label]) => `<button class="quiz-choice ${quizState.font === value ? 'selected' : ''}" data-quiz-action="font" data-value="${value}">${label}</button>`).join('')}</div></div><div class="quiz-choice-group"><span class="quiz-choice-label">Color</span><div class="quiz-choice-row">${window.CardQuiz.QUIZ_COLORS.map((value) => `<button class="quiz-color ${quizState.color === value ? 'selected' : ''}" style="--quiz-color:${value}" data-quiz-action="color" data-value="${value}" aria-label="${value}"></button>`).join('')}</div></div><button class="button button-primary quiz-next" data-quiz-action="next">Continue <span>→</span></button>`;
    $('quizName').addEventListener('input', (event) => { quizState = window.CardQuiz.setQuizName(quizState, event.target.value); });
  } else {
    $('quizStepContent').innerHTML = `<div class="quiz-copy"><div class="eyebrow">STEP 03</div><h2 id="quizTitle">The final <em>touch.</em></h2><p>Choose up to three stickers and a finish for your preview.</p></div>${preview}<div class="quiz-choice-group"><span class="quiz-choice-label">Add a sticker</span><div class="quiz-sticker-grid">${quizStickers.map((sticker) => `<button class="quiz-sticker-button ${quizState.stickers.includes(sticker) ? 'selected' : ''}" data-quiz-action="sticker" data-value="${sticker}" aria-label="${sticker} sticker">${sticker}</button>`).join('')}</div></div><div class="quiz-choice-group"><span class="quiz-choice-label">Finish</span><div class="quiz-finish-row">${[['gloss','Gloss','Shiny highlight'],['matte','Matte','Soft, no shine'],['holo','Holo','Rainbow sheen']].map(([value,label,caption]) => `<button class="quiz-finish ${quizState.finish === value ? 'selected' : ''}" data-quiz-action="finish" data-value="${value}"><strong>${label}</strong><small>${caption}</small></button>`).join('')}</div></div><button class="button button-primary quiz-next" data-quiz-action="open-editor">Open editor <span>↗</span></button>`;
  }
}
function openQuiz() { quizState = window.CardQuiz.createQuizState(state.selectedId); $('quizModal').classList.remove('hidden'); document.body.style.overflow = 'hidden'; renderQuiz(); }
function closeQuiz() { $('quizModal').classList.add('hidden'); document.body.style.overflow = ''; }
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
$('openWalletPreview').addEventListener('click', openWalletPreview);
$('closeWalletPreview').addEventListener('click', closeWalletPreview);
$('walletBackToEditor').addEventListener('click', closeWalletPreview);
$('walletModal').addEventListener('click', (event) => { if (event.target === $('walletModal')) closeWalletPreview(); });
editorCard.addEventListener('dblclick', openWalletPreview);
function handleArtworkFile(file, input) {
  if (!file) return;
  const validationError = window.CardPersistence.validateArtworkFile(file);
  if (validationError) { showToast(validationError); input.value = ''; return; }
  const nextUrl = URL.createObjectURL(file);
  const probe = new Image();
  probe.onload = () => {
    if (state.customImage) URL.revokeObjectURL(state.customImage);
    state.customBlob = file;
    state.customImage = nextUrl;
    state.customName = window.CardPersistence.artworkName(file.name);
    updateEditor();
    $('editorArtTitle').textContent = state.customName.toUpperCase();
    if (quizState) renderQuiz();
    showToast('Image loaded on this device');
  };
  probe.onerror = () => {
    URL.revokeObjectURL(nextUrl);
    showToast('This photo format could not be opened. Try sharing it as JPEG.');
    input.value = '';
  };
  probe.src = nextUrl;
}
$('imageUpload').addEventListener('change', (event) => handleArtworkFile(event.target.files && event.target.files[0], event.target));
$('openEditorTop').removeEventListener('click', openEditor);
$('openEditorTop').addEventListener('click', openQuiz);
$('closeQuiz').addEventListener('click', closeQuiz);
$('quizModal').addEventListener('click', (event) => { if (event.target === $('quizModal')) closeQuiz(); });
$('quizBack').addEventListener('click', () => { if (!quizState || quizState.step === 1) closeQuiz(); else { quizState = window.CardQuiz.setQuizStep(quizState, quizState.step - 1); renderQuiz(); } });
$('quizStepContent').addEventListener('click', (event) => {
  const action = event.target.closest('[data-quiz-action]'); if (!action) return;
  const type = action.dataset.quizAction;
  if (type === 'design') quizState = window.CardQuiz.selectQuizDesign(quizState, action.dataset.id);
  if (type === 'font' || type === 'color' || type === 'finish') quizState = window.CardQuiz.setQuizOption(quizState, type, action.dataset.value);
  if (type === 'sticker') quizState = window.CardQuiz.toggleQuizSticker(quizState, action.dataset.value);
  if (type === 'next') quizState = window.CardQuiz.setQuizStep(quizState, quizState.step + 1);
  if (type === 'open-editor') { state.selectedId = quizState.selectedId; state.quizStickers = [...quizState.stickers]; state.quizFinish = quizState.finish; if (quizState.name) state.customName = quizState.name; renderHero(); closeQuiz(); openEditor(); }
  renderQuiz();
});
$('quizStepContent').addEventListener('change', (event) => { if (event.target.id === 'quizImageUpload') handleArtworkFile(event.target.files && event.target.files[0], event.target); });
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
document.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase()==='k') { event.preventDefault(); $('searchInput').focus(); } if (event.key==='Escape') { if (!$('walletModal').classList.contains('hidden')) closeWalletPreview(); else closeEditor(); } });

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
