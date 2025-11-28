// script.js — AOEM S199 (FINAL, BASE64 STORAGE, MULTI-LANGUAGE)
// Requires: firebaseConfig defined in index.html before this file is loaded

/* ======================
   Multi-language Translations
   ====================== */
const translations = {
    'id': {
        // --- Header & Global ---
        'web-title': 'AOEM S199',
        'king-name-label': 'Raja', // Label without colon, colon added in setLanguage
        'admin-label': 'Admin',
        'logout-label': 'Logout',
        'confirm-modal-title': 'Konfirmasi',
        'confirm-modal-text': 'Apakah Anda yakin?',
        'confirm-modal-yes': 'Ya',
        'confirm-modal-cancel': 'Batal',
        
        // --- Tabs (Nav Menu) ---
        'tab-home': '🏠 Home',
        'tab-ranks': '📊 Ranks',
        'tab-events': '⏳ Events',
        'tab-info': '🌐 Info',
        'tab-migration': '✈️ Migrasi',
        'tab-login': '🔑 Admin',
        'tab-admin': 'Admin',
        
        // --- Home Page ---
        'posts-latest': '📢 Postingan Terbaru',
        'posts-loading': 'Memuat posting...',
        'status-war-title': 'Status War',
        'status-war-label': 'Status',
        'status-migration-title': 'Status Migrasi',
        'status-migration-label': 'Status',
        'highlight-title': 'Highlight',
        'mig-form-title': 'Form Pendaftaran Migrasi',
        'mig-name-label': 'Nama:',
        'mig-server-label': 'Server asal:',
        'mig-power-label': 'Power:',
        'mig-contact-label': 'Kontak:',
        'mig-submit-btn': 'Kirim',
        
        // --- Ranks Page ---
        'ranks-title': '📊 Ranking',
        'power-ranking-title': 'Power Ranking',
        'merit-ranking-title': 'Merit Ranking',
        'rank-hash-col': '#',
        'rank-name-col': 'Nama',
        'rank-alliance-col': 'Aliansi',
        'rank-power-col': 'Power',
        'rank-merit-col': 'Merit',
        
        // --- Events Page ---
        'events-title': '⏳ Event Global',
        'event-status-title': 'Status Event',
        'event-name-label': 'Event',
        'event-status-label': 'Status',
        'event-note-label': 'Catatan',
        'kvk-schedule-title': 'Jadwal KvK',
        
        // --- Info Page ---
        'info-title': '🌐 Info Server',
        'alliance-info-title': 'Info Aliansi',
        'rules-info-title': 'Peraturan',
        
        // --- Migration List Page ---
        'miglist-title': '✈️ Daftar Pendaftar Migrasi',
        'miglist-server-col': 'Server',
        'miglist-date-col': 'Tanggal',
        
        // --- Login Page ---
        'login-title': '🔑 Login Admin',
        'login-email-label': 'Email Admin:',
        'login-pass-label': 'Password:',
        'login-btn': 'Login',
        
        // --- Admin Panel (Sidebar) ---
        'adm-dashboard': 'Dashboard',
        'adm-posts': 'Postingan',
        'adm-ranks': 'Ranking',
        'adm-migrations': 'Migrasi',
        'adm-files': 'Upload',
        'adm-admins': 'Admin',
        'adm-server': 'Server Info',
        'adm-settings': 'Pengaturan',
        'adm-panel-title': 'Admin Panel',
        'adm-stat-posts-title': 'Total Postingan',
        'adm-stat-ranks-title': 'Total Ranking',
        'adm-stat-migs-title': 'Total Migrasi',
        
        // --- Admin - Posts ---
        'adm-posts-title': '📝 Kelola Postingan',
        'adm-post-title-label': 'Judul:',
        'adm-post-content-label': 'Isi / URL Gambar:',
        'adm-post-featured-label': 'Featured:',
        'adm-post-img-upload-label': 'Upload Gambar:',
        'adm-post-upload-btn': 'Upload',
        'adm-post-save-btn': 'Simpan',
        'adm-post-cancel-edit-btn': 'Batal Edit',
        'adm-post-list-title': 'Daftar Postingan',
        'adm-post-featured-check': 'Featured',
        'adm-post-edit-btn': 'Edit',
        'adm-post-replace-img-btn': 'Ganti Gambar',
        'adm-post-delete-btn': 'Hapus',
        
        // --- Admin - Ranks ---
        'adm-ranks-title': '🏅 Kelola Ranking',
        'adm-rank-name-label': 'Nama:',
        'adm-rank-alliance-label': 'Aliansi:',
        'adm-rank-power-label': 'Power:',
        'adm-rank-merit-label': 'Merit:',
        'adm-rank-list-title': 'Daftar Ranking',
        
        // --- Admin - Migrations ---
        'adm-migrations-title': '✈️ Kelola Migrasi',
        'adm-mig-edit-title': 'Edit Data Migrasi',
        'adm-mig-save-btn': 'Simpan',
        'adm-mig-cancel-btn': 'Batal',

        // --- Admin - Files ---
        'adm-files-title': '📁 Upload File & Tema',
        'adm-file-logo-title': 'Logo Website',
        'adm-file-logo-upload-btn': 'Upload Logo',
        'adm-file-wallpaper-title': 'Wallpaper Latar Belakang',
        'adm-file-wallpaper-upload-btn': 'Upload Wallpaper',
        'adm-file-wallpaper-delete-btn': 'Hapus Wallpaper',
        'adm-file-sound-title': 'War Sound',
        'adm-file-sound-label': 'Sound Aktif',
        'adm-file-sound-upload-btn': 'Upload Sound',
        
        // --- Admin - Admins ---
        'adm-admins-title': '👑 Kelola Admin',
        'adm-admin-add-label': 'Tambah email admin:',
        'adm-admin-pass-label': 'Password:',
        'adm-admin-add-btn': 'Tambah Admin Baru',
        'adm-admin-list-title': 'Daftar Admin',
        'adm-admin-primary': '(Admin Utama)',
        'adm-admin-delete-btn': 'Hapus',
        'adm-admin-restriction-msg': 'Fitur penambahan dan penghapusan admin hanya tersedia untuk Admin Utama.',

        // --- Admin - Server ---
        'adm-server-title': '🌐 Pengaturan Server',
        'adm-static-content-title': 'Konten Statis Utama',
        'adm-static-welcome-title-label': 'Judul Pesan Selamat Datang:',
        'adm-static-welcome-content-label': 'Isi Pesan Selamat Datang (HTML diizinkan):',
        'adm-static-important-title-label': 'Judul Pesan Penting:',
        'adm-static-important-content-label': 'Isi Pesan Penting (HTML diizinkan):',
        'adm-static-save-btn': 'Simpan Konten Statis',
        'adm-status-title': 'Status War & Migrasi',
        'adm-status-war-label': 'Status War:',
        'adm-status-mig-label': 'Status Migrasi:',
        'adm-status-save-btn': 'Simpan',
        'adm-event-status-title': 'Status Event',
        'adm-event-name-label': 'Nama Event:',
        'adm-event-status-label': 'Status:',
        'adm-event-note-label': 'Catatan:',
        'adm-info-title': 'Info Server',
        'adm-info-alliance-label': 'Info Aliansi:',
        'adm-info-rules-label': 'Peraturan:',
        'adm-info-save-btn': 'Simpan',
        'adm-kvk-title': 'Jadwal KvK',
        'adm-king-title': 'Nama Raja',
        
        // --- Admin - Settings ---
        'adm-settings-title': '⚙️ Pengaturan Sistem',
        'adm-settings-text': 'Semua setting tersimpan otomatis melalui Firebase Realtime Database.',
        
        // --- Footer ---
        'footer-text': '© 2025 AOEM 199 — By HADES',
        
        // --- Toast Messages --- (for dynamic translation)
        'toast-post-updated': 'Posting diperbarui',
        'toast-post-saved': 'Posting ditambahkan',
        'toast-failed-save': 'Gagal menyimpan',
        'toast-missing-field': 'Lengkapi judul & isi',
        'toast-edit-active': 'Edit mode aktif',
        'toast-edit-cancelled': 'Edit dibatalkan',
        'toast-post-deleted': 'Posting dihapus',
        'toast-failed-delete': 'Gagal hapus',
        'toast-featured-changed': 'Featured diubah',
        'toast-image-replaced': 'Gambar posting diganti (base64)',
        'toast-failed-image': 'Gagal mengganti gambar',
        'toast-select-image': 'Pilih gambar terlebih dahulu',
        'toast-rank-updated': 'Rank diperbarui',
        'toast-rank-saved': 'Rank ditambahkan',
        'toast-rank-deleted': 'Rank dihapus',
        'toast-missing-rank-field': 'Isi nama & aliansi',
        'toast-mig-saved': 'Pendaftaran migrasi terkirim',
        'toast-mig-failed-send': 'Gagal mengirim pendaftaran',
        'toast-mig-missing-field': 'Lengkapi semua field pendaftaran',
        'toast-mig-data-saved': 'Data migrasi disimpan',
        'toast-mig-data-deleted': 'Data migrasi dihapus',
        'toast-mig-data-missing': 'Lengkapi data migrasi',
        'toast-event-saved': 'Event disimpan',
        'toast-server-info-saved': 'Info server disimpan',
        'toast-status-saved': 'Status disimpan',
        'toast-kvk-saved': 'Jadwal KvK disimpan',
        'toast-king-saved': 'Nama Raja disimpan',
        'toast-static-saved': 'Konten Statis disimpan',
        'toast-file-select': 'Pilih file dulu',
        'toast-logo-saved': 'Logo tersimpan (base64)',
        'toast-wallpaper-saved': 'Wallpaper tersimpan (base64)',
        'toast-wallpaper-deleted': 'Wallpaper berhasil dihapus',
        'toast-wallpaper-failed-delete': 'Gagal menghapus wallpaper',
        'toast-wallpaper-confirm': 'Hapus wallpaper latar belakang? (Latar akan kembali ke warna hitam)',
        'toast-sound-saved': 'Sound tersimpan (base64)',
        'toast-access-denied': 'Akses ditolak: Hanya admin utama yang dapat menambahkan admin baru.',
        'toast-admin-exists': 'Email sudah terdaftar. Hanya menambahkan ke daftar admin.',
        'toast-admin-added': 'Admin berhasil didaftarkan!',
        'toast-primary-admin-cannot-be-removed': 'Admin Utama tidak dapat dihapus.',
        'toast-admin-removed': 'Admin dihapus',
        'toast-sound-label-custom': 'custom',
        'toast-admin-list-remove-confirm': 'Hapus admin ini dari daftar yang diizinkan?',
        'toast-admin-login-msg': 'Login berhasil',
    },
    'en': {
        // --- Header & Global ---
        'web-title': 'AOEM S199',
        'king-name-label': 'King',
        'admin-label': 'Admin',
        'logout-label': 'Logout',
        'confirm-modal-title': 'Confirmation',
        'confirm-modal-text': 'Are you sure?',
        'confirm-modal-yes': 'Yes',
        'confirm-modal-cancel': 'Cancel',
        
        // --- Tabs (Nav Menu) ---
        'tab-home': ' Home',
        'tab-ranks': ' Ranks',
        'tab-events': ' Events',
        'tab-info': ' Info',
        'tab-migration': ' Migration',
        'tab-login': ' Admin',
        'tab-admin': 'Admin',
        
        // --- Home Page ---
        'posts-latest': '📢 Latest Posts',
        'posts-loading': 'Loading posts...',
        'status-war-title': 'War Status',
        'status-war-label': 'Status',
        'status-migration-title': 'Migration Status',
        'status-migration-label': 'Status',
        'highlight-title': 'Highlight',
        'mig-form-title': 'Migration Registration Form',
        'mig-name-label': 'Name:',
        'mig-server-label': 'Origin server:',
        'mig-power-label': 'Power:',
        'mig-contact-label': 'Contact:',
        'mig-submit-btn': 'Submit',
        
        // --- Ranks Page ---
        'ranks-title': '📊 Ranking',
        'power-ranking-title': 'Power Ranking',
        'merit-ranking-title': 'Merit Ranking',
        'rank-hash-col': '#',
        'rank-name-col': 'Name',
        'rank-alliance-col': 'Alliance',
        'rank-power-col': 'Power',
        'rank-merit-col': 'Merit',
        
        // --- Events Page ---
        'events-title': '⏳ Global Events',
        'event-status-title': 'Event Status',
        'event-name-label': 'Event',
        'event-status-label': 'Status',
        'event-note-label': 'Note',
        'kvk-schedule-title': 'KvK Schedule',
        
        // --- Info Page ---
        'info-title': '🌐 Server Info',
        'alliance-info-title': 'Alliance Info',
        'rules-info-title': 'Rules',
        
        // --- Migration List Page ---
        'miglist-title': '✈️ Migration Applicants List',
        'miglist-server-col': 'Server',
        'miglist-date-col': 'Date',
        
        // --- Login Page ---
        'login-title': '🔑 Admin Login',
        'login-email-label': 'Admin Email:',
        'login-pass-label': 'Password:',
        'login-btn': 'Login',
        
        // --- Admin Panel (Sidebar) ---
        'adm-dashboard': 'Dashboard',
        'adm-posts': 'Posts',
        'adm-ranks': 'Ranks',
        'adm-migrations': 'Migrations',
        'adm-files': 'Uploads',
        'adm-admins': 'Admins',
        'adm-server': 'Server Info',
        'adm-settings': 'Settings',
        'adm-panel-title': 'Admin Panel',
        'adm-stat-posts-title': 'Total Posts',
        'adm-stat-ranks-title': 'Total Ranks',
        'adm-stat-migs-title': 'Total Migrations',
        
        // --- Admin - Posts ---
        'adm-posts-title': '📝 Manage Posts',
        'adm-post-title-label': 'Title:',
        'adm-post-content-label': 'Content / Image URL:',
        'adm-post-featured-label': 'Featured:',
        'adm-post-img-upload-label': 'Upload Image:',
        'adm-post-upload-btn': 'Upload',
        'adm-post-save-btn': 'Save',
        'adm-post-cancel-edit-btn': 'Cancel Edit',
        'adm-post-list-title': 'Post List',
        'adm-post-featured-check': 'Featured',
        'adm-post-edit-btn': 'Edit',
        'adm-post-replace-img-btn': 'Replace Image',
        'adm-post-delete-btn': 'Delete',

        // --- Admin - Ranks ---
        'adm-ranks-title': '🏅 Manage Ranks',
        'adm-rank-name-label': 'Name:',
        'adm-rank-alliance-label': 'Alliance:',
        'adm-rank-power-label': 'Power:',
        'adm-rank-merit-label': 'Merit:',
        'adm-rank-list-title': 'Rank List',
        
        // --- Admin - Migrations ---
        'adm-migrations-title': '✈️ Manage Migrations',
        'adm-mig-edit-title': 'Edit Migration Data',
        'adm-mig-save-btn': 'Save',
        'adm-mig-cancel-btn': 'Cancel',

        // --- Admin - Files ---
        'adm-files-title': '📁 File & Theme Uploads',
        'adm-file-logo-title': 'Website Logo',
        'adm-file-logo-upload-btn': 'Upload Logo',
        'adm-file-wallpaper-title': 'Background Wallpaper',
        'adm-file-wallpaper-upload-btn': 'Upload Wallpaper',
        'adm-file-wallpaper-delete-btn': 'Delete Wallpaper',
        'adm-file-sound-title': 'War Sound',
        'adm-file-sound-label': 'Active Sound',
        'adm-file-sound-upload-btn': 'Upload Sound',

        // --- Admin - Admins ---
        'adm-admins-title': '👑 Manage Admins',
        'adm-admin-add-label': 'Add admin email:',
        'adm-admin-pass-label': 'Password:',
        'adm-admin-add-btn': 'Add New Admin',
        'adm-admin-list-title': 'Admin List',
        'adm-admin-primary': '(Primary Admin)',
        'adm-admin-delete-btn': 'Delete',
        'adm-admin-restriction-msg': 'Admin addition and removal features are only available to the Primary Admin.',

        // --- Admin - Server ---
        'adm-server-title': '🌐 Server Settings',
        'adm-static-content-title': 'Main Static Content',
        'adm-static-welcome-title-label': 'Welcome Message Title:',
        'adm-static-welcome-content-label': 'Welcome Message Content (HTML allowed):',
        'adm-static-important-title-label': 'Important Message Title:',
        'adm-static-important-content-label': 'Important Message Content (HTML allowed):',
        'adm-static-save-btn': 'Save Static Content',
        'adm-status-title': 'War & Migration Status',
        'adm-status-war-label': 'War Status:',
        'adm-status-mig-label': 'Migration Status:',
        'adm-status-save-btn': 'Save',
        'adm-event-status-title': 'Event Status',
        'adm-event-name-label': 'Event Name:',
        'adm-event-status-label': 'Status:',
        'adm-event-note-label': 'Note:',
        'adm-info-title': 'Server Info',
        'adm-info-alliance-label': 'Alliance Info:',
        'adm-info-rules-label': 'Rules:',
        'adm-info-save-btn': 'Save',
        'adm-kvk-title': 'KvK Schedule',
        'adm-king-title': 'King Name',
        
        // --- Admin - Settings ---
        'adm-settings-title': '⚙️ System Settings',
        'adm-settings-text': 'All settings are automatically saved via Firebase Realtime Database.',
        
        // --- Footer ---
        'footer-text': '© 2025 AOEM 199 — By HADES',

        // --- Toast Messages --- (for dynamic translation)
        'toast-post-updated': 'Post updated',
        'toast-post-saved': 'Post added',
        'toast-failed-save': 'Failed to save',
        'toast-missing-field': 'Complete title & content',
        'toast-edit-active': 'Edit mode active',
        'toast-edit-cancelled': 'Edit cancelled',
        'toast-post-deleted': 'Post deleted',
        'toast-failed-delete': 'Failed to delete',
        'toast-featured-changed': 'Featured changed',
        'toast-image-replaced': 'Post image replaced (base64)',
        'toast-failed-image': 'Failed to replace image',
        'toast-select-image': 'Please select an image first',
        'toast-rank-updated': 'Rank updated',
        'toast-rank-saved': 'Rank added',
        'toast-rank-deleted': 'Rank deleted',
        'toast-missing-rank-field': 'Complete name & alliance',
        'toast-mig-saved': 'Migration registration submitted',
        'toast-mig-failed-send': 'Failed to send registration',
        'toast-mig-missing-field': 'Complete all registration fields',
        'toast-mig-data-saved': 'Migration data saved',
        'toast-mig-data-deleted': 'Migration data deleted',
        'toast-mig-data-missing': 'Complete migration data',
        'toast-event-saved': 'Event saved',
        'toast-server-info-saved': 'Server info saved',
        'toast-status-saved': 'Status saved',
        'toast-kvk-saved': 'KvK schedule saved',
        'toast-king-saved': 'King name saved',
        'toast-static-saved': 'Static Content saved',
        'toast-file-select': 'Select file first',
        'toast-logo-saved': 'Logo saved (base64)',
        'toast-wallpaper-saved': 'Wallpaper saved (base64)',
        'toast-wallpaper-deleted': 'Wallpaper successfully deleted',
        'toast-wallpaper-failed-delete': 'Failed to delete wallpaper',
        'toast-wallpaper-confirm': 'Delete background wallpaper? (Background will revert to black)',
        'toast-sound-saved': 'Sound saved (base64)',
        'toast-access-denied': 'Access denied: Only the primary admin can add new admins.',
        'toast-admin-exists': 'Email already registered. Only adding to admin list.',
        'toast-admin-added': 'Admin successfully registered!',
        'toast-primary-admin-cannot-be-removed': 'Primary Admin cannot be removed.',
        'toast-admin-removed': 'Admin removed',
        'toast-sound-label-custom': 'custom',
        'toast-admin-list-remove-confirm': 'Remove this admin from the allowed list?',
        'toast-admin-login-msg': 'Login successful',
    }
};

