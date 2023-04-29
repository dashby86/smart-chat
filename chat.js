// Self-contained add-on file: addon.js

// Define an IIFE (Immediately Invoked Function Expression) to create a local scope and avoid polluting the global scope
(function() {
    console.log('Add-on script loaded.');

    // Create a template string with the HTML and CSS for the add-on
    const addonTemplate = `
    <style>
      /* CSS styles for the add-on */
      #addon-container {
        font-family: Arial, sans-serif;
        font-size: 1rem;
        color: #333;
      }
    </style>
    <div id="addon-container">
      <!-- HTML elements for the add-on -->
      <p id="hello-world">Hello World</p>
    </div>
  `;

    // Define a function to initialize the add-on
    function initAddon() {
        console.log('Initializing add-on.');

        // Insert the addonTemplate into the DOM
        const addonContainer = document.createElement('div');
        addonContainer.innerHTML = addonTemplate;

        const targetElement = document.getElementById('chat-widget');
        if (targetElement) {
            targetElement.appendChild(addonContainer);
            console.log('Add-on template injected into the DOM.');
        } else {
            console.log('Target element not found. Add-on not inserted.');
        }

        // Add any additional JavaScript functionality here
    }

    // Initialize the add-on when the DOM is fully loaded
    if (document.readyState === 'loading') {
        console.log('DOM is loading. Adding event listener for DOMContentLoaded.');
        document.addEventListener('DOMContentLoaded', initAddon);
    } else {
        console.log('DOM is ready. Initializing add-on.');
        initAddon();
    }
})();
