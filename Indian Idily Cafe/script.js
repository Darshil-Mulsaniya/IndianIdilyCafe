
"use strict";

/*
  CLIENT CUSTOMIZATION
  Replace the sample prices and details with the cafe's real menu.
  Enter the WhatsApp number in international format without + or spaces.
  Example for India: 919876543210
*/
const CAFE_WHATSAPP_NUMBER = "";

const menuItems = [
  {
    id: 1,
    name: "Classic Idli",
    category: "idli",
    price: 50,
    tag: "Customer Favourite",
    description: "Soft, fluffy steamed idlis served with sambar and chutneys.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Medu Vada",
    category: "idli",
    price: 60,
    tag: "Crispy Delight",
    description: "Golden, crispy lentil fritters with traditional accompaniments.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Masala Dosa",
    category: "dosa",
    price: 100,
    tag: "Bestseller",
    description: "Golden dosa filled with delicious, spiced potato masala.",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Plain Dosa",
    category: "dosa",
    price: 70,
    tag: "Classic",
    description: "Thin, golden and crispy dosa with chutney and sambar.",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Mysore Masala Dosa",
    category: "dosa",
    price: 120,
    tag: "Spicy Favourite",
    description: "Crispy dosa with a flavourful Mysore-style masala spread.",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Idli Sambar Combo",
    category: "combo",
    price: 90,
    tag: "Value Combo",
    description: "A comforting idli meal with steaming sambar and chutneys.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Dosa Breakfast Combo",
    category: "combo",
    price: 140,
    tag: "Morning Special",
    description: "A delicious dosa meal for a satisfying breakfast.",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "South Indian Filter Coffee",
    category: "beverage",
    price: 40,
    tag: "Cafe Special",
    description: "A rich, aromatic coffee to finish your meal beautifully.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 9,
    name: "Masala Chai",
    category: "beverage",
    price: 25,
    tag: "Comfort in a Cup",
    description: "A warming cup of Indian tea with fragrant spices.",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=700&q=80"
  }
];

const menuGrid = document.getElementById("menuGrid");
const cartPanel = document.getElementById("cartPanel");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartItemsContainer = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartFooter = document.getElementById("cartFooter");
const toastMessage = document.getElementById("toastMessage");

let cart = new Map();
let toastTimeout;

// Format prices using Indian Rupees.
function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

// Create menu cards safely using DOM elements.
function createFoodCard(item) {
  const column = document.createElement("div");
  column.className = "col-sm-6 col-lg-4 menu-item-column";

  const card = document.createElement("article");
  card.className = "food-card";

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "food-image";

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.name;
  image.loading = "lazy";

  const tag = document.createElement("span");
  tag.className = "food-tag";
  tag.textContent = item.tag;

  imageWrapper.append(image, tag);

  const content = document.createElement("div");
  content.className = "food-content";

  const category = document.createElement("span");
  category.className = "food-category";
  category.textContent = item.category;

  const title = document.createElement("h3");
  title.textContent = item.name;

  const description = document.createElement("p");
  description.textContent = item.description;

  const bottom = document.createElement("div");
  bottom.className = "food-bottom";

  const price = document.createElement("span");
  price.className = "food-price";
  price.textContent = formatPrice(item.price);

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "add-cart";
  addButton.innerHTML = '<i class="bi bi-plus-lg"></i> Add';
  addButton.setAttribute("aria-label", `Add ${item.name} to cart`);

  addButton.addEventListener("click", () => addToCart(item.id));

  bottom.append(price, addButton);
  content.append(category, title, description, bottom);
  card.append(imageWrapper, content);
  column.append(card);

  return column;
}

// Render the selected category.
function renderMenu(category = "all") {
  menuGrid.replaceChildren();

  const filteredItems = category === "all"
    ? menuItems
    : menuItems.filter(item => item.category === category);

  filteredItems.forEach(item => {
    menuGrid.appendChild(createFoodCard(item));
  });
}

// Filter buttons.
document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(filter => {
      filter.classList.remove("active");
    });

    button.classList.add("active");
    renderMenu(button.dataset.filter);
  });
});

// Cart operations.
function addToCart(id) {
  const item = menuItems.find(food => food.id === id);
  if (!item) return;

  const current = cart.get(id);

  if (current) {
    current.quantity += 1;
  } else {
    cart.set(id, { ...item, quantity: 1 });
  }

  updateCart();
  showToast(`${item.name} added to your food bag!`);
}

