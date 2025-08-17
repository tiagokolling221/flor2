// Variáveis globais
let currentScreen = 0; // Começa na capa (screen 0)
const noButton = document.getElementById('noButton');
let noButtonMoved = false;

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Garante que apenas a capa esteja ativa inicialmente
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById('cover').classList.add('active');
    currentScreen = 0;
});

// Função para navegar entre as telas
function goToScreen(screenNumber) {
    // Remove a classe active da tela atual
    let currentScreenElement;
    if (currentScreen === 0) {
        currentScreenElement = document.getElementById('cover');
    } else {
        currentScreenElement = document.getElementById(`screen${currentScreen}`);
    }
    currentScreenElement.classList.remove('active');
    
    // Adiciona a classe active na nova tela
    let newScreenElement;
    if (screenNumber === 0) {
        newScreenElement = document.getElementById('cover');
    } else {
        newScreenElement = document.getElementById(`screen${screenNumber}`);
    }
    
    // Pequeno delay para a animação
    setTimeout(() => {
        newScreenElement.classList.add('active');
    }, 100);
    
    // Atualiza a tela atual
    currentScreen = screenNumber;
    
    // Reset do botão "Não" quando voltar para a tela 2
    if (screenNumber === 2) {
        resetNoButton();
    }
    
    // Adiciona efeito sonoro (se suportado)
    playClickSound();
}

// Função para mover o botão "Não" aleatoriamente
function moveNoButton() {
    const container = document.querySelector('#screen2 .buttons-container');
    const containerRect = container.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();

    // Posição atual do centro do botão
    const currentX = buttonRect.left - containerRect.left + buttonRect.width / 2;
    const currentY = buttonRect.top - containerRect.top + buttonRect.height / 2;

    // Distância mínima para o botão se mover
    const minMoveDistance = 150; // Pixels

    let newX, newY;
    let attempts = 0;
    const maxAttempts = 100; // Para evitar loops infinitos

    do {
        // Gera um ângulo aleatório em radianos
        const angle = Math.random() * 2 * Math.PI;

        // Calcula a nova posição baseada no ângulo e distância mínima
        newX = currentX + Math.cos(angle) * minMoveDistance;
        newY = currentY + Math.sin(angle) * minMoveDistance;

        // Ajusta para a posição do canto superior esquerdo do botão
        newX -= buttonRect.width / 2;
        newY -= buttonRect.height / 2;

        attempts++;
    } while (
        (newX < 0 || newX > containerRect.width - buttonRect.width ||
         newY < 0 || newY > containerRect.height - buttonRect.height) &&
        attempts < maxAttempts
    );

    // Se não encontrou uma posição válida após muitas tentativas, volta para o random simples
    if (attempts === maxAttempts) {
        newX = Math.random() * (containerRect.width - buttonRect.width);
        newY = Math.random() * (containerRect.height - buttonRect.height);
    }

    // Aplica a nova posição
    noButton.style.position = 'absolute';
    noButton.style.left = newX + 'vh';
    noButton.style.top = newY + 'vh';
    
    // Adiciona efeito de rotação aleatória
    const randomRotation = (Math.random() - 0.5) * 30; // -15 a 15 graus
    noButton.style.transform = `rotate(${randomRotation}deg) scale(0.9)`;
    
    // Volta ao tamanho normal após um tempo
    setTimeout(() => {
        noButton.style.transform = `rotate(${randomRotation}deg) scale(1)`;
    }, 200);
    
    noButtonMoved = true;
    
    // Adiciona efeito de vibração na tela (se suportado)
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }
    
    // Muda o texto do botão ocasionalmente para ser mais divertido
    const funnyTexts = [
        'Não ❌',
        'Nem pensar! 😤',
        'Nunca! 🙅‍♀️',
        'De jeito nenhum! 😠',
        'Impossível! 🚫',
        'Jamais! ⛔',
        'Nada disso! 🙄'
    ];
    
    if (Math.random() < 0.3) { // 30% de chance
        const randomText = funnyTexts[Math.floor(Math.random() * funnyTexts.length)];
        noButton.textContent = randomText;
        
        // Volta ao texto original após 2 segundos
        setTimeout(() => {
            noButton.textContent = 'Não ❌';
        }, 2000);
    }
}

// Função para resetar o botão "Não"
function resetNoButton() {
    noButton.style.position = 'absolute';
    noButton.style.left = '50%';
    noButton.style.top = '60px';
    noButton.style.transform = 'translateX(-50%)';
    noButton.textContent = 'Não ❌';
    noButtonMoved = false;
}

