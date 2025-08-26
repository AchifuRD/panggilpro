import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        'service-select': 'service-select.html',
        'pro-list': 'pro-list.html',
        'booking-confirm': 'booking-confirm.html',
        'receipt': 'receipt.html',
        'booking-history': 'booking-history.html',
        'profile': 'profile.html',
        'chat': 'chat.html',
        'contact': 'contact.html',
        'privacy': 'privacy.html',
        'terms': 'terms.html'
      }
    }
  }
})