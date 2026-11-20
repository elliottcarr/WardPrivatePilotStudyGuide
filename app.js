/* Private Pilot ASEL study guide — client app. Progress stays in this browser. */
var store = {
  get: function (k, d) {
    try { var v = localStorage.getItem("ppasel6c_" + k); return v ? JSON.parse(v) : d; }
    catch (e) { return d; }
  },
  set: function (k, v) {
    try { localStorage.setItem("ppasel6c_" + k, JSON.stringify(v)); } catch (e) {}
  }
};
var mastered = store.get("m", {});
function saveM() { store.set("m", mastered); }

var $ = function (s) { return document.querySelector(s); };
var app = $("#app");
function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}
function strip(h) {
  var d = document.createElement("div");
  d.innerHTML = h || "";
  return d.textContent || "";
}

var ALL = [];
GUIDE.areas.forEach(function (a) {
  a.tasks.forEach(function (t) {
    t.area = a;
    t.key = a.id + "-" + t.id;
    t.code = "PA." + a.id + "." + t.id;
    if (!t.na) ALL.push(t);
  });
});

function elCodes(t) {
  var c = [];
  ["K", "R", "S"].forEach(function (s) {
    (t[s] || []).forEach(function (e) { if (!e.skip) c.push(t.code + "." + e.code); });
  });
  return c;
}
function taskProg(t) {
  var c = elCodes(t), d = c.filter(function (x) { return mastered[x]; }).length;
  return { d: d, n: c.length };
}
function totals() {
  var tot = 0, dn = 0;
  ALL.forEach(function (t) { var p = taskProg(t); tot += p.n; dn += p.d; });
  return { tot: tot, dn: dn, pct: tot ? Math.round(dn / tot * 100) : 0 };
}

function go(r) { location.hash = r; }
window.addEventListener("hashchange", route);

function route() {
  var h = (location.hash || "#home").slice(1) || "home";
  document.querySelectorAll("#nav a").forEach(function (a) {
    var on = a.dataset.r === h || (h.indexOf("task-") === 0 && a.dataset.r === "home");
    a.classList.toggle("on", on);
  });
  window.scrollTo(0, 0);
  if (h.indexOf("task-") === 0) return viewTask(h.slice(5));
  var views = {
    home: viewHome, aircraft: viewAircraft, local: viewLocal, ground: viewGround,
    reference: viewRef, flashcards: viewFlash, day: viewDay
  };
  (views[h] || viewHome)();
}

function notice() {
  return '<div class="notice">' + GUIDE.notice + "</div>";
}

function countdownHTML() {
  var target = new Date("2026-12-02T08:00:00-06:00").getTime();
  var now = Date.now();
  var diff = target - now;
  if (diff <= 0) {
    return '<div class="countbox"><div class="cd-sub">CHECKRIDE</div><div class="cd-num">Dec 2</div><div class="cd-sub">2026 · the date is here. Report time is whatever the examiner assigned.</div></div>';
  }
  var days = Math.floor(diff / 86400000);
  var hours = Math.floor((diff % 86400000) / 3600000);
  var mins = Math.floor((diff % 3600000) / 60000);
  return '<div class="countbox"><div class="cd-sub">UNTIL 8:00 A.M. CENTRAL<br>DECEMBER 2, 2026</div><div class="cd-num">' + days + '<span style="font-size:14px;font-weight:600">d </span>' + hours + '<span style="font-size:14px;font-weight:600">h </span>' + mins + '<span style="font-size:14px;font-weight:600">m</span></div><div class="cd-sub">KLIT · Private ASEL. The report time on your appointment controls, not this clock.</div></div>';
}

