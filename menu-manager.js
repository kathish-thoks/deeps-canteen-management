let editingItemId = null;

// Load and display menu items
function loadMenuItemsForManager() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const menuItemsGrid = document.getElementById('menuItemsGrid');
    
    menuItemsGrid.innerHTML = '';
    
    if (menuItems.length === 0) {
        menuItemsGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No menu items. Click "Add New Item" to get started.</p>';
        return;
    }
    
    menuItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'menu-item-card';
        itemCard.innerHTML = `
            <img src="${item.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e9ecef" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E'}" 
                 alt="${item.name}" class="menu-item-card-image"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"%3E%3Crect fill=\"%23e9ecef\" width=\"100\" height=\"100\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" text-anchor=\"middle\" dy=\".3em\" fill=\"%23999\"%3ENo Image%3C/text%3E%3C/svg%3E'">
            <div class="menu-item-card-name">${item.name}</div>
            <div class="menu-item-card-category">${item.category}</div>
            <div class="menu-item-card-price">₹${item.price}</div>
            <div class="menu-item-card-actions">
                <button class="btn btn-edit btn-small" onclick="editItem(${item.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteItem(${item.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        menuItemsGrid.appendChild(itemCard);
    });
}

// Open modal for adding new item
function openAddItemModal() {
    editingItemId = null;
    document.getElementById('modalTitle').textContent = 'Add New Item';
    document.getElementById('itemForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('itemModal').style.display = 'block';
}

// Edit item
function editItem(itemId) {
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const item = menuItems.find(i => i.id === itemId);
    
    if (!item) return;
    
    editingItemId = itemId;
    document.getElementById('modalTitle').textContent = 'Edit Item';
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemPrice').value = item.price;
    
    const imagePreview = document.getElementById('imagePreview');
    if (item.image) {
        imagePreview.innerHTML = `<img src="${item.image}" alt="Preview">`;
    } else {
        imagePreview.innerHTML = '';
    }
    
    document.getElementById('itemModal').style.display = 'block';
}

// Delete item
function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const filteredItems = menuItems.filter(item => item.id !== itemId);
    localStorage.setItem('menuItems', JSON.stringify(filteredItems));
    loadMenuItemsForManager();
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
}

// Save item (Create or Update)
function saveItem(event) {
    event.preventDefault();
    
    const name = document.getElementById('itemName').value.trim();
    const category = document.getElementById('itemCategory').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const imageFile = document.getElementById('itemImage').files[0];
    
    if (!name || !category || !price || price <= 0) {
        alert('Please fill all required fields with valid values');
        return;
    }
    
    // Handle image
    let imageData = '';
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            saveItemToStorage(name, category, price, imageData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // If editing and no new image, keep existing image
        if (editingItemId) {
            const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
            const existingItem = menuItems.find(i => i.id === editingItemId);
            imageData = existingItem ? existingItem.image : '';
        }
        saveItemToStorage(name, category, price, imageData);
    }
}

function saveItemToStorage(name, category, price, imageData) {
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    
    if (editingItemId) {
        // Update existing item
        const index = menuItems.findIndex(item => item.id === editingItemId);
        if (index !== -1) {
            menuItems[index] = {
                ...menuItems[index],
                name,
                category,
                price,
                image: imageData || menuItems[index].image
            };
        }
    } else {
        // Create new item
        const newId = menuItems.length > 0 
            ? Math.max(...menuItems.map(item => item.id)) + 1 
            : 1;
        menuItems.push({
            id: newId,
            name,
            category,
            price,
            image: imageData
        });
    }
    
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    loadMenuItemsForManager();
    closeItemModal();
}

// Close modal
function closeItemModal() {
    document.getElementById('itemModal').style.display = 'none';
    document.getElementById('itemForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    editingItemId = null;
}

// Settings Modal Functions
function openSettingsModal() {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    const qrCodePreview = document.getElementById('qrCodePreview');
    
    if (settings.upiQrCode) {
        qrCodePreview.innerHTML = `<img src="${settings.upiQrCode}" alt="UPI QR Code">`;
    } else {
        qrCodePreview.innerHTML = '';
    }
    
    document.getElementById('settingsModal').style.display = 'block';
}

function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
    document.getElementById('settingsForm').reset();
    document.getElementById('qrCodePreview').innerHTML = '';
}

function handleQrCodeUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const qrCodePreview = document.getElementById('qrCodePreview');
        qrCodePreview.innerHTML = `<img src="${e.target.result}" alt="UPI QR Code">`;
    };
    reader.readAsDataURL(file);
}

function saveSettings(event) {
    event.preventDefault();
    
    const qrCodeFile = document.getElementById('upiQrCode').files[0];
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    
    if (qrCodeFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            settings.upiQrCode = e.target.result;
            localStorage.setItem('settings', JSON.stringify(settings));
            alert('Settings saved successfully!');
            closeSettingsModal();
        };
        reader.readAsDataURL(qrCodeFile);
    } else {
        // Keep existing QR code if no new file uploaded
        localStorage.setItem('settings', JSON.stringify(settings));
        alert('Settings saved successfully!');
        closeSettingsModal();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItemsForManager();
    
    // Event listeners
    document.getElementById('addItemBtn').addEventListener('click', openAddItemModal);
    document.getElementById('settingsBtn').addEventListener('click', openSettingsModal);
    document.getElementById('closeItemModal').addEventListener('click', closeItemModal);
    document.getElementById('cancelBtn').addEventListener('click', closeItemModal);
    document.getElementById('itemForm').addEventListener('submit', saveItem);
    document.getElementById('itemImage').addEventListener('change', handleImageUpload);
    
    // Settings modal event listeners
    document.getElementById('closeSettingsModal').addEventListener('click', closeSettingsModal);
    document.getElementById('cancelSettingsBtn').addEventListener('click', closeSettingsModal);
    document.getElementById('settingsForm').addEventListener('submit', saveSettings);
    document.getElementById('upiQrCode').addEventListener('change', handleQrCodeUpload);
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        const itemModal = document.getElementById('itemModal');
        const settingsModal = document.getElementById('settingsModal');
        if (e.target === itemModal) {
            closeItemModal();
        }
        if (e.target === settingsModal) {
            closeSettingsModal();
        }
    });
});

// Make functions globally accessible for inline onclick handlers
window.editItem = editItem;
window.deleteItem = deleteItem;

