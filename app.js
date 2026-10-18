const $ = selector => document.querySelector(selector);
const content = $("#content");
const modal = $("#moodboardModal");
const modalImage = $("#modalImage");
const STORE = "palmengarten-study-draft-v2";

const variants = {
  A: { mood: "assets/moodboards/moodboard-a.jpg", corporate: "assets/corporate-designs/Farben_Typo_Logoentwicklung.jpg", logo: "assets/logos/LogoEntwurf1.png", title: "Das Leben hat viele Formen", corporateTitle: "Das Leben hat viele Formen", logoTitle: "Das Leben hat viele Formen" },
  B: { mood: "assets/moodboards/moodboard-b.jpg", corporate: "assets/corporate-designs/Farben_Typo_Logoentwicklung2.jpg", logo: "assets/logos/LogoEntwurf2.2.png", title: "Hier wächst alles zusammen", corporateTitle: "Hier wächst alles zusammen", logoTitle: "Hier wächst alles zusammen" },
  C: { mood: "assets/moodboards/moodboard-c.jpg", corporate: "assets/corporate-designs/Farben_Typo_Logoentwicklung3.jpg", logo: "assets/logos/LogoEntwurf3.png", title: "Ein Ort zum Aufblühen" }
};

const questions = {
  q1: "Welche <strong>Assoziationen</strong> verbinden Sie spontan mit einer <strong>botanischen Garten- und Kultureinrichtung</strong>?",
  q2: "Welche <strong>Farben, Formen</strong> und <strong>Bilder</strong> stellen Sie sich spontan bei einer solchen <strong>botanischen Garten- und Kultureinrichtung</strong> vor?",
  q3: "Wie sollte die <strong>Gestaltung</strong> einer solchen Institution insgesamt <strong>wirken</strong>? Was wäre Ihnen bei der Gestaltung <strong>besonders wichtig</strong>?",
  q7: "Welche Farben, Formen und Bilder kommen Ihnen nach Betrachtung der Beispiele noch in den Sinn?",
  q8: "Für welche der drei Varianten würden Sie sich entscheiden und warum halten Sie diese Variante für die beste?",
  q9: "Was würden Sie an den Design-Beispielen verändern? Wie sollte das ideale Erscheinungsbild für den Palmengarten aussehen?"
};

function esc(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
}

