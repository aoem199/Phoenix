// script.js — AOEM S199 (FINAL, BASE64 STORAGE)
// Requires: firebaseConfig defined in index.html before this file is loaded

/* ======================
   Single Firebase init
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
// NOTE: we DO NOT use firebase.storage() in this Base64 variant

/* ======================
   Helpers
   ====================== */
function qs(id){ return document.getElementById(id); }
function toast(msg, type="info"){
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
  return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}
function readFileAsDataURL(file, onProgress){
  return new Promise((resolve, reject) => {
    try {
      const fr = new FileReader();
      fr.onerror = () => reject(new Error("Gagal membaca file"));
      fr.onload = () => resolve(fr.result);
      // Progress for large files
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

/* Ensure default placeholders */
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

/* ======================
   UTC Clock
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
function showConfirm(text, cb){
  const modal = qs("confirmModal");
  const txt = qs("confirmText");
  if(txt) txt.innerText = text || "Apakah Anda yakin?";
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
  } else {
    if(adminTab) adminTab.classList.add("hidden");
    // if not authorized, stay in login or home
  }
});

/* ======================
   Menu + Admin show
   ====================== */
function switchTab(page){
  document.querySelectorAll(".page-section").forEach(sec => sec.classList.add("hidden"));
  const el = qs(page);
  if(el) el.classList.remove("hidden");
  closeMenu();
}
function toggleMenu(){
  const m = qs("navMenu");
  const ic = qs("menuIcon");
  if(!m) return;
  m.classList.toggle("active");
  if(ic) ic.classList.toggle("fa-xmark");
}
function closeMenu(){
  const m = qs("navMenu");
  const ic = qs("menuIcon");
  if(!m) return;
  m.classList.remove("active");
  if(ic){
    ic.classList.remove("fa-xmark");
    ic.classList.add("fa-bars");
  }
}
function adminShow(panel){
  document.querySelectorAll(".admin-panel").forEach(p => p.classList.add("hidden"));
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
  const el = qs(id);
  if(el) el.classList.remove("hidden");
  // highlight sidebar button (simple)
  Array.from(document.querySelectorAll(".admin-sidebar .sidebar-nav button")).forEach(b => b.classList.remove("active"));
  const btn = Array.from(document.querySelectorAll(".admin-sidebar .sidebar-nav button")).find(b => b.innerText.toLowerCase().includes(panel));
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
  if(!title || !content) return toast("Lengkapi judul & isi","danger");
  const payload = { title, content, featured, time: Date.now() };
  if(id){
    REFS.posts.child(id).update(payload).then(()=> { toast("Posting diperbarui","success"); cancelEditPost(); })
      .catch(e=> { console.error(e); toast("Gagal menyimpan","danger"); });
  } else {
    REFS.posts.push(payload).then(()=> { toast("Posting ditambahkan","success"); cancelEditPost(); })
      .catch(e=> { console.error(e); toast("Gagal menambah","danger"); });
  }
}

function renderPosts(data){
  const box = qs("postList"); if(!box) return;
  box.innerHTML = "";
  const items = Object.entries(data || {}).sort((a,b)=> b[1].time - a[1].time);
  if(items.length === 0){ box.innerHTML = "<i>Tidak ada posting.</i>"; return; }
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
    chk.onchange = ()=> { REFS.posts.child(id).update({ featured: !!chk.checked }); toast("Featured diubah","success"); };
    lab.appendChild(chk); lab.appendChild(document.createTextNode(" Featured")); right.appendChild(lab);
    // edit
    const eb = document.createElement("button"); eb.className="btn-secondary"; eb.innerText="Edit"; eb.onclick = ()=> editPost(id); right.appendChild(eb);
    // upload image to replace content (admin quick-upload)
    const upb = document.createElement("button"); upb.className="btn-secondary"; upb.innerText="Ganti Gambar"; upb.onclick = ()=> openReplaceImageDialog(id); right.appendChild(upb);
    // delete
    const dbtn = document.createElement("button"); dbtn.className="btn-danger"; dbtn.innerText="Hapus"; dbtn.onclick = ()=> showConfirm("Hapus posting ini?", ()=> {
      REFS.posts.child(id).remove().then(()=> toast("Posting dihapus","danger")).catch(e=>{console.error(e); toast("Gagal hapus","danger");});
    }); right.appendChild(dbtn);
    row.appendChild(left); row.appendChild(right); box.appendChild(row);
  });
}

/* Edit/cancel */
function editPost(id){
  REFS.posts.child(id).once("value").then(s=>{
    const p = s.val();
    if(!p) return toast("Posting tidak ditemukan","danger");
    if(qs("postTitle")) qs("postTitle").value = p.title || "";
    if(qs("postContent")) qs("postContent").value = p.content || "";
    if(qs("postFeatured")) qs("postFeatured").checked = !!p.featured;
    if(qs("editPostId")) qs("editPostId").value = id;
    if(qs("cancelEditBtn")) qs("cancelEditBtn").classList.remove("hidden");
    switchTab("admin"); adminShow("posts");
    toast("Edit mode aktif","info");
  }).catch(e=>{ console.error(e); toast("Gagal ambil posting","danger"); });
}
function cancelEditPost(){
  if(qs("editPostId")) qs("editPostId").value = "";
  if(qs("postTitle")) qs("postTitle").value = "";
  if(qs("postContent")) qs("postContent").value = "";
  if(qs("postFeatured")) qs("postFeatured").checked = false;
  if(qs("cancelEditBtn")) qs("cancelEditBtn").classList.add("hidden");
  toast("Edit dibatalkan","info");
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
    status.innerText = "Membaca file...";
    document.body.appendChild(status);
    try {
      const dataUrl = await readFileAsDataURL(f, pct => { status.innerText = `Mengkonversi ${pct}%`; });
      status.innerText = "Menyimpan ke DB...";
      await REFS.posts.child(postId).update({ content: dataUrl, time: Date.now() });
      toast("Gambar posting diganti (base64)","success");
    } catch(e){
      console.error(e);
      toast("Gagal mengganti gambar","danger");
    } finally {
      setTimeout(()=> status.remove(), 600);
    }
  };
  input.click();
}

/* ======================
   Slider
   ====================== */
let __sliderIndex = 0;
function renderSlider(data){
  const track = qs("sliderTrack"); if(!track) return;
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
}
function updateSliderPosition(){
  const track = qs("sliderTrack"); if(!track) return;
  const cards = track.children.length; if(cards === 0){ track.style.transform = "none"; return; }
  const card = track.children[0];
  const gap = 12;
  const width = card.getBoundingClientRect().width + gap;
  const maxIndex = Math.max(0, cards - 1);
  if(__sliderIndex < 0) __sliderIndex = 0;
  if(__sliderIndex > maxIndex) __sliderIndex = maxIndex;
  track.style.transform = `translateX(-${__sliderIndex * width}px)`;
}
function sliderPrev(){ __sliderIndex = Math.max(0, __sliderIndex - 1); updateSliderPosition(); }
function sliderNext(){ const track = qs("sliderTrack"); const maxIndex = Math.max(0, (track ? track.children.length : 1) - 1); __sliderIndex = Math.min(maxIndex, __sliderIndex + 1); updateSliderPosition(); }
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
  if(!name || !alliance) return toast("Isi nama & aliansi","danger");
  const payload = { name, alliance, power, merit, updatedAt: Date.now() };
  if(id){
    REFS.ranks.child(id).update(payload).then(()=> { toast("Rank diperbarui","success"); cancelEditRank(); }).catch(e=>{console.error(e); toast("Gagal menyimpan rank","danger");});
  } else {
    REFS.ranks.push(payload).then(()=> { toast("Rank ditambahkan","success"); cancelEditRank(); }).catch(e=>{console.error(e); toast("Gagal menambah rank","danger");});
  }
}
function renderRankDisplay(data){
  const arr = Object.entries(data || {}).map(([id,v])=> ({ id, ...v }));
  const byPower = [...arr].sort((a,b)=> (b.power||0)-(a.power||0));
  const byMerit = [...arr].sort((a,b)=> (b.merit||0)-(a.merit||0));
  const pl = qs("powerList"), ml = qs("meritList");
  if(pl) pl.innerHTML = ""; if(ml) ml.innerHTML = "";
  byPower.forEach((r,i)=> { if(pl) pl.innerHTML += `<tr><td>${i+1}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.alliance)}</td><td>${r.power||0}</td></tr>`; });
  byMerit.forEach((r,i)=> { if(ml) ml.innerHTML += `<tr><td>${i+1}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.alliance)}</td><td>${r.merit||0}</td></tr>`; });
}
function renderAdminRankList(data){
  const box = qs("adminRankList"); if(!box) return; box.innerHTML = "";
  const arr = Object.entries(data || {}).map(([id,v])=> ({ id, ...v })).sort((a,b)=> (b.power||0)-(a.power||0));
  arr.forEach((r, idx)=> {
    const row = document.createElement("div"); row.className = "admin-rank-row";
    const left = document.createElement("div"); left.style.flex = "1";
    left.innerHTML = `<b>#${idx+1}</b> ${escapeHtml(r.name)}<div style="font-size:12px;color:var(--muted)">Aliansi: ${escapeHtml(r.alliance)} • Power: ${r.power||0} • Merit: ${r.merit||0}</div>`;
    const right = document.createElement("div"); right.style.display="flex"; right.style.gap="8px";
    const eb = document.createElement("button"); eb.className="btn-secondary"; eb.innerText="Edit"; eb.onclick = ()=> {
      qs("editRankId").value = r.id; qs("rankName").value = r.name || ""; qs("rankAlliance").value = r.alliance || ""; qs("rankPower").value = r.power || 0; qs("rankMerit").value = r.merit || 0; qs("cancelRankEditBtn") && qs("cancelRankEditBtn").classList.remove("hidden");
    };
    const dbtn = document.createElement("button"); dbtn.className="btn-danger"; dbtn.innerText="Hapus"; dbtn.onclick = ()=> showConfirm("Hapus rank?", ()=> { REFS.ranks.child(r.id).remove().then(()=> toast("Rank dihapus","danger")).catch(e=>{console.error(e); toast("Gagal hapus rank","danger"); }); });
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
function renderMigrationTable(data){
  const body = qs("migTablePublic"); if(!body) return; body.innerHTML = "";
  Object.entries(data || {}).sort((a,b)=> b[1].time - a[1].time).forEach(([id,m], i)=> {
    body.innerHTML += `<tr><td>${i+1}</td><td>${escapeHtml(m.name)}</td><td>${escapeHtml(m.server)}</td><td>${m.power}</td><td>${new Date(m.time).toLocaleDateString()}</td></tr>`;
  });
}
function renderAdminMigrationList(data){
  const box = qs("adminMigList"); if(!box) return; box.innerHTML = "";
  Object.entries(data || {}).sort((a,b)=> b[1].time - a[1].time).forEach(([id,m])=>{
    const row = document.createElement("div"); row.className = "admin-mig-row";
    row.innerHTML = `<div style="flex:1"><b>${escapeHtml(m.name)}</b><div style="font-size:12px;color:var(--muted)">${escapeHtml(m.server)} • ${m.power} • ${escapeHtml(m.contact)}</div></div>`;
    const right = document.createElement("div"); right.style.display="flex"; right.style.gap="8px";
    const eb = document.createElement("button"); eb.className="btn-secondary"; eb.innerText="Edit"; eb.onclick = ()=> {
      qs("editMigId").value = id; qs("editMigName").value = m.name || ""; qs("editMigServer").value = m.server || ""; qs("editMigPower").value = m.power || 0; qs("editMigContact").value = m.contact || ""; qs("migEditCard") && qs("migEditCard").classList.remove("hidden");
    };
    const dbtn = document.createElement("button"); dbtn.className="btn-danger"; dbtn.innerText="Hapus"; dbtn.onclick = ()=> showConfirm("Hapus data migrasi?", ()=> { REFS.migrations.child(id).remove().then(()=> toast("Data migrasi dihapus","danger")); });
    right.appendChild(eb); right.appendChild(dbtn); row.appendChild(right); box.appendChild(row);
  });
}
function saveMigrationEdit(){
  const id = qs("editMigId").value; const name = qs("editMigName").value.trim(); const server = qs("editMigServer").value.trim(); const power = Number(qs("editMigPower").value) || 0; const contact = qs("editMigContact").value.trim();
  if(!id || !name) return toast("Lengkapi data migrasi","danger");
  REFS.migrations.child(id).set({ name, server, power, contact, time: Date.now() }).then(()=> { toast("Data migrasi disimpan","success"); qs("migEditCard") && qs("migEditCard").classList.add("hidden"); }).catch(e=>{ console.error(e); toast("Gagal simpan migrasi","danger"); });
}
function cancelMigEdit(){ if(qs("editMigId")) qs("editMigId").value = ""; if(qs("editMigName")) qs("editMigName").value = ""; if(qs("editMigServer")) qs("editMigServer").value = ""; if(qs("editMigPower")) qs("editMigPower").value = ""; if(qs("editMigContact")) qs("editMigContact").value = ""; if(qs("migEditCard")) qs("migEditCard").classList.add("hidden"); }

/* ======================
   Events & Server Info
   ====================== */
REFS.events.on("value", snap=>{ const d = snap.val() || {}; if(qs("eventName")) qs("eventName").innerText = d.name || "-"; if(qs("eventStatus")) qs("eventStatus").innerText = d.status || "-"; if(qs("eventNote")) qs("eventNote").innerText = d.note || "-"; });
REFS.serverInfo.on("value", snap=>{ const d = snap.val() || {}; if(qs("allianceInfo")) qs("allianceInfo").innerHTML = d.alliance || "-"; if(qs("rulesInfo")) qs("rulesInfo").innerHTML = d.rules || "-"; });
function saveEventStatus(){ REFS.events.set({ name: qs("admEventName").value, status: qs("admEventStatus").value, note: qs("admEventNote").value }); toast("Event disimpan","success"); }
function saveServerInfo(){ REFS.serverInfo.set({ alliance: qs("admAllianceInfo").value, rules: qs("admRulesInfo").value }); toast("Info server disimpan","success"); }
function saveMigrationStatus(){ REFS.settings.child("migrationStatus").set({ war: qs("admWarStatus").value, migration: qs("admMigStatus").value }); toast("Status disimpan","success"); }
function saveKvkSchedule(){ REFS.settings.child("kvk").set(qs("admKvkSchedule").value); toast("Jadwal KvK disimpan","success"); }
function saveKingName(){ REFS.settings.child("king").set(qs("admKingName").value); toast("Nama Raja disimpan","success"); }

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
   Saves data URLs into /assets in Realtime Database
   ====================== */
async function uploadPostImage(){
  const inp = qs("postImageInput");
  const status = qs("uploadImageStatus");
  if(!inp || !inp.files || !inp.files[0]){ if(status) status.innerText = "Pilih gambar terlebih dahulu"; toast("Pilih gambar terlebih dahulu","danger"); return; }
  const f = inp.files[0];
  if(status) status.innerText = "Membaca file...";
  try {
    const dataUrl = await readFileAsDataURL(f, pct => { if(status) status.innerText = `Mengkonversi ${pct}%`; });
    // store the dataUrl directly to postContent field
    if(qs("postContent")) qs("postContent").value = dataUrl;
    if(status) status.innerText = "Selesai (base64)";
    toast("Gambar berhasil dikonversi ke base64 (diisi ke field Isi)", "success");
  } catch(e){
    console.error(e);
    if(status) status.innerText = "Gagal";
    toast("Gagal mengkonversi gambar", "danger");
  }
}

async function uploadLogo(){
  const file = qs("logoInput")?.files?.[0];
  if(!file) return toast("Pilih file dulu","danger");
  try {
    qs("currentLogo") && (qs("currentLogo").alt = "Mengonversi...");
    const dataUrl = await readFileAsDataURL(file, pct => { qs("currentLogo") && (qs("currentLogo").alt = `Mengonversi ${pct}%`); });
    await REFS.assets.child("logo").set(dataUrl);
    if(qs("headerLogo")) qs("headerLogo").src = dataUrl;
    if(qs("sidebarLogo")) qs("sidebarLogo").src = dataUrl;
    if(qs("currentLogo")) qs("currentLogo").src = dataUrl;
    toast("Logo tersimpan (base64)", "success");
  } catch(e){
    console.error(e);
    toast("Gagal upload logo", "danger");
  }
}

async function uploadBackground(){
  const file = qs("bgInput")?.files?.[0];
  if(!file) return toast("Pilih file dulu","danger");
  try {
    qs("currentBgPreview") && (qs("currentBgPreview").alt = "Mengonversi...");
    const dataUrl = await readFileAsDataURL(file, pct => { qs("currentBgPreview") && (qs("currentBgPreview").alt = `Mengonversi ${pct}%`); });
    await REFS.assets.child("background").set(dataUrl);
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.9)), url('${dataUrl}')`;
    if(qs("currentBgPreview")) qs("currentBgPreview").src = dataUrl;
    toast("Wallpaper tersimpan (base64)", "success");
  } catch(e){
    console.error(e);
    toast("Gagal upload wallpaper", "danger");
  }
}

async function uploadWarSound(){
  const file = qs("soundInput")?.files?.[0];
  if(!file) return toast("Pilih file audio","danger");
  try {
    const dataUrl = await readFileAsDataURL(file, pct => { /* progress optional */ });
    await REFS.assets.child("warSound").set(dataUrl);
    toast("Sound tersimpan (base64)", "success");
  } catch(e){
    console.error(e);
    toast("Gagal upload sound", "danger");
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
  }
  if(a.warSound && qs("currentSoundLabel")) qs("currentSoundLabel").innerText = "custom";
});

/* ======================
   Admin emails simple render (settings/adminEmails)
   ====================== */
function renderAdminEmailListSimple(){
  REFS.settings.child("adminEmails").once("value").then(snap=>{
    const arr = snap.val() || [];
    const box = qs("adminEmailsList"); if(!box) return;
    box.innerHTML = "";
    arr.forEach((email, idx) => {
      const div = document.createElement("div"); div.className = "admin-post-row";
      div.innerHTML = `<div>${escapeHtml(email)}</div><div><button class="btn-danger" onclick="removeAdminEmailSimple(${idx})">Hapus</button></div>`;
      box.appendChild(div);
    });
  }).catch(()=>{});
}
function addAdminEmailSimple(){
  const email = qs("newAdminEmail")?.value?.trim();
  if(!email) return toast("Masukkan email","danger");
  REFS.settings.child("adminEmails").once("value").then(snap=>{
    const arr = snap.val() || [];
    arr.push(email);
    REFS.settings.child("adminEmails").set(arr).then(()=>{ toast("Admin ditambahkan","success"); qs("newAdminEmail").value = ""; renderAdminEmailListSimple(); }).catch(e=>{ console.error(e); toast("Gagal menambah admin","danger"); });
  });
}
function removeAdminEmailSimple(index){
  showConfirm("Hapus admin ini?", ()=> {
    REFS.settings.child("adminEmails").once("value").then(snap=>{
      const arr = snap.val() || [];
      arr.splice(index,1);
      REFS.settings.child("adminEmails").set(arr).then(()=> { toast("Admin dihapus","danger"); renderAdminEmailListSimple(); });
    }).catch(e=> toast("Gagal hapus admin","danger"));
  });
}
window.addAdminEmail = addAdminEmailSimple;
window.removeAdminEmail = removeAdminEmailSimple;

/* ======================
   Final initializers & exposes
   ====================== */
window.sliderPrev = sliderPrev;
window.sliderNext = sliderNext;
window.uploadPostImage = uploadPostImage;
window.uploadLogo = uploadLogo;
window.uploadBackground = uploadBackground;
window.uploadWarSound = uploadWarSound;
window.submitPost = submitPost;
window.editPost = editPost;
window.deletePost = (id)=> REFS.posts.child(id).remove();
window.cancelEditPost = cancelEditPost;
window.addOrUpdateRank = addOrUpdateRank;
window.cancelEditRank = cancelEditRank;
window.saveMigrationEdit = saveMigrationEdit;
window.cancelMigEdit = cancelMigEdit;
window.adminLogin = function(){ const email = qs("adminEmail").value; const pass = qs("adminPass").value; auth.signInWithEmailAndPassword(email, pass).then(()=>{ toast("Login berhasil","success"); if(qs("adminTab")) qs("adminTab").classList.remove("hidden"); switchTab("admin"); adminShow("dashboard"); }).catch(e=> { qs("loginMsg") && (qs("loginMsg").innerText = e.message); }); };
window.adminLogout = function(){ auth.signOut().then(()=>{ toast("Logout", "info"); location.reload(); }); };

/* small init: load assets once */
REFS.assets.once("value").then(snap=>{ const a = snap.val() || {}; if(a.logo && qs("headerLogo")) qs("headerLogo").src = a.logo; if(a.background) document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.9)), url('${a.background}')`; }).catch(()=>{});

/* Ensure initial UI: show home */
switchTab("home");
adminShow("dashboard");
console.log("script.js (BASE64) loaded — uploads are saved to Realtime DB as data URLs.");