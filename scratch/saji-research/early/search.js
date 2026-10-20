


    (() => {
      "use strict";

      const clues = [
        "①・〜・",
        "④「〜」",
        "⑥一〜ー",
        "③丸〜丸",
        "⑤息継ぎ〜息継ぎ",
        "②　〜　"
      ];
      const rowMarks = ["①", "④", "⑥", "③", "⑤", "②"];
      const encodedTargets = [
        "44O76KGM56m644GN44O7",
        "44CM5pu444GN5q6L44GX44CN",
        "5LiA44Gk44Gu44OR44K544Ov44O8",
        "44CC5bem5Y+z44Gu5paH5a2X44Gv5YuV44GL44Gq44GE44CC",
        "44CB5ZCM5LiA44Gq44KJ44CB",
        "44CA5paH5a2X44KS5pu444GN5YaZ44GZ44CA"
      ];
      const targetTexts = encodedTargets.map((value) => decodeURIComponent(escape(atob(value))));
      const solved = new Set();
      const history = [];
      const wrongEntries = [];
      const wrongGroups = new Map();

      const puzzleText = document.getElementById("puzzleText");
      const passwordLabel = document.getElementById("passwordLabel");
      const targetElements = targetTexts.map((_, index) => document.querySelector(`[data-target="${index}"]`));
      const checkItems = [...document.querySelectorAll(".check-item")];
      const clipboardArrow = document.querySelector(".clipboard-arrow");
      const wrongLog = document.getElementById("wrongLog");
      const undoButton = document.getElementById("undoButton");
      const resetButton = document.getElementById("resetButton");
      const clipboardShell = document.getElementById("clipboardShell");
      const clipboardToggle = document.getElementById("clipboardToggle");
      const answerForm = document.getElementById("answerForm");
      const answerInput = document.getElementById("answerInput");
      const answerStatus = document.getElementById("answerStatus");
      const app = document.getElementById("app");
      const introModal = document.getElementById("introModal");
      const introStart = document.getElementById("introStart");
      const successModal = document.getElementById("successModal");
      const xShareButton = document.getElementById("xShareButton");
      const modalClose = document.getElementById("modalClose");
      const recordModal = document.getElementById("recordModal");
      const recordClose = document.getElementById("recordClose");
      const playCount = document.getElementById("playCount");
      const clearCount = document.getElementById("clearCount");
      const toast = document.getElementById("toast");
      let toastTimer = 0;
      let lastFocusedElement = null;
      let wrongSerial = 0;
      let resetTapCount = 0;

      const shareText = [
        "WEB謎「サーチテスト」を解きました！",
        "https://sajiqook.jp/game/search",
        "",
        "#サーチテスト",
        "https://x.com/saji_qook/status/2093846858804429133?s=20"
      ].join("\n");
      xShareButton.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

      const statsEndpoint = "stats.php";
      const visitorStorageKey = "search-test-global-visitor-id";

      function createVisitorId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
          return window.crypto.randomUUID();
        }

        return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
      }

      const visitorId = (() => {
        try {
          const saved = localStorage.getItem(visitorStorageKey);
          if (saved) return saved;
          const created = createVisitorId();
          localStorage.setItem(visitorStorageKey, created);
          return created;
        } catch {
          return createVisitorId();
        }
      })();

      function applyStats(stats) {
        if (!stats || !Number.isFinite(stats.plays) || !Number.isFinite(stats.clears)) return;
        playCount.textContent = String(stats.plays);
        clearCount.textContent = String(stats.clears);
      }

      async function syncStats(action = "read") {
        try {
          const options = action === "read"
            ? { cache: "no-store" }
            : {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, visitorId })
              };
          const response = await fetch(statsEndpoint, options);
          if (!response.ok) throw new Error("stats unavailable");
          applyStats(await response.json());
        } catch {
          playCount.textContent = "—";
          clearCount.textContent = "—";
        }
      }

      syncStats("visit");

      function normalize(value) {
        return value.normalize("NFKC").replace(/[\s　]/g, "");
      }

      function showToast(message) {
        window.clearTimeout(toastTimer);
        toast.textContent = message;
        toast.classList.add("show");
        toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1500);
      }

      function alignClipboardArrow() {
        const firstItem = checkItems[0];
        const textNode = [...firstItem.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.data.length >= 4);
        if (!textNode) return;

        const fourthCharacter = document.createRange();
        fourthCharacter.setStart(textNode, 3);
        fourthCharacter.setEnd(textNode, 4);

        clipboardArrow.style.transform = "none";
        const characterRect = fourthCharacter.getBoundingClientRect();
        const arrowRect = clipboardArrow.getBoundingClientRect();
        const offset = characterRect.left + characterRect.width / 2 - (arrowRect.left + arrowRect.width / 2);
        clipboardArrow.style.transform = `translateX(${offset}px)`;
      }

      function scheduleClipboardArrowAlignment() {
        window.requestAnimationFrame(alignClipboardArrow);
      }

      function setClipboardOpen(open) {
        clipboardShell.classList.toggle("open", open);
        clipboardShell.classList.remove("has-update");
        clipboardToggle.setAttribute("aria-expanded", String(open));
      }

      function markClipboardUpdated() {
        if (!clipboardShell.classList.contains("open")) {
          clipboardShell.classList.add("has-update");
        }
      }

      function renderWrongEntries() {
        wrongLog.replaceChildren();
        wrongEntries.forEach((entry) => {
          const line = document.createElement("div");
          line.className = "wrong-entry";
          line.dataset.wrongId = entry.id;

          const text = document.createElement("span");
          text.className = "wrong-entry-text";
          text.textContent = entry.value;

          const remove = document.createElement("button");
          remove.className = "wrong-remove";
          remove.type = "button";
          remove.dataset.removeWrong = entry.id;
          remove.setAttribute("aria-label", `「${entry.value}」を消す`);
          remove.textContent = "×";

          line.append(text, remove);
          wrongLog.appendChild(line);
        });
      }

      function eraseTarget(index) {
        const element = targetElements[index];
        element.classList.add("erased");
        element.setAttribute("aria-hidden", "true");
      }

      function restoreTarget(index) {
        const element = targetElements[index];
        element.classList.remove("erased");
        element.removeAttribute("aria-hidden");
      }

      function wrapWrongSelection(range, id) {
        const root = puzzleText.contains(range.commonAncestorContainer)
          ? puzzleText
          : passwordLabel.contains(range.commonAncestorContainer)
            ? passwordLabel
            : null;
        if (!root) return [];

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const parts = [];
        let node = walker.nextNode();

        while (node) {
          if (node.data && range.intersectsNode(node)) {
            const start = node === range.startContainer ? range.startOffset : 0;
            const end = node === range.endContainer ? range.endOffset : node.data.length;
            if (end > start) parts.push({ node, start, end });
          }
          node = walker.nextNode();
        }

        const spans = [];
        for (let i = parts.length - 1; i >= 0; i -= 1) {
          const part = parts[i];
          const selectedNode = part.node.splitText(part.start);
          selectedNode.splitText(part.end - part.start);

          const span = document.createElement("span");
          span.className = "wrong-selection";
          span.dataset.wrongSource = id;
          selectedNode.parentNode.insertBefore(span, selectedNode);
          span.appendChild(selectedNode);
          spans.unshift(span);
        }

        requestAnimationFrame(() => {
          spans.forEach((span) => span.classList.add("erased"));
        });
        return spans;
      }

      function unwrapWrongSpans(spans) {
        spans.forEach((span) => {
          if (!span.isConnected || !span.parentNode) return;
          const parent = span.parentNode;
          while (span.firstChild) parent.insertBefore(span.firstChild, span);
          span.remove();
          parent.normalize();
        });
      }

      function restoreWrongSource(id, animate = true) {
        const group = wrongGroups.get(id);
        if (!group) return;
        wrongGroups.delete(id);

        if (!animate) {
          unwrapWrongSpans(group.spans);
          return;
        }

        group.spans.forEach((span) => span.classList.remove("erased"));
        window.setTimeout(() => unwrapWrongSpans(group.spans), 700);
      }

      function removeWrongRecord(id, options = {}) {
        const { animate = true, removeHistory = true } = options;
        const entryIndex = wrongEntries.findIndex((entry) => entry.id === id);
        if (entryIndex < 0) return;

        wrongEntries.splice(entryIndex, 1);
        if (removeHistory) {
          let historyIndex = -1;
          for (let i = history.length - 1; i >= 0; i -= 1) {
            if (history[i].type === "wrong" && history[i].id === id) {
              historyIndex = i;
              break;
            }
          }
          if (historyIndex >= 0) history.splice(historyIndex, 1);
        }

        restoreWrongSource(id, animate);
        renderWrongEntries();
        undoButton.disabled = history.length === 0;
      }

      function completeTarget(index) {
        if (solved.has(index)) return;
        solved.add(index);
        history.push({ type: "correct", index });
        eraseTarget(index);

        const item = checkItems[index];
        item.textContent = `${rowMarks[index]}${targetTexts[index]}`;
        item.classList.add("done", "flash");
        scheduleClipboardArrowAlignment();
        window.setTimeout(() => item.classList.remove("flash"), 520);

        undoButton.disabled = false;
        markClipboardUpdated();
        showToast("コピーを記録しました");
      }

      function recordWrong(value, range) {
        const id = String(++wrongSerial);
        const spans = wrapWrongSelection(range, id);
        if (!spans.length) return;

        wrongGroups.set(id, { spans });
        wrongEntries.unshift({ id, value });
        history.push({ type: "wrong", id });
        renderWrongEntries();
        undoButton.disabled = false;
        markClipboardUpdated();
        showToast("クリップボードに追加しました");
      }

      function selectedInsidePuzzle(selection) {
        if (!selection.rangeCount) return false;
        const range = selection.getRangeAt(0);
        const insidePuzzle = puzzleText.contains(range.startContainer) && puzzleText.contains(range.endContainer);
        const insideLabel = passwordLabel.contains(range.startContainer) && passwordLabel.contains(range.endContainer);
        return insidePuzzle || insideLabel;
      }

      function handleClipboardAction(event) {
        if (!introModal.hidden) return;
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !selectedInsidePuzzle(selection)) return;

        const raw = selection.toString();
        const value = raw.replace(/\r\n/g, "\n");
        if (!value.trim()) return;
        const copiedRange = selection.getRangeAt(0).cloneRange();

        if (event.clipboardData) {
          event.preventDefault();
          event.clipboardData.setData("text/plain", value);
        }

        const index = targetTexts.findIndex((text, targetIndex) => text === value && !solved.has(targetIndex));
        window.setTimeout(() => {
          selection.removeAllRanges();
          if (index >= 0) completeTarget(index);
          else recordWrong(value, copiedRange);
        }, 0);
      }

      document.addEventListener("copy", handleClipboardAction);
      document.addEventListener("cut", handleClipboardAction);

      wrongLog.addEventListener("click", (event) => {
        const button = event.target.closest("[data-remove-wrong]");
        if (!button) return;
        removeWrongRecord(button.dataset.removeWrong);
        showToast("本文に戻しました");
      });

      clipboardToggle.addEventListener("click", () => {
        setClipboardOpen(!clipboardShell.classList.contains("open"));
      });

      undoButton.addEventListener("click", () => {
        const action = history.pop();
        if (!action) return;

        if (action.type === "correct") {
          solved.delete(action.index);
          restoreTarget(action.index);
          checkItems[action.index].textContent = clues[action.index];
          checkItems[action.index].classList.remove("done", "flash");
          scheduleClipboardArrowAlignment();
        } else {
          removeWrongRecord(action.id, { removeHistory: false });
        }

        undoButton.disabled = history.length === 0;
        showToast("一つ前の状態に戻しました");
      });

      resetButton.addEventListener("click", async () => {
        solved.clear();
        [...wrongGroups.keys()].forEach((id) => restoreWrongSource(id, false));
        history.length = 0;
        wrongEntries.length = 0;
        wrongSerial = 0;
        targetElements.forEach((_, index) => restoreTarget(index));
        checkItems.forEach((item, index) => {
          item.textContent = clues[index];
          item.classList.remove("done", "flash");
        });
        scheduleClipboardArrowAlignment();
        renderWrongEntries();
        undoButton.disabled = true;
        answerInput.value = "";
        answerStatus.textContent = "";
        setClipboardOpen(false);
        showToast("最初の状態に戻しました");

        resetTapCount += 1;
        if (resetTapCount >= 8) {
          resetTapCount = 0;
          await syncStats("read");
          recordModal.hidden = false;
          recordClose.focus();
        }
      });

      async function digest(value) {
        const bytes = new TextEncoder().encode(value);
        const hash = await crypto.subtle.digest("SHA-256", bytes);
        return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
      }

      answerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const value = normalize(answerInput.value);
        if (!value) {
          answerStatus.textContent = "入力してください";
          answerInput.focus();
          return;
        }

        const accepted = new Set([
          "f513806c222c8e2051883a1f01069ff68387fc7813cf1d87e325d17c705111b3",
          "1a46de2cb18690697d6561522b0217a64725afb93ac352f4c447c1bb42a1688e"
        ]);
        const valueHash = await digest(value);
        if (accepted.has(valueHash)) {
          answerStatus.textContent = "";
          lastFocusedElement = document.activeElement;
          syncStats("clear");
          successModal.hidden = false;
          modalClose.focus();
        } else {
          answerStatus.textContent = "認証できませんでした";
          const box = answerForm;
          box.classList.remove("shake");
          void box.offsetWidth;
          box.classList.add("shake");
        }
      });

      function closeModal() {
        successModal.hidden = true;
        if (lastFocusedElement) lastFocusedElement.focus();
      }

      introStart.addEventListener("click", () => {
        introModal.hidden = true;
        app.classList.remove("intro-locked");
        app.removeAttribute("inert");
        app.removeAttribute("aria-hidden");
      });

      modalClose.addEventListener("click", closeModal);
      successModal.addEventListener("click", (event) => {
        if (event.target === successModal) closeModal();
      });
      recordClose.addEventListener("click", () => {
        recordModal.hidden = true;
        resetButton.focus();
      });
      recordModal.addEventListener("click", (event) => {
        if (event.target === recordModal) {
          recordModal.hidden = true;
          resetButton.focus();
        }
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !successModal.hidden) closeModal();
        if (event.key === "Escape" && !recordModal.hidden) {
          recordModal.hidden = true;
          resetButton.focus();
        }
      });

      window.addEventListener("resize", scheduleClipboardArrowAlignment);
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", scheduleClipboardArrowAlignment);
      }
      scheduleClipboardArrowAlignment();

      introStart.focus();
    })();
  
