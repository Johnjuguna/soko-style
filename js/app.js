/**
 * SOKO STYLE – Main Application
 * Cart, Products, Hero, Modals, Scroll, Filters
 */

/* ── DEMO PRODUCTS ─────────────────────────────────────────── */
const DEMO_PRODUCTS = [
  { id:'p1',  name:'Floral Maxi Dress',         category:'women',      price:3200, oldPrice:4500, image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format', sizes:['XS','S','M','L','XL'], isNew:true,  isSale:true,  isHot:false, tag:'New' },
  { id:'p2',  name:'Linen Blazer – Navy',        category:'men',        price:5800, oldPrice:null, image:'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&auto=format', sizes:['S','M','L','XL','XXL'], isNew:true,  isSale:false, isHot:true,  tag:'Hot' },
  { id:'p3',  name:'Kitenge Wrap Dress',         category:'african',    price:4200, oldPrice:5500, image:'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&auto=format', sizes:['S','M','L','XL'],        isNew:true,  isSale:true,  isHot:false, tag:'Sale' },
  { id:'p4',  name:'High-Waist Jeans',           category:'women',      price:2800, oldPrice:null, image:'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=400&auto=format', sizes:['XS','S','M','L'],        isNew:true,  isSale:false, isHot:false, tag:'New' },
  { id:'p5',  name:'African Print Shirt',        category:'men',        price:1900, oldPrice:2800, image:'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&auto=format', sizes:['S','M','L','XL'],        isNew:false, isSale:true,  isHot:true,  tag:'Sale' },
  { id:'p6',  name:'Leather Tote Bag',           category:'accessories',price:3500, oldPrice:null, image:'https://images.unsplash.com/photo-1573408301185-9519f94815d8?w=400&auto=format', sizes:['One Size'],              isNew:true,  isSale:false, isHot:false, tag:'New' },
  { id:'p7',  name:' Ankara Palazzo Pants',       category:'african',    price:3100, oldPrice:4000, image:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&auto=format', sizes:['S','M','L','XL'],        isNew:false, isSale:true,  isHot:true,  tag:'Hot' },
  { id:'p8',  name:'Classic White Sneakers',     category:'shoes',      price:4500, oldPrice:6000, image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format', sizes:['37','38','39','40','41','42'], isNew:false, isSale:true, isHot:false, tag:'Sale' },
  { id:'p9',  name:'Silk Blouse – Ivory',        category:'women',      price:2400, oldPrice:null, image:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format', sizes:['XS','S','M','L'],        isNew:true,  isSale:false, isHot:false, tag:'New' },
  { id:'p10', name:'Chino Trousers – Olive',     category:'men',        price:3200, oldPrice:4200, image:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&auto=format', sizes:['28','30','32','34','36'], isNew:false, isSale:true,  isHot:false, tag:'Sale' },
  { id:'p11', name:'Kids Ankara Romper',         category:'kids',       price:1500, oldPrice:null, image:'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&auto=format', sizes:['0-6m','6-12m','1yr','2yr'], isNew:true, isSale:false, isHot:false, tag:'New' },
  { id:'p12', name:'Beaded Maasai Necklace',     category:'accessories',price:1200, oldPrice:1800, image:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format', sizes:['One Size'],              isNew:false, isSale:true,  isHot:true,  tag:'Hot' },
];

const SALE_PRODUCTS = DEMO_PRODUCTS.filter(p => p.isSale);

/* ── STATE ─────────────────────────────────────────────────── */
let cart      = JSON.parse(localStorage.getItem('soko_cart') || '[]');
let wishlist  = JSON.parse(localStorage.getItem('soko_wish') || '[]');
let allProds  = [...DEMO_PRODUCTS];
let filtered  = [...allProds];
let displayed = 8;
const PER_PAGE = 4;

/* ── UTILS ─────────────────────────────────────────────────── */
function fmt(n)    { return n.toLocaleString('en-KE'); }
function saveCart(){ localStorage.setItem('soko_cart', JSON.stringify(cart)); }
function saveWish(){ localStorage.setItem('soko_wish', JSON.stringify(wishlist)); }

function showToast(msg, color = '#2C2C2C') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── PRODUCT CARD HTML ──────────────────────────────────────── */
function productCardHTML(p, showSaleBadge = false) {
  const savedPct = p.oldPrice ? Math.round((1 - p.price/p.oldPrice) * 100) : 0;
  const inWish   = wishlist.some(w => w.id === p.id);

  return `
  <div class="product-card" data-id="${p.id}" data-cat="${p.category}">
    <div class="product-img-wrap">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
      <div class="product-badges">
        ${p.isNew  ? '<span class="badge-pill badge-new">NEW</span>' : ''}
        ${(p.isSale || showSaleBadge) ? `<span class="badge-pill badge-sale">-${savedPct}%</span>` : ''}
        ${p.isHot  ? '<span class="badge-pill badge-hot">🔥 HOT</span>' : ''}
      </div>
      <div class="product-actions">
        <button class="product-action-btn wishlist-toggle" data-id="${p.id}" title="Wishlist">
          ${inWish ? '❤️' : '🤍'}
        </button>
        <button class="product-action-btn quick-view" data-id="${p.id}" title="Quick View">👁</button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-category">${p.category.replace('-', ' ')}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">
        <span class="price-current">KSh ${fmt(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">KSh ${fmt(p.oldPrice)}</span>` : ''}
        ${savedPct   ? `<span class="price-save">Save ${savedPct}%</span>` : ''}
      </div>
      <div class="product-sizes">
        ${(p.sizes || []).slice(0,4).map(s => `<span class="size-chip">${s}</span>`).join('')}
      </div>
      <button class="add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
    </div>
  </div>`;
}

/* ── RENDER GRIDS ───────────────────────────────────────────── */
function renderProducts() {
  const grid  = document.getElementById('productsGrid');
  const slice = filtered.slice(0, displayed);
  grid.innerHTML = slice.map(p => productCardHTML(p)).join('');
  attachCardEvents(grid);

  const btn = document.getElementById('loadMore');
  btn.style.display = filtered.length > displayed ? 'inline-flex' : 'none';
}

function renderSaleGrid() {
  const grid = document.getElementById('saleGrid');
  if (!grid) return;
  grid.innerHTML = SALE_PRODUCTS.map(p => productCardHTML(p, true)).join('');
  attachCardEvents(grid);
}

function attachCardEvents(container) {
  // Add to cart
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = allProds.find(x => x.id === btn.dataset.id);
      if (p) addToCart(p);
    });
  });

  // Wishlist toggle
  container.querySelectorAll('.wishlist-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.id);
      renderProducts();
      renderSaleGrid();
    });
  });

  // Quick view
  container.querySelectorAll('.quick-view').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openProductModal(btn.dataset.id);
    });
  });

  // Size chips
  container.querySelectorAll('.size-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.closest('.product-sizes').querySelectorAll('.size-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });
}

/* ── FILTER ─────────────────────────────────────────────────── */
function initFilters() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const f = tab.dataset.filter;
      filtered = f === 'all' ? [...allProds] : allProds.filter(p => p.category === f);
      displayed = 8;
      renderProducts();
    });
  });

  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const f = card.dataset.filter;
      document.querySelector('[data-filter="' + f + '"]')?.click();
      document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.getElementById('loadMore')?.addEventListener('click', () => {
    displayed += PER_PAGE;
    renderProducts();
  });
}

/* ── CART ───────────────────────────────────────────────────── */
function addToCart(product, size = '', qty = 1) {
  const existing = cart.find(i => i.id === product.id && i.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty, size });
  }
  saveCart();
  updateCartUI();
  showToast(`✅ ${product.name} added to cart!`, '#2C2C2C');
  typeof trackFBEvent === 'function' && trackFBEvent('AddToCart', { content_id: product.id, value: product.price, currency: 'KES' });
  typeof trackTikTokEvent === 'function' && trackTikTokEvent('AddToCart', { content_id: product.id, value: product.price, currency: 'KES' });
}

function removeFromCart(id, size) {
  cart = cart.filter(i => !(i.id === id && i.size === size));
  saveCart(); updateCartUI(); renderCartItems();
}

function updateQty(id, size, delta) {
  const item = cart.find(i => i.id === id && i.size === size);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    saveCart(); updateCartUI(); renderCartItems();
  }
}

function cartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function cartCount() { return cart.reduce((s, i) => s + i.qty, 0); }

function updateCartUI() {
  document.getElementById('cartCount').textContent     = cartCount() || '0';
  document.getElementById('cartItemCount').textContent = cartCount();
  document.getElementById('cartTotal').textContent     = fmt(cartTotal());
  document.getElementById('cartFooter').style.display  = cart.length ? 'flex' : 'none';
}

function renderCartItems() {
  const el = document.getElementById('cartItems');
  if (!cart.length) {
    el.innerHTML = `<div class="cart-empty"><span>🛍️</span><p>Your cart is empty</p><a href="#new-arrivals" class="btn-primary" onclick="closeCart()">Start Shopping</a></div>`;
    return;
  }
  el.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">${item.size ? `Size: ${item.size}` : 'One Size'}</div>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="updateQty('${item.id}','${item.size}',-1)">−</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${item.id}','${item.size}',1)">+</button>
          <span class="remove-item" onclick="removeFromCart('${item.id}','${item.size}')">🗑</span>
        </div>
      </div>
      <div class="cart-item-price">KSh ${fmt(item.price * item.qty)}</div>
    </div>`).join('');
}

function openCart()  { document.getElementById('cartSidebar').classList.add('open'); document.getElementById('cartOverlay').classList.add('show'); renderCartItems(); }
function closeCart() { document.getElementById('cartSidebar').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('show'); }
window.closeCart = closeCart;

function checkout() {
  if (!cart.length) return showToast('Your cart is empty!');
  const total = cartTotal();
  typeof trackFBEvent === 'function' && trackFBEvent('InitiateCheckout', { value: total, currency: 'KES', num_items: cartCount() });
  typeof trackTikTokEvent === 'function' && trackTikTokEvent('InitiateCheckout', { value: total, currency: 'KES' });

  // Open WhatsApp checkout
  const lines = cart.map(i => `• ${i.name} (${i.size || 'One Size'}) x${i.qty} = KSh ${fmt(i.price * i.qty)}`).join('%0A');
  const msg   = `Hello SOKO STYLE! I'd like to order:%0A${lines}%0A%0A*Total: KSh ${fmt(total)}*%0A%0APlease send M-Pesa payment details.`;
  window.open(`https://wa.me/254700000000?text=${msg}`, '_blank');
}
window.checkout = checkout;

/* ── WISHLIST ────────────────────────────────────────────────── */
function toggleWishlist(id) {
  const idx = wishlist.findIndex(w => w.id === id);
  if (idx >= 0) {
    wishlist.splice(idx, 1);
    showToast('Removed from wishlist');
  } else {
    const p = allProds.find(x => x.id === id);
    if (p) { wishlist.push(p); showToast('❤️ Added to wishlist!'); }
  }
  saveWish();
  document.getElementById('wishlistCount').textContent = wishlist.length || '0';
}

/* ── PRODUCT MODAL ───────────────────────────────────────────── */
function openProductModal(id) {
  const p = allProds.find(x => x.id === id);
  if (!p) return;
  const savedPct = p.oldPrice ? Math.round((1 - p.price/p.oldPrice) * 100) : 0;

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-body">
      <div class="modal-img"><img src="${p.image}" alt="${p.name}" /></div>
      <div class="modal-details">
        <div class="modal-category">${p.category.replace('-', ' ')}</div>
        <div class="modal-name">${p.name}</div>
        <div class="modal-price">KSh ${fmt(p.price)} ${p.oldPrice ? `<span style="font-size:16px;color:#999;text-decoration:line-through">KSh ${fmt(p.oldPrice)}</span>` : ''}</div>
        <div class="modal-desc">${p.description || 'Premium quality clothing. Ships within Nairobi same-day, nationwide in 2-3 days.'}</div>
        <label class="modal-sizes-label">Select Size:</label>
        <div class="modal-sizes" id="modalSizes">
          ${(p.sizes || ['One Size']).map(s => `<span class="size-chip">${s}</span>`).join('')}
        </div>
        <label class="modal-qty-label">Quantity:</label>
        <div class="modal-qty">
          <button class="qty-btn" id="modalMinus">−</button>
          <span id="modalQty">1</span>
          <button class="qty-btn" id="modalPlus">+</button>
        </div>
        <button class="btn-primary full-width" id="modalAddCart">Add to Cart – KSh ${fmt(p.price)}</button>
        <div style="margin-top:12px;display:flex;gap:8px">
          <button class="btn-outline" style="flex:1" onclick="toggleWishlist('${p.id}'); closeModal()">❤️ Wishlist</button>
        </div>
      </div>
    </div>`;

  // Size select
  document.getElementById('modalSizes').querySelectorAll('.size-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.getElementById('modalSizes').querySelectorAll('.size-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });

  // Qty
  let qty = 1;
  document.getElementById('modalMinus').addEventListener('click', () => { qty = Math.max(1, qty-1); document.getElementById('modalQty').textContent = qty; });
  document.getElementById('modalPlus').addEventListener('click', () => { qty++; document.getElementById('modalQty').textContent = qty; });

  // Add to cart
  document.getElementById('modalAddCart').addEventListener('click', () => {
    const size = document.querySelector('#modalSizes .size-chip.selected')?.textContent || '';
    addToCart(p, size, qty);
    closeModal();
  });

  document.getElementById('productModal').classList.add('open');
  document.getElementById('modalOverlay').classList.add('show');
  typeof trackFBEvent === 'function' && trackFBEvent('ViewContent', { content_id: p.id, content_name: p.name, value: p.price, currency: 'KES' });
}

function closeModal() {
  document.getElementById('productModal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('show');
}
window.closeModal = closeModal;

/* ── HERO SLIDER ─────────────────────────────────────────────── */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let current  = 0, timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function start() { timer = setInterval(() => goTo(current + 1), 5000); }
  function stop()  { clearInterval(timer); }

  document.getElementById('heroPrev')?.addEventListener('click', () => { stop(); goTo(current - 1); start(); });
  document.getElementById('heroNext')?.addEventListener('click', () => { stop(); goTo(current + 1); start(); });
  dots.forEach(d => d.addEventListener('click', () => { stop(); goTo(+d.dataset.slide); start(); }));

  start();
}

/* ── MOBILE NAV ──────────────────────────────────────────────── */
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const overlay   = document.getElementById('navOverlay');
  const close     = document.getElementById('navClose');

  const open  = () => { mobileNav.classList.add('open'); overlay.classList.add('show'); };
  const shut  = () => { mobileNav.classList.remove('open'); overlay.classList.remove('show'); };

  hamburger?.addEventListener('click', open);
  close?.addEventListener('click', shut);
  overlay?.addEventListener('click', shut);
  document.querySelectorAll('[data-close-nav]').forEach(a => a.addEventListener('click', shut));
}

/* ── SEARCH ──────────────────────────────────────────────────── */
function initSearch() {
  const toggle  = document.getElementById('searchToggle');
  const bar     = document.getElementById('searchBar');
  const input   = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  toggle?.addEventListener('click', () => { bar.classList.toggle('open'); if (bar.classList.contains('open')) input.focus(); });

  input?.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ''; return; }
    const hits = allProds.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q)).slice(0, 5);
    results.innerHTML = hits.map(p => `
      <div class="search-result-item" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" />
        <div><strong>${p.name}</strong><br><small>KSh ${fmt(p.price)}</small></div>
      </div>`).join('') || '<div style="padding:16px;color:#999">No results found</div>';

    results.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        openProductModal(el.dataset.id);
        bar.classList.remove('open');
        results.innerHTML = '';
        input.value = '';
      });
    });
  });

  document.getElementById('searchBtn')?.addEventListener('click', () => input.dispatchEvent(new Event('input')));
}

/* ── SCROLL EFFECTS ──────────────────────────────────────────── */
function initScroll() {
  const header    = document.getElementById('header');
  const scrollTop = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 50);
    scrollTop.classList.toggle('show', y > 400);

    // Active nav link
    document.querySelectorAll('section[id]').forEach(sec => {
      const top = sec.offsetTop - 100;
      const bot = top + sec.offsetHeight;
      if (y >= top && y < bot) {
        document.querySelectorAll('.nav-link').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }, { passive: true });

  scrollTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── TESTIMONIALS ────────────────────────────────────────────── */
function initTestimonials() {
  const slider = document.getElementById('testimonialsSlider');
  const dotsEl = document.getElementById('testimonialDots');
  if (!slider) return;

  const cards = slider.querySelectorAll('.testimonial-card');
  let cur = 0;

  dotsEl.innerHTML = [...cards].map((_, i) => `<button class="hero-dot ${i===0?'active':''}" data-t="${i}"></button>`).join('');
  dotsEl.querySelectorAll('.hero-dot').forEach(d => {
    d.addEventListener('click', () => { cur = +d.dataset.t; updateTestimonials(); });
  });

  function updateTestimonials() {
    // On mobile show one at a time, on desktop show all
    if (window.innerWidth < 640) {
      cards.forEach((c, i) => c.style.display = i === cur ? 'block' : 'none');
      dotsEl.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
    } else {
      cards.forEach(c => c.style.display = '');
      dotsEl.style.display = 'none';
    }
  }

  window.addEventListener('resize', updateTestimonials);
  updateTestimonials();
  setInterval(() => { cur = (cur + 1) % cards.length; updateTestimonials(); }, 4000);
}

/* ── FORMS ───────────────────────────────────────────────────── */
function initForms() {
  document.getElementById('newsletterForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('🎉 Subscribed! Welcome to Soko Style.', '#C8392B');
    e.target.reset();
  });

  document.getElementById('contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✅ Message sent! We\'ll reply within 24 hrs.', '#2C2C2C');
    e.target.reset();
  });
}

/* ── INIT ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {

  // Try loading from ERPNext first, fallback to demo
  if (typeof window.ERP !== 'undefined') {
    const loaded = await window.ERP.loadProducts();
    if (loaded && window.PRODUCTS_FROM_ERP?.length) {
      allProds = window.PRODUCTS_FROM_ERP;
      filtered = [...allProds];
    }
  }

  // Render
  renderProducts();
  renderSaleGrid();
  initFilters();
  initHeroSlider();
  initNav();
  initSearch();
  initScroll();
  initTestimonials();
  initForms();

  // Cart UI
  updateCartUI();
  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

  // Wishlist count
  document.getElementById('wishlistCount').textContent = wishlist.length || '0';

  // Wishlist btn – show toast
  document.getElementById('wishlistBtn')?.addEventListener('click', () => {
    if (!wishlist.length) { showToast('Your wishlist is empty. Click ❤️ on any product!'); return; }
    showToast(`❤️ ${wishlist.length} item${wishlist.length > 1 ? 's' : ''} in wishlist`);
  });

  // Modal close
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeCart(); } });

  console.log('[SOKO STYLE] App initialized 🇰🇪');
});
