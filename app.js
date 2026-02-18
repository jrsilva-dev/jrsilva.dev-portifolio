document.addEventListener("click", function (e) {
  const anchor = e.target.closest('a[href^="#"]');
  if (anchor) {
    e.preventDefault();
    const id = anchor.getAttribute("href");
    const target = document.querySelector(id);

    if (target) {
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - 80;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;

      const duration = 800;

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;

        const run = ease(timeElapsed, startPosition, distance, duration);

        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    }
  }
});

function reveal() {
  var reveals = document.querySelectorAll(".reveal");
  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150; // Distância para ativar a animação
    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    }
  }
}

window.addEventListener("scroll", reveal);

reveal();

const mobileMenu = document.getElementById('mobile-menu');
const menuList = document.querySelector('.menu');

mobileMenu.addEventListener('click', () => {
  menuList.classList.toggle('active');
  const icon = mobileMenu.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
});

document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    menuList.classList.remove('active');
    const icon = mobileMenu.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  });
});

const form = document.getElementById("appointmentForm");
const submitBtn = form.querySelector('button[type="submit"]');

if (form) {
  const messageDiv = document.createElement("div");

  messageDiv.id = "form-message";
  messageDiv.style.cssText =
    "margin-top: 10px; padding: 10px; border-radius: 8px; font-size: 0.9rem; text-align: center; opacity: 0; transition: opacity 0.3s ease;";
  form.appendChild(messageDiv);
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = form.querySelector("#email");
    const nameInput = form.querySelector("#name");
    const messageInput = form.querySelector("#message");
    const email = emailInput.value.trim();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      showMessage("Por favor, preencha todos os campos.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage("Por favor, insira um email válido.", "error");
      emailInput.focus();
      return;
    }

    const formData = new FormData(form);

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";
    submitBtn.style.opacity = "0.7";

    showMessage("Enviando mensagem...", "loading");

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro na resposta do servidor");
        }
        return response.json();
      })
      .then((data) => {
        if (data.ok) {
          showMessage(
            "Mensagem enviada com sucesso! Em breve entrarei em contato. 😊",
            "success",
          );
          form.reset();
          form.scrollIntoView({ behavior: "smooth" });
        } else {
          throw new Error(data.message || "Erro desconhecido");
        }
      })
      .catch((error) => {
        console.error("Erro no envio:", error);
        showMessage(
          "Erro ao enviar. Verifique sua conexão e tente novamente.",
          "error",
        );
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar Mensagem";
        submitBtn.style.opacity = "1";
      });
  });
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.style.opacity = "1";

    if (type !== "loading") {
      setTimeout(() => {
        messageDiv.style.opacity = "0";
      }, 5000);
    }
  }
}

const whatsappMainBtn = document.getElementById("whatsappMainBtn");
const whatsappOptions = document.getElementById("whatsappOptions");
const whatsappIcon = document.getElementById("whatsappIcon");
const closeIcon = document.getElementById("closeIcon");

whatsappMainBtn.addEventListener("click", () => {
  if (whatsappOptions.style.display === "flex") {
    whatsappOptions.style.display = "none";
    whatsappIcon.style.display = "block";
    closeIcon.style.display = "none";
  } else {
    whatsappOptions.style.display = "flex";
    whatsappIcon.style.display = "none";
    closeIcon.style.display = "block";
  }
});
