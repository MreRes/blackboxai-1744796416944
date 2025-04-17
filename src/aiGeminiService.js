const axios = require('axios');

class AiGeminiService {
    constructor() {
        this.apiKey = process.env.AI_GEMINI_API_KEY;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    }

    async getFinancialAdvice(userQuery) {
        try {
            const prompt = this.constructPrompt(userQuery);
            const response = await axios.post(
                `${this.baseUrl}?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                }
            );

            // Extract and process the response
            const generatedText = response.data.candidates[0].content.parts[0].text;
            return this.formatAdvice(generatedText);
        } catch (error) {
            console.error('Error getting financial advice from Gemini:', error);
            return 'Maaf, saat ini saya tidak dapat memberikan saran keuangan. Silakan coba lagi nanti.';
        }
    }

    constructPrompt(userQuery) {
        return `Sebagai penasihat keuangan, berikan saran yang ringkas dan praktis dalam Bahasa Indonesia untuk pertanyaan berikut: "${userQuery}"
                Fokus pada langkah-langkah yang dapat ditindaklanjuti dan perencanaan keuangan yang realistis.
                Pertimbangkan:
                - Tips penganggaran
                - Strategi menabung
                - Manajemen pengeluaran
                - Tujuan keuangan
                Berikan respons yang jelas, ramah, dan di bawah 200 kata.`;
    }

    formatAdvice(generatedText) {
        // Clean and format the AI response
        let advice = generatedText.trim();
        
        // Ensure the advice isn't too long for a WhatsApp message
        if (advice.length > 1000) {
            advice = advice.substring(0, 997) + '...';
        }

        return advice;
    }

    async analyzeSpendingPatterns(transactions) {
        try {
            const prompt = `Analisis transaksi keuangan berikut dan berikan wawasan dalam Bahasa Indonesia:
                          ${JSON.stringify(transactions)}
                          Pertimbangkan:
                          - Pola pengeluaran
                          - Area potensial untuk penghematan
                          - Rekomendasi anggaran
                          Berikan wawasan yang ringkas dan dapat ditindaklanjuti.`;

            const response = await axios.post(
                `${this.baseUrl}?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                }
            );

            return this.formatAdvice(response.data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error('Error analyzing spending patterns:', error);
            return 'Maaf, saat ini tidak dapat menganalisis pola pengeluaran.';
        }
    }
}

module.exports = { AiGeminiService };
