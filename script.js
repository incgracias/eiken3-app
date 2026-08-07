(function () {
  const chapters = (window.EIKEN3_DATA || []).filter((chapter) => chapter.id !== 0);
  const storageKey = "eiken3-progress-v1";
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // ===============================
// 教材サーバー設定
// ===============================
const CONFIG = {
    AUDIO_BASE: "https://pub-384bb717e727460ab23a61eb5b48cbda.r2.dev/audio/eiken3/",
    IMAGE_BASE: "https://pub-384bb717e727460ab23a61eb5b48cbda.r2.dev/images/"
};

  const state = {
    chapterId: null,
    questions: [],
    index: 0,
    selectedChoice: null,
    sortAnswer: [],
    scriptVisible: false,
    recording: null,
    chunks: [],
    audioTracks: [],
    audioTrackIndex: 0
  };

  const el = {
    homeView: document.getElementById("homeView"),
    practiceView: document.getElementById("practiceView"),
    chapterList: document.getElementById("chapterList"),
    overallAccuracy: document.getElementById("overallAccuracy"),
    studiedCount: document.getElementById("studiedCount"),
    weakCount: document.getElementById("weakCount"),
    chapterTitle: document.getElementById("chapterTitle"),
    questionTitle: document.getElementById("questionTitle"),
    questionMeta: document.getElementById("questionMeta"),
    imageArea: document.getElementById("imageArea"),
    passageArea: document.getElementById("passageArea"),
    questionText: document.getElementById("questionText"),
    hintArea: document.getElementById("hintArea"),
    sortArea: document.getElementById("sortArea"),
    choicesArea: document.getElementById("choicesArea"),
    dictationInput: document.getElementById("dictationInput"),
    audioPanel: document.getElementById("audioPanel"),
    audioTrackButtons: document.getElementById("audioTrackButtons"),
    audioPlayer: document.getElementById("audioPlayer"),
    speedSelect: document.getElementById("speedSelect"),
    answerPanel: document.getElementById("answerPanel"),
    resultTitle: document.getElementById("resultTitle"),
    answerText: document.getElementById("answerText"),
    explanationText: document.getElementById("explanationText"),
    grammarText: document.getElementById("grammarText"),
    vocabText: document.getElementById("vocabText"),
    modelAnswerText: document.getElementById("modelAnswerText"),
    shadowingPanel: document.getElementById("shadowingPanel"),
    shadowingText: document.getElementById("shadowingText"),
    recordingPanel: document.getElementById("recordingPanel"),
    recordBtn: document.getElementById("recordBtn"),
    recordStatus: document.getElementById("recordStatus"),
    recordPlayback: document.getElementById("recordPlayback"),
    progressBar: document.getElementById("progressBar"),
    positionText: document.getElementById("positionText"),
    checkBtn: document.getElementById("checkBtn"),
    chapter07AudioBtn: document.getElementById("chapter07AudioBtn")
  };

  let progress = loadProgress();

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || baseProgress();
    } catch (error) {
      return baseProgress();
    }
  }

  function baseProgress() {
    return {
      correct: 0,
      incorrect: 0,
      weakIds: [],
      wrongIds: [],
      studiedIds: [],
      answers: {},
      chapters: {},
      lastStudyDate: null
    };
  }

  function saveProgress() {
    progress.lastStudyDate = new Date().toISOString();
    localStorage.setItem(storageKey, JSON.stringify(progress));
    renderHome();
  }

  function questionKey(question) {
    return `${question.chapter || state.chapterId}:${question.id}`;
  }

  function byId(id) {
    return chapters.find((chapter) => chapter.id === id);
  }

 function renderHome() {
    const total = progress.correct + progress.incorrect;

    el.overallAccuracy.textContent =
        total ? `${Math.round(progress.correct / total * 100)}%` : "0%";

    el.studiedCount.textContent =
        `${progress.studiedIds.length}問`;

    el.weakCount.textContent =
        `${progress.weakIds.length}問`;

    el.chapterList.innerHTML = chapters.map(chapter => {

        const chapterProgress =
            progress.chapters[chapter.id] || {};

        const done =
            Object.keys(chapterProgress).length;

        const totalQuestions =
            chapter.questions.length;

        const percent =
            totalQuestions
                ? Math.round(done / totalQuestions * 100)
                : 0;

        return `
<article class="chapter-card">

    <div class="chapter-header">

        <span class="chapter-tag">
            Chapter ${String(chapter.id).padStart(2,"0")}
        </span>

        <button
            class="study-btn"
            data-chapter="${chapter.id}">
            学習
        </button>

    </div>

    <h2 class="chapter-title">
        ${escapeHtml(chapter.title)}
    </h2>

    <div class="chapter-footer">

        <span class="chapter-count">
            ${done}/${totalQuestions}問
        </span>

        <div class="chapter-progress">
            <span style="width:${percent}%"></span>
        </div>

    </div>

</article>
`;

    }).join("");

  }

  function openHome() {
    el.homeView.classList.add("active");
    el.practiceView.classList.remove("active");
    stopAudio();
    renderHome();
  }

  function openChapter(chapterId, filter) {
    const chapter = byId(chapterId);
    if (!chapter) return;
    state.chapterId = chapterId;
    state.questions = (filter ? chapter.questions.filter(filter) : chapter.questions.slice()).map((question) => ({
      ...question,
      chapter: question.chapter || chapter.id
    }));
    state.index = 0;
    if (!state.questions.length) {
      alert("対象の問題はまだありません。");
      return;
    }
    el.homeView.classList.remove("active");
    el.practiceView.classList.add("active");
    renderQuestion();
  }

  function openReview(kind) {
    const ids = kind === "weak" ? progress.weakIds : progress.wrongIds;
    const wanted = new Set(ids);
    const questions = chapters.flatMap((chapter) => chapter.questions.map((question) => ({
      ...question,
      chapter: question.chapter || chapter.id
    }))).filter((question) => wanted.has(`${question.chapter}:${question.id}`));
    if (!questions.length) {
      alert(kind === "weak" ? "苦手問題は登録されていません。" : "間違えた問題はありません。");
      return;
    }
    state.chapterId = "review";
    state.questions = questions;
    state.index = 0;
    el.homeView.classList.remove("active");
    el.practiceView.classList.add("active");
    renderQuestion();
  }

  function currentQuestion() {
    return state.questions[state.index];
  }

  function renderQuestion() {
    const question = currentQuestion();
    if (Number(question.chapter) === 7) {
    renderChapter07(question);
    return;
    }
    const chapter = byId(question.chapter);
    el.chapter07AudioBtn.classList.add("hidden");
    state.selectedChoice = null;
    state.sortAnswer = [];
    state.scriptVisible = false;
    el.chapterTitle.textContent = chapter ? `Chapter ${String(chapter.id).padStart(2, "0")} ${chapter.title}` : "復習";
    const type = question.type || "choice";
    el.questionTitle.textContent = "";
    el.questionMeta.innerHTML = [
      `ID ${question.id}`,
      question.cd ? `CD ${question.cd}` : "",
      question.typeLabel || question.section || type
    ].filter(Boolean).map((text) => `<span class="pill">${escapeHtml(text)}</span>`).join("");
    el.progressBar.style.width = `${Math.round(((state.index + 1) / state.questions.length) * 100)}%`;
    el.positionText.textContent = `${state.index + 1} / ${state.questions.length}`;
    const passage = getPassage(question);
    el.imageArea.classList.toggle("hidden", !question.image);
    el.imageArea.innerHTML = "";
    if (question.image) {
      const image = new Image();
      image.alt = question.imageAlt || question.title || "面接カード";
      image.onload = () => el.imageArea.classList.remove("hidden");
      image.onerror = () => {
        el.imageArea.classList.add("hidden");
        el.imageArea.innerHTML = "";
      };
     if (question.image.startsWith("http")) {
     image.src = question.image;
     } else if (question.image.startsWith("images/")) {
      image.src = question.image;
     } else {
      image.src = CONFIG.IMAGE_BASE + question.image;
     }

      el.imageArea.appendChild(image);
    }
    if (Number(question.chapter) === 7) {
    el.passageArea.classList.add("hidden");
    el.questionText.classList.add("hidden");
} else {
    el.passageArea.classList.toggle("hidden", !passage);
    el.passageArea.textContent = passage;
    el.questionText.classList.remove("hidden");
    el.questionText.textContent = question.prompt || question.question || "";
}
    el.hintArea.classList.add("hidden");
    el.hintArea.textContent = question.hint || "";
    el.answerPanel.classList.add("hidden");
    el.dictationInput.value = "";
    el.dictationInput.classList.toggle("hidden", type !== "listening" && type !== "interview");
    if (type === "vocab") el.dictationInput.classList.add("hidden");
    el.checkBtn.classList.toggle("hidden", type === "study");
    renderChoices(question);
    renderSort(question);
    renderAudio(question);
    renderTraining(question);
    updateWeakButton(question);
  }

  function renderChoices(question) {
    if ((question.type || "choice") === "sort") {
      el.choicesArea.classList.remove("number-choices");
      el.choicesArea.innerHTML = "";
      return;
    }
    el.choicesArea.classList.toggle("number-choices", usesNumberOnlyChoices(question));
    el.choicesArea.classList.toggle("two-by-two-choices", Number(question.chapter) === 1);
    el.choicesArea.innerHTML = (question.choices || []).map((choice, index) => (
      `<button class="choice" type="button" data-choice="${index}">${escapeHtml(choiceLabel(question, choice, index))}</button>`
    )).join("");
  }

  function choiceLabel(question, choice, index) {
    if (usesNumberOnlyChoices(question)) {
      return String(index + 1);
    }
    if (Number(question.chapter) === 5 && (question.type || "choice") === "listening") {
      return `${index + 1} ${choice}`;
    }
    return choice;
  }

  function usesNumberOnlyChoices(question) {
    return Number(question.chapter) === 5
      && (question.type || "choice") === "listening"
      && Number(question.id) <= 10;
  }

  function renderSort(question) {
    el.sortArea.classList.toggle("hidden", (question.type || "choice") !== "sort");
    if ((question.type || "choice") !== "sort") return;
    const words = question.words || [];
    el.sortArea.innerHTML = `
      <div class="sort-answer" id="sortAnswer"></div>
      <div class="sort-bank" id="sortBank">
        ${words.map((word, index) => `<button class="word-chip" type="button" data-word="${index}">${escapeHtml(word)}</button>`).join("")}
      </div>
    `;
  }

  function renderAudio(question) {
   if (Number(question.chapter) === 7) {
    el.audioPanel.classList.remove("hidden");
    el.audioTrackButtons.classList.add("hidden");
    document.getElementById("replayBtn").classList.add("hidden");
    return;
   }

    if ([1, 2, 3, 4].includes(Number(question.chapter))) {
      stopAudio();
      el.audioPanel.classList.add("hidden");
      el.audioTrackButtons.classList.add("hidden");
      el.audioTrackButtons.innerHTML = "";
      el.audioPlayer.removeAttribute("src");
      return;
    }
    document.getElementById("replayBtn").textContent = "もう一度聞く";
    const tracks = audioTracks(question);
    const hasAudio = tracks.length > 0;
    el.audioPanel.classList.toggle("hidden", !hasAudio);
    if (!hasAudio) {
      stopAudio();
      state.audioTracks = [];
      state.audioTrackIndex = 0;
      el.audioTrackButtons.classList.add("hidden");
      el.audioTrackButtons.innerHTML = "";
      el.audioPlayer.removeAttribute("src");
      return;
    }
    state.audioTracks = tracks;
    setAudioTrack(0);
    el.audioPlayer.playbackRate = Number(el.speedSelect.value);
  }

  function audioTracks(question) {
    const audio = question.audio;
    if (Array.isArray(audio)) {
      return audio.filter(Boolean).map((path) => ({
        label: audioLabel(path),
        sources: audioSources(path)
      }));
    }
    if (!audio) return [];
    return [{ label: audioLabel(audio), sources: audioSources(audio) }];
  }

  function setAudioTrack(index) {
    state.audioTrackIndex = index;
    const track = state.audioTracks[index];
    if (!track) return;
    let sourceIndex = 0;
    el.audioPlayer.src = track.sources[sourceIndex];
    el.audioPlayer.load();
    el.audioPlayer.onerror = function () {
      sourceIndex++;
      if (sourceIndex < track.sources.length) {
        el.audioPlayer.src = track.sources[sourceIndex];
        el.audioPlayer.load();
      } else {
        el.audioPanel.classList.add("hidden");
      }
    };
    renderAudioTrackButtons();
  }

  function renderAudioTrackButtons() {
    const tracks = state.audioTracks || [];
    el.audioTrackButtons.classList.toggle("hidden", tracks.length < 2);
    if (tracks.length < 2) {
      el.audioTrackButtons.innerHTML = "";
      return;
    }
    el.audioTrackButtons.innerHTML = tracks.map((track, index) => `
      <button class="audio-track-button ${index === state.audioTrackIndex ? "selected" : ""}" type="button" data-audio-track="${index}">
        ${escapeHtml(track.label)}
      </button>
    `).join("");
  }

  function audioLabel(audioPath) {
    const fileName = String(audioPath || "").split("/").pop() || "";
    const eikenTrack = fileName.match(/^E(\d+)\.mp3$/i);
    return eikenTrack ? `音源${Number(eikenTrack[1])}` : "音声";
  }

  function audioSources(audioPath) {
    if (!audioPath) return [];

    // すでに https:// のURLならそのまま使う
    if (audioPath.startsWith("http")) {
        return [audioPath];
    }

    // 従来形式（audio/eiken3/E21.mp3）はそのまま使う
    if (audioPath.includes("/")) {
        return [audioPath];
    }

    // ファイル名だけならCDNから取得
    return [CONFIG.AUDIO_BASE + audioPath];
   }

  function renderTraining(question) {
    const showShadowing = Boolean(question.shadowing) && ![3, 4].includes(Number(question.chapter));
    el.shadowingPanel.classList.toggle("hidden", !showShadowing);
    el.shadowingText.textContent = showShadowing ? question.shadowing : "";
    el.recordingPanel.classList.toggle("hidden", question.chapter !== 6);
  }

  function updateWeakButton(question) {
    const weak = progress.weakIds.includes(questionKey(question));
    document.getElementById("weakBtn").textContent = weak ? "解除" : "登録";
  }

  function checkAnswer() {
    const question = currentQuestion();
    let correct = false;
    let userAnswer = "";
    const type = question.type || "choice";
    const answerIndex = getAnswerIndex(question);
    if (type === "sort") {
      userAnswer = state.sortAnswer.join(" ");
      const expected = Array.isArray(question.correctOrder) ? question.correctOrder.join(" ") : question.answer;
      correct = normalize(userAnswer) === normalize(expected);
    } else if (type === "listening" && !(question.choices || []).length) {
      userAnswer = el.dictationInput.value;
      correct = normalize(userAnswer) === normalize(question.answer);
    } else if (type === "interview" && !(question.choices || []).length) {
      userAnswer = el.dictationInput.value;
      correct = true;
    } else if (type === "vocab") {
      userAnswer = question.answer;
      correct = true;
    } else {
      userAnswer = question.choices ? question.choices[state.selectedChoice] : el.dictationInput.value;
      correct = String(state.selectedChoice) === String(answerIndex);
    }

    const key = questionKey(question);
    if (question.ungraded) {
      progress.answers[key] = { correct: null, userAnswer };
      addUnique(progress.studiedIds, key);
      progress.chapters[question.chapter] = progress.chapters[question.chapter] || {};
      progress.chapters[question.chapter][question.id] = { correct: null };
      saveProgress();
      showAnswer(question, null, userAnswer);
      return;
    }

    const previous = progress.answers[key];
    if (!previous) {
      correct ? progress.correct++ : progress.incorrect++;
    } else if (previous.correct !== correct) {
      if (correct) {
        progress.correct++;
        progress.incorrect = Math.max(0, progress.incorrect - 1);
      } else {
        progress.incorrect++;
        progress.correct = Math.max(0, progress.correct - 1);
      }
    }
    progress.answers[key] = { correct, userAnswer };
    addUnique(progress.studiedIds, key);
    if (!correct) addUnique(progress.wrongIds, key);
    if (correct) progress.wrongIds = progress.wrongIds.filter((id) => id !== key);
    progress.chapters[question.chapter] = progress.chapters[question.chapter] || {};
    progress.chapters[question.chapter][question.id] = { correct };
    saveProgress();
    showAnswer(question, correct, userAnswer);
  }

  function showAnswer(question, correct) {
    el.answerPanel.classList.remove("hidden");
    el.resultTitle.textContent = correct === null ? "解答を記録しました" : (correct ? "正解" : "確認しよう");
    el.resultTitle.className = correct === null ? "" : (correct ? "good" : "bad");
    const answerIndex = getAnswerIndex(question);
    const answer = (question.type || "choice") === "sort" || (question.type || "choice") === "vocab" ? question.answer : (question.choices ? question.choices[answerIndex] : question.answer);
    const answerHtml = escapeHtml(answer || "").replace(/\n/g, "<br>");
    el.answerText.innerHTML = correct === null
      ? `<p><strong>選んだ答え：</strong>${escapeHtml(question.choices ? question.choices[state.selectedChoice] : "")}</p>`
      : `<p><strong>${(question.type || "choice") === "vocab" ? "解答" : "答え："}</strong><br>${answerHtml}</p>`;
    const translation = question.translation || question.jp;
    const script = question.script ? escapeHtml(question.script).replace(/\n/g, "<br>") : "";
    const choices = answerChoicesText(question);
    el.explanationText.innerHTML = [
      script ? `<p><strong>スクリプト：</strong><br>${script}</p>` : "",
      choices ? `<p><strong>選択肢：</strong><br>${choices}</p>` : "",
      question.explanation ? `<p><strong>解説：</strong>${escapeHtml(question.explanation)}</p>` : "",
      translation ? `<p><strong>日本語訳：</strong>${escapeHtml(translation)}</p>` : ""
    ].join("");
    el.grammarText.innerHTML = [
      question.secondFourth ? `<p><strong>2番目と4番目：</strong>${escapeHtml(question.secondFourth)}</p>` : "",
      question.grammar ? `<p><strong>文法解析：</strong>${escapeHtml(question.grammar)}</p>` : ""
    ].join("");
    el.vocabText.innerHTML = question.vocab ? `<p><strong>重要単語：</strong>${escapeHtml(question.vocab.join(" / "))}</p>` : "";
    el.modelAnswerText.innerHTML = question.modelAnswer ? `<p><strong>模範解答：</strong>${escapeHtml(question.modelAnswer)}</p>` : "";
    document.querySelectorAll(".choice").forEach((button) => {
      const index = Number(button.dataset.choice);
      button.classList.toggle("correct", index === answerIndex);
      button.classList.toggle("wrong", index === state.selectedChoice && index !== answerIndex);
    });
  }

  function getAnswerIndex(question) {
    if (typeof question.answerIndex === "number") return question.answerIndex;
    if (!question.choices || typeof question.answer === "undefined") return -1;
    return question.choices.findIndex((choice) => normalize(choice) === normalize(question.answer));
  }

  function answerChoicesText(question) {
    if (Number(question.chapter) !== 5 || !question.choices || !question.choices.length) return "";
    const hasHiddenText = question.choices.some((choice, index) => String(choice) !== String(index + 1));
    if (!hasHiddenText) return "";
    return question.choices
      .map((choice, index) => {
        const translation = question.choiceTranslations && question.choiceTranslations[index]
          ? `（${escapeHtml(question.choiceTranslations[index])}）`
          : "";
        return `${index + 1} ${escapeHtml(choice)}${translation}`;
      })
      .join("<br>");
  }

  function toggleScript() {
    const question = currentQuestion();
    const passage = getPassage(question);
    state.scriptVisible = !state.scriptVisible;
    if (state.scriptVisible && question.script) {
      el.passageArea.classList.remove("hidden");
      el.passageArea.textContent = [passage, "【スクリプト】", question.script].filter(Boolean).join("\n\n");
    } else {
      el.passageArea.classList.toggle("hidden", !passage);
      el.passageArea.textContent = passage;
    }
  }

  function getPassage(question) {
    if (question.passage) return question.passage;
    if (Array.isArray(question.conversation)) return question.conversation.join("\n");
    return "";
  }

  function addUnique(list, value) {
    if (!list.includes(value)) list.push(value);
  }

  function normalize(text) {
    return String(text || "").toLowerCase().replace(/[.,?!]/g, "").replace(/\s+/g, " ").trim();
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function stopAudio() {
    el.audioPlayer.pause();
    el.audioPlayer.currentTime = 0;
  }

  function resetAllData() {
    if (!confirm("すべての学習データをリセットしますか？")) return;
    localStorage.removeItem(storageKey);
    progress = baseProgress();
    openHome();
  }

  document.getElementById("resetBtn").addEventListener("click", resetAllData);
  document.getElementById("backBtn").addEventListener("click", openHome);
  document.getElementById("reviewWrongBtn").addEventListener("click", () => openReview("wrong"));
  document.getElementById("reviewWeakBtn").addEventListener("click", () => openReview("weak"));
  el.chapterList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-chapter]");
    if (button) openChapter(Number(button.dataset.chapter));
  });
  el.choicesArea.addEventListener("click", (event) => {
    const button = event.target.closest("[data-choice]");
    if (!button) return;
    state.selectedChoice = Number(button.dataset.choice);
    document.querySelectorAll(".choice").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
  });
  el.sortArea.addEventListener("click", (event) => {
    const button = event.target.closest("[data-word]");
    if (!button) return;
    const word = button.textContent;
    state.sortAnswer.push(word);
    button.disabled = true;
    document.getElementById("sortAnswer").insertAdjacentHTML("beforeend", `<button class="word-chip" type="button" data-remove="${state.sortAnswer.length - 1}">${escapeHtml(word)}</button>`);
  });
  el.sortArea.addEventListener("dblclick", () => {
    state.sortAnswer = [];
    renderSort(currentQuestion());
  });
  document.getElementById("checkBtn").addEventListener("click", checkAnswer);
  document.getElementById("weakBtn").addEventListener("click", () => {

    const question = currentQuestion();
    const key = questionKey(question);

    if (progress.weakIds.includes(key)) {
        progress.weakIds = progress.weakIds.filter((id) => id !== key);
    } else {
        progress.weakIds.push(key);
    }

    saveProgress();
    updateWeakButton(question);

    if (Number(question.chapter) === 7) {

        el.answerPanel.classList.remove("hidden");

        el.resultTitle.textContent = "";

        el.answerText.innerHTML = `
        `;

        el.explanationText.innerHTML = "";
        el.grammarText.innerHTML = "";
        el.vocabText.innerHTML = "";
        el.modelAnswerText.innerHTML = "";
    }

});


  document.getElementById("prevBtn").addEventListener("click", () => {
    if (state.index > 0) {
      state.index--;
      renderQuestion();
    }
  });
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (state.index < state.questions.length - 1) {
      state.index++;
      renderQuestion();
    } else {
      openHome();
    }
  });
  el.speedSelect.addEventListener("change", () => {
    const selectedSpeed = speeds.includes(Number(el.speedSelect.value)) ? Number(el.speedSelect.value) : 1;
    el.audioPlayer.playbackRate = selectedSpeed;
  });


 const replayBtn = document.getElementById("replayBtn");
    if (replayBtn) {
    replayBtn.addEventListener("click", () => {


    el.audioPlayer.currentTime = 0;
    el.audioPlayer.play().catch(() => {});
  
   });
 }

