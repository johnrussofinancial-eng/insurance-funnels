/**
 * SEGMENT.JS — Vertical Detection & Session Gating
 * Controls which vertical a user belongs to based on:
 *   1. URL parameter (?v=teachers)
 *   2. Stored session/cookie
 *   3. Quiz result (set via setVertical)
 *   4. Referrer domain (Meta ad UTM)
 */

const VERTICALS = {
  'federal-retirement': {
    label: 'Federal Retirement Planning',
    path: '/verticals/federal-retirement/',
    pixel: 'FB_PIXEL_FEDERAL',
    quizId: 'quiz-federal'
  },
  'iul': {
    label: 'Indexed Universal Life',
    path: '/verticals/iul/',
    pixel: 'FB_PIXEL_IUL',
    quizId: 'quiz-iul'
  },
  'annuities': {
    label: 'Annuities',
    path: '/verticals/annuities/',
    pixel: 'FB_PIXEL_ANNUITIES',
    quizId: 'quiz-annuities'
  },
  'life-insurance': {
    label: 'Life Insurance',
    path: '/verticals/life-insurance/',
    pixel: 'FB_PIXEL_LIFE',
    quizId: 'quiz-life'
  },
  'teachers': {
    label: 'Teachers',
    path: '/verticals/teachers/',
    pixel: 'FB_PIXEL_TEACHERS',
    quizId: 'quiz-teachers'
  },
  'truckers': {
    label: 'Truckers',
    path: '/verticals/truckers/',
    pixel: 'FB_PIXEL_TRUCKERS',
    quizId: 'quiz-truckers'
  }
};

const SESSION_KEY = 'ins_vertical';
const UTM_MAP = {
  'federal': 'federal-retirement',
  'fed': 'federal-retirement',
  'iul': 'iul',
  'annuity': 'annuities',
  'annuities': 'annuities',
  'life': 'life-insurance',
  'teacher': 'teachers',
  'teachers': 'teachers',
  'trucker': 'truckers',
  'truckers': 'truckers'
};

const Segment = {
  // Detect vertical from all sources, priority order:
  // 1. URL ?v= param  2. sessionStorage  3. UTM source  4. null
  detect() {
    const params = new URLSearchParams(window.location.search);
    const vParam = params.get('v') || params.get('vertical');
    const utmContent = params.get('utm_content') || params.get('utm_campaign') || '';

    if (vParam && VERTICALS[vParam]) {
      this.set(vParam);
      return vParam;
    }

    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored && VERTICALS[stored]) return stored;

    const utmLower = utmContent.toLowerCase();
    for (const [key, vertical] of Object.entries(UTM_MAP)) {
      if (utmLower.includes(key)) {
        this.set(vertical);
        return vertical;
      }
    }

    return null;
  },

  set(verticalId) {
    if (!VERTICALS[verticalId]) return;
    sessionStorage.setItem(SESSION_KEY, verticalId);
    // Also set cookie for server-side use if needed
    document.cookie = `ins_v=${verticalId};path=/;max-age=86400`;
  },

  get() {
    return sessionStorage.getItem(SESSION_KEY);
  },

  clear() {
    sessionStorage.removeItem(SESSION_KEY);
    document.cookie = 'ins_v=;path=/;max-age=0';
  },

  getConfig(verticalId) {
    return VERTICALS[verticalId] || null;
  },

  getAllVerticals() {
    return VERTICALS;
  }
};

window.Segment = Segment;
window.VERTICALS = VERTICALS;
