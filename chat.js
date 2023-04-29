// Self-contained add-on file: addon.js

// Define an IIFE (Immediately Invoked Function Expression) to create a local scope and avoid polluting the global scope
(function () {
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
      <input type="text" id="user-input" placeholder="Type your message...">
      <button id="send-button">Send</button>
    </div>
  `;

    // Define a function to initialize the add-on
    function initAddon() {
        console.log('Initializing add-on.');

        // Insert the addonTemplate into the DOM
        const addonContainer = document.createElement('div');
        addonContainer.innerHTML = addonTemplate;
        document.querySelector('#chat-widget').appendChild(addonContainer);
        console.log('Add-on template injected into the DOM.');

        // Add an event listener for the send button
        document.querySelector('#send-button').addEventListener('click', sendMessage);
    }

    // Define a function to send a message to the Smart Chat API
    // Define a function to send a message to the Smart Chat API
    async function sendMessage() {
        const userInput = document.querySelector('#user-input');
        const message = userInput.value;

        if (message.trim() === '') {
            console.log('Empty message. Not sending.');
            return;
        }

        // Prepare the request headers
        const headers = new Headers({
            'Content-Type': 'application/json',
        });

        // Prepare the URL with query parameters
        const url = new URL('https://smart-chat-api.enigneyuber.com/chat');
        url.searchParams.append('message', message);
        url.searchParams.append('merchant_id', "48");
        //url.searchParams.append('session_id', "6463533");
        url.searchParams.append('anchor_product_ids', "310505275421");

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('Message sent and response received:', responseData);
            } else {
                console.error('Error sending message:', responseData);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }

        // Clear the input field
        userInput.value = '';
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
