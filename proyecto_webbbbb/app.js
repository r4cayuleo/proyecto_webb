// datos iniciales del carrito
let cart = [
  { id: 1, name: "Producto 1", price: 150, quantity: 2 },
  { id: 2, name: "Producto 2", price: 90, quantity: 1 },
  { id: 3, name: "Producto 3", price: 200, quantity: 1 }
];

// funcion para actualizar el carrito
function updateCart() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';
  let total = 0;

  // itera sobre cada item del carrito y genera filas de la tabla
  cart.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${item.name}</td>
          <td>$${item.price}</td>
          <td class="quantity-controls">
              <button onclick="changeQuantity(${item.id}, -1)" class="btn btn-secondary btn-sm">-</button>
              ${item.quantity}
              <button onclick="changeQuantity(${item.id}, 1)" class="btn btn-secondary btn-sm">+</button>
          </td>
          <td>$${item.price * item.quantity}</td>
          <td><button onclick="removeItem(${item.id})" class="btn btn-danger btn-sm">Eliminar</button></td>
      `;
      cartItems.appendChild(row);
      total += item.price * item.quantity;
  });

  // actualizar el total a pagar
  document.getElementById('totalAmount').textContent = `$${total}`;
}

// funcion para cambiar la cantidad de un item en el carrito
function changeQuantity(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) item.quantity = 1;
  updateCart();
}

// funcion para eliminar un item del carrito
function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}


// AQUI EMPIEZA LA API DE SEATGEEK PARA MOSTRAR OTROS CONCIERTOS

// se llama a updateCart para mostrar los datos iniciales del carrito
updateCart();

// codigo para obtener y mostrar los conciertos de SeatGeek
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