function viewHome() {
  var g = totals();
  var h = '<div class="hero"><div><h1>Private Pilot — Airplane Single-Engine Land</h1><p class="lead">Every Area of Operation and Task in the Private Pilot ACS (FAA-S-ACS-6C, effective May 31, 2024) that applies to ASEL. The airplane sections are organized around the <b>Tecnam P-Mentor</b>, the same type the school’s commercial guide uses. You started in a different airplane and you are not training in the P-Mentor, so if the checkride airplane is not a P-Mentor, that airplane’s POH/AFM replaces every speed, system, and limitation in this guide. Home airport is <b>KLIT</b>. Open a task for each Knowledge, Risk Management, and Skill element. Progress saves in this browser only.</p></div>' +
    countdownHTML() +
    '<div class="meter"><div class="small">OVERALL MASTERY</div><div style="font-size:30px;font-weight:700" class="mono">' + g.pct + '%</div><div class="bar"><i style="width:' + g.pct + '%"></i></div><div class="small">' + g.dn + " of " + g.tot + ' elements mastered</div><div style="margin-top:10px"><button id="rst" onclick="resetProgress(this)">Reset progress</button></div></div></div>';
  h += '<input class="search" id="q" placeholder="Search elements, regulations, topics (91.155, hypoxia, short-field, KLIT, VA)…" oninput="doSearch(this.value)"><div id="sr"></div><div id="areas">';
  GUIDE.areas.forEach(function (a) {
    h += '<div class="area"><div class="area-h"><span class="roman">' + a.id + "</span><h3>" + esc(a.title) + "</h3></div><div class=\"tasks\">";
    a.tasks.forEach(function (t) {
      if (t.na) {
        h += '<div class="tile na"><div class="c">' + t.code + "</div><div class=\"t\">" + esc(t.title) + '</div><div class="n">' + esc(t.na) + "</div></div>";
        return;
      }
      var p = taskProg(t), w = p.n ? p.d / p.n * 100 : 0;
      h += '<div class="tile" onclick="go(\'task-' + t.key + '\')"><div class="c">' + t.code + '</div><div class="t">' + esc(t.title) + '</div><div class="n"><span class="pill pk">K ' + (t.K || []).filter(function (e) { return !e.skip; }).length + '</span><span class="pill pr">R ' + (t.R || []).filter(function (e) { return !e.skip; }).length + '</span><span class="pill ps">S ' + (t.S || []).filter(function (e) { return !e.skip; }).length + '</span><span style="margin-left:auto">' + p.d + "/" + p.n + '</span></div><div class="bar"><i style="width:' + w + '%"></i></div></div>';
    });
    h += "</div></div>";
  });
  h += "</div>" + notice();
  app.innerHTML = h;
}

var confirmReset = 0;
function resetProgress(btn) {
  if (confirmReset) {
    mastered = {};
    saveM();
    confirmReset = 0;
    route();
  } else {
    confirmReset = 1;
    btn.textContent = "Tap again to confirm reset";
    setTimeout(function () {
      confirmReset = 0;
      if (btn) btn.textContent = "Reset progress";
    }, 4000);
  }
}

function doSearch(v) {
  var box = $("#sr"), areas = $("#areas");
  v = (v || "").trim().toLowerCase();
  if (!v) { box.innerHTML = ""; areas.style.display = ""; return; }
  areas.style.display = "none";
  var hits = [];
  ALL.forEach(function (t) {
    ["K", "R", "S"].forEach(function (s) {
      (t[s] || []).forEach(function (e) {
        var blob = (e.code + " " + e.title + " " + strip(e.html) + " " + (e.subs || []).map(function (sb) { return sb.title + " " + strip(sb.html); }).join(" ")).toLowerCase();
        if (blob.indexOf(v) >= 0) hits.push({ t: t, e: e, s: s });
      });
    });
    if ((t.title + " " + t.obj).toLowerCase().indexOf(v) >= 0 && !hits.some(function (h) { return h.t === t && !h.e; })) {
      /* task-level hit already covered if any element matched; add a task row only when nothing else matched */
    }
  });
  if (!hits.length) { box.innerHTML = '<div class="small" style="padding:8px">No matches.</div>'; return; }
  var html = '<div class="small" style="margin:6px 0">' + hits.length + " match" + (hits.length === 1 ? "" : "es") + " — showing " + Math.min(hits.length, 40) + "</div>";
  hits.slice(0, 40).forEach(function (hit) {
    html += '<div class="res" onclick="go(\'task-' + hit.t.key + "');setTimeout(function(){openEl('" + hit.t.code + "." + hit.e.code + '\')},30)">' +
      '<span class="mono" style="color:var(--amber)">' + hit.t.code + "." + hit.e.code + "</span> " + esc(hit.e.title) +
      ' <span class="tag">· ' + esc(hit.t.title) + "</span></div>";
  });
  box.innerHTML = html;
}