let currentLang = localStorage.getItem('lang') || 'id';

function T(key) {
    return translations[currentLang][key] || translations['en'][key] || `??${key}??`;
}

function setLanguage(lang) {
    if (!translations[lang]) lang = 'id';
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang; 

    // 1. Translate all elements with data-t attribute
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        let text = T(key);

        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
        } 
        else if (el.tagName === 'BUTTON') {
             // Special handling for nav buttons with icons if needed, but innerText should suffice 
             if (key === 'tab-home') text = '🏠 ' + text;
             if (key === 'tab-ranks') text = '📊 ' + text;
             if (key === 'tab-events') text = '⏳ ' + text;
             if (key === 'tab-info') text = '🌐 ' + text;
             if (key === 'tab-migration') text = '✈️ ' + text;
             if (key === 'tab-login') text = '🔑 ' + text;
             
             el.innerText = text;
        }
        else if (el.tagName === 'SPAN' && el.parentElement.id === 'adminTab') {
             // For the span inside Admin tab
             el.innerText = text;
        }
        else {
            el.innerText = text;
        }
    });

    // 2. Translate specific elements
    document.title = T('web-title') + ' — ' + T('adm-panel-title');
    qs('confirmText').innerText = T('confirm-modal-text');
    qs('confirmYes').innerText = T('confirm-modal-yes');
    qs('confirmNo').innerText = T('confirm-modal-cancel');
    
    // Manual updates for elements with dynamic parts (like colon for labels)
    document.querySelector('[data-t="king-name-label"]').innerText = T('king-name-label') + ':';
    document.querySelector('[data-t="status-war-label"]').innerText = T('status-war-label') + ':';
    document.querySelector('[data-t="status-migration-label"]').innerText = T('status-migration-label') + ':';
    
    // Update the language selector UI
    const langSelect = qs('langSelect');
    if(langSelect) langSelect.value = lang;

    // Rerender dynamic lists/panels for updated button/text contents
    renderAdminEmailListSimple(); 
}


