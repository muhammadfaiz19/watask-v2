# Watask V2 (Frontend)

Aplikasi Task Management berbasis web yang dibangun menggunakan [Next.js](https://nextjs.org/) dan [React](https://reactjs.org/). Aplikasi ini memungkinkan pengguna untuk mengelola tugas-tugas mereka dengan mudah dan efisien, termasuk pengingat melalui WhatsApp. Frontend ini terhubung dengan backend yang dijelaskan di repositori [watask-backend](https://github.com/muhammadfaiz19/watask-backend).

## Fitur

*   **Manajemen Tugas**: CRUD (Create, Read, Update, Delete) tugas dengan opsi prioritas dan tanggal jatuh tempo.
*   **Pengingat WhatsApp**: Notifikasi pengingat tugas langsung ke WhatsApp Anda.
*   **Manajemen User**: CRUD User, Update Profile, Update Password
*   **Mode Gelap**: Tampilan yang nyaman di malam hari.
*   **Tampilan Responsif**

## Teknologi yang Digunakan

*   **Next.js**: [https://nextjs.org/](https://nextjs.org/)
*   **React**: [https://reactjs.org/](https://reactjs.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Library UI**: [Hero UI](https://www.heroui.com/) dan [Aceternity UI](https://ui.aceternity.com/)
*   **Integrasi WhatsApp**: Menggunakan WhatsApp Web JS di backend untuk integrasi WhatsApp.

## Cara Menjalankan

1.  Clone repositori ini:

    ```bash
    git clone [https://github.com/muhammadfaiz19/watask-v2.git](https://github.com/muhammadfaiz19/watask-v2.git)
    ```

2.  Pindah ke direktori project:

    ```bash
    cd watask-v2
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Jalankan *development server*:

    ```bash
    npm run dev
    ```

Buka browser Anda dan akses `http://localhost:3000` untuk melihat aplikasi. Pastikan backend juga sudah berjalan.

## Konfigurasi

Konfigurasi, termasuk variabel lingkungan dan koneksi ke MongoDB serta integrasi WhatsApp, dilakukan di sisi backend (repositori `watask-backend` di bawah ini). Frontend hanya perlu terhubung ke *endpoint* backend yang sesuai.

## Repositori Backend

[watask-backend](https://github.com/muhammadfaiz19/watask-backend)