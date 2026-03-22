// ─── Quiz Questions ────────────────────────────────────────────────────────────
// Each question has a `map` array: map[optionIndex] = personalityIndex
//   Personality indices: 0=Tapioca, 1=Ragi Roti, 2=Lemak, 3=Salted Fish
// Option order deliberately rotates per question so no single letter
// consistently leads to the same result.

const quizData = [
  {
    // A=Tapioca(0), B=Ragi(1), C=Lemak(2), D=Salted(3)
    context: "Chinatown, 1942. The rice ration has been cut to eight katis a month. It is not enough.",
    question: "You have a few cents and one trip to the market. What do you bring home?",
    options: [
      "Tapioca root—the most filling thing your coins can still buy.",
      "Whatever the aunty at the next stall is getting. Between the two of you, you sort something out.",
      "Sweet potato. With a little work, you can make it taste like a proper meal.",
      "Salted fish—dried, cheap, and good for days of meals."
    ],
    map: [0, 1, 2, 3]
  },
  {
    // A=Lemak(2), B=Salted(3), C=Tapioca(0), D=Ragi(1)
    context: "The Syonan Shimbun orders every household to grow food. Behind your house is a patch of hard, sun-baked clay.",
    question: "You have seeds. What do you plant?",
    options: [
      "Kangkong and sweet potato—things you can still cook into something that feels like a real meal.",
      "Chilli and preserved vegetables—they keep long and trade well when you need something you cannot grow.",
      "Tapioca—it ruins the soil and takes months, but it is the one thing guaranteed to fill a stomach.",
      "Whatever the people on your street decide to plant. You would rather work a shared plot than dig alone."
    ],
    map: [2, 3, 0, 1]
  },
  {
    // A=Ragi(1), B=Lemak(2), C=Tapioca(0), D=Salted(3)
    context: "Clearing rubble from a bombed-out shophouse near Chinatown, you find something tucked behind a fallen beam: a small jar of palm oil, still sealed.",
    question: "What do you do with it?",
    options: [
      "You bring it home and tell everyone. Something this good should be shared.",
      "You use it tonight. A little fat is all it takes to turn foraged greens into something worth eating.",
      "You hide it. Save it for the day someone in the house is too weak to get out of bed.",
      "You use a single teaspoon to fry a scrap of fish and let the smell travel through the house."
    ],
    map: [1, 2, 0, 3]
  },
  {
    // A=Salted(3), B=Ragi(1), C=Tapioca(0), D=Lemak(2)
    context: "Tanjong Pagar, 1944. A contact came through. For once, there is more food in the house than you need today.",
    question: "What do you do with the extra?",
    options: [
      "You salt and dry what you can. A run of luck like this never lasts.",
      "You bring it to your neighbours before you have even eaten yourself.",
      "You keep most of it back and say nothing. You know how quickly things change.",
      "You cook a proper meal, the kind the household has not had in months."
    ],
    map: [3, 1, 0, 2]
  },
  {
    // A=Tapioca(0), B=Lemak(2), C=Ragi(1), D=Salted(3)
    context: "Your kampong, late at night. Someone knocks.",
    question: "Your neighbour is at the door. Her two children are behind her. They have not eaten since morning. You have barely enough for yourself. What do you do?",
    options: [
      "You give her the tapioca—all of it. You will manage tomorrow somehow.",
      "You bring out what you have and cook it properly: small portions, but warm, and made with care.",
      "You open the door wider. Come in—you'll figure the rest out together.",
      "You count out half your ikan bilis and hand it over. You show her what to cook with it."
    ],
    map: [0, 2, 1, 3]
  },
  {
    // A=Salted(3), B=Tapioca(0), C=Ragi(1), D=Lemak(2)
    context: "The same watery porridge has been on the table for the seventh night in a row. The lamp is running low.",
    question: "Someone asks what you miss most about before. What do you say?",
    options: [
      "\"Knowing there would be enough. Not plenty—just enough.\"",
      "\"Being able to walk out the door without thinking about it.\"",
      "\"Everyone together. Before people scattered.\"",
      "\"The smell of a kitchen that wasn't worried.\""
    ],
    map: [3, 0, 1, 2]
  },
  {
    // A=Tapioca(0), B=Ragi(1), C=Lemak(2), D=Salted(3)
    context: "You have one banana note left. The market at Sungei Road is risky, but you need something.",
    question: "What do you buy?",
    options: [
      "A large tuber of ubi kayu. The safest thing for the price.",
      "The cheapest thing going. You ask around and add it to what the neighbours are buying.",
      "A small tin of coconut milk. It is a luxury, but it makes foraged greens into a proper dish.",
      "A pouch of salt. Everything else you can find. Salt you cannot do without."
    ],
    map: [0, 1, 2, 3]
  },
  {
    // A=Lemak(2), B=Tapioca(0), C=Salted(3), D=Ragi(1)
    context: "15 August 1945. The Occupation is over. Someone has managed to cook a real meal.",
    question: "What does it mean to you?",
    options: [
      "That ordinary life—food made with care, a kitchen that isn't desperate—was worth getting back.",
      "That you survived. Whatever it cost, you made it through.",
      "A reckoning. You start thinking about what was lost and what has to be rebuilt.",
      "A table with people around it. Everyone who is still here."
    ],
    map: [2, 0, 3, 1]
  }
];

