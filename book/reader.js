(function () {
  const STORAGE_KEY = "woa-book-progress";
  const PATH_STORAGE_KEY = "woa-book-path";
  const TYPE_STORAGE_KEY = "woa-book-type";
  const WORDS_PER_MIN = 230;
  const navList = document.getElementById("nav-list");
  const content = document.getElementById("book-content");
  const partCount = document.getElementById("part-count");
  const sectionTimeEl = document.getElementById("section-reading-time");
  const sectionBar = document.getElementById("book-section-bar");
  const sectionStatsEl = document.getElementById("book-section-stats");
  const copyLinkBtn = document.getElementById("book-copy-link");
  const printSectionBtn = document.getElementById("book-print-section");
  const downloadSectionBtn = document.getElementById("book-download-section");
  const shortcutsBtn = document.getElementById("book-shortcuts-btn");
  const shortcutsDialog = document.getElementById("book-shortcuts");
  const shortcutsCloseBtn = document.getElementById("book-shortcuts-close");
  const navToggle = document.getElementById("book-nav-toggle");
  const bookNav = document.getElementById("book-nav");
  const titleEl = document.getElementById("book-title");
  const subtitleEl = document.getElementById("book-subtitle");
  const progressBar = document.getElementById("book-progress-bar");
  const pagerEl = document.getElementById("book-pager");
  const nextEl = document.getElementById("book-next");

  const SITE_ORIGIN = "https://ascendism.github.io";
  const OG_IMAGE = SITE_ORIGIN + "/assets/window_banner.png";
  const BOOK_BRAND = "Window of Ascent";

  const READING_PATHS = [
    {
      id: "two-doors",
      label: "Two doors",
      steps: [
        { id: "audience-pleas", reason: "Permission slips before the shared argument." },
        { id: "introduction", reason: "The narrowing window — where the thesis lands." },
        { id: "chapter-01", reason: "Name what you are actually trying to build." },
      ],
    },
    {
      id: "skeptics",
      label: "Skeptics",
      steps: [
        { id: "chapter-08", reason: "Honest objections first." },
        { id: "chapter-04", reason: "Why society blames tools instead of design." },
        { id: "chapter-03", reason: "Tools are neutral; incentives are not." },
      ],
    },
    {
      id: "infrastructure",
      label: "Infrastructure",
      steps: [
        { id: "chapter-05", reason: "Data centers, farms, and the same extraction pattern." },
        { id: "chapter-03", reason: "Follow the incentives underneath." },
        { id: "chapter-10", reason: "Why this era is temporary." },
      ],
    },
    {
      id: "action",
      label: "Action",
      steps: [
        { id: "appendix-c", reason: "Twelve-month ascent plan." },
        { id: "appendix-a", reason: "Filter tools before you execute." },
        { id: "appendix-b", reason: "Thirty practical use cases for skeptics." },
      ],
    },
  ];

  const SKIP_RECOMMEND = new Set([
    "title-page",
    "copyright",
    "dedication",
    "table-of-contents",
    "acknowledgments",
    "colophon",
  ]);

  let manifest = null;
  let navMedia = null;
  let searchIndex = null;
  let activePathId = null;
  let currentPartId = null;
  let shortcutsApi = null;

  function pathById(id) {
    return READING_PATHS.find(function (p) {
      return p.id === id;
    });
  }

  function pathFromQuery() {
    const id = new URLSearchParams(location.search).get("path");
    return id && pathById(id) ? id : null;
  }

  function pathFromStorage() {
    try {
      const id = sessionStorage.getItem(PATH_STORAGE_KEY);
      return id && pathById(id) ? id : null;
    } catch (err) {
      return null;
    }
  }

  function getActivePath() {
    return activePathId ? pathById(activePathId) : null;
  }

  function setActivePathId(id, keepHash) {
    activePathId = id && pathById(id) ? id : null;
    const url = new URL(location.href);
    if (activePathId) {
      url.searchParams.set("path", activePathId);
      try {
        sessionStorage.setItem(PATH_STORAGE_KEY, activePathId);
      } catch (err) {
        /* ignore */
      }
    } else {
      url.searchParams.delete("path");
      try {
        sessionStorage.removeItem(PATH_STORAGE_KEY);
      } catch (err) {
        /* ignore */
      }
    }
    if (keepHash !== false && location.hash) {
      url.hash = location.hash;
    }
    history.replaceState(null, "", url.pathname + url.search + url.hash);
    setupReadingPaths();
    renderPathProgress(partFromHash() || (manifest && manifest.parts[0] && manifest.parts[0].id));
  }

  function pathStepIndex(path, partId) {
    return path.steps.findIndex(function (step) {
      return step.id === partId;
    });
  }

  function pathHref(path, stepId) {
    return "?path=" + encodeURIComponent(path.id) + "#" + stepId;
  }

  function setPartHash(partId) {
    const url = new URL(location.href);
    url.hash = partId;
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }

  function stripFrontMatter(md) {
    if (!md.startsWith("---")) return md;
    const end = md.indexOf("\n---", 3);
    if (end === -1) return md;
    return md.slice(end + 4).replace(/^\s+/, "");
  }

  function parseHash() {
    const raw = location.hash.replace(/^#/, "");
    if (!raw) return { partId: null, targetId: null };
    if (!manifest || !manifest.parts) {
      return { partId: raw, targetId: null };
    }

    const sorted = manifest.parts.slice().sort(function (a, b) {
      return b.id.length - a.id.length;
    });

    for (let i = 0; i < sorted.length; i++) {
      const part = sorted[i];
      if (raw === part.id) {
        return { partId: part.id, targetId: null };
      }
      if (raw.indexOf(part.id + "-") === 0) {
        return { partId: part.id, targetId: raw };
      }
    }

    return { partId: raw, targetId: null };
  }

  function partFromHash() {
    return parseHash().partId;
  }

  function slugifyHeading(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function enhanceHeadings(container, partId) {
    if (!container || !partId) return;

    container.querySelectorAll("h2, h3").forEach(function (heading) {
      const slug = slugifyHeading(heading.textContent);
      if (!slug) return;

      const id = partId + "-" + slug;
      heading.id = id;

      const anchor = document.createElement("a");
      anchor.className = "book-heading-anchor";
      anchor.href = "#" + id;
      anchor.setAttribute("aria-label", "Link to this heading");
      anchor.textContent = "#";
      heading.appendChild(anchor);
    });
  }

  function scrollToTarget(targetId) {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (!el) return;
    window.requestAnimationFrame(function () {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function shortTitle(title) {
    return title
      .replace(/^Chapter \d+ — /, "Ch. ")
      .replace(/^Introduction — /, "Intro · ")
      .replace(/^Appendix ([A-C]) — /, "App. $1 · ");
  }

  function readingTimeMinutes(words) {
    return Math.max(1, Math.ceil((words || 0) / WORDS_PER_MIN));
  }

  function formatDurationMinutes(min) {
    const rounded = Math.max(1, Math.ceil(min || 0));
    const hours = Math.floor(rounded / 60);
    const rem = rounded % 60;
    if (hours < 1) return "~" + rounded + " min";
    if (rem === 0) return "~" + hours + " hr";
    return "~" + hours + " hr " + rem + " min";
  }

  function remainingBookMinutes(parts, fromIndex) {
    const words = parts.slice(fromIndex).reduce(function (sum, part) {
      return sum + (part.words || 0);
    }, 0);
    return readingTimeMinutes(words);
  }

  function renderSectionStats(part, index, total) {
    if (!sectionStatsEl || !sectionBar) return;
    const here = readingTimeMinutes(part.words || 0);
    const left = remainingBookMinutes(manifest.parts, index);
    sectionStatsEl.textContent =
      "Section " +
      (index + 1) +
      " of " +
      total +
      " · " +
      here +
      " min here · " +
      formatDurationMinutes(left) +
      " left";
  }

  function readTypeScale() {
    try {
      const val = localStorage.getItem(TYPE_STORAGE_KEY);
      return val === "sm" || val === "lg" ? val : "md";
    } catch (err) {
      return "md";
    }
  }

  function applyTypeScale(scale) {
    const root = document.documentElement;
    root.classList.remove("book-type--sm", "book-type--lg");
    if (scale === "sm") root.classList.add("book-type--sm");
    if (scale === "lg") root.classList.add("book-type--lg");

    ["sm", "md", "lg"].forEach(function (size) {
      const btn = document.getElementById("book-type-" + size);
      if (!btn) return;
      btn.setAttribute("aria-pressed", size === scale ? "true" : "false");
    });

    try {
      localStorage.setItem(TYPE_STORAGE_KEY, scale);
    } catch (err) {
      /* ignore */
    }
  }

  function setupTypeControls() {
    applyTypeScale(readTypeScale());
    ["sm", "md", "lg"].forEach(function (size) {
      const btn = document.getElementById("book-type-" + size);
      if (!btn) return;
      btn.addEventListener("click", function () {
        applyTypeScale(size);
      });
    });
  }

  function formatReadingTime(words) {
    const min = readingTimeMinutes(words);
    return min + " min read";
  }

  function totalReadingTime(parts) {
    const words = parts.reduce(function (sum, part) {
      return sum + (part.words || 0);
    }, 0);
    const min = readingTimeMinutes(words);
    const hours = Math.floor(min / 60);
    const rem = min % 60;
    if (hours < 1) return "~" + min + " min";
    if (rem === 0) return "~" + hours + " hr";
    return "~" + hours + " hr " + rem + " min";
  }

  function saveProgress(partId) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ id: partId, at: Date.now() })
      );
    } catch (err) {
      /* ignore quota / private mode */
    }
  }

  function readProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data && data.id ? data : null;
    } catch (err) {
      return null;
    }
  }

  function isMobileNav() {
    return navMedia && navMedia.matches;
  }

  function setNavOpen(open) {
    if (!bookNav || !navToggle) return;
    bookNav.classList.toggle("book-nav--open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.textContent = open ? "Hide contents" : "Contents";
  }

  function setupNavToggle() {
    if (!navToggle || !bookNav) return;

    navMedia = window.matchMedia("(max-width: 51.99rem)");
    navToggle.hidden = false;

    function syncNavMode() {
      if (!isMobileNav()) {
        bookNav.classList.remove("book-nav--open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "Contents";
        return;
      }
      setNavOpen(bookNav.classList.contains("book-nav--open"));
    }

    navToggle.addEventListener("click", function () {
      setNavOpen(!bookNav.classList.contains("book-nav--open"));
    });

    navList.addEventListener("click", function (e) {
      if (isMobileNav() && e.target.closest("a")) {
        setNavOpen(false);
      }
    });

    if (navMedia.addEventListener) {
      navMedia.addEventListener("change", syncNavMode);
    } else {
      navMedia.addListener(syncNavMode);
    }
    syncNavMode();
  }

  async function loadManifest() {
    const res = await fetch("read/manifest.json");
    if (!res.ok) throw new Error("manifest.json not found — run scripts/build-book-site.ps1");
    return res.json();
  }

  async function loadSearchIndex() {
    try {
      const res = await fetch("read/search-index.json");
      if (!res.ok) return null;
      return res.json();
    } catch (err) {
      return null;
    }
  }

  function tokenizeQuery(q) {
    return q
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(function (t) {
        return t.length >= 2;
      });
  }

  function matchesPart(part, tokens) {
    const hay = (part.title + " " + part.excerpt + " " + part.text).toLowerCase();
    return tokens.every(function (t) {
      return hay.indexOf(t) >= 0;
    });
  }

  function highlightSnippet(text, tokens) {
    const lower = text.toLowerCase();
    const idx = tokens
      .map(function (t) {
        return lower.indexOf(t);
      })
      .filter(function (i) {
        return i >= 0;
      })
      .sort(function (a, b) {
        return a - b;
      })[0];
    if (idx < 0) return text.slice(0, 120) + (text.length > 120 ? "…" : "");
    const start = Math.max(0, idx - 40);
    let snip = text.slice(start, start + 140).trim();
    if (start > 0) snip = "…" + snip;
    if (start + 140 < text.length) snip += "…";
    tokens.forEach(function (t) {
      const re = new RegExp(
        "(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")",
        "gi"
      );
      snip = snip.replace(re, "<mark>$1</mark>");
    });
    return snip;
  }

  function searchParts(query) {
    if (!searchIndex || !searchIndex.parts) return [];
    const tokens = tokenizeQuery(query);
    if (!tokens.length) return [];
    return searchIndex.parts
      .filter(function (p) {
        return matchesPart(p, tokens);
      })
      .slice(0, 12);
  }

  function setupReadingPaths() {
    const container = document.getElementById("book-paths");
    const list = document.getElementById("book-paths-list");
    if (!container || !list || !manifest) return;

    list.replaceChildren();
    READING_PATHS.forEach(function (path) {
      const first = path.steps[0];
      if (!first || !partById(first.id)) return;

      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "book-paths__link";
      if (path.id === activePathId) {
        a.classList.add("book-paths__link--active");
        a.setAttribute("aria-current", "true");
      }
      a.href = pathHref(path, first.id);
      a.innerHTML =
        '<span class="book-paths__label">' +
        path.label +
        '</span><span class="book-paths__hint">' +
        path.steps.length +
        " stops · " +
        first.reason +
        "</span>";
      a.addEventListener("click", function () {
        setActivePathId(path.id);
      });
      li.appendChild(a);
      list.appendChild(li);
    });

    container.hidden = list.children.length === 0;
  }

  function renderPathProgress(partId) {
    const nav = document.getElementById("book-nav");
    let panel = document.getElementById("book-path-active");
    const path = getActivePath();

    if (!path || !nav) {
      if (panel) panel.remove();
      return;
    }

    const idx = partId ? pathStepIndex(path, partId) : -1;
    const onPath = idx >= 0;
    const completed = onPath && idx >= path.steps.length - 1;
    const currentStep = onPath ? idx + 1 : 0;
    const fillPct = onPath
      ? Math.round(((idx + 1) / path.steps.length) * 100)
      : 0;

    if (!panel) {
      panel = document.createElement("div");
      panel.id = "book-path-active";
      panel.className = "book-path-active";
      nav.insertBefore(panel, nav.firstChild);
    }

    panel.replaceChildren();

    const label = document.createElement("p");
    label.className = "book-path-active__label";
    label.textContent = path.label + " path";

    const track = document.createElement("div");
    track.className = "book-path-active__track";
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", String(path.steps.length));
    track.setAttribute(
      "aria-valuenow",
      String(onPath ? currentStep : 0)
    );
    track.setAttribute(
      "aria-label",
      path.label + " reading path progress"
    );

    const fill = document.createElement("div");
    fill.className = "book-path-active__fill";
    fill.style.width = fillPct + "%";
    track.appendChild(fill);

    const step = document.createElement("p");
    step.className = "book-path-active__step";
    if (completed) {
      step.textContent =
        "Path complete · " + path.steps.length + " sections read";
    } else if (onPath) {
      const current = partById(partId);
      step.textContent =
        "Step " +
        currentStep +
        " of " +
        path.steps.length +
        " · " +
        shortTitle(current ? current.title : partId);
    } else {
      const resume = path.steps[0];
      step.innerHTML =
        'Off this path · <a href="' +
        pathHref(path, resume.id) +
        '">Resume at step 1</a>';
    }

    const exit = document.createElement("button");
    exit.type = "button";
    exit.className = "book-path-active__exit";
    exit.textContent = "Exit guided path";
    exit.addEventListener("click", function () {
      setActivePathId(null);
      const currentId = partFromHash();
      if (currentId && manifest) {
        const idx = partIndex(currentId);
        const part = partById(currentId);
        if (part && idx >= 0) {
          renderRecommendations(part, idx, manifest.parts.length);
        }
      }
    });

    panel.append(label, track, step, exit);
  }

  function urlHostLabel(url) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "");
      return host.length > 24 ? host.slice(0, 21) + "…" : host;
    } catch (err) {
      return "source";
    }
  }

  function renderCitationLockNotice(part) {
    const existing = document.getElementById("book-citation-lock");
    if (existing) existing.remove();
    if (!part.citation_lock && !part.citation_verified) return;

    const notice = document.createElement("aside");
    notice.id = "book-citation-lock";
    notice.className =
      "book-citation-lock" +
      (part.citation_verified ? " book-citation-lock--verified" : "");
    notice.setAttribute("role", "note");

    if (part.citation_verified) {
      const priority =
        part.lock_priority && part.lock_priority < 99
          ? " Priority " + part.lock_priority + " pass complete."
          : "";
      notice.innerHTML =
        "<p><strong>Citation verified.</strong>" +
        priority +
        " Primary sources for this section were checked in the pre-print pass. Re-verify before upload if superseded. " +
        '<a href="../resources/#citation-locks">View all locks</a>.</p>';
    } else {
      const priority =
        part.lock_priority && part.lock_priority < 99
          ? "Priority " + part.lock_priority + " pre-print lock. "
          : "";

      notice.innerHTML =
        "<p><strong>Pre-print citation lock.</strong> " +
        priority +
        "Sources in this section still need verification before print. " +
        '<a href="../resources/#citation-locks">View all open locks</a>.</p>';

      if (part.lock_urls && part.lock_urls.length) {
        const list = document.createElement("ul");
        list.className = "book-citation-lock__urls";
        part.lock_urls.slice(0, 6).forEach(function (url) {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = url;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = urlHostLabel(url);
          a.title = url;
          li.appendChild(a);
          list.appendChild(li);
        });
        notice.appendChild(list);
      }
    }

    content.parentElement.insertBefore(notice, content);
  }

  function setupSearch() {
    const input = document.getElementById("book-search-input");
    const results = document.getElementById("book-search-results");
    if (!input || !results) return;

    function renderResults(query) {
      const tokens = tokenizeQuery(query);
      results.replaceChildren();
      if (!tokens.length) {
        results.hidden = true;
        return;
      }

      const hits = searchParts(query);
      if (!hits.length) {
        const li = document.createElement("li");
        li.className = "book-search__empty";
        li.textContent = "No matches in this draft.";
        results.appendChild(li);
        results.hidden = false;
        return;
      }

      hits.forEach(function (part) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "book-search__hit";
        a.href = "#" + part.id;

        const title = document.createElement("span");
        title.className = "book-search__hit-title";
        title.textContent = shortTitle(part.title);

        const snip = document.createElement("span");
        snip.className = "book-search__hit-snippet";
        snip.innerHTML = highlightSnippet(part.text, tokens);

        a.append(title, snip);
        li.appendChild(a);
        results.appendChild(li);
      });
      results.hidden = false;
    }

    input.addEventListener("input", function () {
      renderResults(input.value);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        input.value = "";
        renderResults("");
        input.blur();
      }
    });

    results.addEventListener("click", function (e) {
      if (e.target.closest("a") && isMobileNav()) {
        setNavOpen(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (
        e.key === "/" &&
        !e.target.closest("input, textarea, select, [contenteditable=true]")
      ) {
        e.preventDefault();
        input.focus();
        if (isMobileNav()) setNavOpen(true);
      }
    });
  }

  async function loadPart(file) {
    const res = await fetch(file);
    if (!res.ok) throw new Error("Failed to load " + file);
    return stripFrontMatter(await res.text());
  }

  function partIndex(id) {
    return manifest.parts.findIndex(function (p) {
      return p.id === id;
    });
  }

  function renderNav(parts, activeId) {
    navList.innerHTML = "";
    const saved = readProgress();
    parts.forEach(function (p) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + p.id;
      if (p.id === activeId) a.setAttribute("aria-current", "true");

      const label = document.createElement("span");
      label.className = "nav-label-text";
      label.textContent = shortTitle(p.title);
      a.appendChild(label);

      const marks = document.createElement("span");
      marks.className = "nav-marks";
      if (saved && saved.id === p.id && p.id !== activeId) {
        const resume = document.createElement("span");
        resume.className = "nav-mark nav-mark--resume";
        resume.title = "Resume here";
        resume.setAttribute("aria-label", "Resume here");
        marks.appendChild(resume);
      }
      if (p.citation_lock) {
        const lock = document.createElement("span");
        lock.className = "nav-mark nav-mark--lock";
        lock.title = "Pre-print citation lock";
        lock.setAttribute("aria-label", "Pre-print citation lock");
        marks.appendChild(lock);
      } else if (p.citation_verified) {
        const verified = document.createElement("span");
        verified.className = "nav-mark nav-mark--verified";
        verified.title = "Citation verified";
        verified.setAttribute("aria-label", "Citation verified");
        marks.appendChild(verified);
      }

      const time = document.createElement("span");
      time.className = "nav-time";
      time.textContent = readingTimeMinutes(p.words || 0) + "m";

      a.append(marks, time);
      li.appendChild(a);
      navList.appendChild(li);
    });
  }

  function renderProgress(index, total) {
    if (!progressBar) return;
    const pct = total <= 1 ? 100 : ((index + 1) / total) * 100;
    progressBar.style.width = pct + "%";
    progressBar.parentElement.setAttribute("aria-valuenow", String(index + 1));
    progressBar.parentElement.setAttribute("aria-valuemax", String(total));
  }

  function renderPager(index, total) {
    if (!pagerEl) return;

    pagerEl.replaceChildren();
    if (total <= 1) {
      pagerEl.hidden = true;
      return;
    }

    pagerEl.hidden = false;

    const prev = index > 0 ? manifest.parts[index - 1] : null;
    const next = index < total - 1 ? manifest.parts[index + 1] : null;

    if (prev) {
      const a = document.createElement("a");
      a.className = "book-pager__link book-pager__prev";
      a.href = "#" + prev.id;
      a.innerHTML =
        '<span class="book-pager__dir">Previous</span><span class="book-pager__label">' +
        shortTitle(prev.title) +
        "</span><span class=\"book-pager__time\">" +
        formatReadingTime(prev.words) +
        "</span>";
      pagerEl.appendChild(a);
    } else {
      const span = document.createElement("span");
      span.className = "book-pager__spacer";
      pagerEl.appendChild(span);
    }

    const pos = document.createElement("span");
    pos.className = "book-pager__pos";
    pos.textContent = index + 1 + " / " + total;
    pagerEl.appendChild(pos);

    if (next) {
      const a = document.createElement("a");
      a.className = "book-pager__link book-pager__next";
      a.href = "#" + next.id;
      a.innerHTML =
        '<span class="book-pager__dir">Next</span><span class="book-pager__label">' +
        shortTitle(next.title) +
        "</span><span class=\"book-pager__time\">" +
        formatReadingTime(next.words) +
        "</span>";
      pagerEl.appendChild(a);
    } else {
      const span = document.createElement("span");
      span.className = "book-pager__spacer";
      pagerEl.appendChild(span);
    }
  }

  function linkifyTableOfContents(container) {
    const parts = manifest.parts.filter(function (p) {
      return p.id !== "table-of-contents";
    });

    container.querySelectorAll("p, li").forEach(function (el) {
      const text = el.textContent.trim();
      if (!text || text === "Contents") return;

      const match = parts.find(function (p) {
        return p.title === text;
      });
      if (!match) return;

      const a = document.createElement("a");
      a.href = "#" + match.id;
      a.textContent = text;
      el.replaceChildren(a);
    });
  }

  function sectionUrl(partId) {
    const url = new URL(window.location.href);
    url.hash = partId;
    return url.href;
  }

  function shareUrl(part) {
    if (part && part.share) {
      return new URL(part.share, window.location.href).href;
    }
    return new URL("share/" + part.id + ".html", window.location.href).href;
  }

  function absoluteShareUrl(part) {
    if (part && part.share) {
      return new URL(part.share, window.location.origin + window.location.pathname).href;
    }
    return window.location.origin + "/book/share/" + part.id + ".html";
  }

  function setMeta(attr, key, value) {
    let el = document.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  }

  function updateSocialMeta(part) {
    const title = part.title + " — " + BOOK_BRAND;
    const description =
      part.excerpt ||
      manifest.subtitle ||
      "Draft section from Window of Ascent.";
    const url = absoluteShareUrl(part);
    const readerUrl = sectionUrl(part.id);

    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:type", "article");
    setMeta("property", "og:site_name", BOOK_BRAND);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", OG_IMAGE);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", OG_IMAGE);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = readerUrl;
  }

  function partById(id) {
    return manifest.parts.find(function (p) {
      return p.id === id;
    });
  }

  function pathRecommendations(partId, linearNextId) {
    const active = getActivePath();
    if (active) {
      const idx = pathStepIndex(active, partId);
      if (idx >= 0 && idx < active.steps.length - 1) {
        const step = active.steps[idx + 1];
        const target = partById(step.id);
        if (target) {
          return [
            {
              pathLabel: active.label,
              part: target,
              reason: step.reason,
              guided: true,
              stepNum: idx + 2,
              stepTotal: active.steps.length,
            },
          ];
        }
      }
      return [];
    }

    const seen = new Set();
    const items = [];

    READING_PATHS.forEach(function (path) {
      const idx = path.steps.findIndex(function (step) {
        return step.id === partId;
      });
      if (idx < 0 || idx >= path.steps.length - 1) return;

      const step = path.steps[idx + 1];
      if (step.id === linearNextId || seen.has(step.id)) return;

      const target = partById(step.id);
      if (!target) return;

      seen.add(step.id);
      items.push({
        pathLabel: path.label,
        part: target,
        reason: step.reason,
      });
    });

    return items;
  }

  function renderRecommendations(part, index, total) {
    if (!nextEl) return;
    nextEl.replaceChildren();
    nextEl.hidden = true;

    if (SKIP_RECOMMEND.has(part.id)) return;

    const linearNext =
      index < total - 1 ? manifest.parts[index + 1] : null;
    const items = pathRecommendations(
      part.id,
      linearNext ? linearNext.id : null
    );
    if (!items.length) return;

    nextEl.hidden = false;

    const heading = document.createElement("p");
    heading.className = "book-next__label";
    const guided = items[0] && items[0].guided;
    if (guided) {
      heading.textContent =
        "Next on the " + items[0].pathLabel.toLowerCase() + " path";
    } else if (items.length === 1) {
      heading.textContent = "On this reading path";
    } else {
      heading.textContent = "Reading path suggestions";
    }
    nextEl.appendChild(heading);

    items.forEach(function (item) {
      const card = document.createElement("a");
      card.className = "book-next__card";
      card.href = getActivePath()
        ? pathHref(getActivePath(), item.part.id)
        : "#" + item.part.id;

      const path = document.createElement("span");
      path.className = "book-next__path";
      if (item.guided) {
        path.textContent =
          "Step " + item.stepNum + " of " + item.stepTotal;
      } else {
        path.textContent = item.pathLabel;
      }

      const title = document.createElement("span");
      title.className = "book-next__title";
      title.textContent = item.part.title;

      const reason = document.createElement("span");
      reason.className = "book-next__reason";
      reason.textContent = item.reason;

      const time = document.createElement("span");
      time.className = "book-next__time";
      time.textContent = formatReadingTime(item.part.words);

      card.append(path, title, reason, time);
      nextEl.appendChild(card);
    });
  }

  function setupExportActions(part) {
    if (printSectionBtn) {
      printSectionBtn.onclick = function () {
        window.print();
      };
    }

    if (downloadSectionBtn) {
      downloadSectionBtn.onclick = async function () {
        const prev = downloadSectionBtn.textContent;
        try {
          const res = await fetch(part.file);
          if (!res.ok) throw new Error("Download failed");
          const md = stripFrontMatter(await res.text());
          const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = part.id + ".md";
          link.click();
          URL.revokeObjectURL(url);
          downloadSectionBtn.textContent = "Saved";
        } catch (err) {
          console.error(err);
          downloadSectionBtn.textContent = "Failed";
        }
        window.setTimeout(function () {
          downloadSectionBtn.textContent = prev;
        }, 2000);
      };
    }
  }

  function setupShortcutsDialog() {
    if (!shortcutsDialog) return null;

    function open() {
      if (typeof shortcutsDialog.showModal === "function") {
        shortcutsDialog.showModal();
      } else {
        shortcutsDialog.setAttribute("open", "");
      }
    }

    function close() {
      if (typeof shortcutsDialog.close === "function") {
        shortcutsDialog.close();
      } else {
        shortcutsDialog.removeAttribute("open");
      }
    }

    function isOpen() {
      return shortcutsDialog.hasAttribute("open") || shortcutsDialog.open;
    }

    if (shortcutsBtn) {
      shortcutsBtn.addEventListener("click", open);
    }
    if (shortcutsCloseBtn) {
      shortcutsCloseBtn.addEventListener("click", close);
    }

    shortcutsDialog.addEventListener("click", function (e) {
      if (e.target === shortcutsDialog) close();
    });

    return { open: open, close: close, isOpen: isOpen };
  }

  function setupCopyLink(part) {
    if (!sectionBar || !copyLinkBtn) return;
    sectionBar.hidden = false;

    copyLinkBtn.onclick = async function () {
      const url = absoluteShareUrl(part);
      try {
        await navigator.clipboard.writeText(url);
        const prev = copyLinkBtn.textContent;
        copyLinkBtn.textContent = "Copied";
        window.setTimeout(function () {
          copyLinkBtn.textContent = prev;
        }, 2000);
      } catch (err) {
        copyLinkBtn.textContent = "Copy failed";
        window.setTimeout(function () {
          copyLinkBtn.textContent = "Copy link";
        }, 2000);
      }
    };
  }

  function showResumeBanner(savedId) {
    const existing = document.getElementById("book-resume-banner");
    if (existing) existing.remove();
    if (!savedId || partFromHash()) return;

    const saved = manifest.parts.find(function (p) {
      return p.id === savedId;
    });
    if (!saved || saved.id === manifest.parts[0].id) return;

    const banner = document.createElement("p");
    banner.id = "book-resume-banner";
    banner.className = "book-resume";
    banner.innerHTML =
      'You were reading <a href="#' +
      saved.id +
      '">' +
      shortTitle(saved.title) +
      "</a>. <button type=\"button\" class=\"book-resume__dismiss\">Start from the beginning</button>";

    banner.querySelector(".book-resume__dismiss").addEventListener("click", function () {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        /* ignore */
      }
      banner.remove();
    });

    const header = document.querySelector(".book-header");
    if (header) header.appendChild(banner);
  }

  async function showPart(forcedId) {
    const parsed = forcedId
      ? { partId: forcedId, targetId: null }
      : parseHash();

    if (
      parsed.targetId &&
      parsed.partId &&
      parsed.partId === currentPartId &&
      partIndex(parsed.partId) >= 0
    ) {
      scrollToTarget(parsed.targetId);
      return;
    }

    const idx = parsed.partId ? partIndex(parsed.partId) : -1;
    const index = idx >= 0 ? idx : 0;
    const part = manifest.parts[index];

    if (!part) {
      content.innerHTML = '<p class="book-error">No chapters in manifest.</p>';
      return;
    }

    currentPartId = part.id;

    renderNav(manifest.parts, part.id);
    renderProgress(index, manifest.parts.length);
    renderSectionStats(part, index, manifest.parts.length);
    renderPathProgress(part.id);
    renderRecommendations(part, index, manifest.parts.length);
    renderPager(index, manifest.parts.length);
    if (!parsed.targetId) {
      setPartHash(part.id);
    }
    saveProgress(part.id);
    setupCopyLink(part);
    setupExportActions(part);
    updateSocialMeta(part);

    if (sectionTimeEl) {
      sectionTimeEl.hidden = false;
      sectionTimeEl.textContent = formatReadingTime(part.words) + " · ";
    }

    content.innerHTML = '<p class="loading">Loading…</p>';
    if (!parsed.targetId) {
      window.scrollTo(0, 0);
    }

    try {
      const md = await loadPart(part.file);
      content.innerHTML = marked.parse(md);
      enhanceHeadings(content, part.id);
      renderCitationLockNotice(part);
      if (part.id === "table-of-contents") {
        linkifyTableOfContents(content);
      }
      scrollToTarget(parsed.targetId);
    } catch (e) {
      content.innerHTML = '<p class="book-error">' + e.message + "</p>";
      renderCitationLockNotice(part);
    }
  }

  function onKeydown(e) {
    if (!manifest) return;

    if (shortcutsApi && shortcutsApi.isOpen() && e.key === "Escape") {
      e.preventDefault();
      shortcutsApi.close();
      return;
    }

    if (e.target.closest("input, textarea, select, [contenteditable=true]")) return;

    if (e.key === "?" || (e.shiftKey && e.key === "/")) {
      e.preventDefault();
      if (shortcutsApi) shortcutsApi.open();
      return;
    }

    const id = partFromHash() || manifest.parts[0].id;
    const index = partIndex(id);
    if (index < 0) return;

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      location.hash = manifest.parts[index - 1].id;
    } else if (e.key === "ArrowRight" && index < manifest.parts.length - 1) {
      e.preventDefault();
      location.hash = manifest.parts[index + 1].id;
    }
  }

  async function init() {
    try {
      manifest = await loadManifest();
      if (manifest.title) titleEl.textContent = manifest.title;
      if (manifest.subtitle) subtitleEl.textContent = manifest.subtitle + " · draft";
      const n = manifest.parts.length;
      const words = manifest.parts.reduce(function (s, p) {
        return s + (p.words || 0);
      }, 0);
      let metaLine =
        n +
        " section" +
        (n === 1 ? "" : "s") +
        " · ~" +
        words.toLocaleString() +
        " words · " +
        totalReadingTime(manifest.parts) +
        " total";
      if (manifest.generated_at) {
        const built = new Date(manifest.generated_at);
        if (!Number.isNaN(built.getTime())) {
          metaLine +=
            " · built " +
            built.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
        }
      }
      partCount.textContent = metaLine;

      searchIndex = await loadSearchIndex();
      activePathId = pathFromQuery() || pathFromStorage();
      if (activePathId && !pathFromQuery()) {
        setActivePathId(activePathId, true);
      }
      setupSearch();
      setupTypeControls();
      setupReadingPaths();
      setupNavToggle();
      shortcutsApi = setupShortcutsDialog();

      const saved = readProgress();
      showResumeBanner(saved && saved.id);

      await showPart();

      window.addEventListener("hashchange", function () {
        showPart();
      });
      window.addEventListener("keydown", onKeydown);
    } catch (e) {
      content.innerHTML = '<p class="book-error">' + e.message + "</p>";
    }
  }

  init();
})();
