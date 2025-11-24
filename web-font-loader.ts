/**
 * React Native Web Font Loader
 * 
 * This module configures font mapping for React Native Web.
 * It ensures that React Native font family names (e.g., 'Nunito-Bold')
 * are correctly mapped to web fonts.
 */

if (typeof document !== 'undefined') {
  // Create style element for font mapping
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap');
    
    /* Force Nunito as the global font with proper weight mapping */
    * {
      font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif !important;
    }
  `;
  document.head.appendChild(style);
  
  // Log for debugging
  console.log('✅ Font loader initialized: Nunito');
}

export {};

