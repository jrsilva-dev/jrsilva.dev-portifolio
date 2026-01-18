document.querySelectorAll('nav a').forEach(anchor => {
anchor.addEventListener('click', function(e) {
    e.preventDefault();

const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
    behavior: 'smooth'
  });
}});
});

const form = document.getElementById('appointmentForm');
const submitBtn = form.querySelector('button[type="submit"]');

if (form) {
  const messageDiv = document.createElement('div');

messageDiv.id = 'form-message';
messageDiv.style.cssText = 'margin-top: 10px; padding: 10px; border-radius: 8px; font-size: 0.9rem; text-align: center; opacity: 0; transition: opacity 0.3s ease;';
  form.appendChild(messageDiv);
form.addEventListener('submit', function(e) {
    e.preventDefault();

const emailInput = form.querySelector('#email');
const nameInput = form.querySelector('#name');
const messageInput = form.querySelector('#message');
    const email = emailInput.value.trim();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
  showMessage('Por favor, preencha todos os campos.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
  showMessage('Por favor, insira um email válido.', 'error');
      emailInput.focus();
      return;
    }

    const formData = new FormData(form);

    submitBtn.disabled = true;
submitBtn.textContent = 'Enviando...';
submitBtn.style.opacity = '0.7';

showMessage('Enviando mensagem...', 'loading');

fetch(form.action, { method: 'POST', body: formData, headers: {
      'Accept': 'application/json'
    }})
    .then(response => {
        if (!response.ok) {
      throw new Error('Erro na resposta do servidor');
        }
        return response.json();
      })
    .then(data => {
        if (data.ok) {
        showMessage('Mensagem enviada com sucesso! Em breve entrarei em contato. 😊', 'success');
          form.reset();
        form.scrollIntoView({ behavior: 'smooth' });
        } else {
        throw new Error(data.message || 'Erro desconhecido');
        }
      })
    .catch(error => {
      console.error('Erro no envio:', error);
      showMessage('Erro ao enviar. Verifique sua conexão e tente novamente.', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Mensagem';
      submitBtn.style.opacity = '1';
      });
  });
  function showMessage(text, type) {

    messageDiv.textContent = text;
    messageDiv.className = type;
messageDiv.style.opacity = '1';

if (type !== 'loading') {
      setTimeout(() => {
  messageDiv.style.opacity = '0';
      }, 5000);
}}}
