// Minimal local question banks
const LOCAL_QUANT = [
  { subject: 'Quant', question: 'What is the value of 12 x 13?', options: ['156', '144', '169', '132'], answer: '156' },
  { subject: 'Quant', question: 'If x^2 = 49, what is x?', options: ['7', '-7', 'Both 7 and -7', '0'], answer: 'Both 7 and -7' },
  { subject: 'Quant', question: 'If a train travels 120 km in 2 hours, what is its average speed?', options: ['60 km/h', '120 km/h', '240 km/h', '30 km/h'], answer: '60 km/h' },
  { subject: 'Quant', question: 'If the area of a circle is 154 sq cm, what is its radius? (π=22/7)', options: ['7 cm', '14 cm', '11 cm', '5 cm'], answer: '7 cm' },
  { subject: 'Quant', question: 'If 3x + 2 = 11, what is x?', options: ['3', '2', '1', '4'], answer: '3' }
];
const LOCAL_LRDI = [
  { subject: 'LRDI', question: 'If all roses are flowers and some flowers fade quickly, can we say all roses fade quickly?', options: ['Yes', 'No', 'Cannot say', 'Sometimes'], answer: 'Cannot say' },
  { subject: 'LRDI', question: 'Find the odd one out: 2, 4, 8, 16, 20', options: ['2', '4', '8', '16', '20'], answer: '20' },
  { subject: 'LRDI', question: 'If 5 people can paint 5 walls in 5 days, how many days for 10 people to paint 10 walls?', options: ['5', '10', '2.5', '1'], answer: '5' },
  { subject: 'LRDI', question: "If A is twice as old as B and B is 10, what is A's age?", options: ['10', '15', '20', '5'], answer: '20' },
  { subject: 'LRDI', question: 'If CAT is coded as DBU, how is DOG coded?', options: ['EPH', 'EPI', 'DPI', 'EOG'], answer: 'EPH' }
];
const LOCAL_VARC = [
  { subject: 'VARC', question: 'Choose the correct synonym for "Eloquent".', options: ['Silent', 'Fluent', 'Angry', 'Tired'], answer: 'Fluent' },
  { subject: 'VARC', question: 'Antonym of "Obsolete"?', options: ['Modern', 'Ancient', 'Old', 'Rare'], answer: 'Modern' },
  { subject: 'VARC', question: 'Choose the correctly spelled word.', options: ['Accomodate', 'Acommodate', 'Accommodate', 'Acomodate'], answer: 'Accommodate' },
  { subject: 'VARC', question: 'Fill in the blank: The book was ___ by critics.', options: ['praised', 'praise', 'praising', 'praises'], answer: 'praised' },
  { subject: 'VARC', question: 'Which word is closest in meaning to "Ubiquitous"?', options: ['Rare', 'Everywhere', 'Unique', 'Absent'], answer: 'Everywhere' }
];

// Hard questions
const LOCAL_HARD = [
  { subject: 'Quant (Hard)', question: 'What is the square root of 169?', options: ['11', '12', '13', '14'], answer: '13' },
  { subject: 'LRDI (Hard)', question: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?', options: ['Yes', 'No', 'Cannot say', 'Only some'], answer: 'Yes' },
  { subject: 'VARC (Hard)', question: 'Choose the word most opposite in meaning to "Obfuscate".', options: ['Clarify', 'Hide', 'Complicate', 'Blur'], answer: 'Clarify' }
];

let currentBatch = [];
let timer = null;
let timeElapsed = 0; // seconds
let score = 0;
let total = 0;

// Track used questions to avoid repeats
let usedQuant = [];
let usedLRDI = [];
let usedVARC = [];
let usedHard = [];

function pickNNoRepeat(arr, usedArr, n) {
  let available = arr.filter(q => !usedArr.includes(q));
  if (available.length < n) {
    // Reset if not enough left
    usedArr.length = 0;
    available = arr.slice();
  }
  let picked = [];
  let usedIdx = new Set();
  while (picked.length < Math.min(n, available.length)) {
    let idx = Math.floor(Math.random() * available.length);
    if (!usedIdx.has(idx)) {
      picked.push(available[idx]);
      usedArr.push(available[idx]);
      usedIdx.add(idx);
    }
  }
  return picked;
}

function getRandomBatch() {
  return [
    ...pickNNoRepeat(LOCAL_QUANT, usedQuant, 3),
    ...pickNNoRepeat(LOCAL_LRDI, usedLRDI, 3),
    ...pickNNoRepeat(LOCAL_VARC, usedVARC, 4),
    ...pickNNoRepeat(LOCAL_HARD, usedHard, 1)
  ];
}

function renderQuiz() {
  const form = document.getElementById('quiz-form');
  form.innerHTML = '';
  if (!Array.isArray(currentBatch)) return;
  currentBatch.forEach((q, i) => {
    const block = document.createElement('div');
    block.className = 'question-block';
    block.innerHTML = `<b>(${q.subject}) ${q.question}</b><div class="options"></div>`;
    const optionsDiv = block.querySelector('.options');
    q.options.forEach(opt => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="radio" name="q${i}" value="${opt}"> ${opt}`;
      optionsDiv.appendChild(label);
      optionsDiv.appendChild(document.createElement('br'));
    });
    form.appendChild(block);
  });
}

function startTimer() {
  clearInterval(timer);
  timeElapsed = 0;
  updateTimerDisplay();
  timer = setInterval(() => {
    timeElapsed++;
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const min = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
  const sec = String(timeElapsed % 60).padStart(2, '0');
  document.getElementById('time').textContent = `${min}:${sec}`;
}

function submitQuiz() {
  clearInterval(timer);
  const form = document.getElementById('quiz-form');
  let correct = 0;
  let attempted = 0;
  currentBatch.forEach((q, i) => {
    const selected = form.querySelector(`input[name="q${i}"]:checked`);
    if (selected) {
      attempted++;
      if (selected.value === q.answer) {
        correct++;
      }
    }
  });
  score = correct;
  total = currentBatch.length;
  document.getElementById('accuracy').textContent = `${score}/${total}`;
  document.getElementById('result').textContent = `You got ${correct} out of ${currentBatch.length} correct!`;
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('next-btn').style.display = '';
}

document.getElementById('submit-btn').addEventListener('click', function() {
  submitQuiz();
});

document.getElementById('next-btn').addEventListener('click', function() {
  document.getElementById('result').textContent = '';
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('accuracy').textContent = '0/0';
  nextBatch();
  startTimer();
});

function nextBatch() {
  currentBatch = getRandomBatch();
  renderQuiz();
}

document.addEventListener('DOMContentLoaded', function() {
  nextBatch();
  startTimer();
});

// Dark mode toggle logic
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('catpuzzle-darkmode', '1');
  } else {
    localStorage.setItem('catpuzzle-darkmode', '0');
  }
});
if (localStorage.getItem('catpuzzle-darkmode') === '1') {
  document.body.classList.add('dark-mode');
} 