function openEl(full) {
  var id = "e_" + full.replace(/\./g, "_");
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.add("open");
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}

function viewTask(key) {
  var t = ALL.filter(function (x) { return x.key === key; })[0];
  if (!t) return viewHome();
  var i = ALL.indexOf(t), prev = ALL[i - 1], next = ALL[i + 1];
  var h = '<div class="crumb"><a href="#home">Tasks</a> / Area ' + t.area.id + " — " + esc(t.area.title) + "</div>";
  h += '<h1><span class="mono" style="color:var(--amber);font-size:20px">' + t.code + "</span><br>" + esc(t.title) + "</h1>";
  h += '<div class="box obj"><b>Objective.</b> ' + esc(t.obj) + "</div>";
  h += '<div class="small"><b>References:</b> ' + esc(t.refs) + "</div>";
  if (t.notes && t.notes.length) {
    h += '<div class="small" style="margin-top:6px"><b>ACS notes.</b> ' + t.notes.map(esc).join(" ") + "</div>";
  }
  if (t.std && t.std.length) {
    h += '<div class="box std"><b style="color:var(--cyan)">Private pilot standards in this task</b><ul>' + t.std.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ul></div>";
  }
  if (t.pm) h += '<div class="pm">' + t.pm + "</div>";
  if (t.tip) h += '<div class="box tip"><b style="color:var(--green)">Checkride tip.</b> ' + t.tip + "</div>";
  if (t.archived && t.archived.length) {
    h += '<div class="small">Archived by FAA-S-ACS-6C and not tested: ' + t.archived.map(esc).join(", ") + ".</div>";
  }
  h += '<div class="toolbar"><button onclick="expAll(1)">Expand all</button><button onclick="expAll(0)">Collapse all</button><button onclick="markAll()">Mark whole task mastered</button></div>';
  var names = { K: "Knowledge", R: "Risk Management", S: "Skills" };
  var cols = { K: "var(--k)", R: "var(--r)", S: "var(--s)" };
  var intro = {
    K: "The applicant demonstrates understanding of:",
    R: "The applicant is able to identify, assess, and mitigate risk associated with:",
    S: "The applicant exhibits the skill to:"
  };
  ["K", "R", "S"].forEach(function (s) {
    var list = t[s] || [];
    if (!list.length) return;
    h += '<div class="sec-h"><span class="dot" style="background:' + cols[s] + '"></span>' + names[s] + '</div><div class="small" style="margin-bottom:6px">' + intro[s] + "</div>";
    list.forEach(function (e) {
      if (e.skip) {
        h += '<div class="el ' + s + ' skip"><div class="eh" onclick="tog(this)"><span class="code">' + e.code + '</span><span class="tt">' + esc(e.title) + ' <span class="tag">— not tested for ASEL</span></span><span class="chev">▶</span></div><div class="eb">' + (e.html || "") + "</div></div>";
        return;
      }
      var full = t.code + "." + e.code;
      var id = "e_" + full.replace(/\./g, "_");
      h += '<div class="el ' + s + (mastered[full] ? " done" : "") + '" id="' + id + '"><div class="eh" onclick="tog(this)"><span class="code">' + e.code + '</span><span class="tt">' + esc(e.title) + '</span><label class="mast" onclick="event.stopPropagation()"><input type="checkbox" ' + (mastered[full] ? "checked" : "") + ' onchange="mk(\'' + full + '\',this)">Mastered</label><span class="chev">▶</span></div><div class="eb">' + (e.html || "");
      (e.subs || []).forEach(function (sb) {
        var cls = sb.skip ? " skip" : "";
        h += '<div class="el sub open ' + s + cls + '"><div class="eh" onclick="tog(this)"><span class="code">' + e.code + sb.letter + '</span><span class="tt">' + esc(sb.title) + (sb.skip ? ' <span class="tag">— not tested for ASEL</span>' : "") + '</span><span class="chev">▶</span></div><div class="eb">' + (sb.html || "") + "</div></div>";
      });
      h += "</div></div>";
    });
  });
  if (t.qa && t.qa.length) {
    h += '<div class="sec-h"><span class="dot" style="background:var(--amber)"></span>Likely oral exam questions</div><div class="small">Tap a question to reveal the answer.</div>';
    t.qa.forEach(function (q) {
      h += '<div class="qa" onclick="this.classList.toggle(\'show\')"><div class="q">' + esc(q.q) + '</div><div class="a">' + q.a + "</div></div>";
    });
  }
  h += '<div class="pn">' + (prev ? '<button onclick="go(\'task-' + prev.key + "')\">← " + prev.code + " " + esc(prev.title) + "</button>" : "<span></span>") +
    (next ? '<button class="pri" onclick="go(\'task-' + next.key + "')\">" + next.code + " " + esc(next.title) + " →</button>" : "") + "</div>" + notice();
  app.innerHTML = h;
}

