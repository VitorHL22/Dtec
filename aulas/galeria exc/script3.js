const filtros = document.querySelectorAll('#filtros input[type="checkbox"]');
const pesquisar = document.querySelector('.pesquisar');
const limpar = document.querySelector('.botao');
const escolha = document.getElementById('escolha');
const cards = [...document.querySelectorAll('.card')];
const botoesFav = document.querySelectorAll('.favoritar');
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
function atualizarFavoritos() {
    cards.forEach(card => {
        const titulo = card.querySelector('strong').textContent;
        const botao = card.querySelector('.favoritar');
        if (favoritos.includes(titulo)) {
            botao.classList.add('fav');
        } else {
            botao.classList.remove('fav');
        }
    });
}
function filtrarCategorias() {
    const ativos = [...filtros].filter(f => f.checked).map(f => f.value);
    cards.forEach(card => {
        const categoria = card.dataset.category;
        card.classList.toggle('hidden', !ativos.includes(categoria));
    });
}
function filtrarBusca() {
    const termo = pesquisar.value.toLowerCase();
    cards.forEach(card => {
        const nome = card.querySelector('strong').textContent.toLowerCase();
        card.style.display = nome.includes(termo) ? 'block' : 'none';
    });
}
function ordenar() {
    let sortedCards = [...cards];
    const valor = escolha.value;

    // Sempre coloca favoritos no topo
    sortedCards.sort((a, b) => {
        const aTitulo = a.querySelector('strong').textContent;
        const bTitulo = b.querySelector('strong').textContent;

        const aFav = favoritos.includes(aTitulo) ? 1 : 0;
        const bFav = favoritos.includes(bTitulo) ? 1 : 0;

        if (aFav !== bFav) return bFav - aFav;
        if (valor === 'az') {
            return aTitulo.localeCompare(bTitulo);
        } else if (valor === 'za') {
            return bTitulo.localeCompare(aTitulo);
        }
        return 0;
    });

    const grid = document.getElementById('grid');
    sortedCards.forEach(card => grid.appendChild(card));
}

botoesFav.forEach(botao => {
    botao.addEventListener('click', () => {
        const titulo = botao.closest('.card').querySelector('strong').textContent;
        if (favoritos.includes(titulo)) {
            favoritos = favoritos.filter(f => f !== titulo);
        } else {
            favoritos.push(titulo);
        }
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        atualizarFavoritos();
        ordenar();
    });
});

// 🔹 Eventos
filtros.forEach(f => f.addEventListener('change', () => { filtrarCategorias(); filtrarBusca(); }));
pesquisar.addEventListener('input', filtrarBusca);
limpar.addEventListener('click', () => {
    pesquisar.value = '';
    filtrarBusca();
});
escolha.addEventListener('change', ordenar);

filtrarCategorias();
filtrarBusca();
atualizarFavoritos();
ordenar();
