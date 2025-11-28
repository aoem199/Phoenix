/* AOEM S199 — FIX FULL (Admin auto redirect + adminEmails auto-create + UTC time) */

/* Firebase init */
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

/* Refs */
const refs = {
  posts: db.ref("posts"),
  ranks: db.ref("ranks"),
  events: db.ref("events"),
  serverInfo: db.ref("serverInfo"),
  migrationStatus: db.ref("migrationStatus"),
  kvk: db.ref("kvk"),
  king: db.ref("king"),
  migrations: db.ref("migrations"),
  settings: db.ref("settings")
};

/* Toast */
function toast(msg, type="info"){
  const el=document.createElement("div");
  el.className="toast "+type;
  el.innerText=msg;
  document.body.appendChild(el);
  setTimeout(()=>el.classList.add("show"),10);
  setTimeout(()=>{
    el.classList.remove("show");
    setTimeout(()=>el.remove(),300);
  },2600);
}

function escapeHtml(s){
  if(s===undefined||s===null) return "";
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}

/* UTC Time */
function updateUtcTime(){
  const el = document.getElementById("serverTime");
  if(!el) return;
  const now = new Date();
  const hh = String(now.getUTCHours()).padStart(2,"0");
  const mm = String(now.getUTCMinutes()).padStart(2,"0");
  const ss = String(now.getUTCSeconds()).padStart(2,"0");
  el.innerText = `UTC ${hh}:${mm}:${ss}`;
}
setInterval(updateUtcTime,1000);
updateUtcTime();

/* ADMIN SYSTEM */
let currentUser = null;
let allowedAdmins = [];

/* AUTO create default admin email if missing */
refs.settings.child("adminEmails").once("value").then(s=>{
  if(!s.exists()){
    refs.settings.child("adminEmails").set(["hadeskingdoms199@gmail.com"]);
  }
});

/* Load admin emails */
refs.settings.child("adminEmails").on("value", s=>{
  allowedAdmins = s.val() || [];
  renderAdminEmailList();
});

/* AUTH STATE */
auth.onAuthStateChanged(user=>{
  currentUser = user;
  const adminTab = document.getElementById("adminTab");

  if(user){
    if(allowedAdmins.includes(user.email)){
      if(adminTab) adminTab.classList.remove("hidden");
      /* FORCE masuk admin */
      switchTab("admin");
      adminShow("dashboard");
    } else {
      if(adminTab) adminTab.classList.add("hidden");
      switchTab("login");
    }
  } else {
    if(adminTab) adminTab.classList.add("hidden");
    switchTab("login");
  }
});

/* LOGIN */
function adminLogin(){
  const email = document.getElementById("adminEmail").value;
  const pass  = document.getElementById("adminPass").value;

  auth.signInWithEmailAndPassword(email, pass)
  .then(()=>{

    toast("Login berhasil", "success");

    /* FORCE cek ulang admin */
    setTimeout(()=>{

      if(allowedAdmins.includes(email)){
        document.getElementById("adminTab").classList.remove("hidden");
        switchTab("admin");
        adminShow("dashboard");
      } else {
        toast("Email ini belum terdaftar sebagai admin!", "danger");
      }

    }, 500);

  })
  .catch(err=>{
    document.getElementById("loginMsg").innerText = err.message;
  });
}

function adminLogout(){
  auth.signOut();
  toast("Logout sukses","info");
  switchTab("login");
}

/* Admin emails */
function addAdminEmail(){
  const email = document.getElementById("newAdminEmail").value.trim();
  if(!email) return toast("Masukkan email", "error");

  if(!allowedAdmins.includes(email)){
    allowedAdmins.push(email);
    refs.settings.child("adminEmails").set(allowedAdmins);
  }

  document.getElementById("newAdminEmail").value="";
  toast("Admin ditambahkan","success");
}

function removeAdminEmail(email){
  allowedAdmins = allowedAdmins.filter(e=>e!==email);
  refs.settings.child("adminEmails").set(allowedAdmins);
  toast("Admin dihapus","danger");
}

function renderAdminEmailList(){
  const box = document.getElementById("adminEmailsList");
  if(!box) return;
  box.innerHTML="";
  allowedAdmins.forEach(e=>{
    const div=document.createElement("div");
    div.className="admin-post-row";
    div.innerHTML = `
      <div>${escapeHtml(e)}</div>
      <div><button class="btn-danger" onclick="removeAdminEmail('${e}')">Hapus</button></div>
    `;
    box.appendChild(div);
  });
}
/* Admin upload Logo & Wallpaper */
function uploadLogo(){
  const f = document.getElementById("logoInput").files[0];
  if(!f) return toast("Pilih file logo", "error");

  uploadToStorage("logo", f).then(url=>{
    refs.settings.child("logoURL").set(url);
    toast("Logo terupload", "success");
  });
}

