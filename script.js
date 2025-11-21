/**
 * =========================================================
 * AOEM S199 Community Site - Frontend Controller
 * =========================================================
 * CATATAN PENTING:
 * 1. Ini adalah versi mandiri. Variabel global telah dideklarasikan.
 * 2. Logika autentikasi admin masih di sisi klien (insecure).
 * 3. Fungsi updateKingNameAdmin() telah DITAMBAHKAN/DIPERBAIKI.
 * 4. Teks judul telah diubah sesuai permintaan pengguna.
 * =========================================================
 */

// --- GLOBAL VARIABLES (DEKLARASI & INISIALISASI DEFAULT) ---

// Konstanta
const ADMIN_PASSWORD = "silviablack"; // Ganti ini
const STORAGE_PREFIX = "aoem199_";

// Variabel Status dan Data (Akan dimuat dari Local Storage)
let currentLang = 'id';
let isLoggedIn = false;

// Dummy data structure untuk inisialisasi awal
let statusData = {
    kingName: "Nama Raja Belum Ditetapkan", warStatus: "PVE", migStatus: "SYARAT KHUSUS",
    eventName: "Nama Event Aktif", eventStatus: "SELESAI", eventNote: "Info terakhir: ---",
    allianceInfo: "Tidak ada info aliansi.", rulesInfo: "Tidak ada peraturan server.", kvkSchedule: "Jadwal KvK belum diatur."
};
let postings = [];
let powerRanks = [];
let meritRanks = [];
let migrations = [];
let buffRequests = [];


// --- DUMMY/HELPER FUNCTIONS (Simulasi Local Storage & Initial Load) ---

function loadData(key, defaultValue) {
    const data = localStorage.getItem(STORAGE_PREFIX + key);
    try {
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Error parsing data from localStorage for key:", key, e);
    }
    return defaultValue;
}

function saveData(key, data) {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
}

function initialLoad() {
    statusData = loadData('status', statusData);
    postings = loadData('postings', postings);
    powerRanks = loadData('powerRanks', powerRanks);
    meritRanks = loadData('meritRanks', meritRanks);
    migrations = loadData('migrations', migrations);
    buffRequests = loadData('buffRequests', buffRequests);
    currentLang = loadData('language', currentLang);
    isLoggedIn = loadData('isLoggedIn', isLoggedIn);
    
    // Panggil fungsi render awal
    changeLanguage(currentLang);
    checkAdminLoginStatus();
    updateServerTime();
    setInterval(updateServerTime, 1000); // Mulai update waktu
    
    // Tampilkan bagian yang terakhir dilihat atau default ke 'beranda'
    const activeSection = loadData('activeSection', 'beranda');
    showSection(activeSection); 
}

function renderStatus() {
    // Fungsi dummy yang akan dipanggil oleh Admin Tools untuk refresh status war/mig/event
    document.getElementById('warStatusContent').textContent = statusData.warStatus;
    document.getElementById('migStatusContent').textContent = statusData.migStatus;
    document.getElementById('currentEventName').textContent = statusData.eventName;
    document.getElementById('currentEventStatus').textContent = statusData.eventStatus;
    document.getElementById('eventNoteContent').textContent = statusData.eventNote;
    document.getElementById('kingNameDisplay').textContent = (translations[currentLang]['king_name_prefix'] || "Raja:") + " " + statusData.kingName;
    // Panggil renderServerInfo untuk update KvK schedule
    renderServerInfo();
}

// Tambahkan event listener untuk memuat data setelah DOM siap
// document.addEventListener('DOMContentLoaded', initialLoad); 


// --- FUNGSI RENDERING UTAMA ---

function renderServerInfo() {
    document.getElementById('allianceInfoContent').innerHTML = statusData.allianceInfo;
    document.getElementById('rulesInfoContent').innerHTML = statusData.rulesInfo;
    document.getElementById('kvkScheduleContent').innerHTML = statusData.kvkSchedule;
}

// --- MODIFIKASI: HANYA TAMPILKAN JUDUL DAN KONTEN DI BERANDA ---
function renderPostings() {
    const container = document.getElementById('postingsWrapper');
    if (!container) return;
    container.innerHTML = '';
    
    if (postings.length === 0) {
        container.innerHTML = '<p style="text-align: center; font-style: italic; color: #a9adb1;" data-lang-key="post_empty">Belum ada postingan.</p>';
        translateElement(container.querySelector('p')); // Terjemahkan elemen dinamis
        return;
    }
    
    postings.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(post => {
        const item = document.createElement('div');
        item.className = 'post-item';
        
        // Hanya tambahkan Judul dan Konten. Hapus post-meta (tanggal)
        item.innerHTML = `
            <h4>${post.title}</h4>
            <div class="post-content">${post.content.replace(/\n/g, '<br>')}</div>
        `;
        container.appendChild(item);
    });
}
// --- AKHIR MODIFIKASI renderPostings ---

function renderRanks() {
    renderRankTable(powerRanks, 'powerRankBody', 'power');
    renderRankTable(meritRanks, 'meritRankBody', 'merit');
}

