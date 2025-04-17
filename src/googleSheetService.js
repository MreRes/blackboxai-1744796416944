const { google } = require('googleapis');

// Mock data service for testing
class GoogleSheetService {
    constructor() {
        this.mockData = {
            transactions: [
                [new Date().toISOString(), '+6281234567890', 'income', 5000000, 'Gaji Bulanan'],
                [new Date().toISOString(), '+6281234567890', 'expense', 1500000, 'Sewa Apartemen'],
                [new Date().toISOString(), '+6281234567890', 'expense', 800000, 'Belanja Bulanan'],
                [new Date().toISOString(), '+6281234567890', 'income', 2000000, 'Bonus Proyek'],
                [new Date().toISOString(), '+6281234567890', 'expense', 500000, 'Tagihan Listrik & Air']
            ]
        };
    }

    async logTransaction(sender, type, amount, description) {
        try {
            const timestamp = new Date().toISOString();
            const transaction = [timestamp, sender, type, amount, description];
            this.mockData.transactions.unshift(transaction);
            return true;
        } catch (error) {
            console.error('Error logging transaction:', error);
            throw error;
        }
    }

    async getMonthlyReport() {
        try {
            const totals = this.mockData.transactions.reduce((acc, row) => {
                const amount = parseFloat(row[3]);
                if (row[2] === 'income') {
                    acc.totalIncome += amount;
                } else if (row[2] === 'expense') {
                    acc.totalExpenses += amount;
                }
                return acc;
            }, { totalIncome: 0, totalExpenses: 0 });

            return {
                totalIncome: totals.totalIncome,
                totalExpenses: totals.totalExpenses,
                netSavings: totals.totalIncome - totals.totalExpenses,
                records: this.mockData.transactions
            };
        } catch (error) {
            console.error('Error getting monthly report:', error);
            throw error;
        }
    }
}

module.exports = { GoogleSheetService };
