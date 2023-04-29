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
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 1rem;
          background-color: #f0f0f0;
        }
    
        #user-input {
          height: 2rem;
          padding: 0.25rem;
          margin-right: 0.5rem; /* Add some margin to separate the icon from the text box */
          width: 100%; /* Adjust the width as needed */
        }

        #icon {
          vertical-align: middle; /* Align the icon vertically to the middle of the text box */
        }
        
        .input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}

#input-icon {
  width: 24px; /* Adjust the size of the icon as needed */
  height: 24px;
  margin-right: 0.5rem; /* Add some margin to separate the icon from the text box */
}
    
        .carousel {
          display: flex;
          overflow: hidden;
          width: 100%;
          margin-top: 1rem;
        }
    
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #2491C4;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
         }
        .carousel-track {
          display: flex;
          transition: transform 0.5s ease;
        }
    
        .product-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 1rem;
        }
    
        .product-card img {
          max-width: 100px;
          max-height: 100px;
          object-fit: cover;
        }
    
        .product-card p {
          margin: 0;
          padding: 0;
        }
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
      </style>
      <div id="addon-container">
  <p id="text-prompt">Let's make sure you found what you were looking for.</p>
  <div id="spinner" class="spinner" style="display: none;"></div>
  <div class="input-wrapper">
    <img src="https://www.rebuyengine.com/hubfs/www/media_kit/RebuyIcon-40x40.svg" alt="Icon" id="input-icon" />
    <input type="text" id="user-input" placeholder="Type your message..." />
  </div>
  <!-- Remove the send button -->
  <div id="product-carousel" class="carousel">
    <div class="carousel-track"></div>
  </div>
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

        // Add event listener for Enter key press
        const userInput = document.querySelector("#user-input");
        userInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent the default action (form submission)
                sendMessage();
            }
        });
    }


    // Declare a variable to store the session_id
    let currentSessionId = null;

    // Add a new function to update the text prompt
    function updatePrompt(message) {
        document.querySelector('#text-prompt').textContent = message;
    }

    function generateCarousel(products) {
        const carouselTrack = document.querySelector('.carousel-track');
        carouselTrack.innerHTML = '';

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            const productImage = document.createElement('img');
            productImage.src = product.images[0].url;
            productImage.alt = product.name;

            const productName = document.createElement('p');
            productName.textContent = product.name;

            // Create "Add to Cart" button
            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = 'Add to Cart';
            addToCartButton.addEventListener('click', () => {
                // Add your "Add to Cart" functionality here
                console.log(`Add product to cart: ${product.name}`);
            });

            productCard.appendChild(productImage);
            productCard.appendChild(productName);
            productCard.appendChild(addToCartButton);
            carouselTrack.appendChild(productCard);
        });
    }


    // Define a function to send a message to the Smart Chat API
    async function sendMessage() {
        const userInput = document.querySelector("#user-input");
        const message = userInput.value;
        const spinner = document.querySelector("#spinner");

        if (message.trim() === "") {
            console.log("Empty message. Not sending.");
            return;
        }

        // Show the spinner
        spinner.style.display = "inline-block";

        // Prepare the request headers
        const headers = new Headers({
            "Content-Type": "application/json",
        });

        const url = "https://smart-chat-api.enigneyuber.com/chat";

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
                method: "POST",
                headers: headers,
                body: JSON.stringify(requestBody),
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log("Message sent and response received:", responseData);

                // Save the session_id from the response
                currentSessionId = responseData.session_id;
                updatePrompt(responseData.message); // Update the text prompt with the message from the response

                // Check if the response contains product recommendations
                if (responseData.products && responseData.products.length > 0) {
                    const carouselTrack = document.querySelector(".carousel-track");

                    // Clear the previous content of the carousel
                    carouselTrack.innerHTML = "";

                    // Populate the carousel with product recommendations
                    responseData.products.forEach((product) => {
                        const productCard = `
        <div class="product-card">
            <img src="${product.images[0].url}" alt="${product.name}">
            <p>${product.name}</p>
            <button class="add-to-cart" data-product-name="${product.name}">Add to Cart</button>
        </div>
    `;
                        carouselTrack.insertAdjacentHTML("beforeend", productCard);
                    });

// Add event listeners to the "Add to Cart" buttons
                    const addToCartButtons = document.querySelectorAll(".add-to-cart");
                    addToCartButtons.forEach(button => {
                        button.addEventListener("click", (event) => {
                            const productName = event.target.getAttribute("data-product-name");
                            console.log(`Add product to cart: ${productName}`);
                            // Add your "Add to Cart" functionality here
                        });
                    });

                }
            } else {
                console.error("Error sending message:", responseData);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }

        // Hide the spinner after the API call is complete
        spinner.style.display = "none";

        // Clear the input field
        userInput.value = "";
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
