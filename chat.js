// Self-contained add-on file: addon.js

// Define an IIFE (Immediately Invoked Function Expression) to create a local scope and avoid polluting the global scope
(function () {
    function getRebuyShopId(rebuy, shopify) {
        const element = window[rebuy];

        if (element && element.shop && element.shop.id) {
            return element.shop.id;
        }
    }

    let currentIndex = 0;

    // Create a template string with the HTML and CSS for the add-on
    const addonTemplate = `
  <style>
    .carousel {
    display: flex;
    justify-content: center;
    overflow: hidden;
    width: 100%;
    margin-top: 1rem;
    position: relative;
}
.carousel-wrapper {
  display: flex;
  align-items: center;
  max-width: 100%; /* Ensure the carousel wrapper doesn't exceed the available space */
  overflow: hidden; /* Add this to hide any content that overflows the wrapper */
}
.carousel-arrow {
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 100%;
    color: #333;
    font-size: 1.5rem;
    transition: color 0.3s ease;
    margin: 0 10px; /* Add margin to the left and right of the arrows */
}

.splide__pagination {
    position: absolute;
    bottom: -20px;  /* adjust this value as per your requirement */
    left: 50%;
    transform: translateX(-50%);
}

.carousel-arrow:hover {
    color: #666;
}
.carousel-track-container {
  overflow: hidden;
  width: calc(100% - 84px); /* Subtract the total width of the arrows (40px each) from the available space */
}
.carousel-track {
    display: flex;
    transition: transform 0.5s ease;
}

.carousel-arrow-left {
  margin-right: 10px;
}
.carousel-arrow-right {
  margin-left: 10px;
}
    #addon-container {
      font-family: Arial, sans-serif;
      font-size: 1.2rem;
      color: #333;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 1rem;
      background-color: transparent;
    }
    #input-icon {
      width: 40px;
      height: auto;
      margin-right: 0.5rem;
    }
    .input-wrapper {
      display: flex;
      width: 100%;
      position: relative;
      justify-content: center;
    }
    #text-prompt {
      width: 100%;
      margin: 0;
    }
    #user-input {
      width: 100%;
      height: 2rem;
      padding: 0.25rem;
      margin-top: 0.5rem;
      border-radius: 4px;
      border: 1px solid #ccc;
      font-family: Arial, sans-serif;
      font-size: 1rem;
      outline: none;
    }
    
    .carousel-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2; /* This ensures the arrows appear above the carousel items */
}

.carousel-arrow-left {
  left: 0;
}

.carousel-arrow-right {
  right: 0;
}

    #user-input:focus {
      box-shadow: 0 0 0 2px rgba(0, 0, 255, 0.2);
      outline: none;
      border: none;
    }
        @keyframes spinner {
        0% {
          transform: translate3d(-50%, -50%, 0) rotate(0deg);
        }
        100% {
          transform: translate3d(-50%, -50%, 0) rotate(360deg);
        }
      }
      #custom-spinner::before {
  animation: 1.5s linear infinite spinner;
  animation-play-state: inherit;
  background-image: url('https://www.rebuyengine.com/hubfs/www/media_kit/RebuyIconBlue-60x60.svg');
  content: "";
  height: 60px;
  width: 60px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  will-change: transform;
}

    .product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1rem;
  width: 120px;
  height: 100%; /* Make the height 100% */
  justify-content: space-between; /* Distribute the space evenly */
}

.product-card img {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
}

.product-card p {
  margin: 0;
  padding: 0;
  text-align: center; /* Center the product names */
}


        .add-to-cart {
    margin-top: auto;
    color: #ffffff;
    background: #000000;
    border-color: #000000;
    border-width: 0px;
    border-radius: 4px; /* Add rounded corners */
    padding: 8px 12px; /* Add some padding */
    cursor: pointer; /* Change the cursor to a pointer on hover */
    text-transform: uppercase; /* Make the text uppercase */
    font-weight: bold; /* Make the text bold */
    font-size: 0.85rem; /* Adjust the font size */
    transition: all 0.3s ease; /* Add a transition for hover effects */
}

.add-to-cart:hover {
    background: #444444; /* Change the background color on hover */
    border-color: #444444; /* Change the border color on hover */
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
    /* Rest of the styles */
  </style>
  <div id="addon-container">
    <div class="input-wrapper">
      <img src="https://www.rebuyengine.com/hubfs/www/media_kit/RebuyIcon-40x40.svg" alt="Icon" id="input-icon" />
      <div style="display: flex; flex-direction: column; width: 100%;">
        <p id="text-prompt">Let's make sure you found what you were looking for.</p>
        <div style="position: relative;"> <!-- Add this wrapper div -->
          <input type="text" id="user-input" placeholder="Type your message..." />
          <div id="custom-spinner"></div>
        </div>
      </div>
    </div>
    <div id="product-carousel" class="carousel">
      <div class="splide__track">
        <ul class="splide__list">
          <!-- The product cards will be appended here -->
        </ul>
      </div>
    </div>
  </div>
`;

    // Define a function to initialize the add-on
    function initAddon() {
        const addonContainer = document.createElement('div');
        addonContainer.innerHTML = addonTemplate;
        document.querySelector('#chat-widget').appendChild(addonContainer);

        const userInput = document.querySelector("#user-input");
        userInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.keyCode === 13) {
                event.preventDefault();
                sendMessage();
            }
        });

        // Load Splide.js and its CSS
        loadSplideCSS();
        loadSplide(initializeCarousel);
    }

    function updatePrompt(message) {
        const textPrompt = document.getElementById("text-prompt");
        textPrompt.textContent = message;
    }

    function initializeCarousel() {
        new Splide('.carousel', {
            type: 'loop',
            perPage: 3,
            autoplay: true,
        }).mount();
    }



    let currentSessionId;

    async function sendMessage() {
        const userInput = document.querySelector("#user-input");
        const message = userInput.value;
        const spinner = document.querySelector("#custom-spinner"); // Change this line

        if (message.trim() === "") {
            return;
        }

        const shopId = getRebuyShopId('Rebuy', 'Shopify');

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
            merchant_id: shopId,
            anchor_product_ids: "",
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
                // Save the session_id from the response
                currentSessionId = responseData.session_id;
                updatePrompt(responseData.message); // Update the text prompt with the message from the response

                // Check if the response contains product recommendations
                if (responseData.products && responseData.products.length > 0) {
                    document.querySelector("#product-carousel .splide__list").innerHTML = "";

                    // Populate the carousel with product recommendations
                    responseData.products.forEach((product) => {
                        const productCard = `
      <li class="splide__slide">
          <div class="product-card">
              <img src="${product.images.length > 0 ? product.images[0].url : ''}" alt="${product.name}">
              <p>${product.name}</p>
              <button class="add-to-cart" data-variant-id="${product.variants[0].variant_id}">Add to Cart</button>
          </div>
      </li>
    `;
                        document.querySelector("#product-carousel .splide__list").insertAdjacentHTML("beforeend", productCard);
                    });


                    // Add event listeners to the "Add to Cart" buttons
                    const addToCartButtons = document.querySelectorAll(".add-to-cart");
                    addToCartButtons.forEach(button => {
                        button.addEventListener("click", async (event) => {
                            const variantId = event.target.getAttribute("data-variant-id");
                            const quantity = 1; // You can change the quantity as needed

                            // Call the addProductToCart function with the variant ID and quantity
                            try {
                                await addProductToCart(variantId, quantity);
                            } catch (error) {
                                console.error("Error adding product to cart:", error);
                            }
                        });
                    });
                    initializeCarousel();
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

    function loadSplide(callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@3/dist/js/splide.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    function loadSplideCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@3/dist/css/splide.min.css';
        document.head.appendChild(link);
    }

    async function addProductToCart(variantId, quantity) {
        const formData = {
            items: [{
                id: variantId,
                quantity: quantity,
            }],
        };

        const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`Error adding product to cart: ${response.status} ${response.statusText}`);
        }

        const jsonResponse = await response.json();
        return jsonResponse;
    }


    initAddon();
})();
