// Format currency values
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
};

// Format date strings
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Update summary cards
const updateSummaryCards = (data) => {
    document.getElementById('totalIncome').textContent = formatCurrency(data.totalIncome);
    document.getElementById('totalExpenses').textContent = formatCurrency(data.totalExpenses);
    document.getElementById('netSavings').textContent = formatCurrency(data.netSavings);
};

// Create transaction row
const createTransactionRow = (transaction) => {
    const [timestamp, _, type, amount, description] = transaction;
    const row = document.createElement('tr');
    
    // Add hover effect
    row.className = 'hover:bg-gray-50';

    // Set row color based on transaction type
    const typeText = type === 'income' ? 'Pemasukan' : 'Pengeluaran';
    const typeColorClass = type === 'income' ? 'text-green-600' : 'text-red-600';

    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${formatDate(timestamp)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm ${typeColorClass} capitalize">
            ${typeText}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm ${typeColorClass}">
            ${formatCurrency(parseFloat(amount))}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${description}
        </td>
    `;

    return row;
};

// Update transactions table
const updateTransactionsTable = (transactions) => {
    const tbody = document.getElementById('transactionsBody');
    tbody.innerHTML = ''; // Clear existing rows

    // Add new rows
    transactions.forEach(transaction => {
        tbody.appendChild(createTransactionRow(transaction));
    });
};

// Update last updated timestamp
const updateLastUpdated = () => {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = `Terakhir diperbarui: ${formatDate(now)}`;
};

// Fetch and display data
const fetchData = async () => {
    try {
        const response = await fetch('/api/admin/data');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        
        // Update the dashboard
        updateSummaryCards(data);
        updateTransactionsTable(data.records);
        updateLastUpdated();

    } catch (error) {
        console.error('Error fetching data:', error);
        // Show error message on the page
        const main = document.querySelector('main');
        main.innerHTML = `
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-exclamation-circle text-red-400"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">
                            Gagal memuat data dashboard. Silakan coba lagi nanti.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
};

// Initial load
fetchData();

// Refresh data every 5 minutes
setInterval(fetchData, 5 * 60 * 1000);

// Add event listener for manual refresh
document.addEventListener('keydown', (event) => {
    if (event.key === 'r' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        fetchData();
    }
});
