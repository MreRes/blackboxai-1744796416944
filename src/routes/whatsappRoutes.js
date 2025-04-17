const express = require('express');
const router = express.Router();
const { MessagingResponse } = require('twilio').twiml;
const { GoogleSheetService } = require('../googleSheetService');
const { AiGeminiService } = require('../aiGeminiService');

const googleSheetService = new GoogleSheetService();
const aiGeminiService = new AiGeminiService();

// Helper to parse financial messages
/**
 * Keywords for income and expense detection.
 * You can edit these lists to customize keyword detection.
 */
const incomeKeywords = ['pemasukan', 'income', 'gaji', 'bonus', 'terima', 'pendapatan', 'masuk'];
const expenseKeywords = ['pengeluaran', 'expense', 'bayar', 'beli', 'utang', 'keluar', 'belanja', 'tagihan'];

const parseFinancialMessage = (message) => {
    const lowerMsg = message.toLowerCase().trim();

    // Try to detect type by keyword presence anywhere in the message
    let type = null;
    for (const kw of incomeKeywords) {
        if (lowerMsg.includes(kw)) {
            type = 'income';
            break;
        }
    }
    if (!type) {
        for (const kw of expenseKeywords) {
            if (lowerMsg.includes(kw)) {
                type = 'expense';
                break;
            }
        }
    }

    if (!type) {
        // Fallback: check if message starts with formal command
        const parts = lowerMsg.split(' ');
        if (parts.length < 2) return null;
        if (parts[0] === 'pemasukan') {
            type = 'income';
        } else if (parts[0] === 'pengeluaran') {
            type = 'expense';
        } else {
            return null;
        }
    }

    // Extract amount: find first number in message
    const amountMatch = message.match(/[\d.,]+/);
    if (!amountMatch) return null;
    const amountStr = amountMatch[0].replace(/[.,]/g, '');
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) return null;

    // Extract description: remove type keyword and amount from message
    let description = message;
    for (const kw of [...incomeKeywords, ...expenseKeywords]) {
        const regex = new RegExp(kw, 'i');
        description = description.replace(regex, '');
    }
    description = description.replace(amountMatch[0], '').trim();
    if (!description) description = 'Tanpa keterangan';

    return { type, amount, description };
};

// Helper to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
};

router.post('/', async (req, res) => {
    const twiml = new MessagingResponse();
    const incomingMsg = req.body.Body?.trim();
    const sender = req.body.From;

    if (!incomingMsg) {
        twiml.message('Silakan kirim pesan yang valid.');
        return res.type('text/xml').send(twiml.toString());
    }

    try {
        // Handle financial tracking commands
        const financialData = parseFinancialMessage(incomingMsg);
        if (financialData) {
            const { type, amount, description } = financialData;
            await googleSheetService.logTransaction(sender, type, amount, description);
            
            const response = `${type === 'income' ? 'Pemasukan' : 'Pengeluaran'} tercatat: ${formatCurrency(amount)} untuk ${description}`;
            twiml.message(response);
            return res.type('text/xml').send(twiml.toString());
        }

        // Handle financial advice requests
        if (incomingMsg.toLowerCase().startsWith('saran') || incomingMsg.toLowerCase().startsWith('bantuan')) {
            const query = incomingMsg.substring(incomingMsg.indexOf(' ') + 1);
            const advice = await aiGeminiService.getFinancialAdvice(query);
            twiml.message(advice);
            return res.type('text/xml').send(twiml.toString());
        }

        // Handle balance inquiry
        if (incomingMsg.toLowerCase() === 'saldo' || incomingMsg.toLowerCase() === 'ringkasan') {
            const summary = await googleSheetService.getMonthlyReport();
            const response = `Ringkasan Bulanan:\n` +
                `Pemasukan: ${formatCurrency(summary.totalIncome)}\n` +
                `Pengeluaran: ${formatCurrency(summary.totalExpenses)}\n` +
                `Total Tabungan: ${formatCurrency(summary.netSavings)}`;
            twiml.message(response);
            return res.type('text/xml').send(twiml.toString());
        }

        // Default response for unrecognized commands
        twiml.message(
            'Perintah yang tersedia:\n' +
            '- pemasukan [jumlah] [keterangan]\n' +
            '- pengeluaran [jumlah] [keterangan]\n' +
            '- saran [pertanyaan anda]\n' +
            '- saldo'
        );
        return res.type('text/xml').send(twiml.toString());

    } catch (error) {
        console.error('Error processing message:', error);
        twiml.message('Maaf, terjadi kesalahan dalam memproses permintaan Anda. Silakan coba lagi.');
        return res.type('text/xml').send(twiml.toString());
    }
});

module.exports = router;