// Função para tocar som de clique (simulado)
function playClickSound() {
    // Cria um contexto de áudio para feedback sonoro
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Adiciona eventos especiais para o botão "Não"
document.addEventListener('DOMContentLoaded', function() {
    // Evento para quando o mouse se move sobre o botão "Não"
    noButton.addEventListener("mousemove", function(e) {
        const buttonRect = noButton.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calcula a distância do mouse ao centro do botão
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;

        const distanceX = mouseX - buttonCenterX;
        const distanceY = mouseY - buttonCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const fleeDistance = 100; // Distância a partir da qual o botão começa a fugir

        if (distance < fleeDistance) {
            // Calcula a direção oposta ao mouse
            const angle = Math.atan2(distanceY, distanceX);
            const moveX = Math.cos(angle) * (fleeDistance - distance);
            const moveY = Math.sin(angle) * (fleeDistance - distance);

            // Nova posição do botão
            let newX = buttonRect.left - moveX;
            let newY = buttonRect.top - moveY;

            // Garante que o botão permaneça dentro da área visível
            const container = document.querySelector("#screen2 .buttons-container");
            const containerRect = container.getBoundingClientRect();

            newX = Math.max(containerRect.left, Math.min(newX, containerRect.right - buttonRect.width));
            newY = Math.max(containerRect.top, Math.min(newY, containerRect.bottom - buttonRect.height));

            noButton.style.left = (newX - containerRect.left) + "px";
            noButton.style.top = (newY - containerRect.top) + "px";

            // Adiciona um pequeno efeito de rotação
            const randomRotation = (Math.random() - 0.5) * 10; // -5 a 5 graus
            noButton.style.transform = `rotate(${randomRotation}deg)`;
        }
    });

    // Evento para quando o mouse sai do botão "Não"
    noButton.addEventListener("mouseleave", function() {
        // Reseta a rotação quando o mouse sai
        noButton.style.transform = "rotate(0deg)";
    });

    // Evento para clique no botão "Não" (previne a ação padrão)
    noButton.addEventListener("click", function(e) {
        e.preventDefault();
        moveNoButton(); // Ainda move aleatoriamente ao clicar

        // Mensagens engraçadas no console
        const funnyMessages = [
            "Haha! Você não consegue clicar em mim! 😄",
            "Que isso! Eu sou muito rápido para você! ⚡",
            "Tenta de novo! 😜",
            "Impossível me pegar! 🏃‍♂️",
            "Sou um botão ninja! 🥷"
        ];

        const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        console.log(randomMessage);
    });

    // Adiciona movimento aleatório ocasional do botão "Não"
    setInterval(() => {
        if (currentScreen === 2 && Math.random() < 0.1) { // 10% de chance a cada 3 segundos
            moveNoButton();
        }
    }, 3000);

    // Inicializa a posição do botão "Não"
    resetNoButton();
});

// Adiciona efeitos de teclado
document.addEventListener('keydown', function(e) {
    // Tecla Enter para avançar
    if (e.key === 'Enter') {
        if (currentScreen === 0) {
            goToScreen(1);
        } else if (currentScreen === 1) {
            goToScreen(2);
        } else if (currentScreen === 2) {
            goToScreen(3);
        } else if (currentScreen === 3) {
            goToScreen(0);
        }
    }
    
    // Tecla Escape para voltar
    if (e.key === 'Escape') {
        if (currentScreen === 1) {
            goToScreen(0);
        } else if (currentScreen === 2) {
            goToScreen(1);
        } else if (currentScreen === 3) {
            goToScreen(2);
        }
    }
    
    // Tecla espaço para mover o botão "Não"
    if (e.key === ' ' && currentScreen === 2) {
        e.preventDefault();
        moveNoButton();
    }
});

// Adiciona efeitos de partículas dinâmicas
function createFloatingHeart() {
    if (currentScreen === 3) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.top = window.innerHeight + 'px';
        heart.style.fontSize = '20px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '5';
        heart.style.animation = 'floatUp 3s linear forwards';
        
        document.body.appendChild(heart);
        
        // Remove o coração após a animação
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 3000);
    }
}

// Adiciona animação CSS para os corações flutuantes
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Cria corações flutuantes na tela 3
setInterval(createFloatingHeart, 1000);

// Adiciona efeito de confete quando chegar na tela 3
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '5';
            confetti.style.animation = 'confettiFall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, i * 50);
    }
}

// Adiciona animação CSS para o confete
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Modifica a função goToScreen para adicionar confete na tela 3
const originalGoToScreen = goToScreen;
goToScreen = function(screenNumber) {
    originalGoToScreen(screenNumber);
    
    if (screenNumber === 3) {
        setTimeout(createConfetti, 500);
    }
};

