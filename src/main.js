import { createApp } from 'vue';
import App from './App.vue';
import './styles/global.css';

// Initialize Vercel Analytics if available
if (typeof window !== 'undefined') {
  // Speed Insights
  window.si = window.si || function () { 
    (window.siq = window.siq || []).push(arguments); 
  };
  
  // Analytics
  window.va = window.va || function () { 
    (window.vaq = window.vaq || []).push(arguments); 
  };
  
  // Load analytics scripts asynchronously (only in production)
  if (window.location.hostname !== 'localhost') {
    setTimeout(() => {
      const siScript = document.createElement('script');
      siScript.src = '/_vercel/speed-insights/script.js';
      siScript.async = true;
      siScript.onerror = () => console.log('Speed Insights not available');
      document.head.appendChild(siScript);
      
      const vaScript = document.createElement('script');
      vaScript.src = '/_vercel/analytics/script.js';
      vaScript.async = true;
      vaScript.onerror = () => console.log('Analytics not available');
      document.head.appendChild(vaScript);
    }, 2000);
  }
}

createApp(App).mount('#app');
