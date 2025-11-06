const API_URL = "http://localhost:3002/usuarios";

// Seleção de elementos do HTML
const userCardContainer = document.getElementById('user-cards-container');
const addUserForm = document.getElementById('addUserForm');
const btnListUsers = document.getElementById('btnListUsers');

// Modal
const editModal = document.getElementById('editModal');
const editUserForm = document.getElementById('editUserForm');
const btnCancelEdit = document.getElementById('btnCancelEdit');
const editNameInput = document.getElementById('editName');
const editAgeInput = document.getElementById('editAge');
const editIdInput = document.getElementById('editId'); // ✅ corrigido

//Seleção de elementos no html
const loginModal = document.getElementById('loginModal')
const btnLoginModal = document.getElementById('btnLoginModal')
const btnCancelLogin = document.getElementById('btncalcelLogin')
const adminLoginForm = document.getElementById('adminLoginForm')
const adminAuthStatus = document.getElementById('adminAuthStatus')

//Seleção de Elementos MODAL DE REGISTRO

const registerModal = document.getElementById('registerModal')
const btnRegisterModal = document.getElementById('btnRegisterModal')
const bntCalcelRegister = document.getElementById('bntCalcelRegister')
const adminRegisterForm = document.getElementById('adminRegisterForm')
const adminRegisterStatus = document.getElementById('adminRegisterStatus')


// Buscar e renderizar usuários
function fetchAndRenderUsers() {
    fetch(API_URL)
        .then(response => response.json())
        .then(users => renderUsers(users))
        .catch(error => {
            console.error("Erro ao buscar usuários", error);
            userCardContainer.innerHTML = `<p>Erro ao carregar usuários</p>`;
        });
}

// Adicionar usuário
function addUser(userData) {
    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(() => {
            addUserForm.reset();
            fetchAndRenderUsers();
        })
        .catch(error => console.error("Erro ao adicionar usuário", error));
}

// Editar usuário
function editUser(userId, userData) {
    console.log("Editando:", userId, userData);

    fetch(`${API_URL}/${userId}`, {
        method: 'PUT', // ✅ corrigido para PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
        .then(async (response) => {
            console.log("Resposta:", response.status);
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Erro ${response.status}: ${text}`);
            }
            return response.json();
        })
        .then(() => {
            editModal.style.display = 'none';
            fetchAndRenderUsers();
        })
        .catch(error => console.error("Erro ao editar o usuário:", error));
}

// Deletar usuário
function deleteUser(userId) {
    fetch(`${API_URL}/${userId}`, { method: 'DELETE' })
        .then(() => fetchAndRenderUsers())
        .catch(error => console.error('Erro ao excluir usuário', error));
}
//Função para criar conta - Registrar adm 
function handleAdminRegister(email, password) {
    adminRegisterStatus.textContent =  "Registrando...";
    adminRegisterStatus.style.color = "blue";

    fetch('http//localhost:30020/api/register-admin', {
        method: 'POST', 
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({email, password})
    })
    .then(responnse => response.json())
    .then(data => {
        if (data.mensagem && data.mensagem.includes('sucesso')) {
            adminRegisterStatus.style.color = "green";
            adminRegisterStatus.textContent = "Conta criada com sucesso"
            setTimeout(() => {
                registerModal.style.display = 'none';
                document.getElementById('regUsername').value = ''
                document.getElementById('regPassword').value = ''
            }, 2000)
        }else{
            adminRegisterStatus.style.color = "Red"
            adminRegisterStatus.textContent = data.mensagem
        }
    })
}

// Renderizar cards de usuários
function renderUsers(users) {
    userCardContainer.innerHTML = "";

    if (users.length === 0) {
        userCardContainer.innerHTML = `<p>Nenhum usuário cadastrado</p>`;
        return;
    }

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <div class="user-info">
                <p><strong>ID:</strong> ${user._id}</p>  <!-- ✅ corrigido -->
                <p><strong>Nome:</strong> ${user.nome}</p>
                <p><strong>Idade:</strong> ${user.idade}</p>
            </div>
            <div class="card-buttons">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Excluir</button>
            </div>
        `;

        const editBtn = userCard.querySelector('.btn-edit');
        const deleteBtn = userCard.querySelector('.btn-delete');

        // Abrir modal de edição
        editBtn.addEventListener('click', () => {
            editIdInput.value = user._id; // ✅ corrigido
            editNameInput.value = user.nome;
            editAgeInput.value = user.idade;
            editModal.style.display = 'flex';
        });

        // Excluir
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Tem certeza que deseja excluir o usuário ${user.nome}?`)) {
                deleteUser(user._id); // ✅ corrigido
            }
        });

        userCardContainer.appendChild(userCard);
    });
}

// Eventos
btnListUsers.addEventListener('click', fetchAndRenderUsers);

addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newUserName = document.getElementById('addName').value;
    const newUserAge = parseInt(document.getElementById('addAge').value);

    addUser({ nome: newUserName, idade: newUserAge });
});

editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userId = editIdInput.value; // ✅ não usa parseInt
    const newName = editNameInput.value;
    const newAge = parseInt(editAgeInput.value);

    console.log("Form enviado:", { userId, newName, newAge });

    editUser(userId, { nome: newName, idade: newAge });
});

btnCancelEdit.addEventListener('click', () => {
    editModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Carregar lista ao abrir
fetchAndRenderUsers();
