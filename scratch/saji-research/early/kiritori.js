


    (() => {
      "use strict";

      const state = {
        objects: { board: false, lettuce: false },
        source: { kanji: false, kana: false, wrong: false },
        selectedTool: "saw",
        phase: 1,
        wrongVisible: false,
        cutGesture: null,
        tileNumber: 0,
        noneClicks: 0,
        clearRecorded: false
      };

      const objectData = {
        board: { letters: "ITA", bank: "boardBank", card: "boardCard" },
        lettuce: { letters: "RETASU", bank: "lettuceBank", card: "lettuceCard" }
      };

      const answerArea = document.getElementById("answerArea");
      const answerSlotsElement = document.getElementById("answerSlots");
      const answerSlots = [...document.querySelectorAll(".answer-slot")];
      const cutSource = document.getElementById("cutSource");
      const wrongSource = document.getElementById("wrongSource");
      const wrongBank = document.getElementById("wrongBank");
      const gameTitle = document.getElementById("gameTitle");
      const clearModal = document.getElementById("clearModal");
      const statsModal = document.getElementById("statsModal");
      const playCount = document.getElementById("playCount");
      const clearCount = document.getElementById("clearCount");
      const cutStage = document.getElementById("cutStage");
      const toolToggle = document.getElementById("toolToggle");
      const toolMenu = document.getElementById("toolMenu");

      const pointInRect = (x, y, rect, padding = 0) => (
        x >= rect.left - padding && x <= rect.right + padding &&
        y >= rect.top - padding && y <= rect.bottom + padding
      );

      const createTile = (letter, home, delay = 0) => {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "letter-tile";
        tile.textContent = letter;
        tile.setAttribute("aria-label", `${letter}の文字`);
        tile.style.animationDelay = `${delay}ms`;
        tile.dataset.tileId = String(++state.tileNumber);
        tile._home = home;
        home.classList.add("has-pieces");
        home.appendChild(tile);
        tile.addEventListener("click", handleTileClick);
        return tile;
      };

      const releaseObject = (name) => {
        if (state.objects[name]) return;
        state.objects[name] = true;
        const data = objectData[name];
        const card = document.getElementById(data.card);
        const bank = document.getElementById(data.bank);

        if (name === "lettuce") card.classList.add("flash-cut");
        card.classList.add("is-cut");
        [...data.letters].forEach((letter, index) => createTile(letter, bank, 75 + index * 48));
      };

      const chooseTool = (tool) => {
        state.selectedTool = tool;
        const labels = { none: "なし", saw: "のこぎり", knife: "包丁" };
        toolToggle.textContent = `TOOLS：${labels[tool]}`;
        document.querySelectorAll(".tool-choice").forEach(choice => {
          const selected = choice.dataset.tool === tool;
          choice.classList.toggle("is-selected", selected);
          choice.setAttribute("aria-checked", String(selected));
        });
        cutStage.classList.toggle("tool-active", tool !== "none");
        const answerEditable = tool === "none" && !state.source.kanji;
        const wrongEditable = tool === "none" && state.wrongVisible && !state.source.wrong;
        cutSource.classList.toggle("tool-locked", !answerEditable);
        wrongSource.classList.toggle("tool-locked", !wrongEditable);
        cutSource.setAttribute("contenteditable", String(answerEditable));
        wrongSource.setAttribute("contenteditable", String(wrongEditable));
        if (!answerEditable && document.activeElement === cutSource) {
          window.getSelection().removeAllRanges();
          cutSource.blur();
        }
        if (!wrongEditable && document.activeElement === wrongSource) {
          window.getSelection().removeAllRanges();
          wrongSource.blur();
        }
        toolMenu.hidden = true;
        toolToggle.setAttribute("aria-expanded", "false");
      };

      toolToggle.addEventListener("click", () => {
        const willOpen = toolMenu.hidden;
        toolMenu.hidden = !willOpen;
        toolToggle.setAttribute("aria-expanded", String(willOpen));
      });

      const getVisitorId = () => {
        const key = "kiritoriVisitorId";
        let visitorId = localStorage.getItem(key);
        if (!visitorId) {
          visitorId = typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
          localStorage.setItem(key, visitorId);
        }
        return visitorId;
      };

      const statsRequest = async (action = "") => {
        const options = action
          ? {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action, visitorId: getVisitorId() })
            }
          : { cache: "no-store" };
        const response = await fetch("stats.php", options);
        if (!response.ok) throw new Error("stats unavailable");
        return response.json();
      };

      const openStats = async () => {
        statsModal.hidden = false;
        playCount.textContent = "…";
        clearCount.textContent = "…";
        document.getElementById("closeStats").focus();
        try {
          const stats = await statsRequest();
          playCount.textContent = String(stats.plays);
          clearCount.textContent = String(stats.clears);
        } catch (_) {
          playCount.textContent = "—";
          clearCount.textContent = "—";
        }
      };

      statsRequest("visit").catch(() => {});

      document.querySelectorAll(".tool-choice").forEach(choice => {
        choice.addEventListener("click", () => {
          if (choice.dataset.tool === "none") {
            state.noneClicks += 1;
            if (state.noneClicks >= 8) {
              state.noneClicks = 0;
              openStats();
            }
          } else {
            state.noneClicks = 0;
          }
          chooseTool(choice.dataset.tool);
        });
      });

      document.addEventListener("pointerdown", (event) => {
        if (!event.target.closest(".toolbox")) {
          toolMenu.hidden = true;
          toolToggle.setAttribute("aria-expanded", "false");
        }
      });

      const startCutGesture = (event) => {
        if (state.selectedTool === "none") return;
        if (event.button !== undefined && event.button !== 0) return;
        if (event.target.closest(".letter-tile")) return;
        event.preventDefault();
        cutStage.setPointerCapture(event.pointerId);
        state.cutGesture = {
          type: state.selectedTool,
          pointerId: event.pointerId,
          lastX: event.clientX,
          lastY: event.clientY,
          lastTime: performance.now(),
          sawAnchor: null,
          sawVector: null,
          sawTurns: 0,
          touchedWrong: false
        };
      };

      const moveCutGesture = (event) => {
        const drag = state.cutGesture;
        if (!drag || event.pointerId !== drag.pointerId) return;
        event.preventDefault();

        const now = performance.now();
        const dx = event.clientX - drag.lastX;
        const dy = event.clientY - drag.lastY;
        const elapsed = Math.max(1, now - drag.lastTime);
        const speed = Math.hypot(dx, dy) / elapsed;
        const boardRect = document.getElementById("boardShape").getBoundingClientRect();
        const lettuceRect = document.getElementById("lettuceShape").getBoundingClientRect();
        const onBoard = pointInRect(event.clientX, event.clientY, boardRect, 8);
        const onLettuce = pointInRect(event.clientX, event.clientY, lettuceRect, 8);

        document.getElementById("boardCard").classList.toggle("tool-over", onBoard && !state.objects.board);
        document.getElementById("lettuceCard").classList.toggle("tool-over", onLettuce && !state.objects.lettuce);

        if (drag.type === "saw" && onBoard && !state.objects.board) {
          if (drag.sawAnchor === null) {
            drag.sawAnchor = { x: event.clientX, y: event.clientY };
          }
          const travelX = event.clientX - drag.sawAnchor.x;
          const travelY = event.clientY - drag.sawAnchor.y;
          const travel = Math.hypot(travelX, travelY);
          if (travel >= 15) {
            const vector = { x: travelX / travel, y: travelY / travel };
            if (drag.sawVector) {
              const directionDot = drag.sawVector.x * vector.x + drag.sawVector.y * vector.y;
              if (directionDot <= -0.55) drag.sawTurns += 1;
            }
            drag.sawVector = vector;
            drag.sawAnchor = { x: event.clientX, y: event.clientY };
            const groove = document.getElementById("sawGroove");
            groove.style.height = `${Math.min(62, 8 + drag.sawTurns * 11)}px`;
            if (drag.sawTurns >= 5) releaseObject("board");
          }
        } else if (!onBoard) {
          drag.sawAnchor = null;
          drag.sawVector = null;
        }

        if (drag.type === "knife" && onLettuce && !state.objects.lettuce && speed >= 0.55 && Math.hypot(dx, dy) >= 12) {
          releaseObject("lettuce");
        }

        if ((drag.type === "saw" && onLettuce) || (drag.type === "knife" && onBoard)) {
          drag.touchedWrong = true;
        }

        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
        drag.lastTime = now;
      };

      const endCutGesture = (event) => {
        const drag = state.cutGesture;
        if (!drag || event.pointerId !== drag.pointerId) return;
        document.querySelectorAll(".cut-target").forEach(card => card.classList.remove("tool-over"));
        state.cutGesture = null;
      };

      cutStage.addEventListener("pointerdown", startCutGesture);
      cutStage.addEventListener("pointermove", moveCutGesture);
      cutStage.addEventListener("pointerup", endCutGesture);
      cutStage.addEventListener("pointercancel", endCutGesture);

      const returnTileHome = (tile) => {
        const home = tile._home;
        const tileId = Number(tile.dataset.tileId);
        const next = [...home.querySelectorAll(":scope > .letter-tile")]
          .find(candidate => Number(candidate.dataset.tileId) > tileId);
        home.insertBefore(tile, next || null);
      };

      const handleTileClick = (event) => {
        const tile = event.currentTarget;
        const parent = tile.parentElement;
        if (parent.classList.contains("answer-slot")) {
          returnTileHome(tile);
          return;
        }
        const emptySlot = answerSlots.find(slot => !slot.hidden && !slot.querySelector(".letter-tile"));
        if (emptySlot) emptySlot.appendChild(tile);
      };

      const sourceSelection = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
        const range = selection.getRangeAt(0);
        for (const source of [cutSource, wrongSource]) {
          if (!source.contains(range.commonAncestorContainer)) continue;
          const chars = [...source.querySelectorAll(".source-char")].filter(char => {
            try { return range.intersectsNode(char) && !char.classList.contains("is-cut"); }
            catch (_) { return false; }
          });
          if (chars.length) return { source, chars };
        }
        return null;
      };

      document.addEventListener("cut", (event) => {
        const selected = sourceSelection();
        if (!selected) return;
        if (state.selectedTool !== "none") {
          event.preventDefault();
          window.getSelection().removeAllRanges();
          selected.source.blur();
          return;
        }
        event.preventDefault();
        const bank = selected.source === wrongSource ? wrongBank : document.getElementById("sourceBank");
        let copied = "";
        let delay = 0;

        selected.chars.forEach(char => {
          const kind = char.dataset.sourceChar;
          if (state.source[kind]) return;
          state.source[kind] = true;
          const letters = kind === "kanji" ? "KOTA" : kind === "kana" ? "E" : "CHIGAUYO";
          copied += letters;
          char.classList.add("is-cut");
          [...letters].forEach(letter => {
            createTile(letter, bank, delay);
            delay += 45;
          });
        });

        if (event.clipboardData) event.clipboardData.setData("text/plain", copied);
        window.getSelection().removeAllRanges();
        if (state.source.kanji) {
          cutSource.setAttribute("contenteditable", "false");
          cutSource.classList.add("is-exhausted");
        }
        if (state.source.wrong) {
          wrongSource.setAttribute("contenteditable", "false");
          wrongSource.classList.add("is-exhausted");
        }
        selected.source.blur();
      });

      const protectSource = (source, expected) => {
        source.addEventListener("beforeinput", (event) => event.preventDefault());
        source.addEventListener("keydown", (event) => {
          const shortcut = (event.metaKey || event.ctrlKey) && ["a", "c", "x"].includes(event.key.toLowerCase());
          if (!shortcut && (event.key.length === 1 || ["Backspace", "Delete", "Enter"].includes(event.key))) {
            event.preventDefault();
          }
        });
        source.addEventListener("input", () => {
          [...source.childNodes].forEach(node => {
            if (node.nodeType !== Node.ELEMENT_NODE || !node.classList.contains("source-char")) node.remove();
          });
          source.querySelectorAll(".source-char").forEach(char => {
            char.textContent = expected[char.dataset.sourceChar];
          });
        });
        source.addEventListener("paste", (event) => event.preventDefault());
        source.addEventListener("drop", (event) => event.preventDefault());
      };

      protectSource(cutSource, { kanji: "答", kana: "え" });
      protectSource(wrongSource, { wrong: "違うよ" });

      const showWrong = () => {
        state.wrongVisible = true;
        wrongSource.classList.add("is-visible");
        chooseTool(state.selectedTool);
      };

      const consumeAnswerTiles = () => {
        answerSlots.forEach(slot => {
          const tile = slot.querySelector(".letter-tile");
          if (tile) tile.remove();
        });
      };

      const hideWrongSource = () => {
        state.wrongVisible = false;
        wrongSource.classList.remove("is-visible");
        wrongSource.classList.add("tool-locked");
        wrongSource.setAttribute("contenteditable", "false");
        window.getSelection().removeAllRanges();
        wrongSource.blur();
      };

      const rejectAnswer = () => {
        showWrong();
        answerArea.classList.remove("wrong");
        void answerArea.offsetWidth;
        answerArea.classList.add("wrong");
      };

      const enterSecondPhase = () => {
        state.phase = 2;
        gameTitle.textContent = "ホタテを見つけよう";
        consumeAnswerTiles();
        hideWrongSource();
        answerSlots[6].hidden = true;
        answerSlotsElement.classList.add("is-six");
        answerSlotsElement.setAttribute("aria-label", "6文字の答え");
      };

      document.getElementById("checkButton").addEventListener("click", () => {
        const activeSlots = answerSlots.filter(slot => !slot.hidden);
        const filled = activeSlots.every(slot => slot.querySelector(".letter-tile"));
        const answer = activeSlots.map(slot => slot.textContent.trim()).join("");
        if (state.phase === 1 && filled && answer === "OTAKARA") {
          enterSecondPhase();
          return;
        }
        if (state.phase === 2 && filled && answer === "HOTATE") {
          clearModal.hidden = false;
          if (!state.clearRecorded) {
            state.clearRecorded = true;
            statsRequest("clear").catch(() => {});
          }
          document.getElementById("closeModal").focus();
          return;
        }
        rejectAnswer();
      });

      document.getElementById("closeModal").addEventListener("click", () => {
        clearModal.hidden = true;
      });

      clearModal.addEventListener("click", (event) => {
        if (event.target === clearModal) clearModal.hidden = true;
      });

      document.getElementById("closeStats").addEventListener("click", () => {
        statsModal.hidden = true;
      });

      statsModal.addEventListener("click", (event) => {
        if (event.target === statsModal) statsModal.hidden = true;
      });

      const shareText = "WEB謎「kiritori」を解きました！\n\nhttps://sajiqook.jp/game/kiritori\n\n\n#kiritori\nhttps://x.com/saji_qook/status/2095285673003811273?s=20";
      document.getElementById("shareButton").href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

      document.getElementById("clearAnswerButton").addEventListener("click", () => {
        answerSlots.forEach(slot => {
          const tile = slot.querySelector(".letter-tile");
          if (tile) returnTileHome(tile);
        });
      });
    })();
  
