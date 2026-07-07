// ============================================
// Main App — Tri Thức Mở • Kho tài liệu học tập
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const state = {
    resources: [...RESOURCES],
    filtered: [...RESOURCES],
    currentFilter: 'all',
    searchQuery: '',
    sortBy: 'newest',
    visibleCount: 0,
    initialLoad: 12,
    loadMore: 6
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ---- Render ----
  function renderResources() {
    const grid = $('#resourcesGrid');
    const count = $('#resourceCount');
    
    let list = [...state.filtered];
    
    // Sort
    if (state.sortBy === 'popular') list.sort((a, b) => {
      const badgeOrder = { popular: 3, trending: 2, new: 1, free: 0 };
      return (badgeOrder[b.badge] || 0) - (badgeOrder[a.badge] || 0);
    });
    else if (state.sortBy === 'difficulty-asc') list.sort((a, b) => {
      const diffOrder = { 'Cơ bản': 0, 'Cơ bản → Trung cấp': 1, 'Cơ bản → Nâng cao': 2, 'Trung cấp': 3, 'Trung cấp → Nâng cao': 4, 'Nâng cao': 5, 'Tất cả': 0 };
      return (diffOrder[a.difficulty] || 0) - (diffOrder[b.difficulty] || 0);
    });
    else if (state.sortBy === 'difficulty-desc') list.sort((a, b) => {
      const diffOrder = { 'Cơ bản': 0, 'Cơ bản → Trung cấp': 1, 'Cơ bản → Nâng cao': 2, 'Trung cấp': 3, 'Trung cấp → Nâng cao': 4, 'Nâng cao': 5, 'Tất cả': 0 };
      return (diffOrder[b.difficulty] || 0) - (diffOrder[a.difficulty] || 0);
    });
    // "newest" = keep original order
    
    if (list.length === 0) {
      grid.innerHTML = `<div class="empty-state">
        <i class="fas fa-book-open"></i>
        <h3>Không tìm thấy tài liệu</h3>
        <p>Thử với từ khóa hoặc danh mục khác nhé!</p>
      </div>`;
      count.textContent = '0';
      return;
    }
    
    count.textContent = list.length;
    
    grid.innerHTML = list.map((r, index) => `
      <div class="resource-card" data-index="${index}" style="animation: fadeInUp 0.4s ease ${index * 0.04}s both;">
        <div class="resource-image">
          <img src="${r.image}" alt="${r.name}" loading="lazy" onerror="this.src='https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=600'">
          ${r.badge ? `<span class="resource-badge ${r.badge}">${
            r.badge === 'popular' ? '★ Phổ biến' : 
            r.badge === 'trending' ? '📈 Xu hướng' : 
            r.badge === 'new' ? '✨ Mới' : '✅ Miễn phí'
          }</span>` : ''}
          <span class="resource-category-tag">${getCategoryIcon(r.category)} ${getCategoryLabel(r.category)}</span>
        </div>
        <div class="resource-body">
          <h3 class="resource-name">${r.name}</h3>
          <p class="resource-desc">${r.description}</p>
          <div class="resource-meta">
            <span class="resource-type">
              <i class="fas fa-file-alt"></i> ${r.formatLabel}
            </span>
            <span class="resource-type">
              <i class="fas fa-globe"></i> ${r.language}
            </span>
          </div>
          <div class="resource-tags">
            ${r.tags.slice(0, 4).map(tag => `<span class="resource-tag">${tag}</span>`).join('')}
          </div>
          <div class="resource-actions">
            <button class="btn-detail" onclick="showDetail('${r.id}')">
              <i class="fas fa-info-circle"></i> Chi Tiết
            </button>
            <a href="${r.sourceUrl}" class="btn-download" target="_blank" rel="noopener">
              <i class="fas fa-external-link-alt"></i> Truy Cập
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  function getCategoryIcon(cat) {
    const icons = { ai: '🧠', bot: '🤖', agent: '⚡', openclaw: '♠️' };
    return icons[cat] || '📚';
  }

  function getCategoryLabel(cat) {
    const labels = { ai: 'AI', bot: 'Bot', agent: 'AI Agent', openclaw: 'OpenClaw' };
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
  function filterResources() {
    let filtered = [...state.resources];
    
    if (state.currentFilter !== 'all') {
      filtered = filtered.filter(r => r.category === state.currentFilter);
    }
    
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q)) ||
        r.category.includes(q) ||
        r.format.toLowerCase().includes(q)
      );
    }
    
    state.filtered = filtered;
    renderResources();
  }

  // ---- Event Listeners ----
  
  // Category filters
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentFilter = btn.dataset.category;
      filterResources();
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
      filterResources();
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
      filterResources();
    }, 300);
  });

  // Sort
  $('#sortSelect').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderResources();
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

  // Resource detail modal
  window.showDetail = function(resourceId) {
    const resource = RESOURCES.find(r => r.id === resourceId);
    if (!resource) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <button class="modal-close">&times;</button>
        <div class="modal-grid">
          <div class="modal-image">
            <img src="${resource.image}" alt="${resource.name}">
          </div>
          <div class="modal-content">
            <span class="resource-category-tag">${getCategoryIcon(resource.category)} ${getCategoryLabel(resource.category)}</span>
            <h2>${resource.name}</h2>
            
            <div class="modal-meta">
              <div class="modal-meta-item">
                <i class="fas fa-file-alt"></i>
                <span>${resource.formatLabel}</span>
              </div>
              <div class="modal-meta-item">
                <i class="fas fa-globe"></i>
                <span>${resource.language}</span>
              </div>
              <div class="modal-meta-item">
                <i class="fas fa-signal"></i>
                <span>${resource.difficulty}</span>
              </div>
              ${resource.fileSize !== 'Online' ? `
              <div class="modal-meta-item">
                <i class="fas fa-database"></i>
                <span>${resource.fileSize}</span>
              </div>` : ''}
            </div>
            
            <p>${resource.description}</p>
            
            <div class="modal-tags">${resource.tags.map(t => `<span>${t}</span>`).join('')}</div>
            
            <div class="modal-actions">
              <a href="${resource.sourceUrl}" class="btn-download modal-btn" target="_blank" rel="noopener">
                <i class="fas fa-external-link-alt"></i> Truy Cập Tài Nguyên
              </a>
            </div>
            
            <div class="affiliate-disclosure">
              <i class="fas fa-heart" style="color: var(--error);"></i> 
              Tài liệu hoàn toàn miễn phí. Nếu bạn muốn ủng hộ, hãy chia sẻ cho bạn bè!
            </div>
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
      padding: 28px;
    }
    
    .resource-category-tag {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 50px;
      background: var(--border-light);
      font-size: 0.8rem;
      margin-bottom: 12px;
    }
    
    .modal-content h2 {
      font-size: 1.3rem;
      margin-bottom: 12px;
      line-height: 1.3;
    }
    
    .modal-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 16px;
    }
    
    .modal-meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--text-secondary);
      padding: 4px 10px;
      background: var(--border-light);
      border-radius: 6px;
    }
    
    .modal-meta-item i {
      color: var(--primary);
      font-size: 0.75rem;
    }
    
    .modal-content p {
      font-size: 0.88rem;
      margin-bottom: 16px;
      line-height: 1.6;
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
      color: var(--text-secondary);
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
      font-size: 0.78rem !important;
      color: var(--text-light) !important;
      margin-top: 8px !important;
    }
    
    .modal-actions {
      display: flex;
      gap: 10px;
    }
    
    @media (max-width: 700px) {
      .modal-grid {
        grid-template-columns: 1fr;
      }
      .modal-image {
        border-radius: 20px 20px 0 0;
        min-height: 200px;
      }
      .modal { max-width: 100%; }
      .modal-actions { flex-direction: column; }
    }
  `;
  document.head.appendChild(modalStyles);

  // ---- Init ----
  renderResources();
  $('#loadingSpinner').style.display = 'none';
});
