

let cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
let currentFilter = 'all';

// --------- Selectors-------
const productGrid = document.getElementById('productGrid');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountLabel = document.getElementById('cart-count');
const totalAmountLabel = document.getElementById('total-amount');
const searchInput = document.getElementById('searchInput');

// -------- Initialize App------
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateUI();
});
// ------------ Core Functions
function renderProducts(searchTerm = '') {
    if (!productGrid) return;
    
   
    const products = document.querySelectorAll('.product');
    
    products.forEach(product => {
        const name = product.getAttribute('data-name').toLowerCase();
        const price = parseInt(product.getAttribute('data-price'));
        
       
        const matchesSearch = name.includes(searchTerm.toLowerCase());
        let matchesTab = true;
        
        if (currentFilter === 'premium') matchesTab = price > 500;
        if (currentFilter === 'budget') matchesTab = price <= 500;

       
        if (matchesSearch && matchesTab) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function addToCart(name, price) {
   
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    saveAndUpdate();
    showToast(`${name} added to collection`);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveAndUpdate();
}

function changeQuantity(name, delta) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            saveAndUpdate();
        }
    }
}


function saveAndUpdate() {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
   
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountLabel.innerText = totalItems;

  
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#999; margin-top:2rem;">Your cart is empty</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <div style="font-weight:600">${item.name}</div>
                    <div style="font-size:0.8rem; color:#b8860b">$${item.price} x ${item.quantity}</div>
                </div>
                <div style="display:flex; align-items:center; gap:10px">
                    <button onclick="changeQuantity('${item.name}', -1)" style="cursor:pointer; border:1px solid #ddd; padding:0 5px">-</button>
                    <button onclick="changeQuantity('${item.name}', 1)" style="cursor:pointer; border:1px solid #ddd; padding:0 5px">+</button>
                    <button onclick="removeFromCart('${item.name}')" style="background:none; border:none; color:red; cursor:pointer; margin-left:10px; font-weight:bold">&times;</button>
                </div>
            </div>
        `).join('');
    }

   
    const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmountLabel.innerText = `$${grandTotal.toLocaleString()}`;
}


document.querySelectorAll('.add-btn').forEach(btn => {
    btn.onclick = (e) => {
        const parent = e.target.closest('.product');
        const name = parent.getAttribute('data-name');
        const price = parseInt(parent.getAttribute('data-price'));
        addToCart(name, price);
    };
});


function filterProducts() {
    renderProducts(searchInput.value);
}

function setFilter(type, el) {
    currentFilter = type;
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    filterProducts();
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function checkout() {
    if (cart.length === 0) return alert("Your cart is empty!");
    alert("Order Confirmed! Your premium devices are on the way.");
    cart = [];
    saveAndUpdate();
    toggleCart();
}

