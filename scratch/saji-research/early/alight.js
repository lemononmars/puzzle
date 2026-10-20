


    (() => {
      "use strict";

      const unlock = value => {
        const raw = atob(value);
        return [...raw].map((char, index) => String.fromCharCode(
          char.charCodeAt(0) ^ ((173 + index * 29) & 255)
        )).join("");
      };
      const [bankA, bankB, bankC, answer] = unlock("+oKuUGRCGTTU8YSQRnQCLjrfy5i4SWMc").split("|");
      const banks = [bankA, bankB, bankC];
      const visualModes = ["white", "black", "orange"];

      const state = {
        mode: 0,
        isOn: true,
        darkCycles: 0,
        input: "",
        translated: false,
        translationTaps: 0,
        clearRecorded: false
      };

      const panel = document.getElementById("panel");
      const lightSwitch = document.getElementById("lightSwitch");
      const keys = [...document.querySelectorAll(".letter-key")];
      const inputMarks = document.getElementById("inputMarks");
      const backButton = document.getElementById("backButton");
      const clearButton = document.getElementById("clearButton");
      const clearModal = document.getElementById("clearModal");
      const translationButton = document.getElementById("translationButton");
      const xShare = document.getElementById("xShare");
      const statsModal = document.getElementById("statsModal");
      const playCount = document.getElementById("playCount");
      const clearCount = document.getElementById("clearCount");

      const copy = {
        original: {
          first: "MAKE THE RIGHT LIGHT,",
          second: "THEN FLIP THE SWITCH.",
          on: "ON",
          off: "OFF",
          input: "INPUT",
          back: "BACK",
          clear: "CLEAR",
          result: "You found the ideal light!",
          share: "SHARE ON X",
          close: "CLOSE"
        },
        translated: {
          first: "理想のLIGHTを作り",
          second: "スイッチを押そう。",
          on: "点灯",
          off: "消灯",
          input: "入力",
          back: "一つ戻す",
          clear: "消去",
          result: "理想の光を見つけた！",
          share: "Xでシェア",
          close: "閉じる"
        }
      };

      const renderLanguage = () => {
        const words = state.translated ? copy.translated : copy.original;
        document.documentElement.lang = state.translated ? "ja" : "en";
        translationButton.setAttribute("aria-pressed", String(state.translated));
        document.getElementById("instructionFirst").textContent = words.first;
        document.getElementById("instructionSecond").textContent = words.second;
        document.getElementById("onLabel").textContent = words.on;
        document.getElementById("offLabel").textContent = words.off;
        document.getElementById("inputLabel").textContent = words.input;
        backButton.textContent = words.back;
        clearButton.textContent = words.clear;
        document.getElementById("clearTitle").textContent = words.result;
        xShare.textContent = words.share;
        document.getElementById("closeModal").textContent = words.close;
      };

      const isCorrect = () => state.input === answer;

      const getVisitorId = () => {
        const key = "allLightVisitorId";
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

      const render = () => {
        document.body.dataset.mode = visualModes[state.mode];
        lightSwitch.setAttribute("aria-pressed", String(state.isOn));
        keys.forEach((key, index) => {
          key.disabled = index >= banks[state.mode].length || state.input.length >= answer.length;
        });
        inputMarks.textContent = "●".repeat(state.input.length);
        inputMarks.setAttribute("aria-label", `${state.input.length} characters entered`);
        backButton.disabled = state.input.length === 0;
        clearButton.disabled = state.input.length === 0;
      };

      lightSwitch.addEventListener("click", () => {
        if (isCorrect()) {
          clearModal.hidden = false;
          if (!state.clearRecorded) {
            state.clearRecorded = true;
            statsRequest("clear").catch(() => {});
          }
          document.getElementById("closeModal").focus();
          return;
        }

        if (state.isOn) {
          state.isOn = false;
          state.mode = 1;
          state.darkCycles += 1;
        } else {
          state.isOn = true;
          if (state.darkCycles >= 4) {
            state.darkCycles = 0;
            state.mode = 2;
          } else {
            state.mode = 0;
          }
        }

        if (state.input.length === answer.length) {
          panel.classList.remove("shake");
          void panel.offsetWidth;
          panel.classList.add("shake");
        }
        render();
      });

      keys.forEach((key, index) => {
        key.addEventListener("click", () => {
          if (state.input.length >= answer.length) return;
          state.input += banks[state.mode][index];
          state.darkCycles = 0;
          render();
        });
      });

      backButton.addEventListener("click", () => {
        state.input = state.input.slice(0, -1);
        state.darkCycles = 0;
        render();
      });

      clearButton.addEventListener("click", () => {
        state.input = "";
        state.darkCycles = 0;
        render();
      });

      translationButton.addEventListener("click", () => {
        state.translated = !state.translated;
        state.translationTaps += 1;
        renderLanguage();
        if (state.translationTaps >= 8) {
          state.translationTaps = 0;
          openStats();
        }
      });

      document.addEventListener("click", event => {
        if (event.target !== translationButton) state.translationTaps = 0;
      });

      const isSourceShortcut = event => {
        const sourceKey = event.key.toLowerCase() === "u" || event.code === "KeyU";
        return (event.ctrlKey && !event.altKey && sourceKey)
          || (event.metaKey && event.altKey && sourceKey);
      };

      document.addEventListener("keydown", event => {
        if (!isSourceShortcut(event)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        window.alert("やるんだな!?今!ここで!");
      }, true);

      document.getElementById("closeModal").addEventListener("click", () => {
        clearModal.hidden = true;
      });

      clearModal.addEventListener("click", event => {
        if (event.target === clearModal) clearModal.hidden = true;
      });

      document.getElementById("closeStats").addEventListener("click", () => {
        statsModal.hidden = true;
      });

      statsModal.addEventListener("click", event => {
        if (event.target === statsModal) statsModal.hidden = true;
      });

      xShare.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(
        "WEB謎「AllLight」を解きました！\n\n" +
        "https://sajiqook.jp/game/alight\n\n" +
        "#AllLight\n" +
        "https://x.com/saji_qook/status/2096010444314141171?s=20"
      );

      renderLanguage();
      render();
      statsRequest("visit").catch(() => {});
    })();
  