refs.settings.child("logoURL").on("value", s=>{
  const url = s.val() || "";
  const headerLogo = document.getElementById("headerLogo");
  const sidebarLogo = document.getElementById("sidebarLogo");
  if(headerLogo) headerLogo.src = url;
  if(sidebarLogo) sidebarLogo.src = url;
  const cur = document.getElementById("currentLogo");
  if(cur) cur.src = url;
});

function uploadBackground(){
  const f = document.getElementById("bgInput").files[0];
  if(!f) return toast("Pilih wallpaper", "error");

  uploadToStorage("backgrounds", f).then(url=>{
    refs.settings.child("backgroundURL").set(url);
    toast("Wallpaper terupload", "success");
  });
}

refs.settings.child("backgroundURL").on("value", s=>{
  const url = s.val();
  if(url){
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.9)), url('${url}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    const img = document.getElementById("currentBgPreview");
    if(img) img.src = url;
  } else {
    document.body.style.backgroundImage = "";
  }
});

/* War sound */
let warSoundUrl = null;
let soundBuffer = null;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function uploadWarSound(){
  const f = document.getElementById("soundInput").files[0];
  if(!f) return toast("Pilih file audio", "error");

  uploadToStorage("sounds", f).then(url=>{
    refs.settings.child("warSoundURL").set(url);
    toast("Sound terupload", "success");
  });
}

refs.settings.child("warSoundURL").on("value", s=>{
  warSoundUrl = s.val() || null;
  const label = document.getElementById("currentSoundLabel");
  if(label) label.innerText = warSoundUrl ? "custom sound" : "default synth";

  if(warSoundUrl){
    fetch(warSoundUrl)
      .then(r => r.arrayBuffer())
      .then(b => audioCtx.decodeAudioData(b))
      .then(buf => soundBuffer = buf)
      .catch(() => soundBuffer = null);
  } else {
    soundBuffer = null;
  }
});

function playWarSound(vol=0.12){
  if(soundBuffer){
    const src = audioCtx.createBufferSource();
    src.buffer = soundBuffer;
    const g = audioCtx.createGain();
    g.gain.value = vol;
    src.connect(g);
    g.connect(audioCtx.destination);
    src.start();
  } else {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(650, audioCtx.currentTime);
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.06);
  }
}

document.addEventListener("click", e => {
  const tg = e.target.closest("button, a, input[type='button'], input[type='submit']");
  if(tg && audioCtx.state === 'suspended') audioCtx.resume();
  playWarSound(0.08);
});

/* ---------- POSTS MANAGEMENT ---------- */
refs.posts.on("value", snap => {
  const data = snap.val() || {};
  renderPosts(data);
  renderAdminPosts(data);
  renderSlider(data);
  updateStats(data, null, null);
});

function submitPost(){
  const id = document.getElementById("editPostId").value;
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const featured = document.getElementById("postFeatured").checked;

  if(!title || !content) return toast("Lengkapi data", "error");

  const payload = { title, content, featured: !!featured, time: Date.now() };

  if(id) {
    refs.posts.child(id).update(payload).then(()=>{
      toast("Posting diperbarui", "success");
      cancelEditPost();
    });
  } else {
    refs.posts.push(payload).then(()=>{
      toast("Posting ditambahkan", "success");
      cancelEditPost();
    });
  }
}

function renderPosts(data){
  const box = document.getElementById("postList");
  if(!box) return;

  box.innerHTML = "";

  Object.entries(data).sort((a,b) => b[1].time - a[1].time).forEach(([id,p]) => {
    const isImg = (typeof p.content === "string" && p.content.includes("http"));
    box.innerHTML += `
      <div class="post-item">
        <h3 style="color:var(--gold)">${escapeHtml(p.title)}</h3>
        ${isImg ? `<img src="${p.content}" class="post-img">` : `<p>${escapeHtml(p.content)}</p>`}
        <small style="color:var(--muted)">${new Date(p.time).toLocaleString()}</small>
      </div>`;
  });
}

