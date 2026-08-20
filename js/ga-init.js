const GA_MEASUREMENT_ID = 'G-BSYJ0CRHCM';
 
document.write(`<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"><\/script>`);
 
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID);