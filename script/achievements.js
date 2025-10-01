// achievements.js
const ACHIEVEMENTS = [
  {
    id: 'perfect_deposits',
    title: 'Мудрец сбережений',
    description: 'Идеально пройдены все уровни по депозитам',
    icon: '🏦'
  },
  {
    id: 'perfect_security',
    title: 'Страж безопасности',
    description: 'Идеально пройдены все уровни по защите',
    icon: '🛡️'
  },
  {
    id: 'perfect_investments',
    title: 'Инвестор будущего',
    description: 'Идеально пройдены все уровни по инвестициям',
    icon: '📈'
  },
  {
    id: 'perfect_insurance',
    title: 'Гарант спокойствия',
    description: 'Идеально пройдены все уровни по страхованию',
    icon: '💼'
  },
  {
    id: 'score_100',
    title: 'Финансовый гуру',
    description: 'Набрано 100+ очков',
    icon: '🏆'
  },
  {
    id: 'coins_20',
    title: 'Монетный двор',
    description: 'Собрано 20+ монет',
    icon: '💰'
  }
];

function checkAchievements(gameState) {
  const unlocked = gameState.unlockedAchievements || {};

  // Проверка идеальных тем
  for (const topic of ['deposits', 'security', 'investments', 'insurance']) {
    const completed = gameState.completed[topic] || [];
    const levels = GAME_DATA[topic]?.levels || [];
    const isPerfect = completed.length === levels.length && completed.every(x => x);
    const achId = `perfect_${topic}`;
    if (isPerfect && !unlocked[achId]) {
      unlocked[achId] = true;
      showNotification(`Достижение разблокировано: ${ACHIEVEMENTS.find(a => a.id === achId).title}!`);
    }
  }

  // Очки и монеты
  if (gameState.score >= 100 && !unlocked.score_100) {
    unlocked.score_100 = true;
    showNotification('Достижение: Финансовый гуру!');
  }
  if (gameState.coins >= 20 && !unlocked.coins_20) {
    unlocked.coins_20 = true;
    showNotification('Достижение: Монетный двор!');
  }

  gameState.unlockedAchievements = unlocked;
  localStorage.setItem('gameState', JSON.stringify(gameState));
}

function showNotification(text) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = text;
  document.body.appendChild(notif);
  setTimeout(() => {
    if (notif.parentNode) notif.parentNode.removeChild(notif);
  }, 3000);
}

// Экспортируем для использования в script.js
window.ACHIEVEMENTS = ACHIEVEMENTS;
window.checkAchievements = checkAchievements;
window.showNotification = showNotification;