// ─── Personality Results ────────────────────────────────────────────────────────
const personalities = [
  {
    id: 'tapioca',
    name: 'Tapioca',
    tagline: 'The Resilient Root',
    emoji: '🌱',
    color: '#5c3310',
    imgSrc: 'images/tapioca.avif',
    traits: ['Adaptable', 'Resilient', 'Self-sufficient'],
    description: "You do not wait for things to improve before you act. Tapioca was exactly this: it grew in poor soil, required nothing, and fed thousands when rice had disappeared from the market. It was not anyone's first choice. But it was always there, and it never failed the people who relied on it.",
    strength: "You do not need good conditions to function. When things get harder, you get clearer.",
    weakness: "You are so used to managing alone that asking for help can feel like failure, even when you genuinely need it.",
    pairs: "Salted Fish & Ikan Bilis",
    clashes: "Ragi Roti",
    fact: "By 1943, rice prices in Singapore had risen to more than fifty times their pre-war level. Tapioca became the primary substitute—the Syonan Municipal Council actively promoted cassava cultivation to manage the food crisis. Families boiled the roots, fried them in slices, and made congee from the leaves."
  },
  {
    id: 'ragi-roti',
    name: 'Ragi Roti',
    tagline: 'The Keeper of Community',
    emoji: '🫓',
    color: '#6b2e0e',
    imgSrc: 'images/ragi-roti.avif',
    traits: ['Generous', 'Loyal', 'Grounding'],
    description: "You are the reason people around you do not come apart. During the Occupation, many in Singapore's Indian community kept making ragi roti even as supply lines collapsed, cultivating finger millet locally and sharing what they baked across thresholds and between strangers. It was not only food. It was a daily act that said: we are still here, and we are still ourselves.",
    strength: "You hold people together when circumstances want to scatter them. You show up not only in crises but in the ordinary days that follow.",
    weakness: "You give a great deal, sometimes more than you have. You are not always honest with yourself about when you have run out.",
    pairs: "Lemak Sweet Potatoes & Kangkong",
    clashes: "Tapioca",
    fact: "Finger millet, previously imported, was cultivated locally during the Occupation when grain shipments stopped. For many in Singapore's Indian community, continuing to make and share ragi roti was both a practical necessity and a form of cultural continuity—a way of holding onto something recognisable in an unrecognisable time."
  },
  {
    id: 'lemak',
    name: 'Lemak Sweet Potatoes & Kangkong',
    tagline: 'The Creative Nurturer',
    emoji: '🥬',
    color: '#2a5c34',
    imgSrc: 'images/lemak-sweet-potato.avif',
    traits: ['Inventive', 'Caring', 'Resourceful'],
    description: "You believe that how something is made still matters, even under pressure. During the Occupation, some families cooked their home-grown kangkong and sweet potatoes in coconut milk—a small extravagance, a refusal to surrender everything to necessity. The details are not decoration. They are what make life liveable.",
    strength: "You find ways to make difficult situations more bearable, not by ignoring them, but by insisting that small dignities are still worth the effort.",
    weakness: "You invest real energy in how things feel. When bare survival is all that is needed, that instinct can quietly exhaust you.",
    pairs: "Ragi Roti",
    clashes: "Salted Fish & Ikan Bilis",
    fact: "The Syonan government encouraged residents to cultivate any available ground—roadsides, backyards, and open fields were converted into vegetable plots. Kangkong and sweet potatoes were among the most widely grown. Cooking them with coconut milk, when it could be found, was a small but deliberate choice to maintain some dignity in how families ate."
  },
  {
    id: 'salted-fish',
    name: 'Salted Fish & Ikan Bilis',
    tagline: 'The Steadfast Preserver',
    emoji: '🐟',
    color: '#1e3d5c',
    imgSrc: 'images/salted-fish.avif',
    traits: ['Disciplined', 'Measured', 'Dependable'],
    description: "You plan for the version of things that goes wrong. Salted fish and ikan bilis required no refrigeration, lasted for weeks, and worked in almost any dish—which made them among the most essential foods of the Occupation, when fresh supplies were unaffordable or simply gone. The people around you may not notice what you do until everything else runs out.",
    strength: "You do not waste things—time, resources, or energy. That discipline is useful in ways that only become visible when circumstances are hard.",
    weakness: "You can come across as distant when people need warmth more than solutions. Practicality has its limits.",
    pairs: "Tapioca",
    clashes: "Lemak Sweet Potatoes & Kangkong",
    fact: "Salted fish and dried ikan bilis were among the most stable and widely traded foods during the Occupation. Requiring no cold storage and providing reliable protein, they were a lifeline across every community in Singapore. Hawkers who dealt in preserved goods became essential figures in the wartime food network."
  },
  {
    id: 'soya-bean-pie',
    name: 'Soya Bean Pie',
    tagline: 'The Unclassifiable',
    emoji: '🥧',
    color: '#7a4a1e',
    imgSrc: 'images/soya-bean-pie.avif',
    traits: ['Plural', 'Adaptable', 'Between worlds'],
    description: "You ended up here because you could not be placed. Across eight questions you spread yourself evenly, and that is itself a kind of answer. During the Occupation, the Syonan Shimbun published a recipe for soya bean pie: a Western pastry format filled with local soya bean curd, printed as a practical protein substitute. It was neither one thing nor the other, and it worked. You bring different instincts to different situations, and you are harder to define than most.",
    strength: "You are not locked into one response. Different situations get different versions of you, and you usually read the room correctly.",
    weakness: "People who need to know what to expect from you may find you difficult to rely on. Consistency is its own kind of gift.",
    pairs: "Everyone, depending on the day",
    clashes: "Anyone who needs you to be only one thing",
    fact: "The Syonan Shimbun published regular recipe columns during the Occupation encouraging residents to improvise with locally available ingredients. One such recipe was soya bean pie—a Western-style pie filled with pressed soya bean curd, offered as a protein substitute when meat was unaffordable or unavailable. It is one of the stranger documents of wartime Singapore's food history."
  }
];

