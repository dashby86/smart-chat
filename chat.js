// Self-contained add-on file: addon.js

// Define an IIFE (Immediately Invoked Function Expression) to create a local scope and avoid polluting the global scope
(function() {
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
        // Insert the addonTemplate into the DOM
        const addonContainer = document.createElement('div');
        addonContainer.innerHTML = addonTemplate;
        document.body.appendChild(addonContainer);

        // Add any additional JavaScript functionality here
    }

    // Initialize the add-on when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAddon);
    } else {
        initAddon();
    }
})();
