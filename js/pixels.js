/**
 * SOKO STYLE – Facebook Pixel Integration
 * Replace YOUR_PIXEL_ID with your actual Facebook Pixel ID
 * Get yours at: https://business.facebook.com/events_manager
 */

(function() {
  const FB_PIXEL_ID = 'YOUR_PIXEL_ID'; // ← Replace this

  // ── Load Facebook Pixel ──────────────────────────────────
  !function(f,b,e,v,n,t,s) {
    if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', FB_PIXEL_ID);
  fbq('track', 'PageView');

  // ── NoScript fallback ────────────────────────────────────
  const noscript = document.createElement('noscript');
  noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1"/>`;
  document.body.appendChild(noscript);

  console.log('[FB Pixel] Initialized with ID:', FB_PIXEL_ID);
})();

/**
 * Track a Facebook Pixel event.
 * Usage: trackFBEvent('Purchase', { value: 2500, currency: 'KES' })
 *
 * Standard Events:
 *   ViewContent, AddToCart, InitiateCheckout, Purchase,
 *   AddToWishlist, Search, Lead, CompleteRegistration
 */
function trackFBEvent(eventName, params = {}) {
  if (typeof fbq === 'undefined') {
    console.warn('[FB Pixel] fbq not loaded');
    return;
  }
  fbq('track', eventName, params);
  console.log(`[FB Pixel] Event tracked: ${eventName}`, params);
}

/**
 * Track a custom Facebook Pixel event.
 * Usage: trackFBCustomEvent('ViewKitenga', { category: 'African Wear' })
 */
function trackFBCustomEvent(eventName, params = {}) {
  if (typeof fbq === 'undefined') return;
  fbq('trackCustom', eventName, params);
}

// ── Auto-track events ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Track search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let searchTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        if (searchInput.value.trim().length > 2) {
          trackFBEvent('Search', { search_string: searchInput.value.trim() });
        }
      }, 800);
    });
  }

  // Track newsletter sign-up
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', () => {
      trackFBEvent('Lead', { content_name: 'Newsletter Signup' });
    });
  }

  // Track contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      trackFBEvent('Contact');
    });
  }
});
