// Variables globales
let currentScreen = 'login';
let selectedFood = null;
let products = []; 

// Elementos del DOM
const loginScreen = document.getElementById('loginScreen');
const homeScreen = document.getElementById('homeScreen');
const foodDetailScreen = document.getElementById('foodDetailScreen');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const backButton = document.getElementById('backButton');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const detailFoodTitle = document.getElementById('detailFoodTitle');
const detailFoodImage = document.getElementById('detailFoodImage');
const detailFoodCalories = document.getElementById('detailFoodCalories');
const detailFoodProtein = document.getElementById('detailFoodProtein');
const detailFoodCarbs = document.getElementById('detailFoodCarbs');
const detailFoodFat = document.getElementById('detailFoodFat');

// Función para mostrar pantallas
function showScreen(screen) {
  loginScreen.classList.add('hidden');
  homeScreen.classList.add('hidden');
  foodDetailScreen.classList.add('hidden');

  if (screen === 'login') loginScreen.classList.remove('hidden');
  else if (screen === 'home') homeScreen.classList.remove('hidden');
  else if (screen === 'foodDetail') foodDetailScreen.classList.remove('hidden');

  currentScreen = screen;
}

// Login
if (loginButton) {
  loginButton.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) return alert("Por favor ingresa correo y contraseña");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        showScreen('home');
        fetchProducts();
      } else alert(data.error || "Credenciales incorrectas");
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  });
}

// Logout
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    products = [];
    showScreen('login');
  });
}

backButton.addEventListener('click', () => {
  showScreen('home');
});

// Traer productos
async function fetchProducts() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/api/productos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (res.ok) {
      products = data;
      renderProducts();
    } else {
      alert(data.error || 'Error al cargar productos');
    }
  } catch (err) {
    console.error(err);
    alert('No se pudo conectar al servidor');
  }
}

// Render dinámico de alimentos
function renderProducts() {
  const container = document.getElementById('productsContainer');
  container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('food-card');
    card.innerHTML = `
      <img src="${product.image || 'img/default.png'}" alt="${product.Nombre}" />
      <div class="food-info">
        <h4>${product.Nombre}</h4>
        <div class="food-macros">
          <span>${product.Calorias || 0} kcal</span>
          <span>${product.Proteina || 0}g P</span>
          <span>${product.Carbohidratos || 0}g C</span>
          <span>${product.Grasas || 0}g G</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => showFoodDetail(product._id));
    container.appendChild(card);
  });
}

// Mostrar detalle
function showFoodDetail(foodId) {
  const food = products.find(p => p._id === foodId);
  if (!food) return alert('Producto no encontrado');

  selectedFood = food;
  detailFoodTitle.textContent = food.Nombre;
  detailFoodImage.src = food.image || 'img/default.png';
  detailFoodImage.alt = food.Nombre;
  detailFoodCalories.textContent = `${food.Calorias || 0} kcal`;
  detailFoodProtein.textContent = `${food.Proteina || 0} g Proteínas`;
  detailFoodCarbs.textContent = `${food.Carbohidratos || 0} g Carbohidratos`;
  detailFoodFat.textContent = `${food.Grasas || 0} g Grasas`;

  showScreen('foodDetail');
}

// Inicio
showScreen('login');