document.getElementById("chapter07AudioBtn").addEventListener("click", () => {

    const question = currentQuestion();

    if (!question || !question.example) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(question.example);

    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();

    const englishVoice = voices.find((voice) =>
        voice.lang && voice.lang.toLowerCase().startsWith("en")
    );

    if (englishVoice) {
        utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);

});

  el.audioTrackButtons.addEventListener("click", (event) => {
    const button = event.target.closest("[data-audio-track]");
    if (!button) return;
    setAudioTrack(Number(button.dataset.audioTrack));
    el.audioPlayer.play().catch(() => {});
  });
  el.recordBtn.addEventListener("click", async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      el.recordStatus.textContent = "このブラウザは録音に対応していません。";
      return;
    }
    if (state.recording && state.recording.state === "recording") {
      state.recording.stop();
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.chunks = [];
    state.recording = new MediaRecorder(stream);
    state.recording.ondataavailable = (event) => state.chunks.push(event.data);
    state.recording.onstop = () => {
      const blob = new Blob(state.chunks, { type: "audio/webm" });
      el.recordPlayback.src = URL.createObjectURL(blob);
      el.recordPlayback.classList.remove("hidden");
      el.recordStatus.textContent = "録音が完了しました。";
      el.recordBtn.textContent = "録音開始";
      stream.getTracks().forEach((track) => track.stop());
    };
    state.recording.start();
    el.recordStatus.textContent = "録音中です。";
    el.recordBtn.textContent = "録音停止";
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    });
    }

   function renderChapter07(question) {

    const chapter = byId(question.chapter);

    el.chapterTitle.textContent =
        `Chapter ${String(chapter.id).padStart(2, "0")} ${chapter.title}`;

    el.questionTitle.textContent = "";

        // Chapter07では通常問題画面を非表示
    el.questionMeta.innerHTML = "";

    el.passageArea.classList.add("hidden");
    el.questionText.classList.add("hidden");
    el.hintArea.classList.add("hidden");
    el.sortArea.classList.add("hidden");
    el.choicesArea.innerHTML = "";

    el.dictationInput.classList.add("hidden");
    el.answerPanel.classList.add("hidden");
    el.shadowingPanel.classList.add("hidden");
    el.recordingPanel.classList.add("hidden");

    el.audioPanel.classList.add("hidden");
    
    el.positionText.textContent =
        `${state.index + 1} / ${state.questions.length}`;

    el.progressBar.style.width =
        `${Math.round(((state.index + 1) / state.questions.length) * 100)}%`;

    // イラスト表示
    el.imageArea.classList.remove("hidden");
    el.imageArea.innerHTML = "";

    if (question.image) {

        const image = new Image();

        image.alt = question.title || "";

        if (question.image.startsWith("http")) {
            image.src = question.image;
        } else if (question.image.startsWith("images/")) {
            image.src = question.image;
        } else {
            image.src = CONFIG.IMAGE_BASE + question.image;
        }

        el.imageArea.appendChild(image);
    }

  el.chapter07AudioBtn.classList.remove("hidden");
  el.chapter07AudioBtn.textContent = "▶ 音声";

 }


  renderHome();
})();
