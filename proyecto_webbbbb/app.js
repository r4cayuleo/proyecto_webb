// AQUI EMPIEZA LA API DE SEATGEEK PARA MOSTRAR OTROS CONCIERTOS
// código para obtener y mostrar los conciertos de SeatGeek
const clientId = 'NDE2MTkyMTJ8MTcxNTg4NDI4Ni43NzY1NjMy'; // Client ID de SeatGeek
const concertsContainer = document.getElementById('concerts');
const startDate = '2024-05-01';
const endDate = '2024-06-01';
const url = `https://api.seatgeek.com/2/events?client_id=${clientId}&datetime_utc.gt=${startDate}&datetime_utc.lt=${endDate}&type=concert`;

// solicitud fetch a la URL de la API
fetch(url)
  .then(response => response.json())
  .then(data => {
      const events = data.events.slice(0, 6); // Para mostrar solo los primeros 6 conciertos
      let row = document.createElement('div');
      row.className = 'row';
      let colCount = 0;

      // itera sobre cada concierto obtenido
      events.forEach(event => {
          // crea el div para mostrar el concierto
          const concertElement = document.createElement('div');
          concertElement.className = 'concert col-md-4'; // Se usa Bootstrap para organizar en columnas responsivas

          // para mostrar el título, la fecha y la ubicación del concierto
          const title = document.createElement('h2');
          title.textContent = event.title;

          const date = document.createElement('p');
          date.textContent = new Date(event.datetime_utc).toLocaleString();

          const location = document.createElement('p');
          location.textContent = `${event.venue.name}, ${event.venue.city}, ${event.venue.state}`;

          // si hay una imagen disponible para el primer artista, se crea el elemento imagen
          if (event.performers[0].image) {
              const image = document.createElement('img');
              image.src = event.performers[0].image;
              image.className = 'img-fluid'; // Bootstrap para hacer que las imágenes sean responsivas
              concertElement.appendChild(image);
          }

          // agregar los elementos creados al div del concierto
          concertElement.appendChild(title);
          concertElement.appendChild(date);
          concertElement.appendChild(location);

          // agregar el concierto a la fila actual
          row.appendChild(concertElement);
          colCount++;

          // si ya hay 3 conciertos en la fila actual, se agrega la fila al contenedor principal y crea una nueva fila
          if (colCount === 3) {
              concertsContainer.appendChild(row);
              row = document.createElement('div');
              row.className = 'row';
              colCount = 0;
          }
      });

      if (colCount !== 0) {
          concertsContainer.appendChild(row);
      }
  })
  .catch(error => console.error('Error:', error));

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
