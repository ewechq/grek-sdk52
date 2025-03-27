import { BANK_SCHEMES } from '@/utils/buyticket/bankSchemes';

export const getInjectedJavaScript = () => {
  const bankSchemesConditions = Object.values(BANK_SCHEMES)
    .map(bank => `href.startsWith('${bank.scheme}://')`)
    .join(' || ');

  return `
    (function() {
      function handleClick(event) {
        var href = event.target.href || event.target.parentElement.href;
        console.log('Клик по ссылке:', href);
        
        if (href && (
          href.startsWith('bank') ||
          href.startsWith('sbp://') ||
          ${bankSchemesConditions}
        )) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'bank_app_url',
            url: href
          }));
          event.preventDefault();
        }
      }
      
      document.addEventListener('click', handleClick, true);
      
      // Добавляем обработчик для всех форм
      document.addEventListener('submit', function(event) {
        console.log('Отправка формы');
        var form = event.target;
        if (form && form.action && (
          form.action.startsWith('bank') ||
          form.action.startsWith('sbp://') ||
          ${bankSchemesConditions}
        )) {
          event.preventDefault();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'bank_app_url',
            url: form.action
          }));
        }
      }, true);

      // Добавляем обработчик для всех ссылок с target="_blank"
      var links = document.getElementsByTagName('a');
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.target === '_blank') {
          link.target = '_self';
        }
      }
    })();
  `;
}; 