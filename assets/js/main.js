// ============================================
// Main App — Đánh Giá Số
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const state = {
    products: [...PRODUCTS],
    filtered: [...PRODUCTS],
    currentFilter: 'all',
    searchQuery: '',
    sortBy: 'newest',
    visibleCount: 0,
    initialLoad: 9,
    loadMore: 6
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ---- Render ----
  function renderProducts() {
    const grid = $('#productsGrid');
    const count = $('#productCount');
    
    let list = [...state.filtered];
    
    // Sort
    if (state.sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (state.sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (state.sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    // "newest" = keep original order
    
    if (list.length === 0) {
      grid.innerHTML = `<div class="empty-state">
        <i class="fas fa-search"></i>
        <h3>Không tìm thấy sản phẩm</h3>
        <p>Thử với từ khóa hoặc danh mục khác nhé!</p>
      </div>`;
      count.textContent = '0';
      return;
    }
    
    count.textContent = list.length;
    
    grid.innerHTML = list.map((product, index) => `
      <div class="product-card" data-index="${index}" style="animation: fadeInUp 0.4s ease ${index * 0.05}s both;">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=600'">
          ${product.badge ? `<span class="product-badge ${product.badge}">${
            product.badge === 'best' ? '★ Best Choice' : 
            product.badge === 'hot' ? '🔥 Hot' : '✨ Mới'
          }</span>` : ''}
          <span class="product-category">${getCategoryIcon(product.category)} ${getCategoryLabel(product.category)}</span>
        </div>
        <div class="product-body">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-meta">
            <div class="product-rating">
              <span class="stars">${renderStars(product.rating)}</span>
              <span class="rating-value">${product.rating}</span>
              <span class="rating-count">(${product.reviewCount})</span>
            </div>
            <div class="product-price">
              ${formatPrice(product.price)}
              ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
            </div>
          </div>
          <div class="product-tags">
            ${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
          </div>
          <div class="product-actions">
            <button class="btn-detail" onclick="showDetail('${product.id}')">
              <i class="fas fa-info-circle"></i> Chi Tiết
            </button>
            <a href="${product.affiliateUrl}" class="btn-affiliate" target="_blank" rel="nofollow sponsored">
              Xem Giá <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  function getCategoryIcon(cat) {
    const icons = { laptop: '💻', headphone: '🎧', monitor: '🖥️', keyboard: '⌨️' };
    return icons[cat] || '📦';
  }

  function getCategoryLabel(cat) {
    const labels = { laptop: 'Laptop', headphone: 'Tai Nghe', monitor: 'Màn Hình', keyboard: 'Bàn Phím' };
    return labels[cat] || cat;
  }

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  function formatPrice(vnd) {
    return vnd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
  }

  // ---- Filters & Search ----
  function filterProducts() {
    let filtered = [...state.products];
    
    if (state.currentFilter !== 'all') {
      filtered = filtered.filter(p => p.category === state.currentFilter);
    }
    
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.category.includes(q)
      );
    }
    
    state.filtered = filtered;
    renderProducts();
  }

  // ---- Event Listeners ----
  
  // Category filters
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentFilter = btn.dataset.category;
      filterProducts();
      updateNavActive(btn.dataset.category);
    });
  });

  // Nav links
  $$('.nav-links a[data-category]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.dataset.category;
      state.currentFilter = cat;
      $$('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.category === cat);
      });
      filterProducts();
      // Close mobile menu
      $('#navLinks').classList.remove('active');
    });
  });

  function updateNavActive(cat) {
    $$('.nav-links a').forEach(a => a.classList.remove('active'));
    const navLink = $(`.nav-links a[data-category="${cat}"]`);
    if (navLink) navLink.classList.add('active');
  }

  // Search
  let searchTimeout;
  $('#searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.searchQuery = e.target.value;
      filterProducts();
    }, 300);
  });

  // Sort
  $('#sortSelect').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderProducts();
  });

  // Mobile menu toggle
  $('#menuToggle').addEventListener('click', () => {
    $('#navLinks').classList.toggle('active');
  });

  // Close mobile menu on link click
  $$('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      $('#navLinks').classList.remove('active');
    });
  });

  // Newsletter form
  $('#newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#newsletterForm input').value;
    if (email) {
      showToast('✅ Cảm ơn bạn! Kiểm tra email để xác nhận nhé.', 'success');
      $('#newsletterForm input').value = '';
    }
  });

  // Hero stats counter animation
  function animateCounters() {
    $$('.stat-number').forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const increment = Math.ceil(target / 30);
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current > target) {
          counter.textContent = target + '+';
          return;
        }
        counter.textContent = current;
        requestAnimationFrame(updateCounter);
      };
      
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          updateCounter();
          observer.disconnect();
        }
      });
      observer.observe(counter);
    });
  }
  animateCounters();

  // Toast notification
  function showToast(msg, type = '') {
    const existing = $('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => toast.classList.add('show'));
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }
  window.showToast = showToast;

  // Product detail modal (simple version)
  window.showDetail = function(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <button class="modal-close">&times;</button>
        <div class="modal-grid">
          <div class="modal-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="modal-content">
            <span class="product-category-tag">${getCategoryIcon(product.category)} ${getCategoryLabel(product.category)}</span>
            <h2>${product.name}</h2>
            <div class="modal-rating">${renderStars(product.rating)} <span>${product.rating} (${product.reviewCount} đánh giá)</span></div>
            <div class="modal-price">${formatPrice(product.price)}</div>
            <p>${product.description}</p>
            
            <div class="modal-pros-cons">
              <div>
                <h4><i class="fas fa-plus-circle" style="color:var(--success)"></i> Ưu điểm</h4>
                <ul>${product.pros.map(p => `<li>${p}</li>`).join('')}</ul>
              </div>
              <div>
                <h4><i class="fas fa-minus-circle" style="color:var(--error)"></i> Nhược điểm</h4>
                <ul>${product.cons.map(c => `<li>${c}</li>`).join('')}</ul>
              </div>
            </div>
            
            <div class="modal-tags">${product.tags.map(t => `<span>${t}</span>`).join('')}</div>
            
            <a href="${product.affiliateUrl}" class="btn-affiliate modal-btn" target="_blank" rel="nofollow sponsored">
              🛒 Xem Giá Tốt Nhất <i class="fas fa-external-link-alt"></i>
            </a>
            <p class="affiliate-disclosure">Khi bạn mua qua link này, chúng tôi có thể nhận hoa hồng nhỏ. Bạn không mất thêm phí.</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    requestAnimationFrame(() => modal.classList.add('active'));
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.classList.remove('active');
      setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 300);
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 300);
      }
    });
  };

  // Add modal styles dynamically
  const modalStyles = document.createElement('style');
  modalStyles.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(4px);
    }
    .modal-overlay.active { opacity: 1; }
    
    .modal {
      background: white;
      border-radius: 20px;
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      transform: scale(0.95) translateY(10px);
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .modal-overlay.active .modal {
      transform: scale(1) translateY(0);
    }
    
    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: rgba(0,0,0,0.08);
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: background 0.2s;
    }
    .modal-close:hover { background: rgba(0,0,0,0.15); }
    
    .modal-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
    }
    
    .modal-image {
      background: var(--border-light);
      border-radius: 20px 0 0 20px;
      overflow: hidden;
      min-height: 350px;
    }
    .modal-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .modal-content {
      padding: 32px;
    }
    
    .product-category-tag {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 50px;
      background: var(--border-light);
      font-size: 0.8rem;
      margin-bottom: 12px;
    }
    
    .modal-content h2 {
      font-size: 1.4rem;
      margin-bottom: 8px;
    }
    
    .modal-rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 0.9rem;
    }
    .modal-rating .stars { color: var(--accent); font-size: 1rem; }
    
    .modal-price {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 16px;
    }
    
    .modal-content p {
      font-size: 0.88rem;
      margin-bottom: 20px;
    }
    
    .modal-pros-cons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .modal-pros-cons h4 {
      font-size: 0.85rem;
      margin-bottom: 8px;
    }
    .modal-pros-cons ul li {
      font-size: 0.82rem;
      padding: 4px 0;
      color: var(--text-secondary);
      list-style: none;
    }
    .modal-pros-cons ul li::before {
      content: '•';
      margin-right: 6px;
    }
    
    .modal-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 20px;
    }
    .modal-tags span {
      padding: 4px 12px;
      border-radius: 50px;
      background: var(--border-light);
      font-size: 0.78rem;
    }
    
    .modal-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      font-size: 1rem;
      border-radius: 12px;
      margin-bottom: 12px;
      text-decoration: none;
    }
    
    .affiliate-disclosure {
      font-size: 0.72rem !important;
      color: var(--text-light) !important;
    }
    
    @media (max-width: 700px) {
      .modal-grid {
        grid-template-columns: 1fr;
      }
      .modal-image {
        border-radius: 20px 20px 0 0;
        min-height: 220px;
      }
      .modal { max-width: 100%; }
      .modal-pros-cons { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(modalStyles);

  // ---- Init ----
  renderProducts();
  $('#loadingSpinner').style.display = 'none';
});
