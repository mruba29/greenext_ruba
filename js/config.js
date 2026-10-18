/**
 * GreenNext Enterprise Configuration
 * Central configuration for business settings, integrations, and operational parameters.
 */
window.GreenNextConfig = {
  // Configurable business WhatsApp number (Country code + phone number without + or symbols).
  // IMPORTANT: Replace this placeholder with the verified enterprise business number before production.
  WHATSAPP_PHONE: '919876543210',

  // Default prefilled inquiry message
  WHATSAPP_MESSAGE: "Hello GreenNext, I’m interested in your AI data center and intelligent infrastructure solutions. Please share more information.",

  // Google Apps Script Web App Deployment URL
  // Paste your deployed Google Apps Script Web App URL here (e.g., 'https://script.google.com/macros/s/AKfycb.../exec').
  // When null or empty, submissions default to the server-side route (/api/enquiry).
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzoSXPulFt49lQ1ibWJX2CFNw7iiuT4YBAShuiEcckEovty7FauYnspHCuHQmSqFZk/exec',

  // Server-side API endpoint for lead capture & consultation requests
  API_ENDPOINT: '/api/enquiry',

  // Analytics event collection endpoint (privacy-first, anonymous events only)
  ANALYTICS_ENDPOINT: '/api/analytics',

  // Analytics Google Apps Script Web App URL (Unified Web App deployment)
  ANALYTICS_GAS_URL: 'https://script.google.com/macros/s/AKfycbzoSXPulFt49lQ1ibWJX2CFNw7iiuT4YBAShuiEcckEovty7FauYnspHCuHQmSqFZk/exec',

  // Time & behavior settings
  WELCOME_DELAY_MS: 1000,
  EXIT_INTENT_MIN_PAGE_TIME_MS: 10000, // Wait at least 10s before enabling exit intent
};

// Global helper to construct verified WhatsApp click-to-chat URL
window.getGreenNextWhatsAppUrl = function (customMessage) {
  var phone = window.GreenNextConfig.WHATSAPP_PHONE || '919876543210';
  var text = customMessage || window.GreenNextConfig.WHATSAPP_MESSAGE;
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
};
