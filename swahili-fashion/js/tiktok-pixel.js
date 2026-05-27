/**
 * SOKO STYLE – TikTok Pixel Integration
 * Replace YOUR_TIKTOK_PIXEL_ID with your actual TikTok Pixel ID
 * Get yours at: https://ads.tiktok.com → Assets → Events → Web Events
 */

(function() {
  const TIKTOK_PIXEL_ID = 'YOUR_TIKTOK_PIXEL_ID'; // ← Replace this

  // ── Load TikTok Pixel ────────────────────────────────────
  !function(w,d,t){
    w.TiktokAnalyticsObject=t;
    var ttq=w[t]=w[t]||[];
    ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
    ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
    for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
    ttq.instance=function(t){
      for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);
      return e
    };
    ttq.load=function(e,n){
      var i="https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};
      ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};
      n=document.createElement("script");n.type="text/javascript";
      n.async=!0;n.src=i+"?sdkid="+e+"&lib="+t;
      e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)
    };
    ttq.load(TIKTOK_PIXEL_ID);
    ttq.page();
  }(window, document, 'ttq');

  console.log('[TikTok Pixel] Initialized with ID:', TIKTOK_PIXEL_ID);
})();

/**
 * Track a TikTok Pixel event.
 * Usage: trackTikTokEvent('AddToCart', { content_id: '123', value: 2500, currency: 'KES' })
 *
 * Standard Events:
 *   ViewContent, AddToCart, PlaceAnOrder, CompletePayment,
 *   AddToWishlist, Search, Contact, SubmitForm, Subscribe
 */
function trackTikTokEvent(eventName, params = {}) {
  if (typeof ttq === 'undefined') {
    console.warn('[TikTok Pixel] ttq not loaded');
    return;
  }
  ttq.track(eventName, params);
  console.log(`[TikTok Pixel] Event tracked: ${eventName}`, params);
}

// ── Auto-track events ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Track search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (searchInput.value.trim().length > 2) {
          trackTikTokEvent('Search', { query: searchInput.value.trim() });
        }
      }, 800);
    });
  }

  // Track newsletter
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', () => {
      trackTikTokEvent('Subscribe');
    });
  }

  // Track contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      trackTikTokEvent('Contact');
    });
  }
});
