// URL da API (ajuste se necessário para seu backend/json-server)
const API_URL = "http://localhost:3001/livros";

// Seleção dos elementos da página
const bookCardsContainer = document.getElementById("book-cards-container");
const addBookForm = document.getElementById("addBookForm");
const btnListBooks = document.getElementById("btnListBooks");

const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookYear = document.getElementById("bookYear");
const bookCover = document.getElementById("bookCover");

// ---- Funções CRUD ----

// Buscar e renderizar livros (GET)
function fetchAndRenderBooks() {
    fetch(API_URL)
        .then(response => response.json())
        .then(livros => renderBooks(livros))
        .catch(error => {
            console.error("Erro ao buscar livros:", error);
            bookCardsContainer.innerHTML = `<p>Erro ao carregar livros.</p>`;
        });
}

// Adicionar novo livro (POST)
function addBook(livro) {
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(livro)
    })
        .then(() => {
            addBookForm.reset();
            fetchAndRenderBooks();
        })
        .catch(error => console.error("Erro ao adicionar livro:", error));
}

// Editar livro (PUT)
function editBook(id, livroAtualizado) {
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(livroAtualizado)
    })
        .then(() => fetchAndRenderBooks())
        .catch(error => console.error("Erro ao editar livro:", error));
}

// Excluir livro (DELETE)
function deleteBook(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => fetchAndRenderBooks())
        .catch(error => console.error("Erro ao excluir livro:", error));
}

// ---- Renderização dos cards ----
function renderBooks(livros) {
    bookCardsContainer.innerHTML = "";

    if (livros.length === 0) {
        bookCardsContainer.innerHTML = `<p>Nenhum livro cadastrado.</p>`;
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
            <div class="card-buttons">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Excluir</button>
            </div>
        `;

        // Botão editar
        card.querySelector(".btn-edit").addEventListener("click", () => {
            const novoTitulo = prompt("Novo título:", livro.nome);
            const novoAutor = prompt("Novo autor:", livro.autor);
            const novoAno = prompt("Novo ano:", livro.ano);
            const novaCapa = prompt("Nova URL da capa:", livro.capa);

            if (novoTitulo && novoAutor && novoAno) {
                editBook(livro.id, {
                    nome: novoTitulo,
                    autor: novoAutor,
                    ano: parseInt(novoAno),
                    capa: novaCapa
                });
            }
        });

        // Botão excluir
        card.querySelector(".btn-delete").addEventListener("click", () => {
            if (confirm(`Tem certeza que deseja excluir o livro "${livro.nome}"?`)) {
                deleteBook(livro.id);
            }
        });

        bookCardsContainer.appendChild(card);
    });
}

// ---- Eventos ----

// Formulário de adicionar livro
addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const novoLivro = {
        nome: bookTitle.value,
        autor: bookAuthor.value,
        ano: parseInt(bookYear.value),
        capa: bookCover.value
    };

    addBook(novoLivro);
});

// Botão "Listar Livros"
btnListBooks.addEventListener("click", fetchAndRenderBooks);

// Carregar livros ao abrir a página
fetchAndRenderBooks();
