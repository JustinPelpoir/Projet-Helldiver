class ChatHistory {
    constructor() {
        this.messages = [];
    }

    addMessage(message) {
        this.messages.push(message);
    }

    getHistory() {
        return this.messages;
    }
}

const historyMessages = new ChatHistory();

// Fonction pour récupérer et traiter le JSON 
function fetchJSON(url) { 
    // Récupérer le JSON à partir de l'URL fournie 
    fetch(url = '../json/hellbot.json') 
    .then(response => { 
        // Vérifier si la réponse est correcte 
        if (!response.ok) {
            // Si la réponse n'est pas correcte, lancer une erreur 
          throw new Error('Network response was not ok'); 
        } 
        // Si la réponse est correcte, retourner le JSON 
        return response.json(); 
    }) 
    .then(data => { 
        // Vérifier si le JSON est vide ou mal formé 
        if (Object.keys(data).length === 0 && data.constructor === Object) { 
            // Si le JSON est vide ou mal formé, lancer une erreur 
            throw new Error('Empty JSON or malformed JSON'); 
        } 
        console.log(data); 
         
      // Passer les intentions à la fonction sendMessage qui sera définie plus tard 
        sendMessage(data.intents); 
    }) 
    .catch(error => { 
        // En cas d’erreur, afficher un message d’erreur dans la console 
        console.error('There was a problem with the fetch operation:', error); 
    }) ; 
} 

function showMessage(message, type) {
    const chatBox = document.getElementById('chat-box'); // récupère le texte écrit
    const div = document.createElement('div'); // créé un div pour y placer l'element
    div.className = 'message ' + type; // créé une classe pour identifier le message
    div.textContent = message; // place le texte brute écrit dans une variable
    chatBox.appendChild(div); // ajoute le texte dans l'espace message/discussion
    chatBox.scrollTop = chatBox.scrollHeight; // permet de voyager dans l'espace discussion 

    // Sauvegarde du message dans l'historique
    historyMessages.addMessage({
        message: message,
        sender: type
    });
}

function sendMessage(intents) {
    const input = document.getElementById('user-input');
    const userMessage = input.value.trim();

    if (userMessage === "") return; // Ne rien faire si vide

    showMessage(userMessage, 'user');

    const botReply = processMessage(intents, userMessage);

    showMessage(botReply, 'bot');

    input.value = '';
}

// Fonction pour traiter le message de l'utilisateur 
function processMessage(intents, message) { 
    let response = "Je suis désolé, je ne suis pas sûr de comprendre."; 

    intents.forEach(intent => {  
        intent.patterns.forEach(pattern => { 
        if (message.toLowerCase().includes(pattern.toLowerCase())) {
            // Sélectionner une réponse aléatoire parmi les réponses possibles 
            response = intent.responses[Math.floor(Math.random() * 
            intent.responses.length)]; 
        } 
        }); 
    }); 
    return response; 
} 


function saveMessages() {
    console.log('Saving chat history...');
    console.log(historyMessages.getHistory());
    sessionStorage.setItem('chatHistory',
        JSON.stringify(historyMessages.getHistory().map(msg => ({
            message: msg.message,
            sender: msg.sender
        })))
    );
}

function loadMessages() {
    const chatHistory = JSON.parse(sessionStorage.getItem('chatHistory'));
    if (chatHistory) {
        chatHistory.forEach(msg => {
            showMessage(msg.message, msg.sender);
        });
    }
}

// Charger les messages au démarrage de la page
window.addEventListener('DOMContentLoaded', () => {
    fetchJSON(); // charger les intents
    loadMessages(); // charger l’historique
});

// Sauvegarder les messages avant de quitter la page
window.addEventListener('beforeunload', () => {
    saveMessages();
});
