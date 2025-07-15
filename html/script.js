document.addEventListener('DOMContentLoaded', function() {
    let newWebSocket = new WebSocket("ws://localhost:8000/wschat");
    let messagesDiv;
    let messageInput;
    let sendButton;

    // Esperar a que los elementos estén disponibles
    function initElements() {
        messagesDiv = document.getElementById("messages");
        messageInput = document.getElementById("message");
        sendButton = document.getElementById("send");
        
        if (messagesDiv && messageInput && sendButton) {
            // Configurar el botón de enviar
            sendButton.onclick = function () {
                const messageValue = messageInput.value;
                if (messageValue.trim()) {
                    newWebSocket.send(messageValue);
                    messageInput.value = ''; // Limpiar el input después de enviar
                }
            };
        } else {
            console.error("No se encontraron elementos necesarios en el DOM");
        }
    }

    // Manejar mensajes recibidos
    newWebSocket.onmessage = function (event) {
        if (messagesDiv) {
            let message = document.createElement("div");
            message.textContent = event.data;
            messagesDiv.appendChild(message);
            messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll
        }
    }

    newWebSocket.onopen = function (event) {
        console.log("WebSocket connection opened");
        initElements(); // Inicializar elementos después de que la conexión esté lista
    }

    newWebSocket.onclose = function (event) {
        console.log("WebSocket connection closed");
    }
});