const IC = {
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.200 8.200 0 0 1-4.200-1.150l-.3-.18-3 .78.800-2.900-.2-.3A8.200 8.200 0 1 1 12 20.200zm4.500-6.100c-.25-.120-1.470-.720-1.700-.800s-.39-.120-.56.120-.64.800-.79.970-.29.180-.540.060a6.700 6.700 0 0 1-2-1.230 7.400 7.400 0 0 1-1.370-1.700c-.140-.250 0-.380.110-.500s.250-.290.370-.430a1.700 1.700 0 0 0 .25-.410.460.460 0 0 0 0-.430c-.060-.120-.560-1.340-.760-1.840s-.400-.420-.560-.430h-.480a.920.920 0 0 0-.660.310 2.800 2.800 0 0 0-.870 2.070 4.800 4.800 0 0 0 1 2.560 11 11 0 0 0 4.200 3.720c.590.250 1.050.400 1.400.520a3.400 3.400 0 0 0 1.550.100 2.540 2.540 0 0 0 1.660-1.170 2 2 0 0 0 .140-1.170c-.060-.110-.220-.170-.470-.290z"/></svg>',
  tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.900v3a2 2 0 0 1-2.200 2 19.800 19.800 0 0 1-8.600-3.100 19.500 19.500 0 0 1-6-6A19.800 19.800 0 0 1 2.100 4.200 2 2 0 0 1 4.100 2h3a2 2 0 0 1 2 1.700c.1 1 .4 1.900.7 2.800a2 2 0 0 1-.5 2.100L8.100 9.900a16 16 0 0 0 6 6l1.300-1.300a2 2 0 0 1 2.100-.4c.9.300 1.800.6 2.800.7a2 2 0 0 1 1.700 2z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.500" cy="6.500" r=".8" fill="currentColor"/></svg>',
  logo: '<svg viewBox="0 0 34 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1 18l9-13 5 7 4-5 14 11"/></svg>',
};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const waLink = (t = "Здравствуйте! Хочу узнать о свободных домиках на базе отдыха «Яры».") => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(t)}`;
const money = n => n.toLocaleString("ru-RU").replace(/,/g, " ") + " ₸";
const priceHtml = h => h.prices
  ? `<div class="price"><b>от ${money(Math.min(...h.prices))}</b><small>за сутки, весь домик</small></div>`
  : `<div class="price"><b>По запросу</b><small>цену уточняйте</small></div>`;

function chips(h) {
  const c = [h.guestsText, h.floors === 2 ? "2 этажа" : "1 этаж"];
  if (h.hot) c.push("Горячая вода");
  if (h.shower) c.push("Душ");
  if (h.view) c.push("Вид на залив");
  return c.map(x => `<span class="chip">${x}</span>`).join("");
}
function card(h) {
  const pr = h.prices ? `от ${money(Math.min(...h.prices))} / сутки` : "цена по запросу";
  return `<a class="card reveal" href="house.html?id=${h.id}"><img src="${h.imgs[0]}" alt="Домик №${h.id}" loading="lazy">
    <div class="card-ov"><span class="num">№ ${h.id}</span><h3>${h.title}</h3><span class="g">${h.guestsText}</span>
    <span class="extra"><span>${pr}</span><span class="more">Подробнее</span></span></div></a>`;
}

// ---------- выбор домика: номера + фото + описание
function picker(el, startId) {
  let h, k = 0;
  el.innerHTML = `<div class="pick-nums">${HOUSES.map(x => `<button data-id="${x.id}"><b>№ ${x.id}</b><small>${x.guestsText}</small></button>`).join("")}</div>
    <div class="pick-view"><div class="pick-photo"><img alt="Фото домика"><button class="pp" aria-label="Предыдущее фото">‹</button><button class="pn" aria-label="Следующее фото">›</button><span class="pc"></span></div>
    <div class="pick-info"></div></div>`;
  const img = $(".pick-photo img", el);
  const photo = i => { k = (i + h.imgs.length) % h.imgs.length; img.src = h.imgs[k]; $(".pc", el).textContent = `${k + 1} / ${h.imgs.length}`; $$(".pick-thumbs img", el).forEach((t, j) => t.classList.toggle("on", j === k)); };
  const pick = id => {
    h = HOUSES.find(x => x.id == id);
    $$(".pick-nums button", el).forEach(b => b.classList.toggle("on", b.dataset.id == id));
    const msg = `Здравствуйте! Хочу забронировать домик №${h.id} на базе отдыха «Яры». Подскажите, пожалуйста, свободные даты и цену.`;
    $(".pick-info", el).innerHTML = `<span class="eyebrow">Домик № ${h.id}</span><h3>${h.title}</h3><p>${h.short}</p><div class="chips">${chips(h)}</div>
      <div class="pick-thumbs">${h.imgs.map((s, i) => `<img src="${s}" data-i="${i}" alt="Фото ${i + 1}" loading="lazy">`).join("")}</div>
      <div class="pick-btns"><a class="btn btn-sun" href="house.html?id=${h.id}">Подробнее</a><a class="btn btn-wa" href="${waLink(msg)}" target="_blank" rel="noopener">${IC.wa}Забронировать</a></div>`;
    $$(".pick-thumbs img", el).forEach(t => t.onclick = () => photo(+t.dataset.i));
    photo(0);
  };
  $$(".pick-nums button", el).forEach(b => b.onclick = () => pick(b.dataset.id));
  $(".pp", el).onclick = () => photo(k - 1); $(".pn", el).onclick = () => photo(k + 1);
  img.onclick = () => openLb(h.imgs, k);
  pick(startId || HOUSES[0].id);
}

// ---------- header / footer / floating buttons
function chrome() {
  const page = document.body.dataset.page.replace(/^house$/, "houses");
  const nav = [["index", "Главная"], ["houses", "Домики"], ["gallery", "Галерея"], ["location", "Как проехать"], ["contacts", "Контакты"]];
  const logo = `<a class="logo" href="index.html"><span class="logo-mark">${IC.logo}</span><b>ЯРЫ</b><small>база отдыха</small></a>`;
  const dd = `<div class="dd"><div class="dd-grid">${HOUSES.map(h => `<a href="house.html?id=${h.id}"><img src="${h.imgs[0]}" alt="" loading="lazy"><span><b>Домик № ${h.id}</b><small>${h.guestsText} · ${h.floors === 2 ? "2 этажа" : "1 этаж"}</small></span></a>`).join("")}</div><a class="dd-all" href="houses.html">Смотреть все домики →</a></div>`;
  const hdr = $("#hdr");
  hdr.innerHTML = `<div class="wrap"><nav class="nav">${nav.map(([p, t]) => { const a = `<a href="${p}.html" class="${p === page ? "on" : ""}">${t}</a>`; return p === "houses" ? `<span class="dd-wrap">${a}${dd}</span>` : a; }).join("")}</nav>
    ${logo}<div class="hdr-cta"><a class="hdr-tel" href="tel:${SITE.phone}">${SITE.phoneText}</a>
    <a class="btn btn-sun btn-sm" href="${waLink()}" target="_blank" rel="noopener">Забронировать</a></div></div>`;
  const onScroll = () => hdr.classList.toggle("solid", scrollY > 60);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  $("#ftr").innerHTML = `<div class="wrap"><div class="ftr-grid">
    <div>${logo}<p style="margin-top:18px;max-width:38ch">База отдыха на берегу Бухтарминского водохранилища, в 6 км от посёлка Новая Бухтарма, Восточно-Казахстанская область.</p></div>
    <div><h3>Разделы</h3>${nav.map(([p, t]) => `<a href="${p}.html">${t}</a>`).join("")}</div>
    <div><h3>Бронирование</h3><a href="tel:${SITE.phone}">${SITE.phoneText}</a><a href="${waLink()}" target="_blank" rel="noopener">Написать в WhatsApp</a><a href="${SITE.insta}" target="_blank" rel="noopener">Instagram @baza_buhtarma</a></div>
    </div><div class="copy">© ${new Date().getFullYear()} База отдыха «Яры». Правильное место для хорошего отдыха.</div></div>`;

  document.body.insertAdjacentHTML("beforeend", `<div class="fab">
    <a class="t" href="tel:${SITE.phone}" aria-label="Позвонить">${IC.tel}</a>
    <a class="w" href="${waLink()}" target="_blank" rel="noopener" aria-label="Написать в WhatsApp">${IC.wa}</a></div>`);

  // универсальные ссылки и иконки
  $$("[data-wa]").forEach(a => { a.href = waLink(a.dataset.wa || undefined); a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-tel]").forEach(a => { a.href = "tel:" + SITE.phone; if (a.dataset.tel === "text") a.textContent = SITE.phoneText; });
  $$("[data-ic]").forEach(e => e.insertAdjacentHTML("afterbegin", IC[e.dataset.ic]));
}

// ---------- lightbox
function lightbox() {
  document.body.insertAdjacentHTML("beforeend", `<div class="lb"><button class="x" aria-label="Закрыть">✕</button><button class="p" aria-label="Назад">‹</button><img alt=""><button class="n" aria-label="Вперёд">›</button><span class="cnt"></span></div>`);
  const lb = $(".lb"), img = $("img", lb); let list = [], i = 0;
  const show = k => { i = (k + list.length) % list.length; img.src = list[i]; $(".cnt", lb).textContent = `${i + 1} / ${list.length}`; };
  window.openLb = (arr, k = 0) => { list = arr; show(k); lb.classList.add("show"); };
  const close = () => lb.classList.remove("show");
  $(".x", lb).onclick = close; $(".p", lb).onclick = () => show(i - 1); $(".n", lb).onclick = () => show(i + 1);
  lb.onclick = e => { if (e.target === lb) close(); };
  document.addEventListener("keydown", e => { if (!lb.classList.contains("show")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); });
}

function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .08 });
  $$(".reveal:not(.in)").forEach(el => io.observe(el));
}

// ---------- pages
const PAGES = {
  index() {
    picker($("#pick"));
    const q = $("#quick"), today = new Date().toISOString().slice(0, 10);
    $("#q-in").min = $("#q-out").min = today;
    q.onsubmit = e => {
      e.preventDefault();
      const d = s => s ? s.split("-").reverse().join(".") : "", i = $("#q-in").value, o = $("#q-out").value, g = $("#q-g").value;
      const t = ["Здравствуйте! Хочу забронировать домик на базе отдыха «Яры».", i && `Даты: ${d(i)}${o ? " – " + d(o) : ""}`, g && "Гостей: " + g, "Подскажите, пожалуйста, свободные варианты и цену."].filter(Boolean).join("\n");
      window.open(waLink(t), "_blank", "noopener");
    };
  },

  houses() {
    const F = { all: () => true, small: h => h.guests <= 4, big: h => h.guests >= 5, two: h => h.floors === 2, shower: h => h.shower, hot: h => h.hot, view: h => h.view };
    const draw = k => { $("#list").innerHTML = HOUSES.filter(F[k]).map(card).join(""); reveal(); };
    $$(".filters button").forEach(b => b.onclick = () => { $$(".filters button").forEach(x => x.classList.toggle("on", x === b)); draw(b.dataset.f); });
    draw("all");
    picker($("#pick"));
  },

  house() {
    const h = HOUSES.find(x => x.id == new URLSearchParams(location.search).get("id")) || HOUSES[0];
    document.title = `Домик №${h.id} — база отдыха «Яры»`;
    const water = h.water || (h.hot ? "Горячая и холодная вода" : "Холодная вода");
    const msg = `Здравствуйте! Хочу забронировать домик №${h.id} на базе отдыха «Яры». Подскажите, пожалуйста, свободные даты и цену.`;
    const prices = h.prices
      ? `<h3>Цены за сутки</h3><table class="ptable">${SEASONS.map((s, i) => `<tr><td>${s}</td><td>${money(h.prices[i])}</td></tr>`).join("")}</table>
         <p class="note">${h.discount ? "При бронировании от 7 дней — скидка. " : ""}Актуальную цену на ваши даты уточняйте при бронировании.</p>`
      : `<h3>Цена</h3><p class="note" style="margin-top:8px">Стоимость зависит от дат заезда — напишите или позвоните, ответим сразу.</p>`;
    const head = $("#house-head");
    head.style.backgroundImage = `url(${h.imgs[0]})`;
    head.innerHTML = `<div class="wrap"><div class="crumbs"><a href="index.html">Главная</a> / <a href="houses.html">Домики</a> / №${h.id}</div>
      <span class="eyebrow">Домик № ${h.id}</span><h1>${h.title}</h1></div>`;
    const ix = HOUSES.indexOf(h), prev = HOUSES[(ix - 1 + HOUSES.length) % HOUSES.length], next = HOUSES[(ix + 1) % HOUSES.length];
    $("#house").innerHTML = `
      <div class="hswitch"><a class="arr" href="house.html?id=${prev.id}" aria-label="Предыдущий домик">‹</a>
        <div class="hs-nums">${HOUSES.map(x => `<a href="house.html?id=${x.id}" class="${x === h ? "on" : ""}">№ ${x.id}</a>`).join("")}</div>
        <a class="arr" href="house.html?id=${next.id}" aria-label="Следующий домик">›</a></div>
      <div class="house"><div>
        <div class="gal-main"><img id="mainimg" src="${h.imgs[0]}" alt="Домик №${h.id}"></div>
        <div class="thumbs">${h.imgs.map((s, i) => `<img src="${s}" alt="Фото ${i + 1}" class="${i ? "" : "on"}" data-i="${i}" loading="lazy">`).join("")}</div>
        <div class="desc"><h3>Что в домике</h3><ul class="ticks">${[...h.rooms, h.wc, water, "Спутниковое ТВ", "Мангал"].map(x => `<li>${x}</li>`).join("")}</ul></div>
      </div>
      <aside class="panel"><p class="lead" style="font-size:1rem">${h.short}</p>
        <div class="specs"><div><span>Вместимость</span><b>${h.guestsText}</b></div><div><span>Этажей</span><b>${h.floors}</b></div>
        <div><span>Вода</span><b>${h.hot ? "Горячая и холодная" : "Холодная"}</b></div><div><span>${h.year ? "Год постройки" : "Душ"}</span><b>${h.year || (h.shower ? "Есть" : "Нет")}</b></div></div>
        ${prices}
        <a class="btn btn-wa" href="${waLink(msg)}" target="_blank" rel="noopener">${IC.wa}Забронировать в WhatsApp</a>
        <a class="btn btn-pine" href="tel:${SITE.phone}">${IC.tel}${SITE.phoneText}</a>
      </aside></div>`;
    const hs = $(".hs-nums"), on = $(".hs-nums a.on");
    hs.scrollLeft = on.offsetLeft - hs.offsetLeft - (hs.clientWidth - on.offsetWidth) / 2;
    let cur = 0;
    const set = i => { cur = i; $("#mainimg").src = h.imgs[i]; $$(".thumbs img").forEach((t, k) => t.classList.toggle("on", k === i)); };
    $$(".thumbs img").forEach(t => t.onclick = () => set(+t.dataset.i));
    $(".gal-main").onclick = () => openLb(h.imgs, cur);
    $("#others").innerHTML = HOUSES.filter(x => x.id !== h.id).slice(0, 3).map(card).join("");
  },

  gallery() {
    const items = [{ s: "img/view.jpg", c: "Вид на залив", g: "base" }, { s: "img/aerial.jpg", c: "База с высоты", g: "base" }, { s: "img/h12-5.jpg", c: "Зона отдыха", g: "base" }];
    HOUSES.forEach(h => h.imgs.forEach((s, i) => { if (s !== "img/h12-5.jpg") items.push({ s, c: "Домик №" + h.id, g: i ? "in" : "out", h: h.id }); }));
    $(".filters").insertAdjacentHTML("beforeend", HOUSES.map(h => `<button data-f="h${h.id}">№ ${h.id}</button>`).join(""));
    const draw = k => {
      const list = items.filter(x => k === "all" || x.g === k || (k === "out" && x.g === "base") || k === "h" + x.h);
      $("#gal").innerHTML = list.map((x, i) => `<figure data-i="${i}"><img src="${x.s}" alt="${x.c}" loading="lazy"><figcaption>${x.c}</figcaption></figure>`).join("");
      $$("#gal figure").forEach(f => f.onclick = () => openLb(list.map(x => x.s), +f.dataset.i));
    };
    $$(".filters button").forEach(b => b.onclick = () => { $$(".filters button").forEach(x => x.classList.toggle("on", x === b)); draw(b.dataset.f); });
    draw("all");
  },

  location() { $$("[data-zoom]").forEach(im => im.onclick = () => openLb([im.src])); $("#maps").href = SITE.maps; },

  contacts() {
    const sel = $("#f-house");
    sel.innerHTML = `<option value="">Подскажите подходящий</option>` + HOUSES.map(h => `<option value="${h.id}">№${h.id} — ${h.guestsText}</option>`).join("");
    const today = new Date().toISOString().slice(0, 10);
    $("#f-in").min = $("#f-out").min = today;
    $("#book").onsubmit = e => {
      e.preventDefault();
      const v = id => $("#" + id).value.trim(), d = s => s ? s.split("-").reverse().join(".") : "";
      const t = ["Здравствуйте! Хочу забронировать домик на базе отдыха «Яры».", v("f-name") && "Имя: " + v("f-name"),
        v("f-in") && `Даты: ${d(v("f-in"))}${v("f-out") ? " – " + d(v("f-out")) : ""}`, v("f-guests") && "Гостей: " + v("f-guests"),
        v("f-house") && "Домик: №" + v("f-house"), v("f-msg") && "Комментарий: " + v("f-msg")].filter(Boolean).join("\n");
      window.open(waLink(t), "_blank", "noopener");
    };
  },
};

document.addEventListener("DOMContentLoaded", () => {
  chrome(); lightbox();
  PAGES[document.body.dataset.page]?.();
  reveal();
});
