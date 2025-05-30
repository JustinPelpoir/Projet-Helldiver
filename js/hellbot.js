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
    //then est une méthode qui retourne une promesse et prend en paramètre une      
    //fonction callback qui sera exécutée une fois la promesse résolue 
    .then(response => { 
        // Vérifier si la réponse est correcte 
        if (!response.ok) {
            // Si la réponse n'est pas correcte, lancer une erreur 
          throw new Error('Network response was not ok'); 
        } 
        // Si la réponse est correcte, retourner le JSON 
        return response.json(); 
    }) 
    //then ici permettra de récupérer le JSON retourné par la promesse 
    .then(data => { 
        // Vérifier si le JSON est vide ou mal formé 
        if (Object.keys(data).length === 0 && data.constructor === Object) { 
            // Si le JSON est vide ou mal formé, lancer une erreur 
            throw new Error('Empty JSON or malformed JSON'); 
        } 
        //On affiche le JSON dans la console. Il s'agit d'un objet contenant les  
        // intentions du chatbot 
        console.log(data); 
         
      // Passer les intentions à la fonction sendMessage qui sera définie plus tard 
        sendMessage(data.intents); 
    }) 
    //catch est une méthode qui retourne une promesse et prend en paramètre une  
    //fonction callback qui sera exécutée en cas d’erreur 
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

    // a. Récupération de la saisie utilisateur → déjà fait
    // b. Affichage du message de l'utilisateur
    showMessage(userMessage, 'user');

    // c. Traitement et réponse du bot
    const botReply = processMessage(intents, userMessage);

    // d. Affichage de la réponse du chatbot
    showMessage(botReply, 'bot');

    // e. Vider le champ de saisie
    input.value = '';
}

// Fonction pour traiter le message de l'utilisateur 
function processMessage(intents, message) { 
    // Par défaut, la réponse est "Je suis désolé, je ne suis pas sûr de comprendre."
    let response = "Je suis désolé, je ne suis pas sûr de comprendre."; 
    // Parcourir les intentions du chatbot 
    intents.forEach(intent => { 
        // Vérifier si le message de l'utilisateur correspond à l'un des motifs 
        intent.patterns.forEach(pattern => { 
        // Vérifier si le message de l'utilisateur contient le motif 
        if (message.toLowerCase().includes(pattern.toLowerCase())) {
            // Sélectionner une réponse aléatoire parmi les réponses possibles 
            response = intent.responses[Math.floor(Math.random() * 
            intent.responses.length)]; 
        } 
        }); 
    }); 
    // Retourner la réponse 
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
