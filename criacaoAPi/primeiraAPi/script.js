const { response } = require("express");

const API_URL = "http://localhost3000/usuarios";

//Seleção de elementos do HTML
const userCardContainer = document.getElementById('user-cards-container')
const addUserForm = document.getElementById('addUserForm')
const btnListUser = document.getElementById('btnListUser ')

//modal
const editModal = document.getElementById('editModal')
const editUserForm = document.getElementById('editUserForm')
const btnCalcelEdit = document.getElementById('btnCanceledit')
const editNameInput = document.getElementById('editNameInput')
const editAgeInput = document.getElementById('edirtAgeInput')
const editIdInput = document.getElementById('editIdInput')


function fetchAndrenderUsers() {
    fetch(API_URL)
        .then(response => response.json())
        .then(users => renderUsers(users))
        .catch(error => {
            console.error("Erro ao buscar usuários", error);
            userCardsContainer.innerHTML = `<p> Erro ao carregar usuários</p>`
        })
}

function addUser(userData){
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
        
    })
    .then(response => response.json())
    .then(() => {
        addUserForm.reset();
        fetchAndrenderUsers();
    })
    .catch(error => console.error("Erro ao adicionar usuário, error")); 
}

//FUNÇÃO PARA EDITAR USUÁRIO EXISTENT
function editUser(userId, userData) {
    fetch(`${API_URL}/${userID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(() => {
        editModal.style.display = 'none';
        fetchAndrenderUsers();
    })
    .catch(error => console.error("Error ao editar o usuário", error));
}

function deletUser(userId) {
        fetch(`${API_URL}/${userId}`,{
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            fetchAndrenderUsers()
        })
        .catch(error => console.error('Erro ao excluir usuário', error))

}

function renderUsers(users) {
    userCardsContainer.innerHTML = "";

    if(users.length === 0) {
        userCardsContainer.innerHTML = `<p> Nenhum usuário cadastrado</p>`
        return;
    }

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `


            <div class="user-info">
                <p><strong>ID:</strong>${user.id}</p>
                <p><strong>Nome:</strong>${user.nome}</p>
                <p><strong>Idade:</strong>${user.idade}</p>
            </div>
            <div class="card-buttons">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Excluir</button>
        `;

        const editBtn = userCard.querySelector('.btn-edit');
        const deletBtn = userCard.querySelector('.btn-delete');

        editBtn.addEventListener('click', () => {
            editIdInput.value = user.id;
            editNameInput.value =  user.nome;
            editAgeInput.value = user.idade;
            editModal.style.display = 'flex';

        })
    })
}