function tog(h) { h.parentNode.classList.toggle("open"); }
function expAll(o) {
  document.querySelectorAll(".el:not(.sub)").forEach(function (e) { e.classList.toggle("open", !!o); });
}
function mk(c, cb) {
  if (cb.checked) mastered[c] = 1; else delete mastered[c];
  saveM();
  var el = document.getElementById("e_" + c.replace(/\./g, "_"));
  if (el) el.classList.toggle("done", cb.checked);
}
function markAll() {
  document.querySelectorAll(".mast input").forEach(function (cb) {
    if (!cb.checked) { cb.checked = true; cb.onchange(); }
  });
}

function viewAircraft() {
  app.innerHTML = GUIDE.aircraft + notice();
}
function viewLocal() {
  app.innerHTML = GUIDE.local + notice();
}
function viewGround() {
  app.innerHTML = GUIDE.ground + notice();
}
function viewRef() {
  app.innerHTML = GUIDE.reference + notice();
}
function viewDay() {
  app.innerHTML = GUIDE.day + notice();
}

var fc = [], fi = 0;
function viewFlash() {
  fc = [];
  ALL.forEach(function (t) {
    (t.qa || []).forEach(function (q) { fc.push({ t: t, q: q }); });
  });
  fi = 0;
  drawFC();
}
function drawFC() {
  if (!fc.length) { app.innerHTML = "<h1>Oral cards</h1><p>No questions loaded.</p>"; return; }
  var item = fc[fi];
  var h = "<h1>Oral flashcards</h1><p class=\"lead\">" + fc.length + " questions drawn from the task pages. Tap the card to reveal the answer. These are study prompts, not a scored exam.</p>";
  h += '<div class="small" style="margin-bottom:8px">' + (fi + 1) + " / " + fc.length + " · " + item.t.code + " " + esc(item.t.title) + "</div>";
  h += '<div class="box flash" id="card" onclick="this.classList.toggle(\'flip\')"><div>' + esc(item.q.q) + '</div><div class="ans">' + item.q.a + "</div></div>";
  h += '<div class="toolbar"><button onclick="mvFC(-1)">Previous</button><button class="pri" onclick="mvFC(1)">Next</button><button onclick="shuffleFC()">Shuffle</button></div>' + notice();
  app.innerHTML = h;
}
function mvFC(d) { fi = (fi + d + fc.length) % fc.length; drawFC(); }
function shuffleFC() {
  for (var i = fc.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = fc[i]; fc[i] = fc[j]; fc[j] = tmp;
  }
  fi = 0; drawFC();
}

route();
setInterval(function () {
  if ((location.hash || "#home") === "#home" || location.hash === "") {
    var box = document.querySelector(".countbox");
    if (box) {
      var wrap = document.createElement("div");
      wrap.innerHTML = countdownHTML();
      box.replaceWith(wrap.firstChild);
    }
  }
}, 30000);