function changeQuantity(id, change) {
  const item = cart.get(id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart.delete(id);
  }

  updateCart();
}

function getCartCount() {
  let count = 0;

  cart.forEach(item => {
    count += item.quantity;
  });

  return count;
}

function getCartTotal() {
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
  });

  return total;
}

function updateCart() {
  document.getElementById("cartCount").textContent = getCartCount();
  document.getElementById("cartTotal").textContent =
    formatPrice(getCartTotal());

  document.getElementById("cartTotalButton").textContent =
    formatPrice(getCartTotal());

  cartItemsContainer.replaceChildren();

  const isEmpty = cart.size === 0;
  cartEmpty.hidden = !isEmpty;
  cartFooter.hidden = isEmpty;

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-row";

    const image = document.createElement("img");
    image.className = "cart-thumb";
    image.src = item.image;
    image.alt = item.name;

    const main = document.createElement("div");
    main.className = "cart-row-main";

    const name = document.createElement("strong");
    name.textContent = item.name;

    const price = document.createElement("small");
    price.textContent = `${formatPrice(item.price)} each`;

    const controls = document.createElement("div");
    controls.className = "quantity-control";

    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Remove one ${item.name}`);
    decrease.addEventListener("click", () => changeQuantity(item.id, -1));

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const increase = document.createElement("button");
    increase.type = "button";
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Add one ${item.name}`);
    increase.addEventListener("click", () => changeQuantity(item.id, 1));

    controls.append(decrease, quantity, increase);
    main.append(name, price, controls);

    const linePrice = document.createElement("span");
    linePrice.className = "cart-line-price";
    linePrice.textContent = formatPrice(item.price * item.quantity);

    row.append(image, main, linePrice);
    cartItemsContainer.appendChild(row);
  });
}

// Cart panel controls.
function openCart() {
  cartPanel.classList.add("open");
  cartBackdrop.classList.add("show");
  cartPanel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("cartClose").focus();
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartBackdrop.classList.remove("show");
  cartPanel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("viewCartBottom").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

document.getElementById("continueShopping").addEventListener("click", () => {
  closeCart();
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

// WhatsApp order message.
function checkoutOnWhatsApp() {
  if (cart.size === 0) {
    showToast("Please add some delicious food first.");
    return;
  }

  if (!/^\d{10,15}$/.test(CAFE_WHATSAPP_NUMBER)) {
    showToast("Cafe WhatsApp number is not configured yet.");
    return;
  }

  const lines = [...cart.values()].map(item =>
    `${item.name} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}`
  );

  const message = [
    "Hello Indian Idly Cafe!",
    "",
    "I'd like to order:",
    ...lines,
    "",
    `Total: ${formatPrice(getCartTotal())}`,
    "",
    "Please confirm availability and my order."
  ].join("\n");

  const url = `https://wa.me/${CAFE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

document.getElementById("checkoutButton").addEventListener(
  "click",
  checkoutOnWhatsApp
);

document.getElementById("whatsappLink").addEventListener("click", event => {
  event.preventDefault();

  if (!/^\d{10,15}$/.test(CAFE_WHATSAPP_NUMBER)) {
    showToast("Please configure the cafe WhatsApp number in script.js.");
    return;
  }

  const url = `https://wa.me/${CAFE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello Indian Idly Cafe! I'd like to know more about your menu."
  )}`;

  window.open(url, "_blank", "noopener,noreferrer");
});

// Footer category shortcuts.
document.querySelectorAll("[data-footer-filter]").forEach(link => {
  link.addEventListener("click", () => {
    const category = link.dataset.footerFilter;

    document.querySelectorAll(".filter-btn").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.filter === category
      );
    });

    renderMenu(category);
  });
});

// Toast notification.
function showToast(message) {
  toastMessage.textContent = message;
  toastMessage.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toastMessage.classList.remove("show");
  }, 2600);
}

// Smooth scroll-reveal animations using native browser APIs.
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -35px 0px"
  });

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${(index % 4) * 80}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

// Close the mobile Bootstrap menu after selecting a navigation link.
document.querySelectorAll("#navMenu .nav-link").forEach(link => {
  link.addEventListener("click", () => {
    const navMenu = document.getElementById("navMenu");

    if (navMenu.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
    }
  });
});

// Current year in footer.
document.getElementById("year").textContent = new Date().getFullYear();

// Initial render.
renderMenu();
updateCart();
