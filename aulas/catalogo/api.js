const bookContainer = document.getElementById("book-cards-container");
const addBookForm = document.getElementById("addBookForm");
const editBookForm = document.getElementById("editBookForm");
const editModal = document.getElementById("editModal");
const btnCancelEdit = document.getElementById("btnCancelEdit");

// Listar livros
window.listBooks = async function(genre = "") {
    try {
        const res = await fetch('http://localhost:3001/books');
        let books = await res.json();
        if (genre) books = books.filter(book => book.genre === genre);

        bookContainer.innerHTML = "";
        books.forEach(book => {
            const card = document.createElement("div");
            card.classList.add("book-card");
            card.innerHTML = `
                <img src="${book.cover || 'https://via.placeholder.com/150'}" alt="${book.title}">
                <p><strong>${book.title}</strong></p>
                <p>Autor: ${book.author}</p>
                <p>Ano: ${book.year}</p>
                <p>Gênero: ${book.genre || '-'}</p>
                <div class="card-buttons">
                    <button class="btn-edit" onclick="editBook(${book.id})">Editar</button>
                    <button class="btn-delete" onclick="deleteBook(${book.id})">Excluir</button>
                </div>
            `;
            bookContainer.appendChild(card);
        });
    } catch (err) {
        console.error("Erro ao listar livros:", err);
    }
};

// Adicionar livro
addBookForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const book = {
        title: document.getElementById("bookTitle").value,
        author: document.getElementById("bookAuthor").value,
        year: document.getElementById("bookYear").value,
        genre: document.getElementById("bookGenre").value,
        cover: document.getElementById("bookCover").value
    };
    try {
        await fetch('http://localhost:3000/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
        this.reset();
        listBooks();
    } catch (err) {
        console.error("Erro ao adicionar livro:", err);
    }
});

// Excluir livro
window.deleteBook = async function(id) {
    if (!confirm("Deseja realmente excluir este livro?")) return;
    try {
        await fetch(`http://localhost:3000/books/${id}`, { method: 'DELETE' });
        listBooks();
    } catch (err) {
        console.error("Erro ao excluir livro:", err);
    }
};

// Editar livro (abre modal)
window.editBook = async function(id) {
    try {
        const res = await fetch(`http://localhost:3000/books/${id}`);
        const book = await res.json();

        document.getElementById("editId").value = book.id;
        document.getElementById("editTitle").value = book.title;
        document.getElementById("editAuthor").value = book.author;
        document.getElementById("editYear").value = book.year;
        document.getElementById("editGenre").value = book.genre || "";
        document.getElementById("editCover").value = book.cover || "";

        editModal.style.display = "flex";
    } catch (err) {
        console.error("Erro ao abrir modal:", err);
        alert("Não foi possível abrir o modal.");
    }
};

// Salvar edição
editBookForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const id = document.getElementById("editId").value;
    const updatedBook = {
        title: document.getElementById("editTitle").value,
        author: document.getElementById("editAuthor").value,
        year: document.getElementById("editYear").value,
        genre: document.getElementById("editGenre").value,
        cover: document.getElementById("editCover").value
    };
    try {
        await fetch(`http://localhost:3000/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBook)
        });
        editModal.style.display = "none";
        listBooks();
    } catch (err) {
        console.error("Erro ao salvar edição:", err);
        alert("Não foi possível salvar a edição.");
    }
});

// Fechar modal
btnCancelEdit.addEventListener("click", () => {
    editModal.style.display = "none";
});

// Botão listar livros
document.getElementById("btnListBooks").addEventListener("click", () => listBooks());