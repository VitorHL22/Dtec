const API_URL = "http://localhost:3004/api/auth";

// cadastro
const cadastroForm = document.querySelector("form[action='cadastro']") || document.querySelector("form:not(#loginForm)");
if (cadastroForm) {
    cadastroForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const confirmar = document.getElementById("confirmar").value;
        const msg = document.getElementById("mensagem");

        if (senha !== confirmar) {
            alert("As senhas não coincidem!");
            return;
        }

        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await res.json();
        alert(data.msg);
        if (res.ok) window.location.href = "login.html";
    });
}

// login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const msg = document.getElementById("mensagem");

        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await res.json();
        msg.textContent = data.msg;
        msg.style.color = res.ok ? "green" : "red";

        if (data.token) {
            localStorage.setItem("token", data.token);
            alert("Login realizado com sucesso!");
            window.location.href = "index.html";
        }
    });
}

//index
if (window.location.pathname.endsWith("index.html")) {
    const token = localStorage.getItem("token");
    const userName = document.getElementById("userName");

    if (!token) {
        alert("Você precisa estar logado para acessar esta página!");
        window.location.href = "login.html";
    } else {
        fetch("http://localhost:3004/api/auth/perfil", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    alert("Sessão expirada ou token inválido.");
                    localStorage.removeItem("token");
                    window.location.href = "login.html";
                } else {
                    userName.textContent = data.userId || "Usuário";
                }
            })
            .catch(() => {
                alert("Erro ao validar sessão. Tente novamente.");
                localStorage.removeItem("token");
                window.location.href = "login.html";
            });
    }

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("token");
        alert("Você saiu da conta!");
        window.location.href = "login.html";
    });
}