function renderAdminPosts(data){
  const box = document.getElementById("adminPostList");
  if(!box) return;

  box.innerHTML = "";

  Object.entries(data).sort((a,b) => b[1].time - a[1].time).forEach(([id,p]) => {
    const safeId = JSON.stringify(id);
    const row = document.createElement("div");
    row.className = "admin-post-row";
    row.innerHTML = `
      <div style="flex:1">
        <b>${escapeHtml(p.title)}</b>
        <div style="font-size:12px;color:var(--muted)">${new Date(p.time).toLocaleString()}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <label style="font-size:13px">
          <input type="checkbox" ${p.featured ? 'checked': ''} onchange="toggleFeatured(${safeId}, this.checked)"> Featured
        </label>
        <button class="btn-secondary" onclick="editPost(${safeId})">Edit</button>
        <button class="btn-danger" onclick="confirmDelete(() => deletePost(${safeId}))">Hapus</button>
      </div>`;
    box.appendChild(row);
  });
}

window.toggleFeatured = function(id, checked){
  refs.posts.child(id).update({ featured: !!checked });
  toast("Featured toggled", "success");
}

function editPost(id){
  refs.posts.child(id).once("value").then(s=>{
    const p = s.val();
    if(!p) return;
    document.getElementById("postTitle").value = p.title || "";
    document.getElementById("postContent").value = p.content || "";
    document.getElementById("postFeatured").checked = !!p.featured;
    document.getElementById("editPostId").value = id;
    document.getElementById("cancelEditBtn").classList.remove("hidden");
    toast("Edit mode posting aktif", "info");
  });
}

function cancelEditPost(){
  document.getElementById("editPostId").value = "";
  document.getElementById("postTitle").value = "";
  document.getElementById("postContent").value = "";
  document.getElementById("postFeatured").checked = false;
  document.getElementById("cancelEditBtn").classList.add("hidden");
}

function deletePost(id){
  refs.posts.child(id).remove();
  toast("Posting dihapus", "danger");
}
/* ---------- RANK MANAGEMENT ---------- */
refs.ranks.on("value", s=>{
  const data = s.val() || {};
  renderRankDisplay(data);
  renderAdminRankList(data);
  updateStats(null, data, null);
});

function addOrUpdateRank(){
  const id = document.getElementById("editRankId").value;
  const name = document.getElementById("rankName").value.trim();
  const alliance = document.getElementById("rankAlliance").value.trim();
  const power = Number(document.getElementById("rankPower").value) || 0;
  const merit = Number(document.getElementById("rankMerit").value) || 0;

  if(!name || !alliance) return toast("Nama & Aliansi wajib diisi", "error");

  const payload = { name, alliance, power, merit, updatedAt: Date.now() };

  if(id) {
    refs.ranks.child(id).update(payload).then(()=>{
      toast("Rank diperbarui", "success");
      cancelEditRank();
    });
  } else {
    refs.ranks.push(payload).then(()=>{
      toast("Rank ditambahkan", "success");
      cancelEditRank();
    });
  }
}

function renderRankDisplay(data){
  const arr = Object.entries(data || {}).map(([id, v]) => ({ id, ...v }));
  const byPower = [...arr].sort((a, b) => (b.power || 0) - (a.power || 0));
  const byMerit = [...arr].sort((a, b) => (b.merit || 0) - (a.merit || 0));

  const pl = document.getElementById("powerList");
  const ml = document.getElementById("meritList");

  if(pl) pl.innerHTML = "";
  if(ml) ml.innerHTML = "";

  byPower.forEach((r, i) => {
    if(pl) pl.innerHTML += `<tr><td>${i + 1}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.alliance)}</td><td>${r.power || 0}</td></tr>`;
  });

  byMerit.forEach((r, i) => {
    if(ml) ml.innerHTML += `<tr><td>${i + 1}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.alliance)}</td><td>${r.merit || 0}</td></tr>`;
  });
}

function renderAdminRankList(data){
  const box = document.getElementById("adminRankList");
  if(!box) return;

  box.innerHTML = "";

  const arr = Object.entries(data || {}).map(([id, v]) => ({ id, ...v })).sort((a, b) => (b.power || 0) - (a.power || 0));

  arr.forEach((r, idx) => {
    const safeId = JSON.stringify(r.id);
    const d = document.createElement("div");
    d.className = "admin-rank-row";
    d.innerHTML = `
      <div style="flex:1">
        <b>#${idx + 1}</b> ${escapeHtml(r.name)}
        <div style="font-size:12px;color:var(--muted)">Aliansi: ${escapeHtml(r.alliance)} • Power: ${r.power || 0} • Merit: ${r.merit || 0}</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn-secondary" onclick="editRank(${safeId})">Edit</button>
        <button class="btn-danger" onclick="confirmDelete(() => deleteRank(${safeId}))">Hapus</button>
      </div>
    `;
    box.appendChild(d);
  });
}

