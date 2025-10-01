let gameState = JSON.parse(localStorage.getItem('gameState')) || {
  score: 0,
  coins: 0,
  completed: {} // topic: [bool, bool, bool]
};

function updateHeader() {
  const scoreEl = document.getElementById('score');
  const coinsEl = document.getElementById('coins');
  if (scoreEl) scoreEl.textContent = gameState.score;
  if (coinsEl) coinsEl.textContent = gameState.coins;
}

// === Главная страница (index.html) ===
if (document.querySelector('.game-grid')) {
  updateHeader();
  document.querySelectorAll('.game-card').forEach(card => {
    const topic = card.dataset.topic;
    card.addEventListener('click', () => {
      window.location.href = `levels.html?topic=${topic}`;
    });

    const completed = gameState.completed[topic] || [];
    const levels = GAME_DATA[topic]?.levels || [];
    const isPerfect = completed.length === levels.length && completed.every(x => x);
    if (isPerfect) {
      card.classList.add('perfect-topic');
    }
  });
}

// === Страница выбора уровня (levels.html) ===
if (document.querySelector('.levels-container')) {
  const urlParams = new URLSearchParams(window.location.search);
  const topicKey = urlParams.get('topic');

  if (!GAME_DATA[topicKey]) {
    alert('Тема не найдена');
    window.location.href = 'index.html';
  }

  const topic = GAME_DATA[topicKey];
  document.getElementById('mentor-emoji').textContent = topic.emoji;
  document.getElementById('mentor-name').textContent = topic.name;
  document.getElementById('topic-title').textContent = topic.topic;

  const grid = document.getElementById('levels-grid');
  grid.innerHTML = '';
  topic.levels.forEach((_, i) => {
    const item = document.createElement('div');
    item.className = 'level-item';
    if (gameState.completed[topicKey]?.[i]) {
      item.classList.add('perfect');
    }
    item.textContent = i + 1;
    item.onclick = () => {
      window.location.href = `level.html?topic=${topicKey}&level=${i}`;
    };
    grid.appendChild(item);
  });

  document.getElementById('btn-back-to-main').onclick = () => {
    window.location.href = 'index.html';
  };

  updateHeader();
}

// Функция перемешивания (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// === Страница уровня (level.html) ===
if (document.querySelector('.level-container')) {
  const urlParams = new URLSearchParams(window.location.search);
  const topicKey = urlParams.get('topic');
  const levelIndex = parseInt(urlParams.get('level'));

  if (!GAME_DATA[topicKey] || levelIndex < 0 || levelIndex >= GAME_DATA[topicKey].levels.length) {
    alert('Уровень не найден');
    window.location.href = 'index.html';
  }

  const topic = GAME_DATA[topicKey];
  const level = topic.levels[levelIndex];

  // Заполняем заголовок
  document.getElementById('mentor-emoji').textContent = topic.emoji;
  document.getElementById('mentor-name').textContent = topic.name;
  document.getElementById('topic-title').textContent = topic.topic;
  document.getElementById('level-number').textContent = levelIndex + 1;
  document.getElementById('question-text').textContent = level.question;

  // Перемешиваем ответы
  const shuffledAnswers = shuffleArray(level.answers);

  const answersContainer = document.getElementById('answers-container');
  answersContainer.innerHTML = '';
  shuffledAnswers.forEach(ans => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = ans.text;
    // Сохраняем свойство perfect в самом элементе (через dataset или замыкание)
    btn.onclick = () => handleAnswer(ans.perfect, level, topicKey, levelIndex);
    answersContainer.appendChild(btn);
  });

  document.getElementById('btn-back-to-levels').onclick = () => {
    window.location.href = `levels.html?topic=${topicKey}`;
  };

  updateHeader();
}

// === Обработка ответа ===
function handleAnswer(isPerfect, level, topicKey, levelIndex) {
  const feedbackEl = document.getElementById('feedback');
  const feedbackText = document.getElementById('feedback-text');
  const answersContainer = document.getElementById('answers-container');

  // Анимация исчезновения ответов
  answersContainer.classList.add('fade-out');

  feedbackText.textContent = isPerfect ? level.feedback.true : level.feedback.false;
  feedbackEl.classList.remove('hidden');
  feedbackEl.classList.add('fade-in');

  // Сохраняем результат
  if (!gameState.completed[topicKey]) gameState.completed[topicKey] = [];
  const wasAlreadyPerfect = gameState.completed[topicKey][levelIndex] === true;

  if (isPerfect && !wasAlreadyPerfect) {
    gameState.score += level.points;
    gameState.coins += level.coins;
    gameState.completed[topicKey][levelIndex] = true;
  } else if (!isPerfect) {
    gameState.completed[topicKey][levelIndex] = false;
  }

  localStorage.setItem('gameState', JSON.stringify(gameState));
  updateHeader();

  document.getElementById('btn-next').onclick = () => {
    window.location.href = `levels.html?topic=${topicKey}`;
  };
}


// Плавная загрузка страницы
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
});


