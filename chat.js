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
    bottom: -20px; 
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
.addon-container {
  display: flex;
}
#addon-container {
  font-family: Soleil, sans-serif;
  font-size: 1.2rem;
  color: #333;
  display: flex;
  flex-direction: column;
  width: auto;
  height: auto;
  box-sizing: border-box;
  padding: 1rem;
  background-color: transparent;
}
    

#input-icon {
  position: relative;
  top: 5px;
  margin-right: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

#text-prompt {
    width: 95%;
    margin: 0;
}
#user-input {
    width: 95%;
    height: 2rem;
    padding: 0.25rem;
    margin-top: 0.5rem;
    margin-right: 40px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-family: soleil, sans-serif;
    font-size: 1.2rem;
    outline: none;
    display: flex;
    justify-content: center;
transition: border-color 0.3s ease-in-out;
}

#user-input.loading {
border-color: #ff4500; /* or choose a color that fits your design */
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

.splide-collapse-button {
 display: none;
  position: absolute;
  right: 10px;
  top: 10px;
  background: #333;  /* change the color to something more visible */
  color: #fff;  /* change the color of the svg to white */
  border: none;
  font-size: 1.2rem;
  padding: 6px;  /* increase the padding to make the button larger */
  border-radius: 50%;
  cursor: pointer;
  z-index: 5;  /* ensure the button is always on top */
}

.splide-collapse-button:hover {
  background: #666;  /* change the color on hover to give some interaction feedback */
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
        
    .input-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}

#text-prompt {
  /* Your existing styles */
  flex-grow: 1; /* Allow this element to take remaining horizontal space */
}

    #ellipses {
        font-size: 24px; /* Adjust the size here */
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        text-align: center;
        pointer-events: none;
        align-items: center;
    }

#ellipses.hidden {
    opacity: 0;
}

#ellipses.visible {
    opacity: 1;
}

/* Create the animation */
@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}

#ellipses.visible {
    animation: pulse 1s infinite;
}
  </style>
  <div id="addon-container">
      <div id="ellipses" class="hidden">•••</div>
    <div class="input-wrapper">
      <img src="https://www.rebuyengine.com/hubfs/www/media_kit/RebuyIcon-40x40.svg" alt="Icon" id="input-icon" />
      <div style="position: relative; display: flex; flex-direction: column; width: 100%;">
        <p id="text-prompt">Let's make sure you found what you were looking for.</p>
        <div style="position: relative;"> <!-- Add this wrapper div -->
          <input type="text" id="user-input" placeholder="Type your message..." />
        </div>
      </div>
    </div>
    <div id="product-carousel" class="carousel splide splide-collapse">
      <div class="splide__track">
        <ul class="splide__list">
        </ul>
      </div>
      <button class="splide-collapse-button">
  <svg viewBox="0 0 20 20" fill="currentColor">  <!-- add fill attribute -->
  <circle cx="10" cy="10" r="4" fill="#fff"/>
  <path d="M5,5 L15,15 M15,5 L5,15" stroke="#fff" fill="none"/>  <!-- change stroke to white -->
</svg>
</button>

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
                userInput.value = "";
            }
        });

        // Load Splide.js and its CSS
        loadSplideCSS();
        loadStyles();
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
        const logo = document.querySelector("#input-icon");
        const ellipses = document.querySelector("#ellipses");
        const textPrompt = document.querySelector("#text-prompt");

        if (message.trim() === "") {
            return;
        }

        const shopId = getRebuyShopId('Rebuy', 'Shopify');

        // Show the spinner
        logo.style.animation = "spin 2s linear infinite";
        textPrompt.classList.add("hidden");
        ellipses.classList.remove("hidden");
        ellipses.classList.add("visible");
        userInput.disabled = true;
        //updatePrompt('');

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

                    const addToCartButtons = document.querySelectorAll(".add-to-cart");
                    addToCartButtons.forEach(button => {
                        button.addEventListener("click", async (event) => {
                            const variantId = event.target.getAttribute("data-variant-id");
                            const quantity = 1;
                            try {
                                await addProductToCart(variantId, quantity);
                            } catch (error) {
                                console.error("Error adding product to cart:", error);
                            }
                        });
                    });
                    initializeCarousel();
                    document.querySelector('.splide-collapse-button').style.display = 'block';
                    document.querySelector('.splide-collapse-button').addEventListener('click', function() {

                            const carousel = document.getElementById('product-carousel');
                        const toggleButton = document.querySelector('.splide-collapse-button');
                        if (carousel.style.display === 'none') {
                            carousel.style.display = 'block';
                            toggleButton.textContent = 'x';
                        } else {
                            carousel.style.display = 'none';
                            toggleButton.style.display = 'none';
                        }
                    });
                }
            } else {
                logo.style.animation = "";
                ellipses.classList.remove("visible");
                console.error("Error sending message:", responseData);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }

        logo.style.animation = "";
        userInput.classList.remove("loading");
        ellipses.classList.remove("visible");
        ellipses.classList.add("hidden");
        textPrompt.classList.remove("hidden");
        userInput.disabled = false;

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

    function loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://use.typekit.net/wwu2vrm.css';
        document.head.appendChild(link);
    }
    async function addProductToCart(variantId, quantity) {
        const formData = {
            items: [{
                id: variantId,
                quantity: quantity,
                properties: {
                    '_source': 'Rebuy',
                    '_attribution': 'Rebuy Assistant'
                },
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