function renderRankTable(data, tableId, type) {
    const tbody = document.getElementById(tableId);
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">${translations[currentLang]['adm_ranks_manage'] || "Data peringkat belum diisi."}</td></tr>`;
        return;
    }
    
    data.slice(0, 5).forEach(rank => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${rank.no}</td>
            <td>${rank.name}</td>
            <td>${rank.alliance}</td>
            <td>${type === 'power' ? formatPower(rank.value) : rank.value}</td>
            <td>${rank.notes || '-'}</td>
        `;
    });
}

function formatPower(value) {
    if (value >= 1000) {
        return (value / 1000).toFixed(1) + ' B'; // Miliar
    }
    return value.toFixed(1) + ' Jt'; // Juta
}

function renderMigrationList(mode) {
    const publicBody = document.getElementById('migrationListPublic');
    const adminBody = document.getElementById('migrationListAdmin');
    
    if (publicBody) publicBody.innerHTML = '';
    if (adminBody) adminBody.innerHTML = '';

    if (migrations.length === 0) {
        if (publicBody) publicBody.innerHTML = `<tr><td colspan="5">${translations[currentLang]['post_empty'] || "Belum ada pendaftar."}</td></tr>`;
        if (adminBody) adminBody.innerHTML = `<tr><td colspan="7">${translations[currentLang]['post_empty'] || "Belum ada pendaftar."}</td></tr>`;
        return;
    }

    migrations.forEach((mig, index) => {
        // Public View
        if (publicBody) {
            const publicRow = publicBody.insertRow();
            publicRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${mig.name}</td>
                <td>${mig.server}</td>
                <td>${mig.power} Jt</td>
                <td>${new Date(mig.date).toLocaleDateString(currentLang)}</td>
            `;
        }


        // Admin View
        if (adminBody) {
            const adminRow = adminBody.insertRow();
            adminRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${mig.name}</td>
                <td>${mig.server}</td>
                <td>${mig.power} Jt</td>
                <td>${mig.contact}</td>
                <td>${new Date(mig.date).toLocaleString(currentLang)}</td>
                <td><button class="btn btn-danger" onclick="deleteEntry('migration', ${index})">${translations[currentLang]['tbl_action'] || "Hapus"}</button></td>
            `;
        }
    });
}

function renderBuffList(mode) {
    const publicBody = document.getElementById('buffListPublic');
    const adminBody = document.getElementById('buffListAdmin');

    if (publicBody) publicBody.innerHTML = '';
    if (adminBody) adminBody.innerHTML = '';

    if (buffRequests.length === 0) {
        if (publicBody) publicBody.innerHTML = `<tr><td colspan="6">${translations[currentLang]['post_empty'] || "Belum ada permintaan buff."}</td></tr>`;
        if (adminBody) adminBody.innerHTML = `<tr><td colspan="7">${translations[currentLang]['post_empty'] || "Belum ada permintaan buff."}</td></tr>`;
        return;
    }

    buffRequests.forEach((buff, index) => {
        const date = new Date(buff.date);
        const dateStr = date.toLocaleDateString(currentLang);
        const timeStr = date.toLocaleTimeString(currentLang);
        const statusClass = buff.status === 'Selesai' ? 'status-done' : 'status-pending';

        // Public View
        if (publicBody) {
            const publicRow = publicBody.insertRow();
            publicRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${buff.name}</td>
                <td>${buff.type}</td>
                <td>${dateStr}</td>
                <td>${timeStr}</td>
                <td class="${statusClass}">${buff.status}</td>
            `;
        }

        // Admin View
        if (adminBody) {
            const adminRow = adminBody.insertRow();
            adminRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${buff.name}</td>
                <td>${buff.type}</td>
                <td>${buff.contact}</td>
                <td>${timeStr} (${dateStr})</td>
                <td>
                    <select onchange="updateBuffStatus(${index}, this.value)">
                        <option value="Pending" ${buff.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Selesai" ${buff.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                    </select>
                </td>
                <td><button class="btn btn-danger" onclick="deleteEntry('buff', ${index})">${translations[currentLang]['tbl_action'] || "Hapus"}</button></td>
            `;
        }
    });
}

/* --- TABS & MENU NAVIGATION --- */

function showSection(sectionId, event) {
    // Sembunyikan semua section
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });

    // Hapus class 'active' dari semua tab
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Tampilkan section yang dipilih
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }

    // Tandai tab yang aktif
    let activeTab;
    if (event && event.target.tagName === 'BUTTON') {
        activeTab = event.target;
    } else {
        activeTab = document.getElementById(sectionId + 'Tab');
    }
    
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Tutup menu mobile jika terbuka
    const navMenu = document.getElementById('navMenu');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const menuIcon = document.getElementById('menuIcon');
        if (menuIcon) menuIcon.className = 'fas fa-bars';
    }
    
    saveData('activeSection', sectionId);

    // Render ulang konten admin jika tab admin dibuka
    if (sectionId === 'admin' && isLoggedIn) {
        renderAdminTools();
    }
}

function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuIcon = document.getElementById('menuIcon');
    if (!navMenu || !menuIcon) return;
    
    navMenu.classList.toggle('active');

    if (navMenu.classList.contains('active')) {
        menuIcon.className = 'fas fa-times'; // Ubah menjadi ikon tutup
    } else {
        menuIcon.className = 'fas fa-bars'; // Ubah kembali menjadi ikon menu
    }
}

/* --- TIME & SCROLL --- */

// Diubah agar selalu menampilkan waktu UTC murni (HH:MM:SS UTC)
function updateServerTime() {
    const timeElement = document.getElementById('serverTime');
    if (!timeElement) return;

    const now = new Date();
    
    // Mendapatkan komponen waktu UTC
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();
    
    // Memastikan format 2 digit
    const pad = (num) => num.toString().padStart(2, '0');
    
    // Menggabungkan dan menambahkan label UTC (Waktu Universal Terkoordinasi)
    const utcTimeStr = `${pad(utcHours)}:${pad(utcMinutes)}:${pad(utcSeconds)} UTC`;
    
    timeElement.textContent = utcTimeStr;
}

window.onscroll = function() { scrollFunction() };

function scrollFunction() {
    const btn = document.getElementById("scrollToTopBtn");
    if (!btn) return;
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}

function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

/* --- LANGUAGE MANAGEMENT --- */

const translations = {
    // Bahasa Indonesia
    'id': {
        page_title: "Situs Komunitas AoEM Server 199",
        hub_title: "AOEM S199", // DIUBAH
        king_name_prefix: "Raja:",
        menu_home: "Beranda",
        menu_ranks: "Peringkat",
        menu_events: "Events",
        menu_info: "Info Server",
        menu_migration: "Pendaftar Migrasi",
        menu_buff: "Buff Request",
        menu_login: "Login Admin",
        menu_admin: "Admin Tools",
        home_title: "📢 Beranda & Postingan Terbaru",
        status_war_title: "STATUS SERVER WAR",
        mig_status_card: "Status Penerimaan Migrasi S199",
        status_label: "STATUS",
        post_loading: "Memuat postingan...",
        post_empty: "Belum ada postingan.",
        mig_form_title: "✈️ Formulir Pendaftaran Migrasi ke S199",
        mig_form_note: "Silakan isi data Anda di bawah ini jika berminat migrasi.",
        mig_name: "Nama Pemain/In-Game Name:",
        mig_server: "Server Asal:",
        mig_power: "Total Power (Juta):",
        mig_contact: "Kontak (Discord/Telegram):",
        mig_submit: "Kirim Pendaftaran Migrasi",
        ranks_title: "📈 Peringkat Pemain (Power & Merit)",
        ranks_power_card: "Power Ranking TOP 5 (Display Power)",
        ranks_merit_card: "Merit Ranking TOP 5 (Display Merit)",
        tbl_no: "#",
        tbl_player: "Pemain",
        tbl_alliance: "Aliansi",
        tbl_power: "Power",
        tbl_merit: "Merit",
        tbl_notes: "Keterangan",
        events_title: "⏳ Status Event Global",
        events_current_card: "Event Sedang Berlangsung",
        status_label_current: "Status",
        events_note: "Info terakhir: ---",
        events_kvk_card: "JADWAL WAR", // *PERBAIKAN: Mengganti teks*
        info_title: "🌐 Info Server 199",
        info_alliance_card: "Informasi Aliansi Utama",
        info_rules_card: "Peraturan Server",
        mig_status_title: "✈️ Status Pendaftar Migrasi ke Server 199",
        mig_note: "Anda dapat mendaftar melalui formulir di menu **Beranda**.",
        mig_list_card: "Daftar Pendaftar (Kontak disamarkan)",
        tbl_name: "Nama",
        tbl_server_asal: "Server Asal",
        tbl_power_jt: "Power (Jt)",
        tbl_date: "Tanggal Daftar",
        buff_title: "🛡️ Formulir Permintaan Buff Imperial City (IC)",
        buff_form_card: "Formulir Permintaan",
        buff_note: "Permintaan Buff Kota Imperial dikirimkan ke R4/R5. Pastikan Anda berada di koordinat yang benar saat meminta buff.",
        buff_name: "Nama Pemain:",
        buff_type: "Jenis Buff:",
        buff_select: "Pilih Jenis Buff",
        buff_submit: "Kirim Permintaan Buff",
        buff_list_card: "Daftar Request Buff Saat Ini",
        tbl_buff_type: "Jenis Buff",
        tbl_date_req: "Tanggal Request",
        tbl_time_req: "Waktu Request",
        tbl_status: "Status",
        admin_title: "🔑 Admin Panel",
        admin_login_card: "Login Admin",
        btn_login: "Login",
        btn_logout: "Logout Admin",
        adm_btn_clear_all_data: "Clear All Data (Bahaya!)",
        adm_post_title: "1. Tambah/Edit Postingan",
        adm_post_title_label: "Judul Postingan:",
        adm_post_content_label: "Isi Postingan (Teks/URL Gambar):",
        adm_btn_add: "Tambah Postingan",
        adm_btn_cancel: "Batalkan Edit",
        adm_post_manage: "Kelola Postingan Saat Ini",
        adm_ranks_title: "2. Input Data Peringkat (Power/Merit)",
        adm_ranks_manage: "Data Ranking Saat Ini (Edit lalu Simpan)",
        adm_btn_save_all_ranks: "Simpan Semua Perubahan",
        adm_btn_clear_power: "Clear Power Ranks",
        adm_btn_clear_merit: "Clear Merit Ranks",
        adm_status_event_title: "3. Edit Status Event",
        adm_status_event_name: "Nama Event Aktif:",
        adm_status_event_status: "Status Event:",
        adm_status_event_note: "Catatan / Detail Tambahan:",
        adm_btn_update: "Update Status Event",
        adm_info_title: "4. Edit Info Server",
        adm_info_alliance_label: "Info Aliansi Utama (Gunakan tag HTML untuk format):",
        adm_info_rules_label: "Peraturan Server (Gunakan tag HTML untuk format):",
        adm_btn_add_update: "Tambah/Update Data Info",
        adm_mig_status_and_list: "5. Pendaftaran Migrasi & Status",
        adm_status_war: "Status War:",
        adm_status_mig: "Status Migrasi:",
        adm_mig_detail_title: "Data Pendaftaran Migrasi (DETAIL - Kontak Jelas)",
        tbl_contact: "Kontak (Jelas)",
        tbl_action: "Aksi",
        adm_btn_clear_all: "Bersihkan Daftar Migrasi",
        adm_buff_detail_title: "6. Daftar Permintaan Buff (Detail)",
        tbl_buff: "Buff",
        tbl_date_time: "Waktu & Tanggal Request",
        // tbl_status: "Status", // Sudah didefinisikan sebelumnya
        adm_kvk_title: "7. Edit Jadwal WAR", // *PERBAIKAN: Mengganti teks*
        adm_kvk_label: "Jadwal KvK/Stellar War (Gunakan tag HTML untuk format):",
        adm_btn_save: "Simpan Jadwal",
        adm_king_title: "8. Edit Nama Raja",
        adm_king_label: "Nama Raja Saat Ini:",
        adm_btn_save_king: "Simpan Nama Raja", // *PERBAIKAN: Tombol King*
        footer_text: "© 2025 AOEM 199 by HADES", // DIUBAH
        // Tambahkan terjemahan untuk pesan notifikasi
        msg_mig_success: "Pendaftaran Migrasi berhasil dikirim. Terima kasih!",
        msg_buff_success: "Permintaan Buff berhasil dikirim. Harap tunggu konfirmasi R4/R5!",
        msg_login_fail: "Password salah. Silakan coba lagi.",
        msg_post_success: "Postingan berhasil disimpan.",
        msg_update_success: "Data berhasil diperbarui.",
        msg_rank_saved: "Data peringkat berhasil disimpan.",
        msg_rank_cleared: "Data peringkat [TIPE] berhasil dibersihkan.",
        msg_delete_success: "Entri berhasil dihapus.",
        msg_clear_all_confirm: "APAKAH ANDA YAKIN INGIN MENGHAPUS SEMUA DATA [TIPE]? Tindakan ini tidak dapat dibatalkan.",
        msg_buff_status_update: "Status Buff berhasil diperbarui.",
        msg_king_update: "Nama Raja berhasil disimpan.",
        msg_kvk_update: "Jadwal KvK berhasil disimpan.",
        msg_info_update: "Info Server berhasil disimpan.",
        msg_rank_added: "Entri peringkat berhasil ditambahkan.",
        msg_clear_buff_confirm: "APAKAH ANDA YAKIN INGIN MENGHAPUS SEMUA DAFTAR PERMINTAAN BUFF? Tindakan ini tidak dapat dibatalkan.",
    },
    // English
    'en': {
        page_title: "AoEM Server 199 Community Site",
        hub_title: "AOEM S199", // DIUBAH
        king_name_prefix: "King:",
        menu_home: "Home",
        menu_ranks: "Ranks",
        menu_events: "Events",
        menu_info: "Server Info",
        menu_migration: "Migration List",
        menu_buff: "Buff Request",
        menu_login: "Admin Login",
        menu_admin: "Admin Tools",
        home_title: "📢 Home & Latest Posts",
        status_war_title: "SERVER WAR STATUS",
        mig_status_card: "S199 Migration Acceptance Status",
        status_label: "STATUS",
        post_loading: "Loading posts...",
        post_empty: "No posts yet.",
        mig_form_title: "✈️ Migration Registration Form to S199",
        mig_form_note: "Please fill in your details below if interested in migrating.",
        mig_name: "Player/In-Game Name:",
        mig_server: "Origin Server:",
        mig_power: "Total Power (Million):",
        mig_contact: "Contact (Discord/Telegram):",
        mig_submit: "Submit Migration Registration",
        ranks_title: "📈 Player Rankings (Power & Merit)",
        ranks_power_card: "Power Ranking TOP 5 (Display Power)",
        ranks_merit_card: "Merit Ranking TOP 5 (Display Merit)",
        tbl_no: "#",
        tbl_player: "Player",
        tbl_alliance: "Alliance",
        tbl_power: "Power",
        tbl_merit: "Merit",
        tbl_notes: "Notes",
        events_title: "⏳ Global Event Status",
        events_current_card: "Current Event",
        status_label_current: "Status",
        events_note: "Last updated: ---",
        events_kvk_card: "WAR SCHEDULE", // *PERBAIKAN: Mengganti teks*
        info_title: "🌐 Server 199 Info",
        info_alliance_card: "Main Alliance Information",
        info_rules_card: "Server Rules",
        mig_status_title: "✈️ Migration Applicants Status to Server 199",
        mig_note: "You can apply via the form in the **Home** menu.",
        mig_list_card: "Applicant List (Contact obscured)",
        tbl_name: "Name",
        tbl_server_asal: "Origin Server",
        tbl_power_jt: "Power (M)",
        tbl_date: "Registration Date",
        buff_title: "🛡️ Imperial City (IC) Buff Request Form",
        buff_form_card: "Request Form",
        buff_note: "Imperial City Buff requests are sent to R4/R5. Ensure you are at the correct coordinates when requesting a buff.",
        buff_name: "Player Name:",
        buff_type: "Buff Type:",
        buff_select: "Select Buff Type",
        buff_submit: "Send Buff Request",
        buff_list_card: "Current Buff Request List",
        tbl_buff_type: "Buff Type",
        tbl_date_req: "Request Date",
        tbl_time_req: "Request Time",
        tbl_status: "Status",
        admin_title: "🔑 Admin Panel",
        admin_login_card: "Admin Login",
        btn_login: "Login",
        btn_logout: "Logout Admin",
        adm_btn_clear_all_data: "Clear All Data (Danger!)",
        adm_post_title: "1. Add/Edit Post",
        adm_post_title_label: "Post Title:",
        adm_post_content_label: "Post Content (Text/Image URL):",
        adm_btn_add: "Add Post",
        adm_btn_cancel: "Cancel Edit",
        adm_post_manage: "Manage Current Posts",
        adm_ranks_title: "2. Input Ranking Data (Power/Merit)",
        adm_ranks_manage: "Current Ranking Data (Edit then Save)",
        adm_btn_save_all_ranks: "Save All Changes",
        adm_btn_clear_power: "Clear Power Ranks",
        adm_btn_clear_merit: "Clear Merit Ranks",
        adm_status_event_title: "3. Edit Event Status",
        adm_status_event_name: "Active Event Name:",
        adm_status_event_status: "Event Status:",
        adm_status_event_note: "Notes / Additional Details:",
        adm_btn_update: "Update Event Status",
        adm_info_title: "4. Edit Server Info",
        adm_info_alliance_label: "Main Alliance Info (Use HTML tags for formatting):",
        adm_info_rules_label: "Server Rules (Use HTML tags for formatting):",
        adm_btn_add_update: "Add/Update Info Data",
        adm_mig_status_and_list: "5. Migration Registration & Status",
        adm_status_war: "War Status:",
        adm_status_mig: "Migration Status:",
        adm_mig_detail_title: "Migration Registration Data (DETAIL - Clear Contact)",
        tbl_contact: "Contact (Clear)",
        tbl_action: "Action",
        adm_btn_clear_all: "Clear Migration List",
        adm_buff_detail_title: "6. Buff Request List (Detail)",
        tbl_buff: "Buff",
        tbl_date_time: "Request Time & Date",
        // tbl_status: "Status", // Sudah didefinisikan sebelumnya
        adm_kvk_title: "7. Edit WAR Schedule", // *PERBAIKAN: Mengganti teks*
        adm_kvk_label: "KvK/Stellar War Schedule (Use HTML tags for formatting):",
        adm_btn_save: "Save Schedule",
        adm_king_title: "8. Edit King Name",
        adm_king_label: "Current King Name:",
        adm_btn_save_king: "Save King Name", // *PERBAIKAN: Tombol King*
        footer_text: "© 2025 AOEM 199 by HADES", // DIUBAH
        // Tambahkan terjemahan untuk pesan notifikasi
        msg_mig_success: "Migration Registration successfully submitted. Thank you!",
        msg_buff_success: "Buff Request successfully sent. Please wait for R4/R5 confirmation!",
        msg_login_fail: "Incorrect password. Please try again.",
        msg_post_success: "Post successfully saved.",
        msg_update_success: "Data successfully updated.",
        msg_rank_saved: "Ranking data successfully saved.",
        msg_rank_cleared: "[TYPE] Ranking data successfully cleared.",
        msg_delete_success: "Entry successfully deleted.",
        msg_clear_all_confirm: "ARE YOU SURE YOU WANT TO DELETE ALL [TYPE] DATA? This action cannot be undone.",
        msg_buff_status_update: "Buff Status successfully updated.",
        msg_king_update: "King Name successfully saved.",
        msg_kvk_update: "KvK Schedule successfully saved.",
        msg_info_update: "Server Info successfully saved.",
        msg_rank_added: "Rank entry successfully added.",
        msg_clear_buff_confirm: "ARE YOU SURE YOU WANT TO DELETE ALL BUFF REQUESTS? This action cannot be undone.",
    },
    // Spanyol (Contoh Sederhana)
    'es': {
        page_title: "Sitio de la Comunidad AoEM Servidor 199",
        hub_title: "AOEM S199", // DIUBAH
        king_name_prefix: "Rey:",
        menu_home: "Inicio",
        menu_ranks: "Clasificación",
        menu_events: "Eventos",
        menu_info: "Info Servidor",
        menu_migration: "Lista Migración",
        menu_buff: "Solicitud Buff",
        menu_login: "Acceso Admin",
        menu_admin: "Herramientas Admin",
        home_title: "📢 Inicio y Últimas Publicaciones",
        status_war_title: "ESTADO GUERRA DEL SERVIDOR",
        mig_status_card: "Estado Aceptación Migración S199",
        status_label: "ESTADO",
        post_loading: "Cargando publicaciones...",
        post_empty: "No hay publicaciones aún.",
        mig_form_title: "✈️ Formulario de Registro de Migración a S199",
        mig_form_note: "Rellene sus datos si está interesado en migrar.",
        mig_name: "Nombre Jugador/En Juego:",
        mig_server: "Servidor Origen:",
        mig_power: "Poder Total (Millón):",
        mig_contact: "Contacto (Discord/Telegram):",
        mig_submit: "Enviar Registro de Migración",
        ranks_title: "📈 Clasificaciones de Jugadores (Poder y Mérito)",
        ranks_power_card: "Clasificación Poder TOP 5",
        ranks_merit_card: "Clasificación Mérito TOP 5",
        tbl_no: "#",
        tbl_player: "Jugador",
        tbl_alliance: "Alianza",
        tbl_power: "Poder",
        tbl_merit: "Mérito",
        tbl_notes: "Notas",
        events_title: "⏳ Global Event Status",
        events_current_card: "Evento Actual",
        status_label_current: "Estado",
        events_note: "Última actualización: ---",
        events_kvk_card: "PROGRAMA GUERRA", // *PERBAIKAN: Mengganti teks*
        info_title: "🌐 Info Servidor 199",
        info_alliance_card: "Información de Alianza Principal",
        info_rules_card: "Reglas del Servidor",
        mig_status_title: "✈️ Estado de Solicitantes de Migración a Servidor 199",
        mig_note: "Puede solicitar a través del formulario en el menú **Inicio**.",
        mig_list_card: "Lista de Solicitantes (Contacto oculto)",
        tbl_name: "Nombre",
        tbl_server_asal: "Servidor Origen",
        tbl_power_jt: "Poder (M)",
        tbl_date: "Fecha Registro",
        buff_title: "🛡️ Formulario de Solicitud de Buff Ciudad Imperial (IC)",
        buff_form_card: "Formulario de Solicitud",
        buff_note: "Las solicitudes de Buff de Ciudad Imperial se envían a R4/R5. Asegúrese de estar en las coordenadas correctas al solicitar.",
        buff_name: "Nombre del Jugador:",
        buff_type: "Tipo de Buff:",
        buff_select: "Seleccionar Tipo de Buff",
        buff_submit: "Enviar Solicitud de Buff",
        buff_list_card: "Lista Actual de Solicitudes de Buff",
        tbl_buff_type: "Tipo de Buff",
        tbl_date_req: "Fecha Solicitud",
        tbl_time_req: "Hora Solicitud",
        tbl_status: "Estado",
        admin_title: "🔑 Panel de Administrador",
        admin_login_card: "Acceso Admin",
        btn_login: "Iniciar Sesión",
        btn_logout: "Cerrar Sesión Admin",
        adm_btn_clear_all_data: "Borrar Todos los Datos (¡Peligro!)",
        adm_post_title: "1. Añadir/Editar Publicación",
        adm_post_title_label: "Título Publicación:",
        adm_post_content_label: "Contenido Publicación (Texto/URL Imagen):",
        adm_btn_add: "Añadir Publicación",
        adm_btn_cancel: "Cancelar Edición",
        adm_post_manage: "Gestionar Publicaciones Actuales",
        adm_ranks_title: "2. Introducir Datos de Clasificación (Poder/Mérito)",
        adm_ranks_manage: "Datos de Clasificación Actuales (Editar y Guardar)",
        adm_btn_save_all_ranks: "Guardar Todos los Cambios",
        adm_btn_clear_power: "Borrar Clasificaciones Poder",
        adm_btn_clear_merit: "Borrar Clasificaciones Mérito",
        adm_status_event_title: "3. Editar Estado del Evento",
        adm_status_event_name: "Nombre del Evento Activo:",
        adm_status_event_status: "Estado del Evento:",
        adm_status_event_note: "Notas / Detalles Adicionales:",
        adm_btn_update: "Actualizar Estado del Evento",
        adm_info_title: "4. Editar Info del Servidor",
        adm_info_alliance_label: "Info Alianza Principal (Usar etiquetas HTML para formato):",
        adm_info_rules_label: "Reglas del Servidor (Usar etiquetas HTML para formato):",
        adm_btn_add_update: "Añadir/Actualizar Datos de Info",
        adm_mig_status_and_list: "5. Registro y Estado de Migración",
        adm_status_war: "Estado de Guerra:",
        adm_status_mig: "Estado de Migración:",
        adm_mig_detail_title: "Datos de Registro de Migración (DETALLE - Contacto Claro)",
        tbl_contact: "Contacto (Claro)",
        tbl_action: "Acción",
        adm_btn_clear_all: "Borrar Lista de Migración",
        adm_buff_detail_title: "6. Lista de Solicitudes de Buff (Detalle)",
        tbl_buff: "Buff",
        tbl_date_time: "Hora y Fecha Solicitud",
        // tbl_status: "Estado", // Sudah didefinisikan sebelumnya
        adm_kvk_title: "7. Editar Programa GUERRA", // *PERBAIKAN: Mengganti teks*
        adm_kvk_label: "Programa KvK/Guerra Estelar (Usar etiquetas HTML para formato):",
        adm_btn_save: "Guardar Programa",
        adm_king_title: "8. Editar Nombre del Rey",
        adm_king_label: "Nombre Actual del Rey:",
        adm_btn_save_king: "Guardar Nombre del Rey", // *PERBAIKAN: Tombol King*
        footer_text: "© 2025 AOEM 199 by HADES", // DIUBAH
        // Pesan notifikasi
        msg_mig_success: "Registro de Migración enviado con éxito. ¡Gracias!",
        msg_buff_success: "Solicitud de Buff enviada con éxito. ¡Espere la confirmación de R4/R5!",
        msg_login_fail: "Contraseña incorrecta. Inténtelo de nuevo.",
        msg_post_success: "Publicación guardada con éxito.",
        msg_update_success: "Datos actualizados con éxito.",
        msg_rank_saved: "Datos de clasificación guardados con éxito.",
        msg_rank_cleared: "Datos de clasificación [TIPE] borrados con éxito.",
        msg_delete_success: "Entrada borrada con éxito.",
        msg_clear_all_confirm: "¿ESTÁ SEGURO DE QUE DESEA BORRAR TODOS LOS DATOS [TIPE]? Esta acción no se puede deshacer.",
        msg_buff_status_update: "Estado del Buff actualizado con éxito.",
        msg_king_update: "Nombre del Rey guardado con éxito.",
        msg_kvk_update: "Programa KvK guardado con éxito.",
        msg_info_update: "Información del Servidor guardada con éxito.",
        msg_rank_added: "Entrada de clasificación añadida con éxito.",
        msg_clear_buff_confirm: "¿ESTÁ SEGURO DE QUE DESEA BORRAR TODAS LAS SOLICITUDES DE BUFF? Esta acción no se puede deshacer.",
    },
    // Jerman (Contoh Sederhana)
    'de': {
        page_title: "AoEM Server 199 Community Seite",
        hub_title: "AOEM S199", // DIUBAH
        king_name_prefix: "König:",
        menu_home: "Startseite",
        menu_ranks: "Ranglisten",
        menu_events: "Events",
        menu_info: "Server Info",
        menu_migration: "Migrationsliste",
        menu_buff: "Buff Anfrage",
        menu_login: "Admin Login",
        menu_admin: "Admin Tools",
        home_title: "📢 Startseite & Neueste Beiträge",
        status_war_title: "SERVER-KRIEGSSTATUS",
        mig_status_card: "S199 Migrationsannahmestatus",
        status_label: "STATUS",
        post_loading: "Beiträge werden geladen...",
        post_empty: "Noch keine Beiträge.",
        mig_form_title: "✈️ Migrationsanmeldeformular für S199",
        mig_form_note: "Bitte füllen Sie Ihre Daten aus, wenn Sie an einer Migration interessiert sind.",
        mig_name: "Spieler/In-Game Name:",
        mig_server: "Ursprungsserver:",
        mig_power: "Gesamtstärke (Million):",
        mig_contact: "Kontakt (Discord/Telegram):",
        mig_submit: "Migrationsanmeldung senden",
        ranks_title: "📈 Spieler-Ranglisten (Stärke & Merit)",
        ranks_power_card: "Stärke Rangliste TOP 5",
        ranks_merit_card: "Merit Rangliste TOP 5",
        tbl_no: "#",
        tbl_player: "Spieler",
        tbl_alliance: "Allianz",
        tbl_power: "Stärke",
        tbl_merit: "Merit",
        tbl_notes: "Anmerkungen",
        events_title: "⏳ Globaler Event-Status",
        events_current_card: "Aktuelles Event",
        status_label_current: "Status",
        events_note: "Letztes Update: ---",
        events_kvk_card: "KRIEG ZEITPLAN", // *PERBAIKAN: Mengganti teks*
        info_title: "🌐 Server 199 Info",
        info_alliance_card: "Hauptallianz-Informationen",
        info_rules_card: "Serverregeln",
        mig_status_title: "✈️ Migrationsanmelde-Status für Server 199",
        mig_note: "Sie können sich über das Formular im **Startseite**-Menü anmelden.",
        mig_list_card: "Anmeldeliste (Kontakt verschleiert)",
        tbl_name: "Name",
        tbl_server_asal: "Ursprungsserver",
        tbl_power_jt: "Stärke (Mio)",
        tbl_date: "Anmeldedatum",
        buff_title: "🛡️ Buff-Anfrageformular für Kaiserstadt (IC)",
        buff_form_card: "Anfrageformular",
        buff_note: "Buff-Anfragen für die Kaiserstadt werden an R4/R5 gesendet. Stellen Sie sicher, dass Sie sich an den richtigen Koordinaten befinden.",
        buff_name: "Spielername:",
        buff_type: "Buff-Typ:",
        buff_select: "Buff-Typ auswählen",
        buff_submit: "Buff-Anfrage senden",
        buff_list_card: "Aktuelle Buff-Anfrageliste",
        tbl_buff_type: "Buff-Typ",
        tbl_date_req: "Anfragedatum",
        tbl_time_req: "Anfragezeit",
        tbl_status: "Status",
        admin_title: "🔑 Admin-Panel",
        admin_login_card: "Admin Login",
        btn_login: "Login",
        btn_logout: "Admin Logout",
        adm_btn_clear_all_data: "Alle Daten löschen (Gefahr!)",
        adm_post_title: "1. Beitrag hinzufügen/bearbeiten",
        adm_post_title_label: "Beitragstitel:",
        adm_post_content_label: "Beitragsinhalt (Text/Bild-URL):",
        adm_btn_add: "Beitrag hinzufügen",
        adm_btn_cancel: "Bearbeitung abbrechen",
        adm_post_manage: "Aktuelle Beiträge verwalten",
        adm_ranks_title: "2. Ranglistendaten eingeben (Stärke/Merit)",
        adm_ranks_manage: "Aktuelle Ranglistendaten (Bearbeiten & Speichern)",
        adm_btn_save_all_ranks: "Alle Änderungen speichern",
        adm_btn_clear_power: "Stärke-Ränge löschen",
        adm_btn_clear_merit: "Merit-Ränge löschen",
        adm_status_event_title: "3. Event-Status bearbeiten",
        adm_status_event_name: "Name des aktiven Events:",
        adm_status_event_status: "Event-Status:",
        adm_status_event_note: "Anmerkungen / Zusätzliche Details:",
        adm_btn_update: "Event-Status aktualisieren",
        adm_info_title: "4. Server-Info bearbeiten",
        adm_info_alliance_label: "Hauptallianz-Info (HTML-Tags für Formatierung verwenden):",
        adm_info_rules_label: "Serverregeln (HTML-Tags für Formatierung verwenden):",
        adm_btn_add_update: "Info-Daten hinzufügen/aktualisieren",
        adm_mig_status_and_list: "5. Migrationsanmeldung & Status",
        adm_status_war: "Kriegsstatus:",
        adm_status_mig: "Migrationsstatus:",
        adm_mig_detail_title: "Migrationsanmeldedaten (DETAIL - Klarer Kontakt)",
        tbl_contact: "Kontakt (Klar)",
        tbl_action: "Aktion",
        adm_btn_clear_all: "Migrationsliste löschen",
        adm_buff_detail_title: "6. Buff-Anfrageliste (Detail)",
        tbl_buff: "Buff",
        tbl_date_time: "Anfragezeit & Datum",
        // tbl_status: "Status", // Sudah didefinisikan sebelumnya
        adm_kvk_title: "7. Krieg Zeitplan bearbeiten", // *PERBAIKAN: Mengganti teks*
        adm_kvk_label: "KvK/Stellar War Zeitplan (HTML-Tags für Formatierung verwenden):",
        adm_btn_save: "Zeitplan speichern",
        adm_king_title: "8. Königsnamen bearbeiten",
        adm_king_label: "Aktueller Königsname:",
        adm_btn_save_king: "Königsnamen speichern", // *PERBAIKAN: Tombol King*
        footer_text: "© 2025 AOEM 199 by HADES", // DIUBAH
        // Pesan notifikasi
        msg_mig_success: "Migrationsanmeldung erfolgreich gesendet. Vielen Dank!",
        msg_buff_success: "Buff-Anfrage erfolgreich gesendet. Bitte warten Sie auf die R4/R5-Bestätigung!",
        msg_login_fail: "Falsches Passwort. Bitte versuchen Sie es erneut.",
        msg_post_success: "Beitrag erfolgreich gespeichert.",
        msg_update_success: "Daten erfolgreich aktualisiert.",
        msg_rank_saved: "Ranglistendaten erfolgreich gespeichert.",
        msg_rank_cleared: "[TYPE] Ranglistendaten erfolgreich gelöscht.",
        msg_delete_success: "Eintrag erfolgreich gelöscht.",
        msg_clear_all_confirm: "SIND SIE SICHER, DASS SIE ALLE [TYPE]-DATEN LÖSCHEN MÖCHTEN? Diese Aktion kann nicht rückgängig gemacht werden.",
        msg_buff_status_update: "Buff-Status erfolgreich aktualisiert.",
        msg_king_update: "Königsname erfolgreich gespeichert.",
        msg_kvk_update: "KvK-Zeitplan erfolgreich gespeichert.",
        msg_info_update: "Server-Info erfolgreich gespeichert.",
        msg_rank_added: "Ranglisteneintrag erfolgreich hinzugefügt.",
        msg_clear_buff_confirm: "SIND SIE SICHER, DASS SIE ALLE BUFF-ANFRAGEN LÖSCHEN MÖCHTEN? Diese Aktion kann nicht rückgängig gemacht werden.",
    },
    // Chinese (Mandarin/Sederhana)
    'zh': {
        page_title: "AoEM 199区社区网站",
        hub_title: "AOEM S199", // DIUBAH
        king_name_prefix: "国王:",
        menu_home: "首页",
        menu_ranks: "排名",
        menu_events: "活动",
        menu_info: "服务器信息",
        menu_migration: "移民列表",
        menu_buff: "增益请求",
        menu_login: "管理员登录",
        menu_admin: "管理员工具",
        home_title: "📢 首页 & 最新帖子",
        status_war_title: "服务器战争状态",
        mig_status_card: "S199 移民接收状态",
        status_label: "状态",
        post_loading: "正在加载帖子...",
        post_empty: "暂无帖子。",
        mig_form_title: "✈️ S199 移民登记表",
        mig_form_note: "如果您有兴趣移民，请填写您的详细信息。",
        mig_name: "玩家/游戏内名称:",
        mig_server: "原始服务器:",
        mig_power: "总战力(百万):",
        mig_contact: "联系方式 (Discord/Telegram):",
        mig_submit: "提交移民登记",
        ranks_title: "📈 玩家排名 (战力 & 功勋)",
        ranks_power_card: "战力排名 TOP 5",
        ranks_merit_card: "功勋排名 TOP 5",
        tbl_no: "编号",
        tbl_player: "玩家",
        tbl_alliance: "联盟",
        tbl_power: "战力",
        tbl_merit: "功勋",
        tbl_notes: "备注",
        events_title: "⏳ 全球活动状态",
        events_current_card: "当前活动",
        status_label_current: "状态",
        events_note: "上次更新: ---",
        events_kvk_card: "战争日程", // *PERBAIKAN: Mengganti teks*
        info_title: "🌐 199区服务器信息",
        info_alliance_card: "主联盟信息",
        info_rules_card: "服务器规则",
        mig_status_title: "✈️ 199区服务器移民申请状态",
        mig_note: "您可以通过**首页**菜单中的表格申请。",
        mig_list_card: "申请人列表 (联系方式隐藏)",
        tbl_name: "名称",
        tbl_server_asal: "原始服务器",
        tbl_power_jt: "战力(M)",
        tbl_date: "注册日期",
        buff_title: "🛡️ 帝都 (IC) 增益请求表",
        buff_form_card: "请求表",
        buff_note: "帝都增益请求发送给 R4/R5。请求增益时，请确保您位于正确的坐标。",
        buff_name: "玩家名称:",
        buff_type: "增益类型:",
        buff_select: "选择增益类型",
        buff_submit: "发送增益请求",
        buff_list_card: "当前增益请求列表",
        tbl_buff_type: "增益类型",
        tbl_date_req: "请求日期",
        tbl_time_req: "请求时间",
        tbl_status: "状态",
        admin_title: "🔑 管理面板",
        admin_login_card: "管理员登录",
        btn_login: "登录",
        btn_logout: "管理员退出",
        adm_btn_clear_all_data: "清除所有数据 (危险!)",
        adm_post_title: "1. 添加/编辑帖子",
        adm_post_title_label: "帖子标题:",
        adm_post_content_label: "帖子内容 (文本/图片 URL):",
        adm_btn_add: "添加帖子",
        adm_btn_cancel: "取消编辑",
        adm_post_manage: "管理当前帖子",
        adm_ranks_title: "2. 输入排名数据 (战力/功勋)",
        adm_ranks_manage: "当前排名数据 (编辑后保存)",
        adm_btn_save_all_ranks: "保存所有更改",
        adm_btn_clear_power: "清除战力排名",
        adm_btn_clear_merit: "清除功勋排名",
        adm_status_event_title: "3. 编辑活动状态",
        adm_status_event_name: "活跃活动名称:",
        adm_status_event_status: "活动状态:",
        adm_status_event_note: "备注 / 附加详情:",
        adm_btn_update: "更新活动状态",
        adm_info_title: "4. 编辑服务器信息",
        adm_info_alliance_label: "主联盟信息 (使用 HTML 标签进行格式化):",
        adm_info_rules_label: "服务器规则 (使用 HTML 标签进行格式化):",
        adm_btn_add_update: "添加/更新信息数据",
        adm_mig_status_and_list: "5. 移民登记与状态",
        adm_status_war: "战争状态:",
        adm_status_mig: "移民状态:",
        adm_mig_detail_title: "移民登记数据 (详情 - 清晰联系方式)",
        tbl_contact: "联系方式 (清晰)",
        tbl_action: "操作",
        adm_btn_clear_all: "清除移民列表",
        adm_buff_detail_title: "6. 增益请求列表 (详情)",
        tbl_buff: "增益",
        tbl_date_time: "请求时间与日期",
        // tbl_status: "状态", // Sudah didefinisikan sebelumnya
        adm_kvk_title: "7. 编辑战争日程", // *PERBAIKAN: Mengganti teks*
        adm_kvk_label: "KvK/星际战争日程 (使用 HTML 标签进行格式化):",
        adm_btn_save: "保存日程",
        adm_king_title: "8. 编辑国王名称",
        adm_king_label: "现任国王名称:",
        adm_btn_save_king: "保存国王名称", // *PERBAIKAN: Tombol King*
        footer_text: "© 2025 AOEM 199 by HADES", // DIUBAH
        msg_mig_success: "移民登记成功提交。谢谢！",
        msg_buff_success: "增益请求成功发送。请等待 R4/R5 确认！",
        msg_login_fail: "密码不正确。请重试。",
        msg_post_success: "帖子保存成功。",
        msg_update_success: "数据更新成功。",
        msg_rank_saved: "排名数据保存成功。",
        msg_rank_cleared: "[TYPE] 排名数据清除成功。",
        msg_delete_success: "条目删除成功。",
        msg_clear_all_confirm: "您确定要删除所有 [TYPE] 数据吗？此操作无法撤消。",
        msg_buff_status_update: "增益状态更新成功。",
        msg_king_update: "国王名称保存成功。",
        msg_kvk_update: "KvK 日程保存成功。",
        msg_info_update: "服务器信息保存成功。",
        msg_rank_added: "排名条目添加成功。",
        msg_clear_buff_confirm: "您确定要删除所有增益请求吗？此操作无法撤消。",
    },
    // Japanese
    'ja': {
        page_title: "AoEM サーバー199 コミュニティサイト",
        hub_title: "AOEM S199", // DIUBAH
        king_name_prefix: "国王:",
        menu_home: "ホーム",
        menu_ranks: "ランキング",
        menu_events: "イベント",
        menu_info: "サーバー情報",
        menu_migration: "移住リスト",
        menu_buff: "バフ申請",
        menu_login: "管理者ログイン",
        menu_admin: "管理者ツール",
        home_title: "📢 ホーム & 最新投稿",
        status_war_title: "サーバー戦争ステータス",
        mig_status_card: "S199 移住受け入れステータス",
        status_label: "ステータス",
        post_loading: "投稿をロード中...",
        post_empty: "まだ投稿はありません。",
        mig_form_title: "✈️ S199 移住登録フォーム",
        mig_form_note: "移住にご興味がある方は、下記に詳細をご記入ください。",
        mig_name: "プレイヤー/ゲーム内名:",
        mig_server: "元のサーバー:",
        mig_power: "総戦力 (百万):",
        mig_contact: "連絡先 (Discord/Telegram):",
        mig_submit: "移住登録を送信",
        ranks_title: "📈 プレイヤーランキング (戦力 & 功績)",
        ranks_power_card: "戦力ランキング TOP 5",
        ranks_merit_card: "功績ランキング TOP 5",
        tbl_no: "番号",
        tbl_player: "プレイヤー",
        tbl_alliance: "連盟",
        tbl_power: "戦力",
        tbl_merit: "功績",
        tbl_notes: "備考",
        events_title: "⏳ グローバルイベントステータス",
        events_current_card: "現在のイベント",
        status_label_current: "ステータス",
        events_note: "最終更新: ---",
        events_kvk_card: "戦争スケジュール", // *PERBAIKAN: Mengganti teks*
        info_title: "🌐 サーバー199 情報",
        info_alliance_card: "主要連盟情報",
        info_rules_card: "サーバー規則",
        mig_status_title: "✈️ サーバー199への移住申請ステータス",
        mig_note: "「ホーム」メニューからフォーム経由で申請できます。",
        mig_list_card: "申請者リスト (連絡先は非表示)",
        tbl_name: "名前",
        tbl_server_asal: "元のサーバー",
        tbl_power_jt: "戦力(M)",
        tbl_date: "登録日",
        buff_title: "🛡️ 帝都 (IC) バフ申請フォーム",
        buff_form_card: "申請フォーム",
        buff_note: "帝都バフ申請はR4/R5に送信されます。バフを要求する際は、正しい座標にいることを確認してください。",
        buff_name: "プレイヤー名:",
        buff_type: "バフの種類:",
        buff_select: "バフの種類を選択",
        buff_submit: "バフ申請を送信",
        buff_list_card: "現在のバフ申請リスト",
        tbl_buff_type: "バフの種類",
        tbl_date_req: "申請日",
        tbl_time_req: "申請時間",
        tbl_status: "ステータス",
        admin_title: "🔑 管理者パネル",
        admin_login_card: "管理者ログイン",
        btn_login: "ログイン",
        btn_logout: "管理者ログアウト",
        adm_btn_clear_all_data: "全データ消去 (危険!)",
        adm_post_title: "1. 投稿の追加/編集",
        adm_post_title_label: "投稿タイトル:",
        adm_post_content_label: "投稿内容 (テキスト/画像URL):",
        adm_btn_add: "投稿を追加",
        adm_btn_cancel: "編集をキャンセル",
        adm_post_manage: "現在の投稿を管理",
        adm_ranks_title: "2. ランキングデータを入力 (戦力/功績)",
        adm_ranks_manage: "現在のランキングデータ (編集後保存)",
        adm_btn_save_all_ranks: "全ての変更を保存",
        adm_btn_clear_power: "戦力ランキングをクリア",
        adm_btn_clear_merit: "功績ランキングをクリア",
        adm_status_event_title: "3. イベントステータスを編集",
        adm_status_event_name: "アクティブなイベント名:",
        adm_status_event_status: "イベントステータス:",
        adm_status_event_note: "備考 / 追加詳細:",
        adm_btn_update: "イベントステータスを更新",
        adm_info_title: "4. サーバー情報を編集",
        adm_info_alliance_label: "主要連盟情報 (HTMLタグを使用してフォーマット):",
        adm_info_rules_label: "サーバー規則 (HTMLタグを使用してフォーマット):",
        adm_btn_add_update: "情報データを追加/更新",
        adm_mig_status_and_list: "5. 移住登録とステータス",
        adm_status_war: "戦争ステータス:",
        adm_status_mig: "移住ステータス:",
        adm_mig_detail_title: "移住登録データ (詳細 - 明確な連絡先)",
        tbl_contact: "連絡先 (明確)",
        tbl_action: "アクション",
        adm_btn_clear_all: "移住リストをクリア",
        adm_buff_detail_title: "6. バフ申請リスト (詳細)",
        tbl_buff: "バフ",
        tbl_date_time: "申請時刻と日付",
        // tbl_status: "ステータス", // Sudah didefinisikan sebelumnya
        adm_kvk_title: "7. 戦争スケジュールを編集", // *PERBAIKAN: Mengganti teks*
        adm_kvk_label: "KvK/ステラ戦争スケジュール (HTMLタグを使用してフォーマット):",
        adm_btn_save: "スケジュールを保存",
        adm_king_title: "8. 国王名を編集",
        adm_king_label: "現行の国王名:",
        adm_btn_save_king: "国王名を保存", // *PERBAIKAN: Tombol King*
        footer_text: "© 2025 AOEM 199 by HADES", // DIUBAH
        msg_mig_success: "移住登録が正常に送信されました。ありがとうございます！",
        msg_buff_success: "バフ申請が正常に送信されました。R4/R5の確認をお待ちください！",
        msg_login_fail: "パスワードが間違っています。再試行してください。",
        msg_post_success: "投稿が正常に保存されました。",
        msg_update_success: "データが正常に更新されました。",
        msg_rank_saved: "ランキングデータが正常に保存されました。",
        msg_rank_cleared: "[TYPE]ランキングデータが正常にクリアされました。",
        msg_delete_success: "エントリが正常に削除されました。",
        msg_clear_all_confirm: "すべての[TYPE]データを削除してもよろしいですか？この操作は元に戻せません。",
        msg_buff_status_update: "バフステータスが正常に更新されました。",
        msg_king_update: "国王名が正常に保存されました。",
        msg_kvk_update: "KvKスケジュールが正常に保存されました。",
        msg_info_update: "サーバー情報が正常に保存されました。",
        msg_rank_added: "ランキングエントリが正常に追加されました。",
        msg_clear_buff_confirm: "すべてのバフ申請を削除してもよろしいですか？この操作は元に戻せません。",
    },
    // Tambahkan terjemahan untuk RU di sini jika diperlukan
};

function translateElement(element) {
    const key = element.getAttribute('data-lang-key');
    if (key && translations[currentLang] && translations[currentLang][key]) {
        if (element.tagName === 'TITLE') {
             document.title = translations[currentLang][key];
        } else {
             element.textContent = translations[currentLang][key];
        }
    }
}

function changeLanguage(langCode) {
    if (translations[langCode]) {
        currentLang = langCode;
        saveData('language', langCode);
        const langBtn = document.getElementById('currentLangBtn');
        if (langBtn) langBtn.textContent = langCode.toUpperCase();

        document.querySelectorAll('[data-lang-key]').forEach(translateElement);
        
        // Perlu memuat ulang konten dinamis
        renderPostings();
        renderRanks();
        renderMigrationList('public');
        renderBuffList('public');
        renderServerInfo();

        // Admin view harus direfresh
        if (isLoggedIn) {
             renderAdminTools();
        }
    }
}

function toggleLangMenu(event) {
    event.stopPropagation();
    const langDropdown = document.getElementById('langDropdown');
    if (langDropdown) langDropdown.classList.toggle('hidden');
}

document.addEventListener('click', function(event) {
    const langDropdown = document.getElementById('langDropdown');
    if (langDropdown && !langDropdown.classList.contains('hidden')) {
        langDropdown.classList.add('hidden');
    }
});


/* --- USER FORM HANDLERS (MIGRATION & BUFF) --- */

function submitMigrationForm(event) {
    event.preventDefault();

    const name = document.getElementById('migName')?.value.trim();
    const server = document.getElementById('migServer')?.value.trim();
    const powerInput = document.getElementById('migPower')?.value;
    const power = parseFloat(powerInput);
    const contact = document.getElementById('migContact')?.value.trim();

    if (!name || !server || isNaN(power) || power < 1 || !contact) {
        alert("Harap lengkapi semua bidang dengan benar.");
        return;
    }

    const newMigration = {
        name,
        server,
        power,
        contact,
        date: new Date().toISOString()
    };

    migrations.push(newMigration);
    saveData('migrations', migrations);
    renderMigrationList('public');

    alert(translations[currentLang]['msg_mig_success'] || "Pendaftaran Migrasi berhasil dikirim. Terima kasih!");
    document.getElementById('migrationForm')?.reset();
}

function submitBuffRequestForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('buffName')?.value.trim();
    const type = document.getElementById('buffType')?.value;
    const contact = document.getElementById('buffContact')?.value.trim();

    if (!name || !type || !contact) {
        alert("Harap lengkapi semua bidang dengan benar.");
        return;
    }

    const newBuffRequest = {
        name,
        type,
        contact,
        date: new Date().toISOString(),
        status: 'Pending'
    };

    buffRequests.push(newBuffRequest);
    saveData('buffRequests', buffRequests);
    renderBuffList('public');

    alert(translations[currentLang]['msg_buff_success'] || "Permintaan Buff berhasil dikirim. Harap tunggu konfirmasi R4/R5!");
    document.getElementById('buffRequestForm')?.reset();
}


/* --- ADMIN LOGIN & TOOLS --- */

function checkAdminLoginStatus() {
    isLoggedIn = loadData('isLoggedIn', false);
    const adminTab = document.getElementById('adminToolsTab');
    const loginTab = document.getElementById('loginAdminTab');

    if (adminTab && loginTab) {
        if (isLoggedIn) {
            adminTab.classList.remove('hidden');
            loginTab.classList.add('hidden');
        } else {
            adminTab.classList.add('hidden');
            loginTab.classList.remove('hidden');
        }
    }
}

function loginAdmin() {
    const password = document.getElementById('adminPass')?.value;
    const loginMessage = document.getElementById('loginMessage');
    
    if (password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        saveData('isLoggedIn', true);
        checkAdminLoginStatus();
        if (loginMessage) loginMessage.textContent = "";
        showSection('admin');
        renderAdminTools();
        const adminPassInput = document.getElementById('adminPass');
        if (adminPassInput) adminPassInput.value = '';
    } else {
        if (loginMessage) loginMessage.textContent = translations[currentLang]['msg_login_fail'] || "Password salah. Silakan coba lagi.";
    }
}

function logoutAdmin() {
    isLoggedIn = false;
    saveData('isLoggedIn', false);
    checkAdminLoginStatus();
    showSection('beranda');
    alert("Logout berhasil.");
}

function renderAdminTools() {
    // Hanya render jika admin sedang login
    if (!isLoggedIn) return;

    // 1. Postings
    renderAdminPostList();
    
    // 2. Ranks
    renderAdminRankList();
    
    // 3. Event Status
    if (document.getElementById('admEventName')) document.getElementById('admEventName').value = statusData.eventName;
    if (document.getElementById('admEventStatus')) document.getElementById('admEventStatus').value = statusData.eventStatus;
    if (document.getElementById('admEventNote')) document.getElementById('admEventNote').value = statusData.eventNote;

    // 4. Server Info
    if (document.getElementById('admAllianceInfo')) document.getElementById('admAllianceInfo').value = statusData.allianceInfo;
    if (document.getElementById('admRulesInfo')) document.getElementById('admRulesInfo').value = statusData.rulesInfo;

    // 5. War/Mig Status
    if (document.getElementById('admWarStatus')) document.getElementById('admWarStatus').value = statusData.warStatus;
    if (document.getElementById('admMigStatus')) document.getElementById('admMigStatus').value = statusData.migStatus;
    renderMigrationList('admin');

    // 6. Buff List
    renderBuffList('admin');

    // 7. KvK Schedule
    if (document.getElementById('admKvkSchedule')) document.getElementById('admKvkSchedule').value = statusData.kvkSchedule;

    // 8. King Name
    if (document.getElementById('admKingName')) document.getElementById('admKingName').value = statusData.kingName;
}

// --- ADMIN POSTING FUNCTIONS ---
// --- MODIFIKASI: HANYA TAMPILKAN JUDUL & SEDIKIT KONTEN DI ADMIN LIST ---
function renderAdminPostList() {
    const listContainer = document.getElementById('adminPostList');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    postings.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((post, index) => {
        const item = document.createElement('div');
        item.className = 'post-item';
        
        // Hanya tampilkan Judul dan potongan Konten (tanpa tanggal)
        const contentPreview = post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;
        
        item.innerHTML = `
            <h4>${post.title}</h4>
            <div style="font-size: 0.9em; margin-bottom: 10px; color: #bdc3c7;">${contentPreview.replace(/\n/g, '<br>')}</div>
            <button class="btn btn-secondary" onclick="editPost(${index})">${translations[currentLang]['adm_btn_cancel'] || "Edit"}</button>
            <button class="btn btn-danger" onclick="deleteEntry('postings', ${index})">${translations[currentLang]['tbl_action'] || "Hapus"}</button>
        `;
        listContainer.appendChild(item);
    });
}
// --- AKHIR MODIFIKASI renderAdminPostList ---

function submitAdminPost() {
    // postTitle di admin form sekarang disembunyikan dan di-set default value,
    // tapi tetap disimpab di object post.
    const title = document.getElementById('postTitle')?.value || "Postingan Baru"; // Default jika elemen hilang
    const content = document.getElementById('postContent')?.value;
    const postId = document.getElementById('postIdToEdit')?.value;

    if (!content) {
        alert("Isi postingan tidak boleh kosong.");
        return;
    }

    if (postId !== "") {
        // Edit mode
        const index = parseInt(postId);
        if (index >= 0 && index < postings.length) {
            postings[index].title = title;
            postings[index].content = content;
            postings[index].date = new Date().toISOString(); // Update date on edit
            const postSubmitBtn = document.getElementById('postSubmitBtn');
            if (postSubmitBtn) postSubmitBtn.textContent = translations[currentLang]['adm_btn_add'];
            const postIdToEditInput = document.getElementById('postIdToEdit');
            if (postIdToEditInput) postIdToEditInput.value = "";
            const cancelEditBtn = document.getElementById('cancelEditBtn');
            if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
        }
    } else {
        // New post mode
        const newPost = {
            title: title,
            content: content,
            date: new Date().toISOString()
        };
        postings.push(newPost);
    }

    saveData('postings', postings);
    renderPostings();
    renderAdminPostList();
    document.getElementById('adminPostForm')?.reset();
    alert(translations[currentLang]['msg_post_success'] || "Postingan berhasil disimpan.");
}

function editPost(index) {
    if (index < 0 || index >= postings.length) return;
    const post = postings[index];
    
    const postTitleInput = document.getElementById('postTitle');
    const postContentInput = document.getElementById('postContent');
    const postIdToEditInput = document.getElementById('postIdToEdit');
    const postSubmitBtn = document.getElementById('postSubmitBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    if (postTitleInput) postTitleInput.value = post.title; 
    if (postContentInput) postContentInput.value = post.content;
    if (postIdToEditInput) postIdToEditInput.value = index;
    
    if (postSubmitBtn) postSubmitBtn.textContent = translations[currentLang]['adm_btn_save'] || "Simpan Perubahan"; // Set manually for clarity
    if (cancelEditBtn) cancelEditBtn.classList.remove('hidden');
    scrollToTop();
}

function cancelEditPost() {
    document.getElementById('adminPostForm')?.reset();
    const postIdToEditInput = document.getElementById('postIdToEdit');
    if (postIdToEditInput) postIdToEditInput.value = "";
    const postSubmitBtn = document.getElementById('postSubmitBtn');
    if (postSubmitBtn) postSubmitBtn.textContent = translations[currentLang]['adm_btn_add'];
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
}


// --- ADMIN RANK FUNCTIONS ---
function renderAdminRankList() {
    const listContainer = document.getElementById('adminRankListContainer');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    
    // Gabungkan dan urutkan berdasarkan nomor. Ini akan membuat baris Power dan Merit berdekatan
    const combinedRanks = [...powerRanks.map(r => ({...r, type: 'power', globalIndex: powerRanks.findIndex(pr => pr === r)})), 
                           ...meritRanks.map(r => ({...r, type: 'merit', globalIndex: meritRanks.findIndex(mr => mr === r)}))]
                           .sort((a, b) => a.no - b.no || (a.type === 'power' ? -1 : 1)); // Prioritaskan Power jika No. sama

    if (combinedRanks.length === 0) {
        listContainer.innerHTML = '<p>Belum ada data peringkat. Gunakan formulir di atas untuk menambahkan.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'data-table admin-rank-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>${translations[currentLang]['tbl_no'] || "No."}</th>
                <th>${translations[currentLang]['tbl_player'] || "Nama Pemain"}</th>
                <th>${translations[currentLang]['tbl_alliance'] || "Aliansi"}</th>
                <th>${translations[currentLang]['tbl_power_jt'] || "Power (Jt)"}</th>
                <th>${translations[currentLang]['tbl_merit'] || "Merit"}</th>
                <th>${translations[currentLang]['tbl_notes'] || "Keterangan"}</th>
                <th>${translations[currentLang]['tbl_buff_type'] || "Tipe"}</th>
                <th>${translations[currentLang]['tbl_action'] || "Aksi"}</th>
            </tr>
        </thead>
        <tbody id="adminRankListBody"></tbody>
    `;
    listContainer.appendChild(table);
    const tbody = document.getElementById('adminRankListBody');
    if (!tbody) return;
    
    combinedRanks.forEach((rank, index) => {
        const row = tbody.insertRow();
        row.dataset.type = rank.type;
        row.dataset.index = rank.globalIndex; // Index dalam array Power atau Merit
        row.innerHTML = `
            <td><input type="number" class="admin-rank-no" value="${rank.no}"></td>
            <td><input type="text" class="admin-rank-name" value="${rank.name}"></td>
            <td><input type="text" class="admin-rank-alliance" value="${rank.alliance}"></td>
            <td><input type="number" class="admin-rank-power" value="${rank.type === 'power' ? rank.value : ''}" ${rank.type !== 'power' ? 'disabled' : ''}></td>
            <td><input type="number" class="admin-rank-merit" value="${rank.type === 'merit' ? rank.value : ''}" ${rank.type !== 'merit' ? 'disabled' : ''}></td>
            <td><input type="text" class="admin-rank-notes" value="${rank.notes || ''}"></td>
            <td><span class="btn ${rank.type === 'power' ? 'btn-primary' : 'btn-secondary'}">${rank.type.toUpperCase()}</span></td>
            <td><button class="btn btn-danger" onclick="deleteRankEntry('${rank.type}', ${rank.globalIndex})">${translations[currentLang]['tbl_action'] || "Hapus"}</button></td>
        `;
    });
}

function addRankEntry() {
    const no = parseInt(document.getElementById('rankNo')?.value);
    const name = document.getElementById('rankName')?.value.trim();
    const alliance = document.getElementById('rankAlliance')?.value.trim();
    const powerValueStr = document.getElementById('rankPowerValue')?.value;
    const meritValueStr = document.getElementById('rankMeritValue')?.value;
    const notes = document.getElementById('rankNotes')?.value.trim();

    const powerValue = powerValueStr ? parseFloat(powerValueStr) : undefined;
    const meritValue = meritValueStr ? parseInt(meritValueStr) : undefined;

    if (!no || !name || !alliance || (!powerValue && !meritValue)) {
        alert("Harap isi No, Nama, Aliansi, dan setidaknya satu nilai Power atau Merit.");
        return;
    }

    if (powerValue !== undefined && !isNaN(powerValue)) {
        powerRanks.push({ no, name, alliance, value: powerValue, notes, type: 'power' });
        powerRanks.sort((a, b) => a.no - b.no);
    }
    if (meritValue !== undefined && !isNaN(meritValue)) {
        meritRanks.push({ no, name, alliance, value: meritValue, notes, type: 'merit' });
        meritRanks.sort((a, b) => a.no - b.no);
    }

    saveData('powerRanks', powerRanks);
    saveData('meritRanks', meritRanks);
    
    renderRanks();
    renderAdminRankList();
    document.getElementById('adminRankInputForm')?.reset();
    alert(translations[currentLang]['msg_rank_added'] || "Entri peringkat berhasil ditambahkan.");
}

function updateRankDataAdmin() {
    const tbody = document.getElementById('adminRankListBody');
    if (!tbody) return;

    // Reset ranks before saving
    powerRanks = [];
    meritRanks = [];

    Array.from(tbody.rows).forEach(row => {
        const type = row.dataset.type;
        const no = parseInt(row.querySelector('.admin-rank-no')?.value);
        const name = row.querySelector('.admin-rank-name')?.value;
        const alliance = row.querySelector('.admin-rank-alliance')?.value;
        const notes = row.querySelector('.admin-rank-notes')?.value;
        
        if (isNaN(no) || !name || !alliance) return; // Skip invalid entries

        if (type === 'power') {
            const value = parseFloat(row.querySelector('.admin-rank-power')?.value);
            powerRanks.push({ no, name, alliance, value: value || 0, notes, type: 'power' });
        }
        if (type === 'merit') {
            const value = parseInt(row.querySelector('.admin-rank-merit')?.value);
            meritRanks.push({ no, name, alliance, value: value || 0, notes, type: 'merit' });
        }
    });

    powerRanks.sort((a, b) => a.no - b.no);
    meritRanks.sort((a, b) => a.no - b.no);

    saveData('powerRanks', powerRanks);
    saveData('meritRanks', meritRanks);
    
    renderRanks();
    renderAdminRankList();
    alert(translations[currentLang]['msg_rank_saved'] || "Data peringkat berhasil disimpan.");
}


// --- ADMIN STATUS/INFO/KING FUNCTIONS ---
function updateWarMigStatusAdmin() {
    statusData.warStatus = document.getElementById('admWarStatus')?.value.trim() || statusData.warStatus;
    statusData.migStatus = document.getElementById('admMigStatus')?.value.trim() || statusData.migStatus;
    saveData('status', statusData);
    renderStatus();
    alert(translations[currentLang]['msg_update_success'] || "Data berhasil diperbarui.");
}

function updateEventStatusAdmin() {
    statusData.eventName = document.getElementById('admEventName')?.value.trim() || statusData.eventName;
    statusData.eventStatus = document.getElementById('admEventStatus')?.value.trim() || statusData.eventStatus;
    statusData.eventNote = document.getElementById('admEventNote')?.value.trim() || statusData.eventNote;
    saveData('status', statusData);
    renderStatus();
    alert(translations[currentLang]['msg_update_success'] || "Data berhasil diperbarui.");
}

function updateServerInfoAdmin() {
    statusData.allianceInfo = document.getElementById('admAllianceInfo')?.value || statusData.allianceInfo;
    statusData.rulesInfo = document.getElementById('admRulesInfo')?.value || statusData.rulesInfo;
    saveData('status', statusData);
    renderServerInfo();
    alert(translations[currentLang]['msg_info_update'] || "Info Server berhasil disimpan.");
}

function updateKvkScheduleAdmin() {
    statusData.kvkSchedule = document.getElementById('admKvkSchedule')?.value || statusData.kvkSchedule;
    saveData('status', statusData);
    renderServerInfo();
    alert(translations[currentLang]['msg_kvk_update'] || "Jadwal KvK berhasil disimpan.");
}

/**
 * ***************************************
 * PERBAIKAN FUNGSI TOMBOL "EDIT NAMA RAJA"
 * ***************************************
 */
function updateKingNameAdmin() {
    const kingNameInput = document.getElementById('admKingName');
    if (!kingNameInput) {
        console.error("Input 'admKingName' tidak ditemukan.");
        return;
    }
    
    statusData.kingName = kingNameInput.value.trim() || statusData.kingName;
    saveData('status', statusData);
    renderStatus(); // Memperbarui tampilan nama raja di header
    alert(translations[currentLang]['msg_king_update'] || "Nama Raja berhasil disimpan.");
}


// --- ADMIN BUFF FUNCTIONS ---
function updateBuffStatus(index, newStatus) {
    if (index >= 0 && index < buffRequests.length) {
        buffRequests[index].status = newStatus;
        saveData('buffRequests', buffRequests);
        renderBuffList('public');
        renderBuffList('admin');
        alert(translations[currentLang]['msg_buff_status_update'] || "Status Buff berhasil diperbarui.");
    }
}


// --- ADMIN DELETE/CLEAR FUNCTIONS ---
function deleteEntry(type, index) {
    if (!confirm(`Yakin ingin menghapus entri ke-${index + 1} dari ${type}?`)) {
        return;
    }

    switch (type) {
        case 'postings':
            postings.splice(index, 1);
            saveData('postings', postings);
            renderPostings();
            renderAdminPostList();
            break;
        case 'migration':
            migrations.splice(index, 1);
            saveData('migrations', migrations);
            renderMigrationList('public');
            renderMigrationList('admin');
            break;
        case 'buff':
            buffRequests.splice(index, 1);
            saveData('buffRequests', buffRequests);
            renderBuffList('public');
            renderBuffList('admin');
            break;
    }
    alert(translations[currentLang]['msg_delete_success'] || "Entri berhasil dihapus.");
}

function deleteRankEntry(type, index) {
     if (!confirm(`Yakin ingin menghapus entri peringkat ke-${index + 1} dari ${type}?`)) {
        return;
    }
    
    if (type === 'power') {
        powerRanks.splice(index, 1);
        saveData('powerRanks', powerRanks);
    } else if (type === 'merit') {
        meritRanks.splice(index, 1);
        saveData('meritRanks', meritRanks);
    }
    
    renderRanks();
    renderAdminRankList();
    alert(translations[currentLang]['msg_delete_success'] || "Entri berhasil dihapus.");
}

function clearRankDataPrompt(type) {
    const typeUpper = type.toUpperCase();
    const msg = (translations[currentLang]['msg_rank_cleared'] || "Data peringkat [TIPE] berhasil dibersihkan.").replace('[TIPE]', typeUpper);
    
    if (confirm(`Yakin ingin membersihkan semua data peringkat ${typeUpper}?`)) {
        if (type === 'power') {
            powerRanks = [];
            saveData('powerRanks', powerRanks);
        } else if (type === 'merit') {
            meritRanks = [];
            saveData('meritRanks', meritRanks);
        }
        renderRanks();
        renderAdminRankList();
        alert(msg);
    }
}

function clearAllDataPrompt(type) {
    const typeUpper = type.toUpperCase();
    let confirmationMessage = (translations[currentLang]['msg_clear_all_confirm'] || "APAKAH ANDA YAKIN INGIN MENGHAPUS SEMUA DATA [TIPE]? Tindakan ini tidak dapat dibatalkan.").replace('[TIPE]', typeUpper);

    if (type === 'migration') {
        confirmationMessage = (translations[currentLang]['msg_clear_all_confirm'] || "APAKAH ANDA YAKIN INGIN MENGHAPUS SEMUA DATA [TIPE]? Tindakan ini tidak dapat dibatalkan.").replace('[TIPE]', "MIGRASI");
    } else if (type === 'buff') {
         confirmationMessage = translations[currentLang]['msg_clear_buff_confirm'] || "APAKAH ANDA YAKIN INGIN MENGHAPUS SEMUA DAFTAR PERMINTAAN BUFF? Tindakan ini tidak dapat dibatalkan.";
    } else if (type === 'all') {
        confirmationMessage = (translations[currentLang]['msg_clear_all_confirm'] || "APAKAH ANDA YAKIN INGIN MENGHAPUS SEMUA DATA [TIPE]? Tindakan ini tidak dapat dibatalkan.").replace('[TIPE]', "SERVER");
    }

    if (confirm(confirmationMessage)) {
        clearAllData(type);
    }
}

function clearAllData(type) {
    const typeUpper = type.toUpperCase();
    const msg = (translations[currentLang]['msg_delete_success'] || "Entri berhasil dihapus.").replace('Entri', `Data ${typeUpper}`);

    if (type === 'migration') {
        migrations = [];
        saveData('migrations', migrations);
        renderMigrationList('public');
        renderMigrationList('admin');
    } else if (type === 'buff') {
        buffRequests = [];
        saveData('buffRequests', buffRequests);
        renderBuffList('public');
        renderBuffList('admin');
    } else if (type === 'all') {
        // Hapus semua data kecuali bahasa dan login status
        localStorage.removeItem(STORAGE_PREFIX + 'powerRanks');
        localStorage.removeItem(STORAGE_PREFIX + 'meritRanks');
        localStorage.removeItem(STORAGE_PREFIX + 'postings');
        localStorage.removeItem(STORAGE_PREFIX + 'migrations');
        localStorage.removeItem(STORAGE_PREFIX + 'buffRequests');
        
        // Reset status data
        statusData = {
            kingName: "Nama Raja Belum Ditetapkan", warStatus: "PVE", migStatus: "SYARAT KHUSUS",
            eventName: "Nama Event Aktif", eventStatus: "SELESAI", eventNote: "Info terakhir: ---",
            allianceInfo: "Tidak ada info aliansi.", rulesInfo: "Tidak ada peraturan server.", kvkSchedule: "Jadwal KvK belum diatur."
        };
        saveData('status', statusData);
        alert("Semua Data Server berhasil DIHAPUS dan di-reset ke nilai default.");
        window.location.reload(); // Refresh untuk memuat ulang semua data
        return;
    }
    alert(msg);
}

// Tambahkan inisialisasi pada saat DOMContentLoaded selesai
document.addEventListener('DOMContentLoaded', initialLoad);