/* ======================
   Single Firebase init
   ...
   ====================== */
if (!window.firebase || !firebase.initializeApp) {
  console.error("Firebase SDK belum ter-load. Pastikan index.html memuat firebase-app & firebase-database & firebase-auth compat.");
}
if (!window._aoem_initialized) {
  firebase.initializeApp(firebaseConfig);
  window._aoem_initialized = true;
}

const auth = firebase.auth();
const db = firebase.database();

/* ======================
   Helpers
   ====================== */
function qs(id){ return document.getElementById(id); }
function toast(msgKey, type="info"){
  const msg = T(msgKey); // Use translation key
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.innerText = msg;
  Object.assign(el.style, {
    position: "fixed",
    right: "16px",
    bottom: "24px",
    padding: "10px 14px",
    background: type === "danger" ? "#8b1f1f" : type === "success" ? "#2d7a2d" : "#333",
    color: "#fff",
    borderRadius: "8px",
    zIndex: 99999,
    opacity: 0,
    transition: "opacity .18s"
  });
  document.body.appendChild(el);
  requestAnimationFrame(()=> el.style.opacity = 1);
  setTimeout(()=>{ el.style.opacity = 0; setTimeout(()=>el.remove(),200); }, 2200);
}
function escapeHtml(s){
  if(s === undefined || s === null) return "";
  return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">",">gt;").replaceAll('"',"&quot;");
}
function readFileAsDataURL(file, onProgress){
  return new Promise((resolve, reject) => {
    try {
      const fr = new FileReader();
      fr.onerror = () => reject(new Error("Gagal membaca file"));
      fr.onload = () => resolve(fr.result);
      if(onProgress && fr.addEventListener){
        fr.addEventListener("progress", e=>{
          if(e.lengthComputable){
            const pct = Math.round((e.loaded / e.total) * 100);
            try{ onProgress(pct); }catch(e){}
          }
        });
      }
      fr.readAsDataURL(file);
    } catch(e){
      reject(e);
    }
  });
}

