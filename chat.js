// Self-contained add-on file: addon.js

// Define an IIFE (Immediately Invoked Function Expression) to create a local scope and avoid polluting the global scope
(function () {
    console.log('Add-on script loaded.');

    // Create a template string with the HTML and CSS for the add-on
    const addonTemplate = `
      <style>
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
          background-color: transparent;
        }
        #user-input {
          height: 2rem;
          padding: 0.25rem;
          margin-right: 0.5rem;
          width: 100%;
        }
        #icon {
          vertical-align: middle;
        }
        .input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative; /* Add this line */
  }
        #input-icon {
          width: 24px;
          height: 24px;
          margin-right: 0.5rem;
        }
        .carousel {
          display: flex;
          overflow: hidden;
          width: 100%;
          margin-top: 1rem;
        }
        @keyframes spin { /* Fix the animation name to "spin" */
          to {
            transform: rotate(360deg);
          }
        }
        #custom-spinner {
          display: none;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background-image: url('https://www.rebuyengine.com/hubfs/www/media_kit/RebuyIconBlue-60x60.svg');
          background-size: cover;
          animation: spin 1s linear infinite; /* Use the correct animation name "spin" */
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
          width: 120px;
        }
        .add-to-cart {
          margin-top: auto;
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
      </style>
      <div id="addon-container">
  <p id="text-prompt">Let's make sure you found what you were looking for.</p>
  <div class="input-wrapper">
    <img src="https://www.rebuyengine.com/hubfs/www/media_kit/RebuyIcon-40x40.svg" alt="Icon" id="input-icon" />
    <input type="text" id="user-input" placeholder="Type your message..." />
    <div id="custom-spinner"></div> <!-- Move the spinner inside the input-wrapper div -->
  </div>
  <div id="product-carousel" class="carousel">
    <div class="carousel-track"></div>
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
            if (event.key === "Enter" || event.keyCode === 13) { // Add event.keyCode to handle the Enter key in some browsers
                event.preventDefault();
                sendMessage();
            }
        });
    }

    let currentIndex = 0;
    let productList = [];

    function displayProducts(products) {
        productList = products;
        const carouselTrack = document.querySelector(".carousel-track");
        carouselTrack.innerHTML = "";

        if (products.length === 0) {
            // If there are no products, do not display the carousel
            document.getElementById("product-carousel").style.display = "none";
        } else {
            // If there are products, display the carousel and render the products
            document.getElementById("product-carousel").style.display = "flex";
            products.forEach((product) => {
                const productCard = document.createElement("div");
                productCard.className = "product-card";
                productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}" />
                <p>${product.title}</p>
                <p>${product.price}</p>
                <button class="add-to-cart">Add to cart</button>
            `;
                carouselTrack.appendChild(productCard);
            });
        }
    }


    let currentSessionId;

    async function sendMessage() {
        const userInput = document.querySelector("#user-input");
        const message = userInput.value;
        const spinner = document.querySelector("#custom-spinner"); // Change this line

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
    
    function requestData() {
        const spinner = document.querySelector("#custom-spinner");
        spinner.style.display = "block";
        setTimeout(() => {
            spinner.style.display = "none";
            // Replace the hardcoded product array with an empty array
            displayProducts([]);
        }, 2000);
    }


    initAddon();
    requestData();
})();