// ─── State ─────────────────────────────────────────────────────────────────────
let currentQuestion = 0;
let userAnswers = [];
let currentResult = null;

// ─── DOM ───────────────────────────────────────────────────────────────────────
const startScreen    = document.getElementById('start-screen');
const quizScreen     = document.getElementById('quiz-screen');
const resultsScreen  = document.getElementById('results-screen');
const startBtn       = document.getElementById('start-btn');
const nextBtn        = document.getElementById('next-btn');
const prevBtn        = document.getElementById('prev-btn');
const submitBtn      = document.getElementById('submit-btn');
const restartBtn     = document.getElementById('restart-btn');
const shareFeedback  = document.getElementById('share-feedback');

// ─── Helpers ───────────────────────────────────────────────────────────────────
function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

function showFeedback(msg, duration = 3000) {
  shareFeedback.textContent = msg;
  show(shareFeedback);
  setTimeout(() => hide(shareFeedback), duration);
}

// ─── URL-based direct result loading ──────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const resultId = params.get('result');
  if (resultId) {
    const found = personalities.find(p => p.id === resultId);
    if (found) {
      currentResult = found;
      userAnswers = quizData.map(() => 0); // dummy answers
      hide(startScreen);
      show(resultsScreen);
      populateResultCard(found);
      setupShareButtons(found);
      return;
    }
  }
  // Normal flow — show start screen
  show(startScreen);
});

