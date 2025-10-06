const API_URL = "http://localhost:3001/livros";

// cria container no body (se não existir)
let livrosCardsContainer = document.getElementById("livros-cards-container");
if (!livrosCardsContainer) {
    livrosCardsContainer = document.createElement("div");
    livrosCardsContainer.id = "livros-cards-container";
    document.body.appendChild(livrosCardsContainer);
}

function fetchAndRenderLivros() {
    fetch(API_URL)
        .then(response => response.json())
        .then(livros => renderLivros(livros))
        .catch(error => {
            console.error("Erro ao buscar livros", error);
            livrosCardsContainer.innerHTML = `<p>Erro ao carregar livros</p>`;
        });
}

function renderLivros(livros) {
    livrosCardsContainer.innerHTML = "";

    if (livros.length === 0) {
        livrosCardsContainer.innerHTML = `<p>Nenhum livro cadastrado</p>`;
        return;
    }

    livros.forEach(livro => {
        const card = document.createElement("div");
        card.className = "livro-card";

        card.innerHTML = `
            <img src="${livro.capa || 'default.jpg'}" alt="Capa do livro" class="livro-capa">
            <div class="livro-info">
                <p><strong>ID:</strong> ${livro.id}</p>
                <p><strong>Título:</strong> ${livro.nome}</p>
                <p><strong>Autor:</strong> ${livro.autor}</p>
                <p><strong>Ano:</strong> ${livro.ano}</p>
            </div>
        `;

        livrosCardsContainer.appendChild(card);
    });
}

// Executa ao abrir a página
fetchAndRenderLivros();