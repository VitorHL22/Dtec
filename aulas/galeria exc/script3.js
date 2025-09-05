const filters = document.getElementById('filters');
const cards = [...document.querySelectorAll('.card')];

const pesquisar = document.querySelector('.pesquisar');
const limpar = document.querySelector('.botao');

let active = 'tudo';

function apply() {
    cards.forEach(card => {
        const match = active === 'tudo' || card.dataset.category === active;
        card.classList.toggle('hidden', !match);
    });
}

filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill[data-filter]');
    if (!btn) return;

    filters.querySelectorAll('.pill').forEach(b => 
        b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');


    active = btn.dataset.filter;
    apply();
});

apply();

function filtrar(){
    const buscar = pesquisar.value.toLowerCase();
    cards.forEach(card => {
        const  nome = card.querySelector('.meta').textContent.toLowerCase();
        if (nome.includes(buscar)){
            card.style.display = 'block';
        }
        else{
            card.style.display = 'none';
        }
    })
}

pesquisar.addEventListener('input', filtrar);
limpar.addEventListener('click', () =>{
    pesquisar.value = '';
    filtrar();
})