function editRank(id){
  refs.ranks.child(id).once("value").then(s => {
    const r = s.val();
    if(!r) return;

    document.getElementById("editRankId").value = id;
    document.getElementById("rankName").value = r.name || "";
    document.getElementById("rankAlliance").value = r.alliance || "";
    document.getElementById("rankPower").value = r.power || "";
    document.getElementById("rankMerit").value = r.merit || "";
    document.getElementById("cancelRankEditBtn").classList.remove("hidden");
  });
}

function cancelEditRank(){
  document.getElementById("editRankId").value = "";
  document.getElementById("rankName").value = "";
  document.getElementById("rankAlliance").value = "";
  document.getElementById("rankPower").value = "";
  document.getElementById("rankMerit").value = "";
  document.getElementById("cancelRankEditBtn").classList.add("hidden");
}

function deleteRank(id){
  refs.ranks.child(id).remove();
  toast("Rank dihapus", "danger");
}

/* ---------- MIGRATION MANAGEMENT ---------- */
refs.migrations.on("value", s => {
  const data = s.val() || {};
  renderMigrationTable(data);
  renderAdminMigrationList(data);
  updateStats(null, null, data);
});

const migForm = document.getElementById("migForm");

if (migForm) {
  migForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("migName").value.trim();
    const server = document.getElementById("migServer").value.trim();
    const power = Number(document.getElementById("migPower").value) || 0;
    const contact = document.getElementById("migContact").value.trim();

    if (!name || !server || !contact) return toast("Lengkapi semua data", "error");

    refs.migrations.push({
      name,
      server,
      power,
      contact,
      time: Date.now()
    });

    toast("Pendaftaran terkirim", "success");
    migForm.reset();
  });
}

