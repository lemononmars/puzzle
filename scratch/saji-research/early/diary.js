

    (() => {
      "use strict";

      const CH = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--cell"));
      const text = "そこは静かなのだろう。週末、消す準備は済ませた。君を守るためだ";
      const board = document.getElementById("board");
      const puzzle = document.getElementById("puzzle");
      const calendarHead = document.querySelector(".calendar-head");
      const form = document.getElementById("answerForm");
      const input = document.getElementById("answer");
      const result = document.getElementById("result");
      const successDialog = document.getElementById("successDialog");
      const dialogClose = document.getElementById("dialogClose");
      const shareButton = document.getElementById("shareButton");
      const statsTrigger = document.getElementById("statsTrigger");
      const recordDialog = document.getElementById("recordDialog");
      const recordClose = document.getElementById("recordClose");
      const challengeCount = document.getElementById("challengeCount");
      const clearCount = document.getElementById("clearCount");
      const siteMenu = document.getElementById("siteMenu");
      const menuTrigger = document.getElementById("menuTrigger");
      const menuPanel = document.getElementById("menuPanel");
      const menuLinks = [...menuPanel.querySelectorAll("a")];
      const vv = window.visualViewport;
      const entries = [...Array(6).fill("　"), ...text];
      let frame = 0;
      let secretTapCount = 0;

      const recordState = {
        challengers: null,
        clears: null
      };
      const statsEndpoint = "stats.php";
      const visitorStorageKey = "diary-global-visitor-id";

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

        recordState.challengers = stats.challengers;
        recordState.clears = stats.clears;
        challengeCount.textContent = String(stats.challengers);
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
          challengeCount.textContent = "—";
          clearCount.textContent = "—";
        }
      };

      syncStats("visit");

      const setMenuOpen = (isOpen) => {
        siteMenu.classList.toggle("is-open", isOpen);
        menuTrigger.setAttribute("aria-expanded", String(isOpen));
        menuPanel.setAttribute("aria-hidden", String(!isOpen));
        menuPanel.inert = !isOpen;
        menuLinks.forEach((link) => {
          link.tabIndex = isOpen ? 0 : -1;
        });
      };

      menuTrigger.addEventListener("click", () => {
        setMenuOpen(menuTrigger.getAttribute("aria-expanded") !== "true");
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuTrigger.getAttribute("aria-expanded") === "true") {
          setMenuOpen(false);
          menuTrigger.focus();
        }
      });

      entries.forEach((character, index) => {
        const cell = document.createElement("span");
        const glyph = document.createElement("span");
        cell.className = "cell";
        glyph.className = "glyph";
        glyph.textContent = character;
        cell.append(glyph);

        if (index < 6) {
          cell.setAttribute("aria-hidden", "true");
        }
        if (index % 7 === 0) {
          cell.classList.add("is-sunday");
        }
        if (index === 32) {
          cell.classList.add("marked");
        }

        board.append(cell);
      });

      const viewportWidth = () => (vv ? vv.width : window.innerWidth);
      const viewportLeft = () => (vv ? vv.offsetLeft : 0);
      const desktopLayout = window.matchMedia("(hover: hover) and (pointer: fine)");

      const columnCount = (width) => {
        if (!desktopLayout.matches) {
          return Math.max(1, Math.floor(width / CH));
        }

        if (width < 540) {
          return Math.max(1, Math.min(6, Math.floor(width / 75)));
        }

        if (width <= 650) {
          return 7;
        }

        return Math.max(8, Math.floor(width / 75));
      };

      const layout = () => {
        frame = 0;
        const width = viewportWidth();
        const left = viewportLeft();
        const cols = columnCount(width);
        document.documentElement.style.setProperty("--viewport-width", `${width}px`);
        document.documentElement.style.setProperty("--viewport-left", `${left}px`);
        board.style.gridTemplateColumns = `repeat(${cols}, ${CH}px)`;
      };

      const requestLayout = () => {
        if (!frame) {
          frame = window.requestAnimationFrame(layout);
        }
      };

      if (vv) {
        vv.addEventListener("resize", requestLayout);
        vv.addEventListener("scroll", requestLayout);
      }
      window.addEventListener("resize", requestLayout);
      layout();

      const accepted = [
        ["こ", "ろ", "す", "た", "め"].join(""),
        ["コ", "ロ", "ス", "タ", "メ"].join(""),
        ["殺", "す", "た", "め"].join(""),
        ["殺", "す", "為"].join(""),
        ["こ", "ろ", "す", "為"].join("")
      ];

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = input.value.trim().replaceAll(" ", "").replaceAll("　", "");

        if (accepted.includes(value)) {
          puzzle.classList.add("solved");
          calendarHead.setAttribute("aria-hidden", "false");
          result.textContent = "せいかい";
          input.setAttribute("aria-invalid", "false");
          syncStats("clear");
          if (!successDialog.open) {
            successDialog.showModal();
          }
          return;
        }

        if (successDialog.open) {
          successDialog.close();
        }
        puzzle.classList.remove("solved");
        calendarHead.setAttribute("aria-hidden", "true");
        result.textContent = "ちがうみたい";
        input.setAttribute("aria-invalid", "true");
        form.classList.remove("shake");
        void form.offsetWidth;
        form.classList.add("shake");
      });

      form.addEventListener("animationend", () => {
        form.classList.remove("shake");
      });

      dialogClose.addEventListener("click", () => {
        successDialog.close();
      });

      shareButton.addEventListener("click", () => {
        const shareUrl = "https://sajiqook.jp/game/diary";
        const originalPostUrl = "https://x.com/saji_qook/status/2092748934129017086?s=20";
        const params = new URLSearchParams({
          text: `WEB謎『日曜日の予定』を解きました！\n${shareUrl}\n\n#日曜日の予定\n${originalPostUrl}`
        });

        window.open(`https://twitter.com/intent/tweet?${params.toString()}`, "_blank", "noopener,noreferrer");
      });

      statsTrigger.addEventListener("click", async () => {
        secretTapCount += 1;

        if (secretTapCount < 8) {
          return;
        }

        secretTapCount = 0;
        await syncStats("read");

        if (!recordDialog.open) {
          recordDialog.showModal();
        }
      });

      recordClose.addEventListener("click", () => {
        recordDialog.close();
      });
    })();
  
