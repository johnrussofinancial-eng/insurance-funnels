/**
 * ROUTER.JS — Visibility Control & Navigation Gating
 * 
 * How visibility works:
 * - Pages/sections tagged with data-vertical="teachers" are HIDDEN by default
 * - Router reveals only the matching vertical's content
 * - Nav links are filtered to only show the active vertical
 * - If no vertical detected, user is sent to quiz or general landing
 */

const Router = {
  current: null,

  init() {
    this.current = Segment.detect();

    if (this.current) {
      this.applyVertical(this.current);
      Pixels.init(this.current);
    } else {
      this.showGeneral();
    }
  },

  applyVertical(verticalId) {
    // 1. Hide all vertical-specific sections
    document.querySelectorAll('[data-vertical]').forEach(el => {
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
    });

    // 2. Show only matching vertical content
    document.querySelectorAll(`[data-vertical="${verticalId}"]`).forEach(el => {
      el.style.display = '';
      el.removeAttribute('aria-hidden');
    });

    // 3. Show content marked for "all" verticals
    document.querySelectorAll('[data-vertical="all"]').forEach(el => {
      el.style.display = '';
      el.removeAttribute('aria-hidden');
    });

    // 4. Update nav
    this.updateNav(verticalId);

    // 5. Set body attribute for CSS targeting
    document.body.setAttribute('data-active-vertical', verticalId);

    // 6. Update page title
    const config = Segment.getConfig(verticalId);
    if (config) {
      document.title = `${config.label} | Insurance Solutions`;
    }

    console.log(`[Router] Active vertical: ${verticalId}`);
  },

  updateNav(verticalId) {
    // Hide nav items that don't belong to active vertical
    document.querySelectorAll('[data-nav-vertical]').forEach(item => {
      const navVertical = item.getAttribute('data-nav-vertical');
      if (navVertical === verticalId || navVertical === 'all') {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  },

  showGeneral() {
    // No vertical detected - show general content or redirect to quiz
    document.querySelectorAll('[data-vertical="general"], [data-vertical="all"]').forEach(el => {
      el.style.display = '';
      el.removeAttribute('aria-hidden');
    });
    document.body.setAttribute('data-active-vertical', 'general');
  },

  // Call this after quiz completion
  routeFromQuiz(verticalId) {
    Segment.set(verticalId);
    window.location.href = `/verticals/${verticalId}/index.html`;
  },

  // Build a campaign URL for Meta Ads
  buildAdURL(verticalId, extraParams = {}) {
    const base = window.location.origin;
    const params = new URLSearchParams({ v: verticalId, ...extraParams });
    return `${base}/?${params.toString()}`;
  }
};

window.Router = Router;

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', () => Router.init());