/* ======================
   DB refs
   ...
   ====================== */
const REFS = {
  posts: db.ref("posts"),
  ranks: db.ref("ranks"),
  migrations: db.ref("migrations"),
  events: db.ref("events"),
  serverInfo: db.ref("serverInfo"),
  settings: db.ref("settings"),
  assets: db.ref("assets"),
  adminEmails: db.ref("adminEmails")
};

/* Ensure default placeholders (kept for first run consistency) */
REFS.settings.child("adminEmails").once("value").then(s=>{
  if(!s.exists()) REFS.settings.child("adminEmails").set(["hadeskingdoms199@gmail.com"]);
}).catch(()=>{ /* ignore */ });
REFS.assets.child("logo").once("value").then(s=>{
  if(!s.exists()) REFS.assets.child("logo").set("");
}).catch(()=>{});
REFS.assets.child("background").once("value").then(s=>{
  if(!s.exists()) REFS.assets.child("background").set("");
}).catch(()=>{});
REFS.assets.child("warSound").once("value").then(s=>{
  if(!s.exists()) REFS.assets.child("warSound").set("");
}).catch(()=>{});
// NEW: Default static posts
REFS.settings.child("staticPosts").once("value").then(s=>{
  if(!s.exists()){
    REFS.settings.child("staticPosts").set({
      welcome: { title: "Selamat Datang Raja!", content: "Ini adalah Control Panel tidak resmi untuk Server S199. Gunakan menu di atas untuk navigasi. <br><br><i>~ Dari Admin</i>" },
      important: { title: "Pesan Penting", content: "Tidak ada pesan penting saat ini. Semua event aktif tercantum di tab Events." }
    });
  }
}).catch(()=>{});


/* ======================
   UTC Clock (Simplified)
   ====================== */
function updateUtcTime(){
  const el = qs("serverTime");
  if(!el) return;
  const now = new Date();
  const hh = String(now.getUTCHours()).padStart(2,"0");
  const mm = String(now.getUTCMinutes()).padStart(2,"0");
  const ss = String(now.getUTCSeconds()).padStart(2,"0");
  el.innerText = `UTC ${hh}:${mm}:${ss}`;
}
setInterval(updateUtcTime, 1000);
updateUtcTime();

/* ======================
   Confirm modal
   ====================== */
let __confirmCallback = null;
function showConfirm(textKey, cb){
  const text = T(textKey); // Translate text
  const modal = qs("confirmModal");
  const txt = qs("confirmText");
  if(txt) txt.innerText = text || T('confirm-modal-text');
  __confirmCallback = cb;
  if(modal) modal.classList.remove("hidden");
}
function closeConfirm(){
  __confirmCallback = null;
  const modal = qs("confirmModal");
  if(modal) modal.classList.add("hidden");
}
(function bindConfirmButtons(){
  const yes = qs("confirmYes");
  const no = qs("confirmNo");
  if(yes) yes.addEventListener("click", ()=>{ try{ if(__confirmCallback) __confirmCallback(); }catch(e){console.error(e);} closeConfirm(); });
  if(no) no.addEventListener("click", ()=> closeConfirm());
})();

/* ======================
   AUTH handling (simple)
   ====================== */
let currentUser = null;
let allowedAdmins = [];
REFS.settings.child("adminEmails").on("value", s=>{
  allowedAdmins = s.val() || [];
  renderAdminEmailListSimple();
});

auth.onAuthStateChanged(u=>{
  currentUser = u;
  const adminTab = qs("adminTab");
  if(u && allowedAdmins.includes(u.email)){
    if(adminTab) adminTab.classList.remove("hidden");
    switchTab("admin");
    adminShow("dashboard");
    renderAdminEmailListSimple(); 
  } else {
    if(adminTab) adminTab.classList.add("hidden");
  }
});

/* ======================
   Menu + Admin show (Updated to use data-panel)
   ====================== */
function switchTab(page){
  document.querySelectorAll(".page-section").forEach(sec => sec.classList.add("hidden"));
  const el = qs(page);
  if(el) el.classList.remove("hidden");
  closeMenu();
}

function toggleMenu(){
  const navMenu = qs("navMenu"); 
  const ic = qs("menuIcon");
  if(!navMenu) return;
  
  navMenu.classList.toggle("active");
  
  if(ic){
    if(navMenu.classList.contains("active")){
      ic.classList.remove("fa-bars");
      ic.classList.add("fa-xmark");
    } else {
      ic.classList.remove("fa-xmark");
      ic.classList.add("fa-bars");
    }
  }
}

function closeMenu(){
  const navMenu = qs("navMenu"); 
  const ic = qs("menuIcon");
  if(!navMenu) return;
  
  navMenu.classList.remove("active");
  
  if(ic){
    ic.classList.remove("fa-xmark");
    ic.classList.add("fa-bars");
  }
}
window.toggleMenu = toggleMenu; 

function adminShow(panel){
  document.querySelectorAll(".admin-panel").forEach(p => p.classList.add("hidden"));
  const map = {
    dashboard: "admin-dashboard", posts: "admin-posts", ranks: "admin-ranks", migrations: "admin-migrations", 
    files: "admin-files", admins: "admin-admins", server: "admin-server", settings: "admin-settings"
  };
  const id = map[panel] || "admin-dashboard";
  const el = qs(id);
  if(el) el.classList.remove("hidden");
  
  // Highlight sidebar button using data-panel attribute
  Array.from(document.querySelectorAll(".admin-sidebar .sidebar-nav button")).forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`.admin-sidebar .sidebar-nav button[data-panel="${panel}"]`);
  if(btn) btn.classList.add("active");
}

/* ======================
   POSTS (CRUD)
   ====================== */
// listen posts
REFS.posts.on("value", snap=>{
  const data = snap.val() || {};
  renderPosts(data);
  renderAdminPosts(data);
  renderSlider(data);
  updateStats(data, null, null);
});

function submitPost(){
  const id = qs("editPostId")?.value || "";
  const title = qs("postTitle")?.value?.trim() || "";
  const content = qs("postContent")?.value?.trim() || "";
  const featured = !!qs("postFeatured")?.checked;
  if(!title || !content) return toast("toast-missing-field","danger");
  const payload = { title, content, featured, time: Date.now() };
  if(id){
    REFS.posts.child(id).update(payload).then(()=> { toast("toast-post-updated","success"); cancelEditPost(); })
      .catch(e=> { console.error(e); toast("toast-failed-save","danger"); });
  } else {
    REFS.posts.push(payload).then(()=> { toast("toast-post-saved","success"); cancelEditPost(); })
      .catch(e=> { console.error(e); toast("toast-failed-save","danger"); });
  }
}

function renderPosts(data){
  const box = qs("postList"); if(!box) return;
  box.innerHTML = "";
  const items = Object.entries(data || {}).sort((a,b)=> b[1].time - a[1].time);
  if(items.length === 0){ box.innerHTML = `<i>${T('posts-loading')}</i>`; return; }
  items.forEach(([id,p])=>{
    const isImg = typeof p.content === "string" && p.content.startsWith("data:");
    const div = document.createElement("div"); div.className = "post-item card";
    const h = document.createElement("h3"); h.style.color = "var(--gold)"; h.innerText = p.title || ""; div.appendChild(h);
    if(isImg){
      const img = document.createElement("img"); img.src = p.content; img.className = "post-img"; div.appendChild(img);
    } else {
      const ptag = document.createElement("p"); ptag.innerText = p.content || ""; div.appendChild(ptag);
    }
    const small = document.createElement("small"); small.style.color = "var(--muted)"; small.innerText = new Date(p.time).toLocaleString(); div.appendChild(small);
    box.appendChild(div);
  });
}

