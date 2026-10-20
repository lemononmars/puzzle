


    (() => {
      "use strict";

      const unpack = (encoded) => new TextDecoder().decode(
        Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0))
      );

      const COLORS = {
        red:    { jp: unpack("44GC44GL"),         en: unpack("44KM44Gj44Gp"),     color: "#ef3c48", rgb: "239, 60, 72" },
        orange: { jp: unpack("44Gg44GE44Gg44GE"), en: unpack("44GK44KM44KT44GY"), color: "#f08a32", rgb: "240, 138, 50" },
        yellow: { jp: unpack("44GN"),             en: unpack("44GE44GI44KN44O8"), color: "#f4ca3a", rgb: "244, 202, 58" },
        green:  { jp: unpack("44G/44Gp44KK"),     en: unpack("44GQ44KK44O844KT"), color: "#36a96b", rgb: "54, 169, 107" },
        blue:   { jp: unpack("44GC44GK"),         en: unpack("44G244KL44O8"),     color: "#398de2", rgb: "57, 141, 226" },
        purple: { jp: unpack("44KA44KJ44GV44GN"), en: unpack("44Gx44O844G344KL"), color: "#8c55c7", rgb: "140, 85, 199" },
        pink:   { jp: unpack("44KC44KC"),         en: unpack("44G044KT44GP"),     color: "#ef83ae", rgb: "239, 131, 174" },
        black:  { jp: unpack("44GP44KN"),         en: unpack("44G244KJ44Gj44GP"), color: "#252631", rgb: "37, 38, 49" },
        white:  { jp: unpack("44GX44KN"),         en: unpack("44G744KP44GE44Go"), color: "#f3f0df", rgb: "243, 240, 223" },
        gray:   { jp: unpack("44Gv44GE"),         en: unpack("44GQ44KM44O8"),     color: "#8a8f9b", rgb: "138, 143, 155" },
        brown:  { jp: unpack("44Gh44KD"),         en: unpack("44G244KJ44GG44KT"), color: "#8b593f", rgb: "139, 89, 63" }
      };

      const TOKEN = unpack("44GK44Gp44KN44GN");
      const SOURCE_WARNING = unpack("44KE44KL44KT44Gg44Gq77yB77yf5LuK4oCm77yB44GT44GT44Gn77yB");
      const unlocked = new Set(["red", "pink", "purple"]);
      const paletteOrder = ["pink", "purple"];
      const buffer = [];

      const palette = document.getElementById("palette");
      const redDot = document.getElementById("redDot");
      const letterRow = document.getElementById("letterRow");
      const inputTrail = document.getElementById("inputTrail");
      const enterButton = document.getElementById("enterButton");
      const undoButton = document.getElementById("undoButton");
      const clearInputButton = document.getElementById("clearButton");
      const consolePanel = document.getElementById("console");
      const message = document.getElementById("message");
      const clearDialog = document.getElementById("clearDialog");
      const clearTitle = document.getElementById("clearTitle");
      const clearCopy = document.getElementById("clearCopy");
      const closeButton = document.getElementById("closeButton");
      const shareButton = document.getElementById("shareButton");
      const langButtons = [...document.querySelectorAll(".lang-button")];
      const recordDialog = document.getElementById("recordDialog");
      const recordClose = document.getElementById("recordClose");
      const playCount = document.getElementById("playCount");
      const clearCount = document.getElementById("clearCount");

      let selectedColor = "purple";
      let language = "jp";
      let secretTapCount = 0;
      let secretTapLang = null;

      const statsEndpoint = "stats.php";
      const visitorStorageKey = "iroiro-global-visitor-id";

      const createVisitorId = () => {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
          return window.crypto.randomUUID();
        }

        return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
      };

      const visitorId = (() => {
        try {
          const saved = localStorage.getItem(visitorStorageKey);
          if (saved) {
            return saved;
          }

          const created = createVisitorId();
          localStorage.setItem(visitorStorageKey, created);
          return created;
        } catch {
          return createVisitorId();
        }
      })();

      const applyStats = (stats) => {
        if (!stats || !Number.isFinite(stats.challengers) || !Number.isFinite(stats.clears)) {
          return;
        }

        playCount.textContent = String(stats.challengers);
        clearCount.textContent = String(stats.clears);
      };

      const syncStats = async (action = "read") => {
        try {
          const options = action === "read"
            ? { cache: "no-store" }
            : {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, visitorId })
              };
          const response = await fetch(statsEndpoint, options);
          if (!response.ok) {
            throw new Error("stats unavailable");
          }
          applyStats(await response.json());
        } catch {
          playCount.textContent = "—";
          clearCount.textContent = "—";
        }
      };

      syncStats("visit");

      clearTitle.textContent = unpack("5q2j6Kej77yB");
      clearCopy.textContent = unpack("6KaL5LqL6ama44GN44KS44G/44Gk44GR44Gf77yB");

      const setActiveColor = () => {
        const active = COLORS[selectedColor];
        document.documentElement.style.setProperty("--active-color", active.color);
        document.documentElement.style.setProperty("--active-rgb", active.rgb);
      };

      const renderPalette = () => {
        palette.replaceChildren();

        paletteOrder.forEach((colorId, index) => {
          const color = COLORS[colorId];
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "color-dot";
          dot.style.setProperty("--dot-color", color.color);
          dot.dataset.color = colorId;
          dot.setAttribute("aria-label", `${index + 1}番目の色`);
          dot.setAttribute("aria-pressed", String(selectedColor === colorId));
          dot.classList.toggle("is-active", selectedColor === colorId);
          dot.addEventListener("click", () => selectColor(colorId));
          palette.append(dot);
        });

        redDot.classList.toggle("is-active", selectedColor === "red");
        redDot.setAttribute("aria-pressed", String(selectedColor === "red"));
      };

      const createButtons = () => {
        Array.from({ length: 4 }, (_, index) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "letter-button";
          button.addEventListener("click", () => {
            const character = [...COLORS[selectedColor][language]][index];
            if (character === undefined) {
              return;
            }
            buffer.push({ character, color: selectedColor, language, index });
            renderTrail();
            message.textContent = "";
            button.classList.add("is-pressed");
            window.setTimeout(() => button.classList.remove("is-pressed"), 140);
          });
          letterRow.append(button);
        });
      };

      const renderButtons = () => {
        const characters = [...COLORS[selectedColor][language]];

        [...letterRow.children].forEach((button, index) => {
          const disabled = characters[index] === undefined;
          button.disabled = disabled;
          button.setAttribute(
            "aria-label",
            disabled ? `${index + 1}番目のボタン（使用不可）` : `${index + 1}番目のボタン`
          );
        });
      };

      const renderTrail = () => {
        inputTrail.replaceChildren();
        buffer.forEach(() => {
          const dot = document.createElement("span");
          dot.className = "trail-dot";
          inputTrail.append(dot);
        });
        inputTrail.setAttribute("aria-label", `${buffer.length}文字入力中`);
        undoButton.disabled = buffer.length === 0;
        clearInputButton.disabled = buffer.length === 0;
      };

      const selectColor = (colorId) => {
        if (!unlocked.has(colorId)) {
          return;
        }
        selectedColor = colorId;
        setActiveColor();
        renderPalette();
        renderButtons();
      };

      const setLanguage = (nextLanguage) => {
        language = nextLanguage;
        langButtons.forEach((button) => {
          const active = button.dataset.lang === language;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", String(active));
        });
        renderButtons();
      };

      const resetBuffer = () => {
        buffer.length = 0;
        renderTrail();
      };

      const shake = () => {
        consolePanel.classList.remove("shake");
        void consolePanel.offsetWidth;
        consolePanel.classList.add("shake");
      };

      const findColor = (value) => Object.entries(COLORS).find(([, names]) => (
        names.jp === value || names.en === value
      ));

      const solve = () => {
        message.textContent = "";
        resetBuffer();
        syncStats("clear");
        if (typeof clearDialog.showModal === "function") {
          clearDialog.showModal();
        } else {
          clearDialog.setAttribute("open", "");
        }
      };

      const submit = () => {
        const value = buffer.map((item) => item.character).join("");

        if (!value) {
          message.textContent = "ボタンを押してみよう";
          shake();
          return;
        }

        if (value === TOKEN && unlocked.has("blue")) {
          solve();
          return;
        }

        const colorEntry = findColor(value);
        if (colorEntry) {
          const [colorId] = colorEntry;

          if (unlocked.has(colorId)) {
            message.textContent = "その色はもう見つけているみたい";
            shake();
            resetBuffer();
            return;
          }

          unlocked.add(colorId);
          paletteOrder.push(colorId);
          selectedColor = colorId;
          setActiveColor();
          renderPalette();
          renderButtons();
          resetBuffer();
          message.textContent = "新しい色を見つけた！";
          return;
        }

        message.textContent = "何も起こらないようだ";
        shake();
        resetBuffer();
      };

      redDot.addEventListener("click", () => selectColor("red"));
      const trackSecretTap = async (tappedLang) => {
        secretTapCount = secretTapLang === null || secretTapLang === tappedLang ? 1 : secretTapCount + 1;
        secretTapLang = tappedLang;

        if (secretTapCount < 8) {
          return;
        }

        secretTapCount = 0;
        secretTapLang = null;
        await syncStats("read");

        if (!recordDialog.open) {
          if (typeof recordDialog.showModal === "function") {
            recordDialog.showModal();
          } else {
            recordDialog.setAttribute("open", "");
          }
        }
      };

      langButtons.forEach((button) => {
        button.addEventListener("click", () => {
          setLanguage(button.dataset.lang);
          trackSecretTap(button.dataset.lang);
        });
      });

      recordClose.addEventListener("click", () => {
        if (typeof recordDialog.close === "function") {
          recordDialog.close();
        } else {
          recordDialog.removeAttribute("open");
        }
      });
      enterButton.addEventListener("click", submit);
      undoButton.addEventListener("click", () => {
        buffer.pop();
        renderTrail();
        message.textContent = "";
      });
      clearInputButton.addEventListener("click", () => {
        resetBuffer();
        message.textContent = "";
      });
      consolePanel.addEventListener("animationend", () => consolePanel.classList.remove("shake"));

      closeButton.addEventListener("click", () => {
        if (typeof clearDialog.close === "function") {
          clearDialog.close();
        } else {
          clearDialog.removeAttribute("open");
        }
      });

      shareButton.addEventListener("click", () => {
        const shareUrl = "https://sajiqook.jp/game/iroiro";
        // 告知ポストの URL。公開後にここへ貼ると、ハッシュタグの下に改行して差し込まれる。
        const originalPostUrl = "https://x.com/saji_qook/status/2093113455444365584?s=20";
        const params = new URLSearchParams({
          text: `WEB謎『色々』を解きました！\n${shareUrl}\n\n#iroiro${originalPostUrl ? `\n${originalPostUrl}` : ""}`
        });
        window.open(`https://twitter.com/intent/tweet?${params.toString()}`, "_blank", "noopener,noreferrer");
      });

      const warnSourceView = () => window.alert(SOURCE_WARNING);
      const isSourceShortcut = (event) => {
        const key = event.key.toLowerCase();
        const sourceKey = key === "u" || event.code === "KeyU";
        const windowsSource = event.ctrlKey && !event.altKey && sourceKey;
        const macSource = event.metaKey && event.altKey && sourceKey;
        return windowsSource || macSource;
      };

      document.addEventListener("keydown", (event) => {
        if (!isSourceShortcut(event)) {
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        warnSourceView();
      }, true);

      window.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !clearDialog.open && !recordDialog.open) {
          event.preventDefault();
          submit();
        }
        if ((event.key === "Backspace" || event.key === "Escape") && buffer.length && !clearDialog.open && !recordDialog.open) {
          event.preventDefault();
          buffer.pop();
          renderTrail();
        }
      });

      setActiveColor();
      renderPalette();
      createButtons();
      renderButtons();
      renderTrail();
    })();
  
