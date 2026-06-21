(function () {
  const newsList = document.getElementById("news-list");
  const newsEmpty = document.getElementById("news-empty");
  const discordLinks = document.querySelectorAll("[data-discord-link]");

  let chartJsPromise = null;
  let videoJsPromise = null;

  function formatDate(iso) {
    const d = new Date(iso + "T12:00:00");
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function compareManifest(a, b) {
    return String(b.date).localeCompare(String(a.date));
  }

  function dataUrl(filename) {
    return new URL("/data/" + filename, window.location.origin).href;
  }

  function siteUrl(path) {
    const clean = String(path || "").replace(/^\//, "");
    return new URL("/" + clean, window.location.origin).href;
  }

  async function loadJson(filename) {
    const path = dataUrl(filename);
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(path + " " + res.status);
    return res.json();
  }

  function ensureChartJs() {
    if (window.Chart) return Promise.resolve(window.Chart);
    if (!chartJsPromise) {
      chartJsPromise = new Promise(function (resolve, reject) {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.6/dist/chart.umd.min.js";
        s.async = true;
        s.onload = function () {
          resolve(window.Chart);
        };
        s.onerror = function () {
          reject(new Error("Chart.js failed to load"));
        };
        document.head.appendChild(s);
      });
    }
    return chartJsPromise;
  }

  window.woaNewsChartReady = ensureChartJs();

  function ensureVideoJs() {
    if (window.videojs) return Promise.resolve(window.videojs);
    if (!videoJsPromise) {
      videoJsPromise = new Promise(function (resolve, reject) {
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href =
          "https://cdn.jsdelivr.net/npm/video.js@8.21.0/dist/video-js.min.css";
        document.head.appendChild(css);

        const vjs = document.createElement("script");
        vjs.src =
          "https://cdn.jsdelivr.net/npm/video.js@8.21.0/dist/video.min.js";
        vjs.async = true;

        const yt = document.createElement("script");
        yt.src =
          "https://cdn.jsdelivr.net/npm/videojs-youtube@3.0.1/dist/Youtube.min.js";
        yt.async = true;

        vjs.onload = function () {
          yt.onload = function () {
            resolve(window.videojs);
          };
          yt.onerror = function () {
            reject(new Error("videojs-youtube failed to load"));
          };
          document.head.appendChild(yt);
        };
        vjs.onerror = function () {
          reject(new Error("Video.js failed to load"));
        };
        document.head.appendChild(vjs);
      });
    }
    return videoJsPromise;
  }

  function youtubeWatchUrl(youtubeId) {
    return "https://www.youtube.com/watch?v=" + encodeURIComponent(youtubeId);
  }

  function iconSvg(name) {
    const icons = {
      share:
        '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>',
      youtube:
        '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8zM9.6 15.5V8.5L15.8 12l-6.2 3.5z"/></svg>',
      link:
        '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3.9 12c0-1.7 1.4-3.1 3.1-3.1h4V7H7c-2.8 0-5 2.2-5 5s2.2 5 5 5h4v-1.9H7c-1.7 0-3.1-1.4-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1h-4V17h4c2.8 0 5-2.2 5-5s-2.2-5-5-5z"/></svg>',
    };
    return icons[name] || "";
  }

  function actionButton(label, iconName, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "learn-more-hero__action";
    btn.setAttribute("aria-label", label);
    btn.title = label;
    btn.innerHTML = iconSvg(iconName);
    btn.addEventListener("click", onClick);
    return btn;
  }

  function flashAction(btn, message) {
    const prev = btn.title;
    btn.title = message;
    btn.setAttribute("aria-label", message);
    window.setTimeout(function () {
      btn.title = prev;
      btn.setAttribute("aria-label", prev);
    }, 2000);
  }

  async function copyText(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
      flashAction(btn, "Copied");
    } catch (err) {
      console.error(err);
    }
  }

  async function mountLearnMoreHero(learnMore, articleMeta, afterArticle) {
    if (!learnMore || !learnMore.youtubeId || !newsList) return;

    const videoUrl =
      learnMore.youtubeUrl || youtubeWatchUrl(learnMore.youtubeId);
    const playerId =
      "learn-more-" + (articleMeta.id || learnMore.youtubeId).replace(/[^\w-]/g, "-");

    const aside = document.createElement("aside");
    aside.className = "learn-more-hero";
    aside.id = playerId + "-hero";
    aside.setAttribute("aria-labelledby", playerId + "-headline");

    const bar = document.createElement("div");
    bar.className = "learn-more-hero__bar";

    const headline = document.createElement("h4");
    headline.className = "learn-more-hero__headline";
    headline.id = playerId + "-headline";
    headline.textContent =
      learnMore.headline || "Want to learn more?";

    const actions = document.createElement("div");
    actions.className = "learn-more-hero__actions";

    actions.append(
      actionButton("Share video", "share", async function (e) {
        const btn = e.currentTarget;
        const payload = {
          title: headline.textContent,
          url: videoUrl,
        };
        if (navigator.share) {
          try {
            await navigator.share(payload);
          } catch (err) {
            if (err && err.name !== "AbortError") console.error(err);
          }
        } else {
          copyText(videoUrl, btn);
        }
      }),
      actionButton("Open on YouTube", "youtube", function () {
        window.open(videoUrl, "_blank", "noopener,noreferrer");
      }),
      actionButton("Copy video link", "link", function (e) {
        copyText(videoUrl, e.currentTarget);
      })
    );

    bar.append(headline, actions);

    const playerWrap = document.createElement("div");
    playerWrap.className = "learn-more-hero__player";

    const video = document.createElement("video");
    video.id = playerId;
    video.className = "video-js learn-more-hero__video";

    playerWrap.appendChild(video);
    aside.append(bar, playerWrap);

    if (afterArticle) {
      afterArticle.appendChild(aside);
    } else if (newsList) {
      newsList.appendChild(aside);
    }

    try {
      const videojs = await ensureVideoJs();
      videojs(playerId, {
        techOrder: ["youtube"],
        controls: false,
        controlBar: false,
        bigPlayButton: false,
        poster: false,
        fluid: false,
        fill: true,
        sources: [
          {
            type: "video/youtube",
            src: videoUrl,
          },
        ],
        youtube: {
          ytControls: 1,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
        },
      });
    } catch (err) {
      console.error(err);
      const fallback = document.createElement("p");
      fallback.className = "learn-more-hero__fallback";
      fallback.innerHTML =
        'Video unavailable. <a href="' +
        videoUrl +
        '" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>.';
      playerWrap.replaceChildren(fallback);
    }
  }

  function appendNewsScripts(fragmentRoot, hostArticle) {
    fragmentRoot.querySelectorAll("script[data-woa-news-script]").forEach(function (oldScript) {
      const s = document.createElement("script");
      s.setAttribute("data-woa-news-script", "");
      if (oldScript.src) {
        s.src = oldScript.src;
        s.async = oldScript.async;
      } else {
        s.textContent = oldScript.textContent;
      }
      hostArticle.appendChild(s);
    });
  }

  function adoptNewsStyles(articleRoot, hostArticle) {
    articleRoot.querySelectorAll("style[data-woa-news-style]").forEach(function (styleEl) {
      hostArticle.appendChild(styleEl.cloneNode(true));
    });
  }

  function newsArticleId(meta) {
    return (
      meta.id ||
      String(meta.file || "")
        .replace(/^news\//, "")
        .replace(/\.html$/, "")
    );
  }

  function isNewsPreviewMode() {
    return newsList && newsList.dataset.newsPreview === "true";
  }

  function buildNewsHeader(meta) {
    const time = document.createElement("time");
    time.dateTime = meta.date || "";
    time.className = "news-date";
    time.textContent = meta.date ? formatDate(meta.date) : "";

    const titleEl = document.createElement("h3");
    titleEl.className = "news-title";
    titleEl.textContent = meta.title || "Untitled";

    const parts = [time, titleEl];
    if (meta.summary) {
      const deck = document.createElement("p");
      deck.className = "news-summary news-summary--deck";
      deck.textContent = meta.summary;
      parts.push(deck);
    }
    return parts;
  }

  function buildNewsPreviewCard(meta) {
    const id = newsArticleId(meta);
    const host = document.createElement("article");
    host.className = "news-item news-item--preview";
    host.id = "news-" + id;
    host.dataset.newsId = id;

    const actions = document.createElement("p");
    actions.className = "news-actions";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "news-expand";
    btn.textContent = "Read full article";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", host.id + "-body");
    btn.addEventListener("click", function () {
      expandNewsItem(host, { ...meta, id }, btn);
    });

    actions.appendChild(btn);
    host.append(...buildNewsHeader(meta), actions);
    return host;
  }

  async function fetchNewsHtml(meta) {
    const url = siteUrl(meta.file);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(url + " " + res.status);
    return res.text();
  }

  async function populateNewsBody(host, meta, htmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const fragmentRoot = doc.querySelector("[data-woa-news-article]");

    if (!fragmentRoot) {
      throw new Error("Missing [data-woa-news-article] root in " + meta.file);
    }

    const bodySlot = document.createElement("div");
    bodySlot.className = "news-embed-body";
    bodySlot.id = host.id + "-body";

    const content = fragmentRoot.querySelector(".woa-news-body");
    if (content) {
      bodySlot.appendChild(document.importNode(content, true));
    } else {
      bodySlot.appendChild(document.importNode(fragmentRoot, true));
    }

    adoptNewsStyles(fragmentRoot, host);
    host.appendChild(bodySlot);
    host.classList.remove("news-item--preview");
    host.classList.add("news-item--embed");

    if (fragmentRoot.hasAttribute("data-requires-chartjs")) {
      await ensureChartJs();
    }

    appendNewsScripts(fragmentRoot, host);

    if (meta.learnMore) {
      await mountLearnMoreHero(meta.learnMore, meta, host);
    }

    return host;
  }

  async function expandNewsItem(host, meta, btn) {
    if (host.dataset.expanded === "true") return;

    btn.disabled = true;
    const prevLabel = btn.textContent;
    btn.textContent = "Loading…";

    try {
      const html = await fetchNewsHtml(meta);
      await populateNewsBody(host, meta, html);
      host.dataset.expanded = "true";
      btn.setAttribute("aria-expanded", "true");
      const actions = btn.closest(".news-actions");
      if (actions) actions.remove();
    } catch (err) {
      btn.disabled = false;
      btn.textContent = prevLabel;
      console.error(err);
    }
  }

  async function embedNewsArticle(meta, htmlText) {
    const id = newsArticleId(meta);
    const host = document.createElement("article");
    host.className = "news-item news-item--embed";
    host.id = "news-" + id;
    host.dataset.newsId = id;
    host.append(...buildNewsHeader(meta));
    newsList.appendChild(host);
    await populateNewsBody(host, { ...meta, id }, htmlText);
    return host;
  }

  function expandNewsFromHash(sorted) {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash.startsWith("news-")) return;

    const host = document.getElementById(hash);
    if (!host || host.dataset.expanded === "true") return;

    const id = hash.replace(/^news-/, "");
    const meta = sorted.find(function (item) {
      return newsArticleId(item) === id;
    });
    if (!meta) return;

    const btn = host.querySelector(".news-expand");
    if (btn) {
      expandNewsItem(host, { ...meta, id: newsArticleId(meta) }, btn).then(function () {
        host.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  async function renderNews(manifest) {
    if (!newsList) return;
    newsList.replaceChildren();

    const articles = (manifest && manifest.articles) || [];
    if (!articles.length) {
      if (newsEmpty) newsEmpty.hidden = false;
      return;
    }

    if (newsEmpty) newsEmpty.hidden = true;

    const sorted = articles.slice().sort(compareManifest);
    const preview = isNewsPreviewMode();

    for (const meta of sorted) {
      const id = newsArticleId(meta);
      const enriched = { ...meta, id };

      try {
        if (preview) {
          newsList.appendChild(buildNewsPreviewCard(enriched));
        } else {
          const html = await fetchNewsHtml(enriched);
          await embedNewsArticle(enriched, html);
        }
      } catch (err) {
        const errArticle = document.createElement("article");
        errArticle.className = "news-item news-item--error";
        errArticle.innerHTML =
          "<h3 class=\"news-title\">" +
          (meta.title || meta.file) +
          "</h3><p class=\"news-summary\">Could not load this article.</p>";
        newsList.appendChild(errArticle);
        console.error(err);
      }
    }

    if (preview) expandNewsFromHash(sorted);
  }

  function applyDiscord(url) {
    if (!url || url.includes("REPLACE_WITH_YOUR_INVITE")) return;
    discordLinks.forEach(function (el) {
      el.href = url;
      el.removeAttribute("aria-disabled");
    });
  }

  const BOOK_PROGRESS_KEY = "woa-book-progress";
  const WORDS_PER_MIN = 230;
  const BOOK_MAP_SKIP_IDS = new Set([
    "title-page",
    "copyright",
    "dedication",
    "table-of-contents",
    "acknowledgments",
    "colophon",
  ]);

  function formatTotalReadingTime(words) {
    const min = Math.max(1, Math.ceil((words || 0) / WORDS_PER_MIN));
    const hours = Math.floor(min / 60);
    const rem = min % 60;
    if (hours < 1) return "~" + min + " min read";
    if (rem === 0) return "~" + hours + " hr read";
    return "~" + hours + " hr " + rem + " min read";
  }

  function formatBuildDate(iso) {
    const built = new Date(iso);
    if (Number.isNaN(built.getTime())) return null;
    return built.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function urlHostLabel(url) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "");
      return host.length > 28 ? host.slice(0, 25) + "…" : host;
    } catch (err) {
      return "source";
    }
  }

  function appendCitationUrls(container, urls) {
    if (!urls || !urls.length) return;
    const list = document.createElement("ul");
    list.className = "citation-lock-item__urls";
    urls.slice(0, 8).forEach(function (url) {
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
    if (urls.length > 8) {
      const more = document.createElement("li");
      more.className = "citation-lock-item__urls-more";
      more.textContent = "+" + (urls.length - 8) + " more in manuscript";
      list.appendChild(more);
    }
    container.appendChild(list);
  }

  function renderCitationProgress(locked, open, labelEl, barEl, panelEl) {
    const total = locked + open;
    if (!total || !labelEl || !barEl) return;

    const pct = Math.round((locked / total) * 100);
    barEl.style.width = pct + "%";
    if (panelEl) panelEl.hidden = false;

    let nextHint = "";
    if (open > 0) {
      nextHint =
        ' Next up: <a href="' +
        siteUrl("book/#chapter-10") +
        '">Chapter 10</a> (EU AI Act / Digital Omnibus).';
    }

    labelEl.innerHTML =
      "<strong>" +
      locked +
      " of " +
      total +
      "</strong> citation sections verified for print (" +
      pct +
      "%). " +
      open +
      " still open — " +
      '<a href="' +
      siteUrl("resources/#citation-locks") +
      '">full lock list</a>.' +
      nextHint;
  }

  function bookStatsLine(meta) {
    const chapters = meta.chapters || 0;
    const sections = meta.sections || 0;
    const words = meta.words || 0;
    const built = meta.generated_at ? formatBuildDate(meta.generated_at) : null;
    let line =
      chapters +
      " chapters · " +
      sections +
      " sections · ~" +
      words.toLocaleString() +
      " words · " +
      formatTotalReadingTime(words) +
      " · draft";
    if (built) line += " · built " + built;
    return line;
  }

  function readBookProgress() {
    try {
      const raw = localStorage.getItem(BOOK_PROGRESS_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data && data.id ? data : null;
    } catch (err) {
      return null;
    }
  }

  async function loadBookMeta() {
    let meta = null;
    try {
      const bookRes = await fetch(dataUrl("book.json"), { cache: "no-store" });
      if (bookRes.ok) meta = await bookRes.json();
    } catch (err) {
      /* fall through */
    }

    const manifestUrl = siteUrl("book/read/manifest.json");
    try {
      const res = await fetch(manifestUrl, { cache: "no-store" });
      if (res.ok) {
        const manifest = await res.json();
        const parts = manifest.parts || [];
        const words = parts.reduce(function (sum, part) {
          return sum + (part.words || 0);
        }, 0);
        meta = meta || {};
        meta.generated_at = meta.generated_at || manifest.generated_at;
        meta.parts = parts;
        if (!meta.chapters) {
          meta.chapters = parts.filter(function (part) {
            return /^chapter-/.test(part.id);
          }).length;
        }
        if (!meta.sections) meta.sections = parts.length;
        if (!meta.words) meta.words = words;
      }
    } catch (err) {
      /* manifest optional if book.json alone suffices for stats */
    }

    if (meta) return meta;

    throw new Error(manifestUrl + " unavailable");
  }

  function shortPartTitle(title) {
    return title
      .replace(/^Chapter \d+ — /, "Ch. ")
      .replace(/^Introduction — /, "Intro · ")
      .replace(/^Appendix ([A-C]) — /, "App. $1 · ");
  }

  function mapPartKicker(part) {
    if (/^chapter-\d+/.test(part.id)) {
      const match = part.title.match(/^Chapter\s+(\d+)/);
      return match ? "Chapter " + match[1] : "Chapter";
    }
    if (/^appendix-[a-c]$/.test(part.id)) {
      const match = part.title.match(/^Appendix\s+([A-C])/);
      return match ? "Appendix " + match[1] : "Appendix";
    }
    if (part.id === "audience-pleas") return "Reader note";
    if (part.id === "introduction") return "Introduction";
    if (part.id === "conclusion") return "Conclusion";
    return "Section";
  }

  function mapPartTitle(part) {
    return String(part.title || "")
      .replace(/^Chapter \d+ — /, "")
      .replace(/^Introduction — /, "")
      .replace(/^Appendix [A-C] — /, "")
      .trim();
  }

  function citationBadge(part) {
    if (part.citation_verified) {
      return { label: "verified", modifier: "verified" };
    }
    if (part.citation_lock) {
      return { label: "open lock", modifier: "lock" };
    }
    return { label: "draft", modifier: "draft" };
  }

  function setManuscriptMapMessage(text) {
    const empty = document.getElementById("manuscript-map-empty");
    if (empty) empty.textContent = text;
  }

  function renderManuscriptMap(meta) {
    const list = document.getElementById("manuscript-map-list");
    const empty = document.getElementById("manuscript-map-empty");
    if (!list) return;

    const parts = ((meta && meta.parts) || []).filter(function (part) {
      return part && !BOOK_MAP_SKIP_IDS.has(part.id);
    });

    list.replaceChildren();
    if (!parts.length) {
      if (empty) {
        empty.hidden = false;
        empty.textContent = "Manuscript map unavailable in this build.";
      }
      return;
    }

    if (empty) empty.hidden = true;

    parts.forEach(function (part) {
      const badge = citationBadge(part);
      const item = document.createElement("a");
      item.className = "manuscript-map__item";
      item.href = siteUrl("book/#" + part.id);

      const kicker = document.createElement("span");
      kicker.className = "manuscript-map__kicker";
      kicker.textContent = mapPartKicker(part);

      const title = document.createElement("span");
      title.className = "manuscript-map__title";
      title.textContent = mapPartTitle(part) || part.title || part.id;

      const metaLine = document.createElement("span");
      metaLine.className = "manuscript-map__meta";
      metaLine.textContent =
        readingTimeMinutes(part.words || 0) + " min · " + (part.words || 0).toLocaleString() + " words";

      const state = document.createElement("span");
      state.className =
        "manuscript-map__badge manuscript-map__badge--" + badge.modifier;
      state.textContent = badge.label;

      item.append(kicker, title, metaLine, state);
      list.appendChild(item);
    });
  }

  function readingProgressPercent(parts, partId) {
    const idx = parts.findIndex(function (part) {
      return part.id === partId;
    });
    if (idx < 0 || parts.length < 2) return 0;
    return Math.round(((idx + 1) / parts.length) * 100);
  }

  function applyContinueReading(meta, primaryCta, heroCta, secondaryCta) {
    const parts = meta.parts || [];
    if (!parts.length) return;

    const saved = readBookProgress();
    const savedPart =
      saved &&
      parts.find(function (part) {
        return part.id === saved.id;
      });

    const continueEl = document.getElementById("book-continue");
    const continueBar = document.getElementById("book-continue-bar");
    const continueLabel = document.getElementById("book-continue-label");

    if (primaryCta && savedPart && savedPart.id !== "introduction") {
      const pct = readingProgressPercent(parts, savedPart.id);
      const shortTitle = shortPartTitle(savedPart.title);

      primaryCta.textContent = "Continue reading";
      primaryCta.href = "book/#" + savedPart.id;
      if (heroCta) {
        heroCta.textContent = "Continue reading";
        heroCta.href = "book/#" + savedPart.id;
      }
      if (secondaryCta) {
        secondaryCta.hidden = false;
        secondaryCta.textContent = "Start from the introduction";
        secondaryCta.href = "book/#introduction";
      }
      if (continueEl && continueBar && continueLabel) {
        continueEl.hidden = false;
        continueBar.style.width = pct + "%";
        continueLabel.innerHTML =
          "You left off at <strong>" +
          shortTitle +
          "</strong> — " +
          pct +
          "% through the manuscript. <a href=\"book/#" +
          savedPart.id +
          "\">Pick up here</a>.";
      }
    } else {
      if (primaryCta) primaryCta.href = "book/#introduction";
      if (heroCta) heroCta.href = "book/#introduction";
      if (continueEl) continueEl.hidden = true;
    }
  }

  function renderBookMetaPanels(meta) {
    const built = meta.generated_at ? formatBuildDate(meta.generated_at) : null;
    const stats = bookStatsLine(meta);

    renderManuscriptMap(meta);

    const statsEl = document.getElementById("book-stats");
    if (statsEl) statsEl.textContent = stats;

    const statusEl = document.getElementById("book-status-detail");
    if (statusEl) {
      statusEl.innerHTML =
        "Full manuscript draft — " +
        meta.chapters +
        " chapters, conclusion, three appendices (~" +
        meta.words.toLocaleString() +
        " words). Public reader at <a href=\"../book/\">book/</a>; pre-print citation lock and KDP export still open." +
        (built ? " Web draft built " + built + "." : "");
    }

    const resourcesBlurb = document.getElementById("resources-book-blurb");
    if (resourcesBlurb) {
      resourcesBlurb.innerHTML =
        "<a href=\"../book/\">Open the draft reader</a> — " +
        meta.chapters +
        " chapters, conclusion, three appendices (~" +
        meta.words.toLocaleString() +
        " words, " +
        formatTotalReadingTime(meta.words) +
        "). Work in progress; citation lock still open before print." +
        (built ? " Last built " + built + "." : "");
    }
  }

  async function renderCitationLocks() {
    const summaryEl = document.getElementById("citation-locks-summary");
    const listEl = document.getElementById("citation-locks-list");
    const lockedEl = document.getElementById("citation-locks-locked");
    const progressEl = document.getElementById("citation-locks-progress");
    const progressBar = document.getElementById("citation-locks-bar");
    const progressLabel = document.getElementById("citation-locks-progress-label");
    if (!summaryEl || !listEl) return;

    try {
      const data = await loadJson("citation-locks.json");
      const sections = (data && data.sections) || [];
      const locked = (data && data.locked_sections) || [];
      listEl.replaceChildren();

      if (progressEl && progressBar && progressLabel) {
        renderCitationProgress(
          locked.length,
          sections.length,
          progressLabel,
          progressBar,
          progressEl
        );
        progressEl.hidden = false;
      }

      if (lockedEl) {
        lockedEl.replaceChildren();
        if (locked.length) {
          locked.forEach(function (section) {
            const li = document.createElement("li");
            li.className = "citation-lock-item citation-lock-item--done";

            const title = document.createElement("a");
            title.href = "../book/#" + section.id;
            title.textContent = section.title;

            const meta = document.createElement("span");
            meta.className = "citation-lock-item__meta";
            meta.textContent =
              section.priority < 99
                ? "Locked · priority " + section.priority
                : "Locked at citation pass";

            li.append(title, meta);
            lockedEl.appendChild(li);
          });
          lockedEl.hidden = false;
        } else {
          lockedEl.hidden = true;
        }
      }

      if (!sections.length && !locked.length) {
        summaryEl.textContent =
          "No citation locks detected in the current draft build.";
        return;
      }

      const parts = [];
      if (locked.length) {
        parts.push(
          locked.length +
            " section" +
            (locked.length === 1 ? "" : "s") +
            " locked"
        );
      }
      if (sections.length) {
        parts.push(
          sections.length +
            " section" +
            (sections.length === 1 ? "" : "s") +
            " still open"
        );
      }
      summaryEl.textContent = parts.join(" · ") + " in the current web draft.";

      if (!sections.length) {
        const empty = document.createElement("li");
        empty.className = "citation-lock-item citation-lock-item--empty";
        empty.textContent = "No open locks in the current build.";
        listEl.appendChild(empty);
      }

      sections.forEach(function (section) {
        const li = document.createElement("li");
        li.className = "citation-lock-item";

        const title = document.createElement("a");
        title.href = "../book/#" + section.id;
        title.textContent = section.title;

        const meta = document.createElement("span");
        meta.className = "citation-lock-item__meta";
        meta.textContent =
          section.priority < 99
            ? "Priority " + section.priority
            : "Standard lock";

        const note = document.createElement("p");
        note.className = "citation-lock-item__note";
        note.textContent = section.note || "Sources to verify at publication.";

        li.append(title, meta, note);
        appendCitationUrls(li, section.urls);
        listEl.appendChild(li);
      });
    } catch (err) {
      summaryEl.textContent =
        "Citation lock list unavailable — run scripts/build-book-site.ps1 to regenerate.";
      console.error(err);
    }
  }

  async function renderPrePrintPanel() {
    const panel = document.getElementById("pre-print-panel");
    const bar = document.getElementById("pre-print-bar");
    const label = document.getElementById("pre-print-label");
    if (!panel || !bar || !label) return;

    try {
      const data = await loadJson("citation-locks.json");
      const locked = ((data && data.locked_sections) || []).length;
      const open = ((data && data.sections) || []).length;
      renderCitationProgress(locked, open, label, bar, panel);
    } catch (err) {
      panel.hidden = true;
      console.error(err);
    }
  }

  async function renderBookTeaser() {
    const statsEl = document.getElementById("book-stats");
    const primaryCta = document.getElementById("book-primary-cta");
    const heroCta = document.getElementById("hero-book-cta");
    const secondaryCta = document.getElementById("book-secondary-cta");
    const needsMeta =
      statsEl ||
      document.getElementById("book-status-detail") ||
      document.getElementById("resources-book-blurb");
    if (!needsMeta) return;

    try {
      const meta = await loadBookMeta();
      renderBookMetaPanels(meta);
      applyContinueReading(meta, primaryCta, heroCta, secondaryCta);
    } catch (err) {
      if (statsEl) {
        statsEl.textContent = "Full manuscript draft available in the reader.";
      }
      setManuscriptMapMessage("Manuscript map unavailable — open the reader to browse sections.");
      console.error(err);
    }
  }

  async function init() {
    const tasks = [];

    if (newsList) {
      tasks.push(
        loadJson("news.json")
          .then(renderNews)
          .catch(function () {
            if (newsEmpty) {
              newsEmpty.hidden = false;
              newsEmpty.textContent = "News could not be loaded. Try again later.";
            }
          })
      );
    }

    if (discordLinks.length) {
      tasks.push(
        loadJson("site.json")
          .then(function (cfg) {
            applyDiscord(cfg && cfg.discordInviteUrl);
          })
          .catch(function () {})
      );
    }

    tasks.push(renderBookTeaser());
    tasks.push(renderCitationLocks());
    tasks.push(renderPrePrintPanel());

    await Promise.all(tasks);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