function renderAdminPosts(data){
  const box = qs("adminPostList"); if(!box) return;
  box.innerHTML = "";
  const items = Object.entries(data || {}).sort((a,b)=> b[1].time - a[1].time);
  items.forEach(([id,p])=>{
    const row = document.createElement("div"); row.className = "admin-post-row";
    const left = document.createElement("div"); left.style.flex = "1";
    const bt = document.createElement("b"); bt.innerText = p.title || ""; left.appendChild(bt);
    const meta = document.createElement("div"); meta.style.fontSize="12px"; meta.style.color="var(--muted)"; meta.innerText = new Date(p.time).toLocaleString(); left.appendChild(meta);
    const right = document.createElement("div"); right.style.display="flex"; right.style.gap="8px"; right.style.alignItems="center";
    // featured
    const lab = document.createElement("label"); lab.style.fontSize="13px";
    const chk = document.createElement("input"); chk.type="checkbox"; chk.checked = !!p.featured;
    chk.onchange = ()=> { REFS.posts.child(id).update({ featured: !!chk.checked }); toast("toast-featured-changed","success"); };
    lab.appendChild(chk); lab.appendChild(document.createTextNode(` ${T('adm-post-featured-check')}`)); right.appendChild(lab);
    // edit
    const eb = document.createElement("button"); eb.className="btn-secondary"; eb.innerText=T('adm-post-edit-btn'); eb.onclick = ()=> editPost(id); right.appendChild(eb);
    // upload image to replace content (admin quick-upload)
    const upb = document.createElement("button"); upb.className="btn-secondary"; upb.innerText=T('adm-post-replace-img-btn'); upb.onclick = ()=> openReplaceImageDialog(id); right.appendChild(upb);
    // delete
    const dbtn = document.createElement("button"); dbtn.className="btn-danger"; dbtn.innerText=T('adm-post-delete-btn'); dbtn.onclick = ()=> showConfirm("confirm-modal-text", ()=> {
      REFS.posts.child(id).remove().then(()=> toast("toast-post-deleted","danger")).catch(e=>{console.error(e); toast("toast-failed-delete","danger");});
    }); right.appendChild(dbtn);
    row.appendChild(left); row.appendChild(right); box.appendChild(row);
  });
}

/* Edit/cancel */
function editPost(id){
  REFS.posts.child(id).once("value").then(s=>{
    const p = s.val();
    if(!p) return toast("toast-failed-delete","danger");
    if(qs("postTitle")) qs("postTitle").value = p.title || "";
    if(qs("postContent")) qs("postContent").value = p.content || "";
    if(qs("postFeatured")) qs("postFeatured").checked = !!p.featured;
    if(qs("editPostId")) qs("editPostId").value = id;
    if(qs("cancelEditBtn")) qs("cancelEditBtn").classList.remove("hidden");
    switchTab("admin"); adminShow("posts");
    toast("toast-edit-active","info");
  }).catch(e=>{ console.error(e); toast("toast-failed-save","danger"); });
}
function cancelEditPost(){
  if(qs("editPostId")) qs("editPostId").value = "";
  if(qs("postTitle")) qs("postTitle").value = "";
  if(qs("postContent")) qs("postContent").value = "";
  if(qs("postFeatured")) qs("postFeatured").checked = false;
  if(qs("cancelEditBtn")) qs("cancelEditBtn").classList.add("hidden");
  toast("toast-edit-cancelled","info");
}

/* Admin quick replace dialog (create file input dynamically) */
function openReplaceImageDialog(postId){
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async () => {
    const f = input.files[0];
    if(!f) return;
    const status = document.createElement("div");
    status.innerText = T("posts-loading"); // Translate
    document.body.appendChild(status);
    try {
      const dataUrl = await readFileAsDataURL(f, pct => { status.innerText = `${T('adm-post-upload-btn')} ${pct}%`; }); // Translate
      status.innerText = T("toast-failed-save"); // Translate
      await REFS.posts.child(postId).update({ content: dataUrl, time: Date.now() });
      toast("toast-image-replaced","success");
    } catch(e){
      console.error(e);
      toast("toast-failed-image","danger");
    } finally {
      setTimeout(()=> status.remove(), 600);
    }
  };
  input.click();
}

/* ======================
   Slider
   ...
   ====================== */
let __sliderIndex = 0;
let __autoScrollTimer = null;

function renderSlider(data){
  const track = qs("sliderTrack"); if(!track) return;
  stopAutoScroll(); 
  const items = Object.entries(data || {}).filter(([id,p])=> p.featured).sort((a,b)=> b[1].time - a[1].time);
  track.innerHTML = "";
  items.forEach(([id,p])=>{
    const card = document.createElement("div"); card.className = "slider-card";
    const title = document.createElement("h4"); title.style.color = "var(--gold)"; title.innerText = p.title || ""; card.appendChild(title);
    if(typeof p.content === "string" && p.content.startsWith("data:")){
      const img = document.createElement("img"); img.src = p.content; img.className = "post-img"; card.appendChild(img);
    } else {
      const ptag = document.createElement("p"); ptag.innerText = p.content || ""; card.appendChild(ptag);
    }
    track.appendChild(card);
  });
  __sliderIndex = 0;
  setTimeout(updateSliderPosition, 80);
  
  if(items.length > 1){
    startAutoScroll();
  }
}

function updateSliderPosition(){
  const track = qs("sliderTrack"); if(!track) return;
  const cards = track.children.length; if(cards === 0){ track.style.transform = "none"; return; }
  const card = track.children[0];
  const gap = 12;
  const cardWidth = card.getBoundingClientRect().width;
  const width = cardWidth + gap; 
  
  const maxIndex = Math.max(0, cards - 1);
  if(__sliderIndex < 0) __sliderIndex = 0;
  if(__sliderIndex > maxIndex) __sliderIndex = maxIndex;
  track.style.transform = `translateX(-${__sliderIndex * width}px)`;
}

function sliderPrev(){ 
  stopAutoScroll(); 
  __sliderIndex = Math.max(0, __sliderIndex - 1); 
  updateSliderPosition(); 
  startAutoScroll(); 
}

function sliderNext(){ 
  stopAutoScroll(); 
  const track = qs("sliderTrack"); 
  const maxIndex = Math.max(0, (track ? track.children.length : 1) - 1); 
  
  if(__sliderIndex >= maxIndex) {
    __sliderIndex = 0;
  } else {
    __sliderIndex = __sliderIndex + 1; 
  }
  updateSliderPosition(); 
  startAutoScroll(); 
}

function startAutoScroll(){
  stopAutoScroll();
  const track = qs("sliderTrack"); 
  if(track && track.children.length > 1){
    __autoScrollTimer = setInterval(()=>{
      const maxIndex = track.children.length - 1;
      __sliderIndex = (__sliderIndex + 1) % (maxIndex + 1); 
      updateSliderPosition();
    }, 5000); 
  }
}

function stopAutoScroll(){
  if(__autoScrollTimer) clearInterval(__autoScrollTimer);
}

window.addEventListener("resize", ()=> setTimeout(updateSliderPosition, 120));

/* ======================
   Ranks
   ====================== */