function shuffle(list) {
  const result = [...list];
  for (let i = result.length - 1; i; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function now() {
  const date = new Date();
  const pad = n => String(n).padStart(2, "0");
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    displayDate: `${pad(date.getDate())} / ${pad(date.getMonth() + 1)} / ${date.getFullYear()}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`
  };
}

function id() {
  if (globalThis.crypto && typeof crypto.randomUUID === "function") return "PG-" + crypto.randomUUID().toUpperCase();
  return "PG-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 10).toUpperCase();
}

function newSession() {
  const time = now();
  return {
    version: "Palmengarten Designstudie 2.0",
    id: id(),
    startedAt: new Date().toISOString(),
    meta: { date: time.date, time: time.time, age: "", gender: "" },
    orders: { moodboards: shuffle(["A", "B", "C"]), corporateDesigns: shuffle(["A", "B", "C"]), logos: shuffle(["A", "B", "C"]) },
    answers: { q1: "", q2: "", q3: "", q7: "", q8: "", q8Choice: "", q9: "", moodboards: { A: "", B: "", C: "" }, corporateDesigns: { A: "", B: "", C: "" }, logos: { A: "", B: "", C: "" } }
  };
}

let session;
try {
  const saved = JSON.parse(localStorage.getItem(STORE) || "null");
  session = saved && !saved.completedAt ? saved : newSession();
} catch { session = newSession(); }
if (!session.orders.corporateDesigns) session.orders.corporateDesigns = shuffle(["A", "B", "C"]);
if (!session.answers.corporateDesigns) session.answers.corporateDesigns = { A: "", B: "", C: "" };
let step = 0;
let lastMinute = "";

function save() { localStorage.setItem(STORE, JSON.stringify(session)); }
function tick() {
  const time = now();
  if (`${time.date} ${time.time}` === lastMinute) return;
  lastMinute = `${time.date} ${time.time}`;
  session.meta.date = time.date;
  session.meta.time = time.time;
  if ($("#date")) $("#date").value = time.displayDate;
  if ($("#time")) $("#time").value = time.time;
  save();
}

function sequence() {
  return [
    { type: "intro" },
    ...["q1", "q2", "q3"].map(key => ({ type: "question", key })),
    ...session.orders.moodboards.map(id => ({ type: "material", group: "moodboards", id })),
    ...session.orders.corporateDesigns.map(id => ({ type: "material", group: "corporateDesigns", id })),
    ...session.orders.logos.map(id => ({ type: "material", group: "logos", id })),
    ...["q7", "q8", "q9"].map(key => ({ type: "question", key })),
    { type: "finish" }
  ];
}

function overview() {
  return '<div class="overview">' + ["A", "B", "C"].map(key => {
    const variant = variants[key];
    return '<article class="variant"><div class="variant__title">Variante ' + key + '</div><img class="zoom-image" src="' + variant.mood + '" data-source="' + variant.mood + '" alt="Moodboard ' + key + '"><img class="zoom-image variant__logo variant__logo--' + key.toLowerCase() + '" src="' + variant.logo + '" data-source="' + variant.logo + '" alt="Logoentwurf ' + key + '"></article>';
  }).join("") + '</div>';
}

function intro() {
  const time = now();
  return '<section class="slide slide--active intro"><div class="eyebrow">Willkommen</div><h1>Designstudie<br>Bachelorarbeit</h1><p class="lede">Vielen Dank für Ihre Teilnahme. In dieser Studie werden Sie zu drei Moodboards, drei Corporate-Design-Ansätzen und drei Logoansätzen bezüglich Ihrer Wahrnehmung und Ihren Assoziationen befragt. Antworten Sie gerne ausführlich auf die Ihnen präsentierten Fragen. Die Angaben werden nur auf Ihrem Gerät gespeichert und am Ende als Datei heruntergeladen. Die Ergebnisse sollten an die testende Person per E-Mail gesendet werden.<br>selina.baerwald@mni.thm.de</p><div class="meta"><div class="field"><label>Probanden-Nr.</label><input value="' + esc(session.id) + '" readonly></div><div class="field"><label>Datum</label><input id="date" value="' + time.displayDate + '" readonly></div><div class="field"><label>Uhrzeit</label><input id="time" value="' + time.time + '" readonly></div><div class="field"><label>Geschlecht / Selbstbeschreibung (optional)</label><input id="gender" value="' + esc(session.meta.gender) + '"></div><div class="field"><label>Alter (optional)</label><input id="age" value="' + esc(session.meta.age) + '"></div></div></section>';
}

function question(item) {
  const choice = item.key === "q8" ? '<div class="field"><label>Ausgewählte Variante</label><select id="choice"><option value="">Bitte wählen</option>' + ["A","B","C"].map(id => '<option value="' + id + '" ' + (session.answers.q8Choice === id ? "selected" : "") + '>Variante ' + id + '</option>').join("") + '</select></div>' : "";
  const reference = ["q8", "q9"].includes(item.key) ? overview() : "";
  return '<section class="slide slide--active question"><div class="eyebrow">Frage</div><h2>' + questions[item.key] + '</h2>' + reference + choice + '<div class="field"><label>Ihre Antwort</label><textarea id="answer" placeholder="Antwort hier festhalten …">' + esc(session.answers[item.key]) + '</textarea></div></section>';
}

function material(item) {
  const variant = variants[item.id];
  const mood = item.group === "moodboards";
  const corporate = item.group === "corporateDesigns";
  const order = session.orders[item.group].indexOf(item.id) + 1;
  const source = mood ? variant.mood : corporate ? variant.corporate : variant.logo;
  const kind = mood ? "Moodboard" : corporate ? "Corporate Design" : "Logoentwurf";
  const prompt = mood ? "Welche Stimmung vermittelt Ihnen dieses Moodboard? Welche Farben, Formen und Bilder sprechen Sie am ehesten an – und warum?" : corporate ? "Wie wirkt dieser Gestaltungsansatz auf Sie?<br>Welche spontanen Begriffe oder Assoziationen verbinden Sie mit dieser Gestaltung?<br>Halten Sie Ihre Gedanken fest.<br><br>Schauen Sie sich den Ansatz noch einmal an.<br>Welche <strong>Elemente</strong> prägen Ihren Eindruck von dieser Variante besonders? Bitte gehen Sie, wenn möglich, auf <strong>Logoform, Farben, Schrift</strong> und die Wirkung ein." : "Wie spricht Sie dieser Logoentwurf persönlich an? Beschreiben Sie gerne Farbe, Form, Schrift, Anmutung und Assoziationen.";
  const visual = '<div class="visual visual--asset' + (!mood && !corporate && item.id === "B" ? " visual--logo-b" : "") + '"><img class="zoom-image" src="' + source + '" data-source="' + source + '" alt="' + kind + ' ' + item.id + '"><button class="zoom-button" data-source="' + source + '">Vollbild ansehen</button></div>';
  const title = corporate && variant.corporateTitle ? variant.corporateTitle : !mood && variant.logoTitle ? variant.logoTitle : variant.title;
  const heading = corporate ? "Corporate-Design-Ansätze" : title;
  const help = corporate ? 'Hier sehen Sie eines der Beispiele zu möglichen Corporate-Design-Ansätzen der Varianten aus den Moodboards. Es ist <strong>jeweils ein Logo</strong> (Variationen) mit <strong>Farben und Schriften</strong> zu sehen.<br><br>Variante ' + item.id + ': ' + title + '.' : 'Klicken Sie auf das Bild oder „Vollbild ansehen“, um es vollständig zu sehen.';
  return '<section class="slide slide--active material ' + (mood ? "mood-page" : "") + '">' + visual + '<aside class="panel"><div><div class="counter">' + kind + " · " + order + ' / 3</div><h2>' + heading + '</h2><p class="help">' + help + '</p></div><div><label class="eyebrow">' + prompt + '</label><textarea id="materialAnswer" placeholder="Antwort hier festhalten …">' + esc(session.answers[item.group][item.id]) + '</textarea></div></aside></section>';
}

function finish() {
  return '<section class="slide slide--active finish"><div class="eyebrow">Vielen Dank</div><h1>Ihre Antworten<br>sind bereit.</h1><p class="lede">Bitte laden Sie jetzt Ihre persönliche Antwortdatei herunter und schicken Sie diese per E-Mail an selina.baerwald@mni.thm.de </p><button id="download" class="download">Antwortdatei herunterladen (.json)</button><p class="note">Die Datei enthält Ihre Antworten und die zufällige Reihenfolge der Varianten.</p></section>';
}

function bind(item) {
  document.querySelectorAll(".zoom-image, .zoom-button").forEach(element => element.onclick = () => openModal(element.dataset.source));
  if (item.type === "intro") ["age", "gender"].forEach(key => $("#" + key).oninput = event => { session.meta[key] = event.target.value; save(); });
  if (item.type === "question") {
    $("#answer").oninput = event => { session.answers[item.key] = event.target.value; save(); };
    if ($("#choice")) $("#choice").onchange = event => { session.answers.q8Choice = event.target.value; save(); };
  }
  if (item.type === "material") $("#materialAnswer").oninput = event => { session.answers[item.group][item.id] = event.target.value; save(); };
  if (item.type === "finish") $("#download").onclick = download;
}

function render() {
  const all = sequence();
  const item = all[step];
  $("#progress").textContent = `${step + 1} / ${all.length}`;
  $("#back").disabled = step === 0;
  $("#next").hidden = item.type === "finish";
  content.innerHTML = item.type === "intro" ? intro() : item.type === "question" ? question(item) : item.type === "material" ? material(item) : finish();
  bind(item);
}

function openModal(source) {
  modalImage.src = source;
  modal.showModal();
}

function closeModal() {
  modal.close();
  modalImage.removeAttribute("src");
}

function download() {
  session.completedAt = new Date().toISOString();
  save();
  const blob = new Blob([JSON.stringify(session, null, 2)], {type: "application/json"});
  const link = Object.assign(document.createElement("a"), {href: URL.createObjectURL(blob), download: "palmengarten-studie_" + session.id + ".json"});
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

$("#back").onclick = () => { if (step) { step--; render(); } };
$("#next").onclick = () => { if (step < sequence().length - 1) { step++; render(); } };
$("#closeModal").onclick = closeModal;
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
modal.addEventListener("cancel", event => { event.preventDefault(); closeModal(); });

tick();
setInterval(tick, 10000);
render();
