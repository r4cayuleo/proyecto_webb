// AQUI EMPIEZA EL CODIGO DEL CARRITO DE COMPRAS
// Espera a que el contenido del documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderCartItems();
});

// Función para agregar entradas al carrito
function addToCart(eventName, quantity) {
    // Obtiene el carrito actual del localStorage o inicializa uno nuevo
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const eventIndex = cart.findIndex(event => event.name === eventName);

    if (eventIndex > -1) {
        // Si el evento ya está en el carrito, aumenta la cantidad
        cart[eventIndex].quantity += parseInt(quantity);
    } else {
        // Si el evento no está en el carrito, agrégalo
        cart.push({ name: eventName, quantity: parseInt(quantity) });
    }

    // Guarda el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Entradas agregadas al carrito para ' + eventName);
}

// Función para actualizar el número de entradas en el icono del carrito
function updateCartCount() {
    // Obtiene el carrito del localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Calcula el total de entradas en el carrito
    const count = cart.reduce((total, event) => total + event.quantity, 0);
    // Actualiza el contador en el icono del carrito
    document.getElementById('cart-count').textContent = count;
}

// Función para mostrar los elementos del carrito en el modal
function renderCartItems() {
    // Obtiene el carrito del localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    // Crea y agrega un elemento de lista para cada evento en el carrito
    cart.forEach((event, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        const eventInfo = document.createElement('span');
        eventInfo.textContent = `${event.name} - `;
        
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = '1';
        quantityInput.value = event.quantity;
        quantityInput.className = 'form-control quantity-input';
        quantityInput.addEventListener('change', () => updateCartQuantity(index, quantityInput.value));

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => removeFromCart(index));

        const controls = document.createElement('div');
        controls.className = 'd-flex align-items-center';
        controls.appendChild(quantityInput);
        controls.appendChild(deleteButton);

        listItem.appendChild(eventInfo);
        listItem.appendChild(controls);
        
        cartItemsContainer.appendChild(listItem);
    });
}

// Función para actualizar la cantidad de entradas en el carrito
function updateCartQuantity(index, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity = parseInt(quantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Función para eliminar un evento del carrito
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// Función para finalizar la compra
function checkout() {
    // Elimina el carrito del localStorage
    localStorage.removeItem('cart');
    updateCartCount();
    renderCartItems();
    alert('Compra finalizada. Gracias por su compra.');
}

// Event listener para abrir el modal del carrito y actualizar su contenido
document.querySelector('[data-bs-target="#cartModal"]').addEventListener('click', renderCartItems);


// AQUI EMPIEZA EL CODIGO DE LA API
// Clave API de Ticketmaster
const apiKey = 'CGGZDZbd2Du3f5HVuhZ2UrWhqmdzaBCc';
// URL de la API de Ticketmaster para obtener eventos de música
const url = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=${apiKey}`;

// Función para obtener y mostrar los conciertos recomendados
function cargarConciertosRecomendados() {
    // Llamada a la API usando fetch
    fetch(url)
        .then(response => response.json()) // Convierte la respuesta en un objeto JSON
        .then(data => {
            // Se obtiene la lista de eventos del objeto JSON
            const eventos = data._embedded.events;
            // Se selecciona el contenedor para mostrar los conciertos recomendados
            const conciertosContainer = document.getElementById('conciertos-recomendados');
            // Limpia cualquier contenido anterior en el contenedor
            conciertosContainer.innerHTML = '';

            // Objeto para contar la cantidad de conciertos por artista
            const artistCounts = {};
            // Array para rastrear el número de artistas diferentes mostrados
            const displayedArtists = [];

            // Itera sobre cada evento
            eventos.forEach(evento => {
                // Nombre del artista principal del evento
                const artista = evento._embedded.attractions[0].name;

                // Fecha del evento
                const fechaEvento = new Date(evento.dates.start.localDate);
                const añoEvento = fechaEvento.getFullYear();

                // Filtra eventos para mostrar solo los de 2024 y 2025
                if (añoEvento !== 2024 && añoEvento !== 2025) {
                    return;
                }
                
                // Si el artista no está en el array y ya hay 4 artistas, no agregue más conciertos
                if (!displayedArtists.includes(artista) && displayedArtists.length >= 4) {
                    return;
                }

                // Inicializa el contador para el artista si no existe
                if (!artistCounts[artista]) {
                    artistCounts[artista] = 0;
                }

                // Solo agrega el concierto si el artista tiene menos de 3 conciertos mostrados
                if (artistCounts[artista] < 3) {
                    // Crea un elemento de tarjeta para el concierto
                    const conciertoElement = document.createElement('div');
                    conciertoElement.classList.add('col-md-4');

                    // Define el contenido HTML de la tarjeta
                    conciertoElement.innerHTML = `
                        <div class="card">
                            <img src="${evento.images[0].url}" class="card-img-top" alt="${evento.name}">
                            <div class="card-body">
                                <h5 class="card-title">${evento.name}</h5>
                                <p class="card-text">Fecha: ${evento.dates.start.localDate}</p>
                                <p class="card-text">Lugar: ${evento._embedded.venues[0].name}</p>
                                <a href="${evento.url}" class="btn btn-primary" target="_blank">Comprar Entradas</a>
                            </div>
                        </div>
                    `;

                    // Agrega la tarjeta al contenedor
                    conciertosContainer.appendChild(conciertoElement);
                    // Incrementa el contador para el artista
                    artistCounts[artista]++;
                    
                    // Si es la primera vez que se muestra un concierto de este artista, se agrega al array de artistas mostrados
                    if (!displayedArtists.includes(artista)) {
                        displayedArtists.push(artista);
                    }
                }
            });
        })
        .catch(error => console.error('Error:', error)); // Maneja cualquier error en la llamada a la API
}

// Función para cargar los conciertos cuando se cargue la página
document.addEventListener('DOMContentLoaded', cargarConciertosRecomendados);
