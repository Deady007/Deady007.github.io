/**
 * Hallmark 50-Theme Switcher & State Manager
 */
(function() {
  const STORAGE_KEY = 'hallmark_theme';
  const DEFAULT_THEME = 'console';

  function getCurrentTheme() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  }

  function applyTheme(slug) {
    if (!slug) slug = DEFAULT_THEME;
    document.documentElement.setAttribute('data-theme', slug);
    localStorage.setItem(STORAGE_KEY, slug);

    const label = document.getElementById('current-theme-name');
    if (label) {
      const found = window.HALLMARK_THEMES ? window.HALLMARK_THEMES.find(t => t.slug === slug) : null;
      label.textContent = found ? found.name : slug;
    }

    // Update active state in drawer if rendered
    const cards = document.querySelectorAll('.theme-option-card');
    cards.forEach(card => {
      if (card.dataset.slug === slug) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: slug } }));
  }

  window.setHallmarkTheme = applyTheme;

  // Immediate execution before DOM ready to prevent flash
  applyTheme(getCurrentTheme());

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getCurrentTheme());

    const triggerBtn = document.getElementById('theme-trigger-btn');
    const drawer = document.getElementById('theme-drawer');
    const backdrop = document.getElementById('theme-drawer-backdrop');
    const closeBtn = document.getElementById('theme-drawer-close');
    const searchInput = document.getElementById('theme-search');
    const genreTabs = document.querySelectorAll('.genre-tab');
    const randomBtn = document.getElementById('random-theme-btn');
    const grid = document.getElementById('theme-drawer-grid');

    // Mobile nav
    const navToggle = document.getElementById('nav-toggle-btn');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
    const mobileClose = document.getElementById('mobile-nav-close');

    if (navToggle && mobileDrawer && mobileBackdrop) {
      const openNav = () => {
        mobileDrawer.classList.add('open');
        mobileBackdrop.classList.add('open');
      };
      const closeNav = () => {
        mobileDrawer.classList.remove('open');
        mobileBackdrop.classList.remove('open');
      };
      navToggle.addEventListener('click', openNav);
      if (mobileClose) mobileClose.addEventListener('click', closeNav);
      mobileBackdrop.addEventListener('click', closeNav);
    }

    if (!drawer || !backdrop) return;

    function openDrawer() {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      if (grid && grid.children.length === 0) {
        renderThemesList();
      }
      if (searchInput) searchInput.focus();
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
    }

    if (triggerBtn) triggerBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    let currentGenre = 'all';
    let searchQuery = '';

    function renderThemesList() {
      if (!grid || !window.HALLMARK_THEMES) return;
      grid.innerHTML = '';

      const activeSlug = getCurrentTheme();
      const filtered = window.HALLMARK_THEMES.filter(t => {
        const matchesGenre = (currentGenre === 'all' || t.genre === currentGenre);
        const matchesSearch = !searchQuery || 
          t.name.toLowerCase().includes(searchQuery) || 
          t.slug.toLowerCase().includes(searchQuery) ||
          t.displayFace.toLowerCase().includes(searchQuery);
        return matchesGenre && matchesSearch;
      });

      if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.style.gridColumn = '1 / -1';
        empty.style.padding = '24px';
        empty.style.textAlign = 'center';
        empty.style.color = 'var(--color-muted)';
        empty.textContent = 'No themes match your search query.';
        grid.appendChild(empty);
        return;
      }

      filtered.forEach(t => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `theme-option-card ${t.slug === activeSlug ? 'active' : ''}`;
        card.dataset.slug = t.slug;
        card.setAttribute('data-theme', t.slug);

        card.innerHTML = `
          <div class="theme-card-top">
            <span class="theme-card-name">${t.name}</span>
            <div class="theme-swatches">
              <span class="swatch-dot" style="background-color: var(--color-paper);" title="Paper"></span>
              <span class="swatch-dot" style="background-color: var(--color-accent);" title="Accent"></span>
              <span class="swatch-dot" style="background-color: var(--color-ink);" title="Ink"></span>
            </div>
          </div>
          <div class="theme-card-font">${t.displayFace}, ${t.genre} (${t.paperBand})</div>
        `;

        card.addEventListener('click', () => {
          applyTheme(t.slug);
        });

        grid.appendChild(card);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderThemesList();
      });
    }

    genreTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        genreTabs.forEach(tb => tb.classList.remove('active'));
        tab.classList.add('active');
        currentGenre = tab.dataset.genre;
        renderThemesList();
      });
    });

    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        if (!window.HALLMARK_THEMES || window.HALLMARK_THEMES.length === 0) return;
        const randomIndex = Math.floor(Math.random() * window.HALLMARK_THEMES.length);
        const picked = window.HALLMARK_THEMES[randomIndex];
        applyTheme(picked.slug);
      });
    }

    // Initial render of drawer items
    renderThemesList();
  });
})();
