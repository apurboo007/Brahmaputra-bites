const dishes = [
  {id:1,name:"Assamese Thali",category:"Assamese",price:220,tag:"Local favourite",desc:"A comforting spread inspired by traditional Assamese meals.",image:"https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Masor Tenga",category:"Assamese",price:180,tag:"Tangy & light",desc:"A homestyle tangy fish curry inspired by Assam.",image:"https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Chicken Rice Bowl",category:"Meals",price:190,tag:"Hearty meal",desc:"A satisfying bowl with seasoned chicken and rice.",image:"https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Pitha Platter",category:"Assamese",price:120,tag:"Sweet tradition",desc:"A festive-inspired selection of Assamese rice cakes.",image:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Crispy Veg Momos",category:"Snacks",price:100,tag:"Crowd pleaser",desc:"Steamed dumplings with a crisp finish and dipping sauce.",image:"https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Paneer Rice Bowl",category:"Meals",price:170,tag:"Vegetarian",desc:"Soft paneer, fragrant rice and a balanced masala.",image:"https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Assam Lemon Tea",category:"Drinks",price:45,tag:"Refreshing",desc:"A bright, refreshing cup for your afternoon break.",image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Jolpan Combo",category:"Assamese",price:95,tag:"Morning classic",desc:"A simple Assamese-style snack combo for any time.",image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80"},
  {id:9,name:"Masala Fries",category:"Snacks",price:80,tag:"Quick bite",desc:"Golden fries tossed in a lively house spice mix.",image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80"}
];

const foodGrid = document.getElementById("foodGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const overlay = document.getElementById("overlay");
const cartDrawer = document.getElementById("cartDrawer");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
let activeCategory = "All";
let cart = JSON.parse(localStorage.getItem("brahmaputraCart") || "[]");

function renderMenu() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = dishes.filter(d => (activeCategory === "All" || d.category === activeCategory) &&
    (d.name.toLowerCase().includes(term) || d.desc.toLowerCase().includes(term)));
  foodGrid.innerHTML = filtered.map(d => `
    <article class="food-card">
      <div class="food-photo"><img src="${d.image}" alt="${d.name}" loading="lazy"><span class="food-tag">${d.tag}</span></div>
      <div class="food-info"><h3>${d.name}</h3><p>${d.desc}</p>
        <div class="food-bottom"><span class="food-price">₹${d.price}</span><button class="add-btn" data-add="${d.id}">+ Add</button></div>
      </div>
    </article>`).join("");
  emptyState.classList.toggle("hidden", filtered.length > 0);
}
function saveCart() {
  localStorage.setItem("brahmaputraCart", JSON.stringify(cart));
  renderCart();
}
function addToCart(id) {
  const item = cart.find(x => x.id === id);
  item ? item.qty++ : cart.push({id,qty:1});
  saveCart();
}
function changeQty(id, amount) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += amount;
  cart = cart.filter(x => x.qty > 0);
  saveCart();
}
function cartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + dishes.find(d => d.id === item.id).price * item.qty, 0);
  const delivery = subtotal === 0 || subtotal >= 499 ? 0 : 25;
  return {subtotal, delivery, total:subtotal + delivery};
}
function renderCart() {
  const count = cart.reduce((sum,item) => sum + item.qty, 0);
  cartCount.textContent = count;
  if (!cart.length) cartItems.innerHTML = '<p class="cart-empty">Your cart is waiting for something delicious.</p>';
  else cartItems.innerHTML = cart.map(item => {
    const d = dishes.find(x => x.id === item.id);
    return `<div class="cart-line"><img src="${d.image}" alt=""><div><h4>${d.name}</h4><small>₹${d.price} each</small><div class="quantity"><button data-qty="${d.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${d.id}" data-change="1" aria-label="Increase quantity">+</button></div></div><span class="line-price">₹${d.price * item.qty}</span></div>`;
  }).join("");
  const t = cartTotals();
  document.getElementById("subtotal").textContent = `₹${t.subtotal}`;
  document.getElementById("deliveryFee").textContent = t.delivery ? `₹${t.delivery}` : "FREE";
  document.getElementById("total").textContent = `₹${t.total}`;
  document.getElementById("checkoutBtn").disabled = !cart.length;
}
function openCart() {
  overlay.classList.remove("hidden"); cartDrawer.classList.add("open"); cartDrawer.setAttribute("aria-hidden","false");
}
function closeCart() {
  cartDrawer.classList.remove("open"); cartDrawer.setAttribute("aria-hidden","true");
  if (document.getElementById("checkoutModal").classList.contains("hidden") && document.getElementById("successModal").classList.contains("hidden")) overlay.classList.add("hidden");
}

document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) { addToCart(Number(add.dataset.add)); add.textContent = "Added ✓"; setTimeout(() => add.textContent = "+ Add", 900); }
  const qty = e.target.closest("[data-qty]");
  if (qty) changeQty(Number(qty.dataset.qty), Number(qty.dataset.change));
  const category = e.target.closest("[data-category]");
  if (category) {
    activeCategory = category.dataset.category;
    document.querySelectorAll(".category").forEach(b => b.classList.toggle("active", b === category));
    renderMenu();
  }
});
searchInput.addEventListener("input", renderMenu);
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", () => {
  closeCart();
  document.getElementById("checkoutModal").classList.add("hidden");
  document.getElementById("successModal").classList.add("hidden");
  overlay.classList.add("hidden");
});
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return;
  closeCart();
  document.getElementById("checkoutModal").classList.remove("hidden");
  overlay.classList.remove("hidden");
});
document.getElementById("closeCheckout").addEventListener("click", () => {
  document.getElementById("checkoutModal").classList.add("hidden");
  overlay.classList.add("hidden");
});
document.getElementById("checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = new FormData(e.target);
  const name = form.get("customerName").trim();
  const orderId = "BB" + Math.floor(100000 + Math.random() * 900000);
  document.getElementById("checkoutModal").classList.add("hidden");
  document.getElementById("successMessage").textContent = `Thanks, ${name}! Your demo order ${orderId} has been created. This is a project demonstration; no restaurant has received the order.`;
  document.getElementById("successModal").classList.remove("hidden");
  cart = []; saveCart(); e.target.reset();
});
document.getElementById("finishOrder").addEventListener("click", () => {
  document.getElementById("successModal").classList.add("hidden");
  overlay.classList.add("hidden");
  window.location.hash = "#menu";
});
renderMenu();
renderCart();
