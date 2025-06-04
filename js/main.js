// main.js

document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 thefacebook is loaded");

  const statusInput = document.querySelector('.status-update');
  const postBtn = document.querySelector('button.bg-blue-600');
  const postsContainer = document.createElement('div');
  const profileName = document.querySelector('h2');
  const avatar = document.querySelector('div.bg-gray-600');

  let posts = [];
  let username = profileName?.textContent || "User";

  // Función para renderizar los posts
  function renderPosts() {
    postsContainer.innerHTML = '';
    posts.forEach((post, i) => {
      const postDiv = document.createElement('div');
      postDiv.className = "bg-gray-800 rounded-lg shadow-md p-4 space-y-2";

      postDiv.innerHTML = `
        <div class="flex items-center gap-2 text-sm text-white font-semibold">
          <div class="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full text-lg">${post.avatar}</div>
          <span>${post.name}</span>
        </div>
        <p class="text-sm text-white">${post.content}</p>
        ${post.media ? post.media.type === "image"
          ? `<img src="${post.media.data}" class="media-preview rounded-md" alt="img" />`
          : `<video src="${post.media.data}" class="media-preview rounded-md" controls></video>`
          : ""}
      `;
      postsContainer.appendChild(postDiv);
    });
  }

  // Cargar desde localStorage
  function loadData() {
    const saved = localStorage.getItem('thefacebookData');
    if (saved) {
      const data = JSON.parse(saved);
      posts = data.posts || [];
      username = data.username || "User";
      if (profileName) profileName.textContent = username;
    }
  }

  // Guardar en localStorage
  function saveData() {
    localStorage.setItem('thefacebookData', JSON.stringify({ posts, username }));
  }

  // Acción al hacer clic en Post
  postBtn?.addEventListener('click', () => {
    const content = statusInput.value.trim();
    if (!content && !currentMedia.data) return;

    posts.unshift({
      name: username,
      avatar: "👤",
      content,
      media: currentMedia.data
        ? { type: currentMedia.type, data: currentMedia.data }
        : null
    });

    statusInput.value = '';
    clearMediaPreview();
    renderPosts();
    saveData();
  });

  // Manejo de media
  let currentMedia = { type: null, data: null };

  const imageInput = document.querySelector('input[type="file"][accept="image/*"]');
  const videoInput = document.querySelector('input[type="file"][accept="video/*"]');

  function readFile(input, type) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      currentMedia = {
        type,
        data: e.target.result
      };
    };
    reader.readAsDataURL(file);
  }

  imageInput?.addEventListener('change', () => readFile(imageInput, 'image'));
  videoInput?.addEventListener('change', () => readFile(videoInput, 'video'));

  function clearMediaPreview() {
    currentMedia = { type: null, data: null };
    imageInput.value = '';
    videoInput.value = '';
  }

  // Botones de exportar/importar
  const exportBtn = document.querySelector('button.text-green-400');
  const importBtn = document.querySelector('button.text-purple-400');

  exportBtn?.addEventListener('click', () => {
    const dataStr = JSON.stringify({ posts, username }, null, 2);
    const uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const a = document.createElement('a');
    a.setAttribute('href', uri);
    a.setAttribute('download', 'thefacebook-data.json');
    a.click();
  });

  importBtn?.addEventListener('click', () => {
    const json = prompt("Pega aquí los datos JSON exportados:");
    if (!json) return;
    try {
      const imported = JSON.parse(json);
      posts = imported.posts || [];
      username = imported.username || "User";
      if (profileName) profileName.textContent = username;
      renderPosts();
      saveData();
    } catch (e) {
      alert("Datos inválidos.");
    }
  });

  // Edición de perfil
  const editBtn = document.querySelector('button.text-blue-400');
  editBtn?.addEventListener('click', () => {
    const name = prompt("Ingresa tu nuevo nombre:", username);
    if (!name) return;
    username = name;
    if (profileName) profileName.textContent = username;
    saveData();
  });

  // Añadir contenedor de posts al final de section
  const section = document.querySelector('section');
  if (section) section.appendChild(postsContainer);

  loadData();
  renderPosts();
});