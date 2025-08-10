// main.js

document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 thefacebook is loaded");

  const statusInput = document.querySelector('.status-update');
  const postBtn = document.querySelector('button.bg-blue-600');
  const postsContainer = document.createElement('div');
  const profileName = document.querySelector('h2');

  let posts = [];
  let username = profileName?.textContent || "User";

  // Manejo de media
  let currentMedia = { type: null, data: null };

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
  }

  function togglePlaceholder() {
    const placeholder = document.getElementById('posts-placeholder');
    if (!placeholder) return;
    placeholder.style.display = posts.length === 0 ? '' : 'none';
  }

  // Función para renderizar los posts
  function renderPosts() {
    postsContainer.innerHTML = '';
    posts.forEach((post) => {
      const postDiv = document.createElement('div');
      postDiv.className = "bg-gray-800 rounded-lg shadow-md p-4 space-y-2";

      let mediaHTML = "";
      if (post.media) {
        if (post.media.type === "image") {
          mediaHTML = `<img src="${post.media.data}" class="media-preview rounded-md" alt="img" loading="lazy" />`;
        } else if (post.media.type === "video") {
          mediaHTML = `
      <video class="media-preview rounded-md w-full" controls>
        <source src="${post.media.data}" type="${post.media.mime || 'video/mp4'}">
        Your browser does not support the video tag.
      </video>`;
        }
      }

      postDiv.innerHTML = `
  <div class="flex items-center gap-2 text-sm text-white font-semibold">
    <div class="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full text-lg">${escapeHtml(post.avatar)}</div>
    <span>${escapeHtml(post.name)}</span>
  </div>
  <p class="text-sm text-white">${escapeHtml(post.content)}</p>
  ${mediaHTML}
`;
      postsContainer.appendChild(postDiv);
      postDiv.querySelector('video')?.load();
    });
    togglePlaceholder();
  }

  // Cargar desde localStorage
  function loadData() {
    try {
      const saved = localStorage.getItem('thefacebookData');
      if (!saved) return;
      const data = JSON.parse(saved);
      posts = Array.isArray(data.posts) ? data.posts : [];
      username = typeof data.username === 'string' && data.username.trim() ? data.username : "User";
      if (profileName) profileName.textContent = username;
    } catch (_) {
      // ignore parsing/storage errors
      posts = [];
    }
  }

  // Guardar en localStorage
  function saveData() {
    try {
      localStorage.setItem('thefacebookData', JSON.stringify({ posts, username }));
    } catch (_) {
      // storage may be unavailable (private mode quota)
    }
  }

  // Acción al hacer clic en Post
  postBtn?.addEventListener('click', () => {
    const content = (statusInput?.value || '').trim();

    const hasMedia = Boolean(currentMedia.data);
    if (!content && !hasMedia) return;

    posts.unshift({
      name: username,
      avatar: "👤",
      content,
      media: hasMedia ? { type: currentMedia.type, data: currentMedia.data } : null
    });

    if (statusInput) statusInput.value = '';
    clearMediaPreview();
    renderPosts();
    saveData();
  });

  const imageInput = document.querySelector('input[type="file"][accept="image/*"]');
  const videoInput = document.querySelector('input[type="file"][accept="video/*"]');

  function readFile(input, type) {
    const file = input?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e?.target?.result;
      if (!result) return;
      currentMedia = { type, data: result };
    };
    reader.readAsDataURL(file);
  }

  imageInput?.addEventListener('change', () => readFile(imageInput, 'image'));
  videoInput?.addEventListener('change', () => readFile(videoInput, 'video'));

  function clearMediaPreview() {
    currentMedia = { type: null, data: null };
    if (imageInput) imageInput.value = '';
    if (videoInput) videoInput.value = '';
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
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  importBtn?.addEventListener('click', () => {
    const json = prompt("Pega aquí los datos JSON exportados:");
    if (!json) return;
    try {
      const imported = JSON.parse(json);
      posts = Array.isArray(imported.posts) ? imported.posts : [];
      username = typeof imported.username === 'string' && imported.username.trim() ? imported.username : "User";
      if (profileName) profileName.textContent = username;
      renderPosts();
      saveData();
    } catch (_) {
      alert("Datos inválidos.");
    }
  });

  // Edición de perfil
  const editBtn = document.querySelector('button.text-blue-400');
  editBtn?.addEventListener('click', () => {
    const name = prompt("Ingresa tu nuevo nombre:", username);
    if (!name) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    username = trimmed;
    if (profileName) profileName.textContent = username;
    saveData();
  });

  // Añadir contenedor de posts al final de section
  const section = document.querySelector('section');
  if (section) {
    postsContainer.setAttribute('aria-live', 'polite');
    section.appendChild(postsContainer);
  }

  loadData();
  renderPosts();
});