REFS.ranks.on("value", snap=>{
  const data = snap.val() || {};
  renderRankDisplay(data);
  renderAdminRankList(data);
  updateStats(null, data, null);
});
function addOrUpdateRank(){
  const id = qs("editRankId")?.value || "";
  const name = qs("rankName")?.value?.trim() || "";
  const alliance = qs("rankAlliance")?.value?.trim() || "";
  const power = Number(qs("rankPower")?.value) || 0;
  const merit = Number(qs("rankMerit")?.value) || 0;
  if(!name || !alliance) return toast("toast-missing-rank-field","danger");
  const payload = { name, alliance, power, merit, updatedAt: Date.now() };
  if(id){
    REFS.ranks.child(id).update(payload).then(()=> { toast("toast-rank-updated","success"); cancelEditRank(); }).catch(e=>{console.error(e); toast("toast-failed-save","danger");});
  } else {
    REFS.ranks.push(payload).then(()=> { toast("toast-rank-saved","success"); cancelEditRank(); }).catch(e=>{console.error(e); toast("toast-failed-save","danger");});
  }
}
function renderRankDisplay(data){
  const arr = Object.entries(data || {}).map(([id,v])=> ({ id, ...v }));
  const byPower = [...arr].sort((a,b)=> (b.power||0)-(a.power||0));
  const byMerit = [...arr].sort((a,b)=> (b.merit||0)-(a.merit||0));
  const pl = qs("powerList"), ml = qs("meritList");
  if(pl) pl.innerHTML = ""; if(ml) ml.innerHTML = "";
  // Update table headers on render (since they rely on translations)
  document.querySelectorAll('#ranks .data-table thead th[data-t="rank-name-col"]').forEach(th => th.innerText = T('rank-name-col'));
  document.querySelectorAll('#ranks .data-table thead th[data-t="rank-alliance-col"]').forEach(th => th.innerText = T('rank-alliance-col'));
  document.querySelectorAll('#ranks .data-table thead th[data-t="rank-power-col"]').forEach(th => th.innerText = T('rank-power-col'));
  document.querySelectorAll('#ranks .data-table thead th[data-t="rank-merit-col"]').forEach(th => th.innerText = T('rank-merit-col'));
  
  byPower.forEach((r,i)=> { if(pl) pl.innerHTML += `<tr><td>${i+1}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.alliance)}</td><td>${r.power||0}</td></tr>`; });
  byMerit.forEach((r,i)=> { if(ml) ml.innerHTML += `<tr><td>${i+1}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.alliance)}</td><td>${r.merit||0}</td></tr>`; });
}
function renderAdminRankList(data){
  const box = qs("adminRankList"); if(!box) return; box.innerHTML = "";
  const arr = Object.entries(data || {}).map(([id,v])=> ({ id, ...v })).sort((a,b)=> (b.power||0)-(a.power||0));
  arr.forEach((r, idx)=> {
    const row = document.createElement("div"); row.className = "admin-rank-row";
    const left = document.createElement("div"); left.style.flex = "1";
    left.innerHTML = `<b>#${idx+1}</b> ${escapeHtml(r.name)}<div style="font-size:12px;color:var(--muted)">${T('rank-alliance-col')}: ${escapeHtml(r.alliance)} • ${T('rank-power-col')}: ${r.power||0} • ${T('rank-merit-col')}: ${r.merit||0}</div>`;
    const right = document.createElement("div"); right.style.display="flex"; right.style.gap="8px";
    const eb = document.createElement("button"); eb.className="btn-secondary"; eb.innerText=T('adm-post-edit-btn'); eb.onclick = ()=> {
      qs("editRankId").value = r.id; qs("rankName").value = r.name || ""; qs("rankAlliance").value = r.alliance || ""; qs("rankPower").value = r.power || 0; qs("rankMerit").value = r.merit || 0; qs("cancelRankEditBtn") && qs("cancelRankEditBtn").classList.remove("hidden");
    };
    const dbtn = document.createElement("button"); dbtn.className="btn-danger"; dbtn.innerText=T('adm-post-delete-btn'); dbtn.onclick = ()=> showConfirm("confirm-modal-text", ()=> { REFS.ranks.child(r.id).remove().then(()=> toast("toast-rank-deleted","danger")).catch(e=>{console.error(e); toast("toast-failed-delete","danger"); }); });
    right.appendChild(eb); right.appendChild(dbtn);
    row.appendChild(left); row.appendChild(right); box.appendChild(row);
  });
}
function cancelEditRank(){ if(qs("editRankId")) qs("editRankId").value = ""; if(qs("rankName")) qs("rankName").value = ""; if(qs("rankAlliance")) qs("rankAlliance").value = ""; if(qs("rankPower")) qs("rankPower").value = ""; if(qs("rankMerit")) qs("rankMerit").value = ""; if(qs("cancelRankEditBtn")) qs("cancelRankEditBtn").classList.add("hidden"); }

/* ======================
   Migrations
   ====================== */
REFS.migrations.on("value", snap=>{
  const data = snap.val() || {};
  renderMigrationTable(data);
  renderAdminMigrationList(data);
  updateStats(null, null, data);
});
// Form pendaftaran migrasi (on Home tab)
document.getElementById("migForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const name = qs("migName").value.trim();
  const server = qs("migServer").value.trim();
  const power = Number(qs("migPower").value) || 0;
  const contact = qs("migContact").value.trim();
  if(!name || !server || !power) return toast("toast-mig-missing-field","danger");
  
  try {
    await REFS.migrations.push({ name, server, power, contact, time: Date.now() });
    toast("toast-mig-saved","success");
    e.target.reset();
  } catch(err) {
    console.error(err);
    toast("toast-mig-failed-send","danger");
  }
});
function renderMigrationTable(data){
  const body = qs("migTablePublic"); if(!body) return; body.innerHTML = "";
  // Update table headers on render
  document.querySelectorAll('#migration .data-table thead th[data-t="miglist-server-col"]').forEach(th => th.innerText = T('miglist-server-col'));
  document.querySelectorAll('#migration .data-table thead th[data-t="miglist-date-col"]').forEach(th => th.innerText = T('miglist-date-col'));
  
  Object.entries(data || {}).sort((a,b)=> b[1].time - a[1].time).forEach(([id,m], i)=> {
    body.innerHTML += `<tr><td>${i+1}</td><td>${escapeHtml(m.name)}</td><td>${escapeHtml(m.server)}</td><td>${m.power}</td><td>${new Date(m.time).toLocaleDateString()}</td></tr>`;
  });
}
function renderAdminMigrationList(data){
  const box = qs("adminMigList"); if(!box) return; box.innerHTML = "";
  Object.entries(data || {}).sort((a,b)=> b[1].time - a[1].time).forEach(([id,m])=>{
    const row = document.createElement("div"); row.className = "admin-mig-row";
    row.innerHTML = `<div style="flex:1"><b>${escapeHtml(m.name)}</b><div style="font-size:12px;color:var(--muted)">${T('miglist-server-col')}: ${escapeHtml(m.server)} • ${T('rank-power-col')}: ${m.power} • ${T('mig-contact-label')} ${escapeHtml(m.contact)}</div></div>`;
    const right = document.createElement("div"); right.style.display="flex"; right.style.gap="8px";
    const eb = document.createElement("button"); eb.className="btn-secondary"; eb.innerText=T('adm-post-edit-btn'); eb.onclick = ()=> {
      qs("editMigId").value = id; qs("editMigName").value = m.name || ""; qs("editMigServer").value = m.server || ""; qs("editMigPower").value = m.power || 0; qs("editMigContact").value = m.contact || ""; qs("migEditCard") && qs("migEditCard").classList.remove("hidden");
    };
    const dbtn = document.createElement("button"); dbtn.className="btn-danger"; dbtn.innerText=T('adm-post-delete-btn'); dbtn.onclick = ()=> showConfirm("confirm-modal-text", ()=> { REFS.migrations.child(id).remove().then(()=> toast("toast-mig-data-deleted","danger")); });
    right.appendChild(eb); right.appendChild(dbtn); row.appendChild(right); box.appendChild(row);
  });
}
function saveMigrationEdit(){
  const id = qs("editMigId").value; const name = qs("editMigName").value.trim(); const server = qs("editMigServer").value.trim(); const power = Number(qs("editMigPower").value) || 0; const contact = qs("editMigContact").value.trim();
  if(!id || !name) return toast("toast-mig-data-missing","danger");
  REFS.migrations.child(id).set({ name, server, power, contact, time: Date.now() }).then(()=> { toast("toast-mig-data-saved","success"); qs("migEditCard") && qs("migEditCard").classList.add("hidden"); }).catch(e=>{ console.error(e); toast("toast-failed-save","danger"); });
}
function cancelMigEdit(){ if(qs("editMigId")) qs("editMigId").value = ""; if(qs("editMigName")) qs("editMigName").value = ""; if(qs("editMigServer")) qs("editMigServer").value = ""; if(qs("editMigPower")) qs("editMigPower").value = ""; if(qs("editMigContact")) qs("editMigContact").value = ""; if(qs("migEditCard")) qs("migEditCard").classList.add("hidden"); }

