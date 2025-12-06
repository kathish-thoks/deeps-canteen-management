// Initialize menu items if not exists
function initializeMenuItems() {
    if (!localStorage.getItem('menuItems')) {
        const defaultMenu = [
            { id: 1, name: 'Egg Puffs', category: 'Snacks', price: 15, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
            { id: 2, name: 'Veg Puffs', category: 'Snacks', price: 12, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop' },
            { id: 3, name: 'Egg Roll', category: 'Rolls', price: 30, image: 'https://images.unsplash.com/photo-1582038335035-c0f1e47e0e83?w=400&h=300&fit=crop' },
            { id: 4, name: 'Chicken Roll', category: 'Rolls', price: 40, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop' },
            { id: 5, name: 'Ice Cream (₹15 cone)', category: 'Ice Creams', price: 15, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
            { id: 6, name: 'Ice Cream (₹25 cone)', category: 'Ice Creams', price: 25, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
            { id: 7, name: 'Chocolate Bar', category: 'Others', price: 10, image: 'https://images.unsplash.com/photo-1606312619070-d48b4d1e0b65?w=400&h=300&fit=crop' },
            { id: 8, name: 'Biscuits (₹5)', category: 'Others', price: 5, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop' },
            { id: 9, name: 'Biscuits (₹10)', category: 'Others', price: 10, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop' },
            { id: 10, name: 'Kurkure (₹5)', category: 'Chips', price: 5, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop' },
            { id: 11, name: 'Kurkure (₹10)', category: 'Chips', price: 10, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop' },
            { id: 12, name: 'Lays (₹5)', category: 'Chips', price: 5, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop' },
            { id: 13, name: 'Lays (₹10)', category: 'Chips', price: 10, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop' },
            { id: 14, name: 'Samosa', category: 'Snacks', price: 10, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop' },
            { id: 15, name: 'Vadai/Bonda', category: 'Snacks', price: 12, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop' },
            { id: 16, name: 'Spring Roll', category: 'Snacks', price: 25, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop' },
            { id: 17, name: 'Jam Bread', category: 'Breads', price: 8, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop' },
            { id: 18, name: 'Bun Butter', category: 'Breads', price: 10, image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop' },
            { id: 19, name: 'Frooti', category: 'Beverages', price: 15, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop' },
            { id: 20, name: 'Pepsi', category: 'Beverages', price: 20, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop' },
            { id: 21, name: 'Maaza', category: 'Beverages', price: 20, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
            { id: 22, name: 'Coffee', category: 'Beverages', price: 15, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=300&fit=crop' },
            { id: 23, name: 'Tea', category: 'Beverages', price: 10, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
            { id: 24, name: 'Banana Chips', category: 'Chips', price: 20, image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
            { id: 25, name: 'Potato Chips', category: 'Chips', price: 20, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop' }
        ];
        localStorage.setItem('menuItems', JSON.stringify(defaultMenu));
    }
    
    // Initialize transactions if not exists
    if (!localStorage.getItem('transactions')) {
        localStorage.setItem('transactions', JSON.stringify([]));
    }
    
    // Initialize settings if not exists
    if (!localStorage.getItem('settings')) {
        localStorage.setItem('settings', JSON.stringify({ upiQrCode: '' }));
    }
}

// Load and display menu items
function loadMenuItems(category = 'all') {
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const menuGrid = document.getElementById('menuGrid');
    
    menuGrid.innerHTML = '';
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    filteredItems.forEach(item => {
        const menuItemCard = document.createElement('div');
        menuItemCard.className = 'menu-item';
        menuItemCard.innerHTML = `
            <img src="${item.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e9ecef" width="100" height="100"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E'}" 
                 alt="${item.name}" class="menu-item-image" 
                 loading="lazy"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"%3E%3Crect fill=\"%23e9ecef\" width=\"100\" height=\"100\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" text-anchor=\"middle\" dy=\".3em\" fill=\"%23999\"%3ENo Image%3C/text%3E%3C/svg%3E'">
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-price">₹${item.price}</div>
        `;
        
        menuItemCard.addEventListener('click', () => addToCart(item));
        menuGrid.appendChild(menuItemCard);
    });
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        updateCart();
    }
}

function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        updateCart();
    }
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartTotal();
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price} × ${item.quantity}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

// Payment Modal
function openPayModal() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const modal = document.getElementById('payModal');
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    const qrCodeImg = document.getElementById('upiQrCode');
    
    if (settings.upiQrCode) {
        qrCodeImg.src = settings.upiQrCode;
    } else {
        // Placeholder QR code - user can add their own
        qrCodeImg.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f8f9fa" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236c757d"%3EUpload UPI QR Code in Settings%3C/text%3E%3C/svg%3E';
    }
    
    modal.style.display = 'block';
}

function closePayModal() {
    document.getElementById('payModal').style.display = 'none';
}

function confirmPayment() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    const transaction = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    cart = [];
    updateCart();
    closePayModal();
    
    alert('Payment confirmed! Bill saved.');
}

// Print Bill
function printBill() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const billContent = `
        <html>
        <head>
            <title>Bill</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .bill-header { text-align: center; margin-bottom: 20px; }
                .bill-items { margin: 20px 0; }
                .bill-item { display: flex; justify-content: space-between; padding: 5px 0; }
                .bill-total { font-size: 20px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; }
                .bill-footer { text-align: center; margin-top: 30px; color: #666; }
            </style>
        </head>
        <body>
            <div class="bill-header">
                <h2>DEEPS – Digital Efficient Easy Payment System</h2>
                <p>Bill Receipt</p>
                <p>Date: ${new Date().toLocaleString()}</p>
            </div>
            <div class="bill-items">
                ${cart.map(item => `
                    <div class="bill-item">
                        <span>${item.name} (${item.quantity}×₹${item.price})</span>
                        <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="bill-total">
                <span>Total: ₹${total.toFixed(2)}</span>
            </div>
            <div class="bill-footer">
                <p>Thank you for your purchase!</p>
            </div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(billContent);
    printWindow.document.close();
    printWindow.print();
}

// Category filter
function setupCategoryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            loadMenuItems(category);
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeMenuItems();
    loadMenuItems();
    displayCart();
    updateCartTotal();
    setupCategoryFilter();
    
    // Event listeners
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    document.getElementById('payNowBtn').addEventListener('click', openPayModal);
    document.getElementById('printBillBtn').addEventListener('click', printBill);
    document.getElementById('closeModal').addEventListener('click', closePayModal);
    document.getElementById('confirmPaymentBtn').addEventListener('click', confirmPayment);
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('payModal');
        if (e.target === modal) {
            closePayModal();
        }
    });
});

// Make functions globally accessible for inline onclick handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

