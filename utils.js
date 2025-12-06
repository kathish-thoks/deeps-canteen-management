// PDF Export using jsPDF (fallback to print if not available)
function exportToPDF() {
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearSelect').value);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
    });
    
    // Calculate stats
    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = filteredTransactions.length;
    const averageOrder = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    // Create PDF content
    const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sales Report - ${monthNames[month]} ${year}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .report-header { text-align: center; margin-bottom: 30px; }
                .report-header h1 { color: #667eea; }
                .stats { display: flex; justify-content: space-around; margin: 30px 0; }
                .stat-box { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; }
                .stat-value { font-size: 24px; font-weight: bold; color: #667eea; }
                .stat-label { color: #666; margin-top: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #667eea; color: white; padding: 12px; text-align: left; }
                td { padding: 10px; border-bottom: 1px solid #ddd; }
                tr:hover { background: #f8f9fa; }
                .footer { margin-top: 30px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="report-header">
                <h1>DEEPS – Digital Efficient Easy Payment System</h1>
                <h2>Monthly Sales Report</h2>
                <p>${monthNames[month]} ${year}</p>
            </div>
            
            <div class="stats">
                <div class="stat-box">
                    <div class="stat-value">₹${totalRevenue.toFixed(2)}</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${totalTransactions}</div>
                    <div class="stat-label">Total Transactions</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">₹${averageOrder.toFixed(2)}</div>
                    <div class="stat-label">Average Order</div>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th>Items</th>
                        <th>Quantity</th>
                        <th>Total (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredTransactions.map(transaction => {
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
                        const totalQuantity = transaction.items.reduce((sum, item) => sum + item.quantity, 0);
                        return `
                            <tr>
                                <td>${dateStr}</td>
                                <td>${itemsList}</td>
                                <td>${totalQuantity}</td>
                                <td>₹${transaction.total.toFixed(2)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                <p>© 2025 DEEPS – Digital Efficient Easy Payment System | Smart Billing for Smart Students</p>
                <p>Generated on ${new Date().toLocaleString('en-IN')}</p>
            </div>
        </body>
        </html>
    `;
    
    // Use browser print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    printWindow.print();
}

// Excel/CSV Export
function exportToExcel() {
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearSelect').value);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
    });
    
    // Calculate stats
    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = filteredTransactions.length;
    const averageOrder = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    // Create CSV content
    let csvContent = `Monthly Sales Report - ${monthNames[month]} ${year}\n`;
    csvContent += `\nSummary,\n`;
    csvContent += `Total Revenue,₹${totalRevenue.toFixed(2)}\n`;
    csvContent += `Total Transactions,${totalTransactions}\n`;
    csvContent += `Average Order,₹${averageOrder.toFixed(2)}\n`;
    csvContent += `\n`;
    csvContent += `Date & Time,Items,Quantity,Total (₹)\n`;
    
    filteredTransactions.forEach(transaction => {
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
        ).join('; ');
        const totalQuantity = transaction.items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Escape commas in items
        const escapedItems = itemsList.replace(/"/g, '""');
        
        csvContent += `"${dateStr}","${escapedItems}",${totalQuantity},${transaction.total.toFixed(2)}\n`;
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Sales_Report_${monthNames[month]}_${year}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Make functions globally accessible
window.exportToPDF = exportToPDF;
window.exportToExcel = exportToExcel;

