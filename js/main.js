// main.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 thefacebook 2.0 is live!");

  const postButton = document.querySelector("button.bg-blue-600");
  const textarea = document.querySelector("textarea.status-update");

  postButton?.addEventListener("click", () => {
    const content = textarea?.value.trim();
    if (content) {
      alert(`Post enviado: ${content}`);
      textarea.value = "";
    }
  });
});

