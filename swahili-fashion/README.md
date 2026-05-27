# SOKO STYLE – Kenya Fashion E-Commerce Website

A fully responsive, mobile-friendly clothing store website built for Kenya.
Includes Facebook Pixel, TikTok Pixel, and ERPNext/Frappe integration.

---

## 📁 Folder Structure

```
swahili-fashion/
├── index.html              # Main HTML page
├── css/
│   ├── main.css            # Core styles, components, layout
│   └── responsive.css      # Mobile breakpoints (all screen sizes)
├── js/
│   ├── app.js              # Main app: cart, products, UI logic
│   ├── pixels.js           # Facebook Pixel integration
│   ├── tiktok-pixel.js     # TikTok Pixel integration
│   └── erpnext.js          # ERPNext / Frappe REST API integration
├── pages/                  # (Optional) Sub-pages: product detail, checkout
├── components/             # (Optional) Reusable HTML components
└── images/                 # Local images (if not using CDN)
```

---

## 🚀 Quick Start

1. Open `index.html` in any browser — works instantly with demo products.
2. No build step, no npm install needed.

---

## 🔧 Configuration

### Facebook Pixel
Edit `js/pixels.js` line 9:
```js
const FB_PIXEL_ID = 'YOUR_PIXEL_ID';
```
Get your Pixel ID at: https://business.facebook.com/events_manager

### TikTok Pixel
Edit `js/tiktok-pixel.js` line 9:
```js
const TIKTOK_PIXEL_ID = 'YOUR_TIKTOK_PIXEL_ID';
```
Get yours at: https://ads.tiktok.com → Assets → Events → Web Events

### ERPNext / Frappe
Edit `js/erpnext.js` lines 16–22:
```js
const ERPNEXT_CONFIG = {
  baseUrl:   'https://YOUR-SITE.erpnext.com',
  apiKey:    'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
  ...
};
```
- API keys: ERPNext → Settings → API Access → Generate Keys
- The site auto-detects ERPNext products if configured, otherwise uses demo data.

### WhatsApp Checkout
Edit `js/app.js` line ~160:
```js
window.open(`https://wa.me/254700000000?text=...`)
```
Replace `254700000000` with your business WhatsApp number.

### Business Info
In `index.html`, search & replace:
- `+254 700 000 000` → your phone number
- `Tom Mboya Street, CBD` → your address
- `hello@sokostyle.co.ke` → your email
- `@sokostyle.ke` → your Instagram handle

---

## 📱 Mobile Responsive Breakpoints
| Breakpoint | Target              |
|------------|---------------------|
| 1100px     | Large tablets       |
| 900px      | Tablets / iPad      |
| 640px      | All mobile phones   |
| 380px      | Small phones        |

---

## 📊 Pixel Events Tracked
| Event            | Trigger                         |
|------------------|---------------------------------|
| PageView         | Every page load                 |
| ViewContent      | Product modal opened            |
| AddToCart        | Add to cart button clicked      |
| InitiateCheckout | Checkout button clicked         |
| Search           | Search query typed              |
| Lead             | Newsletter subscribed           |
| Contact          | Contact form submitted          |

---

## 🔌 ERPNext API Functions
| Function                        | Description                   |
|---------------------------------|-------------------------------|
| `ERP.getProducts()`             | Fetch all Items               |
| `ERP.getPrice(itemCode)`        | Get selling price             |
| `ERP.getStock(itemCode)`        | Check stock availability      |
| `ERP.createCustomer(info)`      | Create/get customer           |
| `ERP.createSalesOrder(…)`       | Create Sales Order            |
| `ERP.mpesaPayment(…)`           | Initiate M-Pesa STK Push      |
| `ERP.submitOrder(cart, info)`   | Full order submission flow    |

---

## 🌍 Deployment Options
- **Static hosting**: Netlify, Vercel, GitHub Pages (free)
- **Kenyan hosting**: Truehost Kenya, Sasahost
- **With ERPNext**: Host alongside your Frappe/ERPNext instance

---

## ✅ Features
- ✅ Fully mobile responsive (all screen sizes)
- ✅ Facebook Pixel integration
- ✅ TikTok Pixel integration
- ✅ ERPNext/Frappe REST API integration
- ✅ Shopping cart with localStorage persistence
- ✅ Wishlist
- ✅ Product quick-view modal
- ✅ Hero slider with auto-play
- ✅ Product filter by category
- ✅ Search with live results
- ✅ WhatsApp checkout
- ✅ M-Pesa payment flow (via ERPNext)
- ✅ Newsletter subscription form
- ✅ Scroll-to-top button
- ✅ Animated announcement bar
- ✅ Testimonials / reviews
- ✅ Instagram-style social feed
- ✅ Contact form
- ✅ Toast notifications
- ✅ Sticky header with active nav tracking

---

Built with ❤️ in Nairobi, Kenya 🇰🇪
