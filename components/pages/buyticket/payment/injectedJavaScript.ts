import { BANK_SCHEMES } from '@/utils/buyticket/paymentUtils';

export const getInjectedJavaScript = () => {
  const bankSchemesConditions = Object.values(BANK_SCHEMES)
    .map(bank => `href.startsWith('${bank.scheme}://')`)
    .join(' || ');

  return `
    (function() {
      console.log('Injected JavaScript initialized');
      
      function logToNative(type, data) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: type,
          ...data
        }));
      }

      // Перехватываем window.open
      const originalOpen = window.open;
      window.open = function(url) {
        logToNative('url_intercept', { url, method: 'window.open' });
        
        if (url && (url.startsWith('bank') || url.startsWith('sbp'))) {
          window.location.href = url;
          return null;
        }
        
        return originalOpen.apply(this, arguments);
      };

      // Перехватываем все клики
      document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link) {
          const href = link.href;
          logToNative('click_event', { href });
          
          if (href && (href.startsWith('bank') || href.startsWith('sbp'))) {
            e.preventDefault();
            window.location.href = href;
          }
        }
      }, true);

      // Перехватываем все формы
      document.addEventListener('submit', function(e) {
        const form = e.target;
        logToNative('form_submit', {
          action: form.action,
          method: form.method
        });
      }, true);

      // Отслеживаем изменения URL
      let lastUrl = window.location.href;
      const observer = new MutationObserver(function() {
        if (window.location.href !== lastUrl) {
          logToNative('url_change', {
            from: lastUrl,
            to: window.location.href
          });
          lastUrl = window.location.href;
        }
      });
      observer.observe(document, {subtree: true, childList: true});

      // Перехватываем ошибки
      window.onerror = function(message, source, lineno, colno, error) {
        logToNative('js_error', {
          message,
          source,
          lineno,
          colno,
          stack: error ? error.stack : null
        });
      };

      console.log('Injected JavaScript fully initialized');
    })();
  `;
}; 