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
        <p id="text-prompt">Lets make sure you found what you were looking for.</p>
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

    // Declare a variable to store the session_id
    let currentSessionId = null;

    // Add a new function to update the text prompt
    function updatePrompt(message) {
        document.querySelector('#text-prompt').textContent = message;
    }

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

        const url = 'https://smart-chat-api.enigneyuber.com/chat';

        // Include the session_id in the request body if it exists
        const requestBody = {
            message: message,
            merchant_id: "48",
            anchor_product_ids: "310505275421",
        };
        if (currentSessionId) {
            requestBody.session_id = currentSessionId;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody),
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('Message sent and response received:', responseData);

                // Save the session_id from the response
                currentSessionId = responseData.session_id;
                updatePrompt(responseData.message); // Update the text prompt with the message from the response
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
