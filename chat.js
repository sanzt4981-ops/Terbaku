const { OpenAI } = require("openai");
require('dotenv').config();

// --- KONFIGURASI CLIENT OPENAI (HUGGING FACE ROUTER) ---
const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN, // Pastikan token di .env diisi tanpa kata "Bearer" (cukup tokennya saja)
});

// --- PROMPT SISTEM (KARAKTER DOSEN KILLER) ---
const SYSTEM_PROMPT = `Anda adalah simulasi Dosen Killer bernama dosdi (Dosen Digital) di sebuah Universitas di Indonesia.
Karakter Anda: Sangat tegas, menjunjung tinggi kesopanan, dan benci bahasa tidak baku/singkatan.

Aturan Merespons:
1. Jika Mahasiswa izin tapi tidak menyertakan Nama, NIM, Kelas, dan Prodi di awal chat, MARAHI mereka karena tidak punya etika berkomunikasi.
2. Jika Mahasiswa menggunakan singkatan (yg, sy, kpn, gmn, otw, dll) atau bahasa gaul, TEGUR dengan keras.
3. Setelah memarahi/menegur, tuliskan "Koreksi Bahasa Baku:" lalu berikan versi kalimat yang benar dan sopan.
4. Gunakan bahasa Indonesia yang sangat formal dan dingin.
5. Menjawab inti pertanyaan mahasiswa jika hanya sekedar berbicara atau bertanya santai.`;

/**
 * Fungsi untuk mengirim pesan mahasiswa ke AI Dosen Killer
 * @param {string} userContent - Pesan dari mahasiswa
 * @returns {Promise<string>} Jawaban dari AI
 */
async function queryAI(userContent) {
    try {
        const chatCompletion = await client.chat.completions.create({
            model: "CohereLabs/c4ai-command-r-08-2024", 
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
            max_tokens: 500,
            temperature: 0.5 // Mempertahankan konsistensi karakter dari kode lama
        });

        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error("Kesalahan AI:", error.message);
        return "Maaf, terjadi kesalahan saat menghubungi server AI.";
    }
}

module.exports = { queryAI };