// ─── Quiz Flow ─────────────────────────────────────────────────────────────────
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
prevBtn.addEventListener('click', prevQuestion);
submitBtn.addEventListener('click', submitQuiz);
restartBtn.addEventListener('click', restartQuiz);

function startQuiz() {
  hide(startScreen);
  show(quizScreen);
  currentQuestion = 0;
  userAnswers = [];
  document.getElementById('total-q').textContent = quizData.length;
  showQuestion();
}

function showQuestion() {
  const q = quizData[currentQuestion];

  document.getElementById('question-context').textContent = q.context;
  document.getElementById('question-text').textContent    = q.question;
  document.getElementById('current-q').textContent        = currentQuestion + 1;

  const pct = ((currentQuestion + 1) / quizData.length) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';

  const container = document.getElementById('options-container');
  container.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    if (userAnswers[currentQuestion] === i) btn.classList.add('selected');
    btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span class="option-text">${opt}</span>`;
    btn.addEventListener('click', () => selectOption(i));
    container.appendChild(btn);
  });

  updateNavButtons();
}

function selectOption(idx) {
  userAnswers[currentQuestion] = idx;
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === idx);
  });
  updateNavButtons();
}

function updateNavButtons() {
  const isFirst = currentQuestion === 0;
  const isLast  = currentQuestion === quizData.length - 1;
  const hasSel  = userAnswers[currentQuestion] !== undefined;

  hide(prevBtn); hide(nextBtn); hide(submitBtn);

  if (!isFirst) show(prevBtn);

  if (isLast) {
    if (hasSel) show(submitBtn);
  } else {
    if (hasSel) show(nextBtn);
  }
}

function nextQuestion() {
  if (userAnswers[currentQuestion] === undefined) return;
  currentQuestion++;
  showQuestion();
}

function prevQuestion() {
  if (currentQuestion > 0) { currentQuestion--; showQuestion(); }
}

function submitQuiz() {
  if (userAnswers.length < quizData.length || userAnswers.includes(undefined)) {
    alert("Please answer all questions before submitting.");
    return;
  }

  // Tally votes per personality using each question's map
  const tally = [0, 0, 0, 0];
  userAnswers.forEach((a, qIdx) => {
    if (a !== undefined) {
      const personalityIdx = quizData[qIdx].map[a];
      tally[personalityIdx]++;
    }
  });

  // Any tie—two-way, three-way, or four-way—gives the fifth result: Rojak.
  const maxVal = Math.max(...tally);
  const tied = tally.filter(v => v === maxVal);
  let winnerIdx;
  if (tied.length > 1) {
    winnerIdx = 4; // Syonan Rojak & Soya Bean Pie
  } else {
    winnerIdx = tally.indexOf(maxVal);
  }

  currentResult = personalities[winnerIdx];
  hide(quizScreen);
  show(resultsScreen);
  populateResultCard(currentResult);
  setupShareButtons(currentResult);

  // Update URL without reloading
  const newUrl = `${window.location.pathname}?result=${currentResult.id}`;
  window.history.replaceState(null, '', newUrl);
}

// ─── Result Card ───────────────────────────────────────────────────────────────
function populateResultCard(p) {
  const img = document.getElementById('result-img');
  const emojiEl = document.getElementById('rc-emoji');

  // Set up image with emoji fallback
  img.style.display = 'block';
  emojiEl.style.display = 'none';
  img.onerror = () => {
    img.style.display = 'none';
    emojiEl.style.display = 'block';
  };
  img.alt = p.name;
  img.src = p.imgSrc; // set src AFTER handlers are attached

  document.getElementById('rc-emoji').textContent       = p.emoji;
  document.getElementById('rc-name').textContent        = p.name;
  document.getElementById('rc-tagline').textContent     = p.tagline;
  document.getElementById('rc-description').textContent = p.description;
  document.getElementById('rc-strength').textContent    = p.strength;
  document.getElementById('rc-weakness').textContent    = p.weakness;
  document.getElementById('rc-pairs').textContent       = p.pairs;
  document.getElementById('rc-clashes').textContent     = p.clashes;

  document.getElementById('rc-fact').textContent        = '📖 ' + p.fact;

  const traitsEl = document.getElementById('rc-traits');
  traitsEl.innerHTML = '';
  p.traits.forEach(t => {
    const chip = document.createElement('span');
    chip.className = 'trait-chip';
    chip.textContent = t;
    traitsEl.appendChild(chip);
  });

  // Colour accent
  document.documentElement.style.setProperty('--result-color', p.color);
}

// ─── Sharing ───────────────────────────────────────────────────────────────────
function setupShareButtons(p) {
  const shareUrl  = `https://wartimetuckshop.vercel.app?result=${p.id}`;
  const shareText = `I'm ${p.name}—${p.tagline} ${p.emoji} on the Wartime Tuckshop quiz. Find out your Singapore WWII food spirit:`;

  // Primary: Web Share API (opens native share sheet on mobile—WhatsApp, Telegram, Instagram, etc.)
  // Falls back to copy-link on desktop where navigator.share is unavailable.
  const primaryBtn = document.getElementById('btn-share-primary');
  primaryBtn.onclick = () => {
    if (navigator.share) {
      navigator.share({ title: 'Wartime Tuckshop', text: shareText, url: shareUrl })
        .catch(() => {}); // user cancelled
    } else {
      // Desktop fallback: copy link
      copyToClipboard(shareUrl);
      showFeedback('Link copied to clipboard.');
    }
  };

  // Secondary: Copy link
  document.getElementById('btn-copy').onclick = () => {
    copyToClipboard(shareUrl);
    showFeedback('Link copied to clipboard.');
  };

  // Secondary: Save card as image for Instagram
  document.getElementById('btn-save').onclick = () => {
    const card = document.getElementById('result-card');
    showFeedback('Generating image…');
    html2canvas(card, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fdf6e8',
      logging: false
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `wartime-tuckshop-${p.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showFeedback('Saved. Open Instagram and share from your camera roll.');
    }).catch(() => {
      showFeedback('Could not generate image—try screenshotting the card instead.');
    });
  };
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

// ─── Restart ───────────────────────────────────────────────────────────────────
restartBtn.addEventListener('click', restartQuiz);

function restartQuiz() {
  currentResult     = null;
  currentQuestion   = 0;
  userAnswers       = [];
  hide(resultsScreen);
  show(startScreen);
  // Remove result param from URL
  window.history.replaceState(null, '', window.location.pathname);
  // Reset card
  document.getElementById('result-img').src = '';
  document.getElementById('rc-name').textContent = '';
  document.documentElement.style.removeProperty('--result-color');
  hide(shareFeedback);
}