/* ======================
   Events & Server Info (Unified settings handler)
   ====================== */
// Listener untuk Events
REFS.events.on("value", snap=>{ 
  const d = snap.val() || {}; 
  if(qs("eventName")) qs("eventName").innerText = d.name || "-"; 
  if(qs("eventStatus")) qs("eventStatus").innerText = d.status || "-"; 
  if(qs("eventNote")) qs("eventNote").innerText = d.note || "-"; 

  // Admin section load
  if(qs("admEventName")) qs("admEventName").value = d.name || "";
  if(qs("admEventStatus")) qs("admEventStatus").value = d.status || "";
  if(qs("admEventNote")) qs("admEventNote").value = d.note || "";
});
function saveEventStatus(){ REFS.events.set({ name: qs("admEventName").value, status: qs("admEventStatus").value, note: qs("admEventNote").value }); toast("toast-event-saved","success"); }

// Listener untuk Server Info (Alliance, Rules)
REFS.serverInfo.on("value", snap=>{ 
  const d = snap.val() || {}; 
  if(qs("allianceInfo")) qs("allianceInfo").innerHTML = d.alliance || "-"; 
  if(qs("rulesInfo")) qs("rulesInfo").innerHTML = d.rules || "-"; 

  // Admin section load
  if(qs("admAllianceInfo")) qs("admAllianceInfo").value = d.alliance || "";
  if(qs("admRulesInfo")) qs("admRulesInfo").value = d.rules || "";
});
function saveServerInfo(){ REFS.serverInfo.set({ alliance: qs("admAllianceInfo").value, rules: qs("admRulesInfo").value }); toast("toast-server-info-saved","success"); }


// Listener untuk Settings (King Name, War/Mig Status, KvK Schedule, Static Posts)
REFS.settings.on("value", snap=>{ 
  const d = snap.val() || {}; 
  const staticPosts = d.staticPosts || {};
  const migStatus = d.migrationStatus || {};

  // Public View Update
  if(qs("kingNameDisplay")) qs("kingNameDisplay").innerText = d.king || T("king-name-label");
  if(qs("warStatus")) qs("warStatus").innerText = migStatus.war || "PVE";
  if(qs("migStatus")) qs("migStatus").innerText = migStatus.migration || "-";
  if(qs("kvkSchedule")) qs("kvkSchedule").innerHTML = d.kvk || "-";

  if(qs("welcomePostTitle")) qs("welcomePostTitle").innerText = staticPosts.welcome?.title || T("welcome-post-title");
  if(qs("welcomePostContent")) qs("welcomePostContent").innerHTML = staticPosts.welcome?.content || T("welcome-post-content");
  if(qs("importantPostTitle")) qs("importantPostTitle").innerText = staticPosts.important?.title || T("important-post-title");
  if(qs("importantPostContent")) qs("importantPostContent").innerHTML = staticPosts.important?.content || T("important-post-content");

  // Admin Form Load
  if(qs("admWarStatus")) qs("admWarStatus").value = migStatus.war || "PVE";
  if(qs("admMigStatus")) qs("admMigStatus").value = migStatus.migration || "-";
  if(qs("admKvkSchedule")) qs("admKvkSchedule").value = d.kvk || "";
  if(qs("admKingName")) qs("admKingName").value = d.king || "";
  
  if(qs("admWelcomeTitle")) qs("admWelcomeTitle").value = staticPosts.welcome?.title || "";
  if(qs("admWelcomeContent")) qs("admWelcomeContent").value = staticPosts.welcome?.content || "";
  if(qs("admImportantTitle")) qs("admImportantTitle").value = staticPosts.important?.title || "";
  if(qs("admImportantContent")) qs("admImportantContent").value = staticPosts.important?.content || "";
});

function saveMigrationStatus(){ REFS.settings.child("migrationStatus").set({ war: qs("admWarStatus").value, migration: qs("admMigStatus").value }); toast("toast-status-saved","success"); }
function saveKvkSchedule(){ REFS.settings.child("kvk").set(qs("admKvkSchedule").value); toast("toast-kvk-saved","success"); }
function saveKingName(){ REFS.settings.child("king").set(qs("admKingName").value); toast("toast-king-saved","success"); }

// NEW: Save Static Posts
function saveStaticPosts(){
  const welcome = {
    title: qs("admWelcomeTitle").value.trim() || T("welcome-post-title"),
    content: qs("admWelcomeContent").value.trim() || T("welcome-post-content")
  };
  const important = {
    title: qs("admImportantTitle").value.trim() || T("important-post-title"),
    content: qs("admImportantContent").value.trim() || T("important-post-content")
  };
  REFS.settings.child("staticPosts").set({ welcome, important })
    .then(() => toast("toast-static-saved", "success"))
    .catch(e => { console.error(e); toast("toast-failed-save", "danger"); });
}


/* ======================
   Stats util
   ====================== */
function updateStats(postsData, ranksData, migsData){
  const pcount = postsData ? Object.keys(postsData).length : (qs("statPosts") ? Number(qs("statPosts").innerText) : 0);
  const rcount = ranksData ? Object.keys(ranksData).length : (qs("statRanks") ? Number(qs("statRanks").innerText) : 0);
  const mcount = migsData ? Object.keys(migsData).length : (qs("statMigs") ? Number(qs("statMigs").innerText) : 0);
  if(qs("statPosts")) qs("statPosts").innerText = pcount;
  if(qs("statRanks")) qs("statRanks").innerText = rcount;
  if(qs("statMigs")) qs("statMigs").innerText = mcount;
}

/* ======================
   BASE64 Uploads — Logo / Background / Sound / Post Image
   ====================== */
async function uploadPostImage(){
  const inp = qs("postImageInput");
  const status = qs("uploadImageStatus");
  if(!inp || !inp.files || !inp.files[0]){ if(status) status.innerText = T("toast-select-image"); toast("toast-select-image","danger"); return; }
  const f = inp.files[0];
  if(status) status.innerText = T("posts-loading");
  try {
    const dataUrl = await readFileAsDataURL(f, pct => { if(status) status.innerText = `${T('adm-post-upload-btn')} ${pct}%`; });
    if(qs("postContent")) qs("postContent").value = dataUrl;
    if(status) status.innerText = T("toast-post-saved");
    toast("toast-image-replaced", "success");
  } catch(e){
    console.error(e);
    if(status) status.innerText = T("toast-failed-save");
    toast("toast-failed-image", "danger");
  }
}

async function uploadLogo(){
  const file = qs("logoInput")?.files?.[0];
  if(!file) return toast("toast-file-select","danger");
  try {
    qs("currentLogo") && (qs("currentLogo").alt = T("posts-loading"));
    const dataUrl = await readFileAsDataURL(file, pct => { qs("currentLogo") && (qs("currentLogo").alt = `${T('adm-post-upload-btn')} ${pct}%`); });
    await REFS.assets.child("logo").set(dataUrl);
    if(qs("headerLogo")) qs("headerLogo").src = dataUrl;
    if(qs("sidebarLogo")) qs("sidebarLogo").src = dataUrl;
    if(qs("currentLogo")) qs("currentLogo").src = dataUrl;
    toast("toast-logo-saved", "success");
  } catch(e){
    console.error(e);
    toast("toast-failed-save", "danger");
  }
}

async function uploadBackground(){
  const file = qs("bgInput")?.files?.[0];
  if(!file) return toast("toast-file-select","danger");
  try {
    qs("currentBgPreview") && (qs("currentBgPreview").alt = T("posts-loading"));
    const dataUrl = await readFileAsDataURL(file, pct => { qs("currentBgPreview") && (qs("currentBgPreview").alt = `${T('adm-post-upload-btn')} ${pct}%`); });
    await REFS.assets.child("background").set(dataUrl);
    if(qs("currentBgPreview")) qs("currentBgPreview").src = dataUrl;
    toast("toast-wallpaper-saved", "success");
  } catch(e){
    console.error(e);
    toast("toast-failed-save", "danger");
  }
}