function renderMigrationTable(data){
  const body = document.getElementById("migTablePublic");
  body.innerHTML = "";

  Object.entries(data)
    .sort((a, b) => b[1].time - a[1].time)
    .forEach(([id, m], i) => {
      body.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(m.name)}</td>
          <td>${escapeHtml(m.server)}</td>
          <td>${m.power}</td>
          <td>${new Date(m.time).toLocaleDateString()}</td>
        </tr>`;
    });
}

function renderAdminMigrationList(data){
  const box = document.getElementById("adminMigList");
  box.innerHTML = "";

  Object.entries(data)
    .sort((a, b) => b[1].time - a[1].time)
    .forEach(([id, m]) => {
      box.innerHTML += `
        <div class="admin-mig-row">
          <div style="flex:1">
            <b>${escapeHtml(m.name)}</b>
            <div style="font-size:12px;color:var(--muted)">
              ${escapeHtml(m.server)} • ${m.power} • ${escapeHtml(m.contact)}
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn-secondary" onclick="startMigEdit('${id}')">Edit</button>
            <button class="btn-danger" onclick="confirmDelete(() => deleteMig('${id}'))">Hapus</button>
          </div>
        </div>`;
    });
}

function startMigEdit(id){
  refs.migrations.child(id).once("value").then(s=>{
    const m = s.val();
    if(!m) return;

    document.getElementById("editMigId").value = id;
    document.getElementById("editMigName").value = m.name || "";
    document.getElementById("editMigServer").value = m.server || "";
    document.getElementById("editMigPower").value = m.power || "";
    document.getElementById("editMigContact").value = m.contact || "";
    document.getElementById("migEditCard").classList.remove("hidden");
  });
}

function cancelMigEdit(){
  document.getElementById("editMigId").value = "";
  document.getElementById("editMigName").value = "";
  document.getElementById("editMigServer").value = "";
  document.getElementById("editMigPower").value = "";
  document.getElementById("editMigContact").value = "";
  document.getElementById("migEditCard").classList.add("hidden");
}

function saveMigrationEdit(){
  const id = document.getElementById("editMigId").value;
  const name = document.getElementById("editMigName").value.trim();
  const server = document.getElementById("editMigServer").value.trim();
  const power = Number(document.getElementById("editMigPower").value) || 0;
  const contact = document.getElementById("editMigContact").value.trim();

  if(!id || !name) return toast("Lengkapi data", "error");

  refs.migrations.child(id).set({
    name,
    server,
    power,
    contact,
    time: Date.now()
  });

  toast("Data migrasi disimpan", "success");
  cancelMigEdit();
}

function deleteMig(id){
  refs.migrations.child(id).remove();
  toast("Data migrasi dihapus", "danger");
}

/* ---------- SERVER & EVENT MANAGEMENT ---------- */
refs.events.on("value", s => {
  const d = s.val() || {};
  document.getElementById("eventName").innerText = d.name || "-";
  document.getElementById("eventStatus").innerText = d.status || "-";
  document.getElementById("eventNote").innerText = d.note || "-";
});

function saveEventStatus(){
  refs.events.set({
    name: document.getElementById("admEventName").value,
    status: document.getElementById("admEventStatus").value,
    note: document.getElementById("admEventNote").value
  });
  toast("Status event disimpan", "success");
}

refs.serverInfo.on("value", s => {
  const d = s.val() || {};
  document.getElementById("allianceInfo").innerHTML = d.alliance || "-";
  document.getElementById("rulesInfo").innerHTML = d.rules || "-";
});

function saveServerInfo(){
  refs.serverInfo.set({
    alliance: document.getElementById("admAllianceInfo").value,
    rules: document.getElementById("admRulesInfo").value
  });
  toast("Info server disimpan", "success");
}

refs.migrationStatus.on("value", s => {
  const d = s.val() || {};
  document.getElementById("warStatus").innerText = d.war || "PVE";
  document.getElementById("migStatus").innerText = d.migration || "-";
});

function saveMigrationStatus(){
  refs.migrationStatus.set({
    war: document.getElementById("admWarStatus").value,
    migration: document.getElementById("admMigStatus").value
  });
  toast("Status disimpan", "success");
}

refs.kvk.on("value", s => {
  document.getElementById("kvkSchedule").innerText = s.val() || "-";
});
function saveKvkSchedule(){
  refs.kvk.set(document.getElementById("admKvkSchedule").value);
  toast("Jadwal KvK disimpan", "success");
}

refs.king.on("value", s => {
  document.getElementById("kingNameDisplay").innerText = s.val() || "Belum Ditentukan";
});
function saveKingName(){
  refs.king.set(document.getElementById("admKingName").value);
  toast("Nama Raja disimpan", "success");
}

/* ---------- STATS UPDATER ---------- */
function updateStats(postsData, ranksData, migsData){
  const pcount = postsData ? Object.keys(postsData).length : (document.getElementById("statPosts") ? document.getElementById("statPosts").innerText : "-");
  const rcount = ranksData ? Object.keys(ranksData).length : (document.getElementById("statRanks") ? document.getElementById("statRanks").innerText : "-");
  const mcount = migsData ? Object.keys(migsData).length : (document.getElementById("statMigs") ? document.getElementById("statMigs").innerText : "-");

  if(document.getElementById("statPosts")) document.getElementById("statPosts").innerText = pcount;
  if(document.getElementById("statRanks")) document.getElementById("statRanks").innerText = rcount;
  if(document.getElementById("statMigs")) document.getElementById("statMigs").innerText = mcount;
}

/* ---------- NAV MENU TOGGLE ---------- */
function toggleMenu(){
  const m=document.getElementById("navMenu");
  const ic=document.getElementById("menuIcon");
  if(!m || !ic) return;
  m.classList.toggle("active");
  ic.classList.toggle("fa-bars");
  ic.classList.toggle("fa-xmark");
}

function closeMenu(){
  const m=document.getElementById("navMenu");
  const ic=document.getElementById("menuIcon");
  if(!m || !ic) return;
  m.classList.remove("active");
  ic.classList.add("fa-bars");
  ic.classList.remove("fa-xmark");
}

document.querySelectorAll(".nav-list button").forEach(btn => btn.addEventListener("click", closeMenu));

/* ---------- SWITCH TAB ---------- */
function switchTab(page) {
  document.querySelectorAll(".page-section").forEach(sec => sec.classList.add("hidden"));
  const el = document.getElementById(page);
  if (el) el.classList.remove("hidden");

  if(page === "admin") adminShow("dashboard");
  closeMenu();
}

/* ---------- ADMIN PANEL ---------- */
function adminShow(panel){
  document.querySelectorAll(".admin-panel").forEach(p => p.classList.add("hidden"));
  document.querySelectorAll(".admin-sidebar .sidebar-nav button").forEach(b => b.classList.remove("active"));

  const map = {
    dashboard: "admin-dashboard",
    posts: "admin-posts",
    ranks: "admin-ranks",
    migrations: "admin-migrations",
    files: "admin-files",
    admins: "admin-admins",
    server: "admin-server",
    settings: "admin-settings"
  };

  const id = map[panel] || "admin-dashboard";
  const el = document.getElementById(id);
  if(el) el.classList.remove("hidden");

  const btns = Array.from(document.querySelectorAll(".admin-sidebar .sidebar-nav button"));
  const btn = btns.find(b => b.innerText.toLowerCase().includes(panel));
  if(btn) btn.classList.add("active");
}

/* ---------- INIT ---------- */
switchTab("home");
adminShow("dashboard");

console.log("AOEM S199 — FULL FIX script.js loaded.");