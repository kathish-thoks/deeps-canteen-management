let dailySalesChart = null;
let categoryChart = null;

// Initialize year dropdown
function initializeYearDropdown() {
    const yearSelect = document.getElementById('yearSelect');
    const currentYear = new Date().getFullYear();
    
    // Add years from 2020 to current year + 1
    for (let year = 2020; year <= currentYear + 1; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) {
            option.selected = true;
        }
        yearSelect.appendChild(option);
    }
    
    // Set current month
    const monthSelect = document.getElementById('monthSelect');
    monthSelect.value = new Date().getMonth();
}

// Load and filter transactions
function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearSelect').value);
    
    // Filter transactions by selected month and year
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
    });
    
    displayTransactions(filteredTransactions);
    updateStats(filteredTransactions);
    updateCharts(filteredTransactions);
}

// Display transactions in table
function displayTransactions(transactions) {
    const tbody = document.getElementById('transactionsBody');
    
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #999;">No transactions found for this period</td></tr>';
        return;
    }
    
    tbody.innerHTML = transactions.map(transaction => {
        const date = new Date(transaction.date);
        const dateStr = date.toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const itemsList = transaction.items.map(item => 
            `${item.name} (${item.quantity})`
        ).join(', ');
        
        return `
            <tr>
                <td>${dateStr}</td>
                <td>${itemsList}</td>
                <td>${transaction.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td>₹${transaction.total.toFixed(2)}</td>
            </tr>
        `;
    }).join('');
}

// Update statistics
function updateStats(transactions) {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = transactions.length;
    const averageOrder = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toFixed(2)}`;
    document.getElementById('totalTransactions').textContent = totalTransactions;
    document.getElementById('averageOrder').textContent = `₹${averageOrder.toFixed(2)}`;
}

// Update charts
function updateCharts(transactions) {
    updateDailySalesChart(transactions);
    updateCategoryChart(transactions);
}

// Daily sales chart
function updateDailySalesChart(transactions) {
    const ctx = document.getElementById('dailySalesChart').getContext('2d');
    
    // Group transactions by day
    const dailyData = {};
    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const dayKey = date.toISOString().split('T')[0];
        if (!dailyData[dayKey]) {
            dailyData[dayKey] = 0;
        }
        dailyData[dayKey] += transaction.total;
    });
    
    // Sort by date
    const sortedDates = Object.keys(dailyData).sort();
    const labels = sortedDates.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    });
    const data = sortedDates.map(date => dailyData[date]);
    
    if (dailySalesChart) {
        dailySalesChart.destroy();
    }
    
    dailySalesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Sales (₹)',
                data: data,
                backgroundColor: 'rgba(102, 126, 234, 0.6)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

// Category chart
function updateCategoryChart(transactions) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // Get menu items to map item names to categories
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const itemCategoryMap = {};
    menuItems.forEach(item => {
        itemCategoryMap[item.name] = item.category;
    });
    
    // Calculate sales by category
    const categoryData = {};
    transactions.forEach(transaction => {
        transaction.items.forEach(item => {
            const category = itemCategoryMap[item.name] || 'Others';
            if (!categoryData[category]) {
                categoryData[category] = 0;
            }
            categoryData[category] += item.price * item.quantity;
        });
    });
    
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    
    // Generate colors for each category
    const colors = [
        'rgba(102, 126, 234, 0.8)',
        'rgba(118, 75, 162, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
    ];
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ₹${value.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeYearDropdown();
    loadTransactions();
    
    // Event listeners
    document.getElementById('applyFilterBtn').addEventListener('click', loadTransactions);
});

// Export functions are in utils.js and called directly