// NEW: Fungsi untuk menghapus wallpaper
function deleteBackground(){
  showConfirm("toast-wallpaper-confirm", async ()=>{
    try {
      await REFS.assets.child("background").set(""); 
      toast("toast-wallpaper-deleted", "success");
    } catch(e) {
      console.error(e);
      toast("toast-wallpaper-failed-delete", "danger");
    }
  });
}

async function uploadWarSound(){
  const file = qs("soundInput")?.files?.[0];
  if(!file) return toast("toast-file-select","danger");
  try {
    const dataUrl = await readFileAsDataURL(file, pct => { /* progress optional */ });
    await REFS.assets.child("warSound").set(dataUrl);
    toast("toast-sound-saved", "success");
  } catch(e){
    console.error(e);
    toast("toast-failed-save", "danger");
  }
}

/* Load assets from DB to UI */
REFS.assets.on("value", snap=>{
  const a = snap.val() || {};
  if(a.logo && qs("headerLogo")) qs("headerLogo").src = a.logo;
  if(a.logo && qs("sidebarLogo")) qs("sidebarLogo").src = a.logo;
  if(a.logo && qs("currentLogo")) qs("currentLogo").src = a.logo;
  
  if(a.background){ 
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.9)), url('${a.background}')`;
    if(qs("currentBgPreview")) qs("currentBgPreview").src = a.background;
  } else {
    document.body.style.backgroundImage = "none"; 
    if(qs("currentBgPreview")) qs("currentBgPreview").src = "";
  }

  if(a.warSound && qs("currentSoundLabel")) qs("currentSoundLabel").innerText = T('toast-sound-label-custom');
});

/* ======================
   Admin emails simple render (settings/adminEmails)
   ====================== */
function renderAdminEmailListSimple(){
  const primaryAdminEmail = allowedAdmins[0];
  const isPrimary = currentUser && currentUser.email === primaryAdminEmail;
  
  const adminPanel = qs("admin-admins");
  const formCard = adminPanel?.querySelector(".card");
  if(formCard) {
      formCard.classList.toggle("hidden", !isPrimary);
      
      adminPanel.querySelectorAll('.admin-warning-msg').forEach(el => el.remove());
      
      if (!isPrimary) {
          const msg = document.createElement("p");
          msg.className = "admin-warning-msg";
          msg.style.color = "var(--accent)";
          msg.innerText = T('adm-admin-restriction-msg');
          if(formCard) formCard.insertAdjacentElement('afterend', msg); 
          else adminPanel.prepend(msg);
      }
  }

  REFS.settings.child("adminEmails").once("value").then(snap=>{
    const arr = snap.val() || [];
    const box = qs("adminEmailsList"); if(!box) return;
    box.innerHTML = "";
    arr.forEach((email, idx) => {
      const div = document.createElement("div"); div.className = "admin-post-row";
      const isCurrentPrimary = email === primaryAdminEmail;
      let content = `<div>${escapeHtml(email)} ${isCurrentPrimary ? `<b>(${T('adm-admin-primary')})</b>` : ''}</div>`;
      
      if(isPrimary && !isCurrentPrimary) {
        content += `<div><button class="btn-danger" onclick="removeAdminEmailSimple(${idx})">${T('adm-admin-delete-btn')}</button></div>`;
      } else {
        content += `<div></div>`;
      }
      
      div.innerHTML = content;
      box.appendChild(div);
    });
  }).catch(()=>{ /* ignore */ });
}

// NEW: Fungsi untuk Mendaftarkan Admin Baru dengan Password
async function registerNewAdmin(){
  const email = qs("newAdminEmail")?.value?.trim();
  const password = qs("newAdminPassword")?.value?.trim();
  
  const primaryAdminEmail = allowedAdmins[0];
  if (!currentUser || currentUser.email !== primaryAdminEmail) {
    return toast("toast-access-denied", "danger");
  }

  if(!email || !password) return toast("login-pass-label","danger");
  if(password.length < 6) return toast("toast-failed-save","danger"); // Reusing toast for simplicity

  let successAuth = false;

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    successAuth = true;
    toast("toast-admin-added", "info"); // Use success toast for clarity

  } catch (error) {
    console.error("Firebase Auth Error:", error);
    
    if(error.code === 'auth/email-already-in-use') {
      successAuth = true; 
      toast("toast-admin-exists","info");
    } else {
      return toast("toast-failed-save", "danger"); // Use generic failed save
    }
  }

  if(successAuth){
    REFS.settings.child("adminEmails").once("value").then(snap=>{
      const arr = snap.val() || [];
      if(!arr.includes(email)) arr.push(email); 
      
      REFS.settings.child("adminEmails").set(arr).then(()=>{ 
        toast("toast-admin-added","success"); 
        qs("newAdminEmail").value = ""; 
        qs("newAdminPassword").value = "";
        renderAdminEmailListSimple(); 
      }).catch(e=>{ 
        console.error(e); 
        toast("toast-failed-save","danger"); 
      });
    }).catch(e=> toast("toast-failed-save","danger")); // Use generic failed save
  }
}

function removeAdminEmailSimple(index){
  showConfirm("toast-admin-list-remove-confirm", ()=> {
    REFS.settings.child("adminEmails").once("value").then(snap=>{
      const arr = snap.val() || [];
      
      const primaryAdminEmail = allowedAdmins[0];
      if (arr[index] === primaryAdminEmail) {
          return toast("toast-primary-admin-cannot-be-removed", "danger");
      }
      
      arr.splice(index,1);
      REFS.settings.child("adminEmails").set(arr).then(()=> { toast("toast-admin-removed","danger"); renderAdminEmailListSimple(); });
    }).catch(e=> toast("toast-failed-save","danger"));
  });
}

/* ======================
   Final initializers & exposes
   ====================== */
window.setLanguage = setLanguage; // EXPOSED NEW FUNCTION
window.sliderPrev = sliderPrev;
window.sliderNext = sliderNext;
window.uploadPostImage = uploadPostImage;
window.uploadLogo = uploadLogo;
window.uploadBackground = uploadBackground;
window.deleteBackground = deleteBackground; 
window.uploadWarSound = uploadWarSound;
window.submitPost = submitPost;
window.editPost = editPost;
window.deletePost = (id)=> REFS.posts.child(id).remove();
window.cancelEditPost = cancelEditPost;
window.addOrUpdateRank = addOrUpdateRank;
window.cancelEditRank = cancelEditRank;
window.saveMigrationEdit = saveMigrationEdit;
window.cancelMigEdit = cancelMigEdit;
window.saveEventStatus = saveEventStatus;
window.saveServerInfo = saveServerInfo;
window.saveMigrationStatus = saveMigrationStatus;
window.saveKvkSchedule = saveKvkSchedule;
window.saveKingName = saveKingName;
window.saveStaticPosts = saveStaticPosts;
window.registerNewAdmin = registerNewAdmin; 
window.removeAdminEmailSimple = removeAdminEmailSimple; 
window.adminShow = adminShow; // Re-expose with new logic

window.adminLogin = function(){ 
  const email = qs("adminEmail").value; 
  const pass = qs("adminPass").value; 
  auth.signInWithEmailAndPassword(email, pass).then(()=>{ 
    toast("toast-admin-login-msg","success"); 
    if(qs("adminTab")) qs("adminTab").classList.remove("hidden"); 
    switchTab("admin"); 
    adminShow("dashboard"); 
  }).catch(e=> { 
    qs("loginMsg") && (qs("loginMsg").innerText = e.message); 
  }); 
};
window.adminLogout = function(){ auth.signOut().then(()=>{ toast("logout-label", "info"); location.reload(); }); };

/* small init: load assets once & set language */
REFS.assets.once("value").then(snap=>{ 
  const a = snap.val() || {}; 
  if(a.logo && qs("headerLogo")) qs("headerLogo").src = a.logo; 
  if(a.background) document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.9)), url('${a.background}')`; 
}).catch(()=>{});

// Initial call to set language and UI
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    switchTab("home");
    adminShow("dashboard");
});
