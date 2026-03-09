/**
 * PIXELS.JS — Per-Vertical Pixel Firing
 * Loads Meta Pixel only for the active vertical.
 * Swap pixel IDs with your real ones.
 */

const PIXEL_IDS = {
  'federal-retirement': 'XXXXXXXXXXXXXXXXX1',
  'iul':                'XXXXXXXXXXXXXXXXX2',
  'annuities':          'XXXXXXXXXXXXXXXXX3',
  'life-insurance':     'XXXXXXXXXXXXXXXXX4',
  'teachers':           'XXXXXXXXXXXXXXXXX5',
  'truckers':           'XXXXXXXXXXXXXXXXX6',
};

const Pixels = {
  loaded: {},

  init(verticalId) {
    const pixelId = PIXEL_IDS[verticalId];
    if (!pixelId || this.loaded[verticalId]) return;

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', pixelId);
    fbq('track', 'PageView');

    this.loaded[verticalId] = pixelId;
    console.log(`[Pixels] Loaded pixel for: ${verticalId}`);
  },

  track(event, data = {}) {
    if (typeof fbq !== 'undefined') {
      fbq('track', event, data);
    }
  },

  trackLead(verticalId, formData = {}) {
    this.track('Lead', {
      content_category: verticalId,
      ...formData
    });
  },

  trackScheduled(verticalId) {
    this.track('Schedule', { content_category: verticalId });
  }
};

window.Pixels = Pixels;
