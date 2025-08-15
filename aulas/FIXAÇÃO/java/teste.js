const form = document.querySelector('#formulario');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const peso = Number(document.querySelector("#peso").value.replace(",", "."));
  const alturaCm = Number(document.querySelector("#altura").value.replace(",", "."));
  const altura = alturaCm / 100; 
  const resultado1 = document.querySelector("#resultado");

  if (!peso || peso <= 0) {
    resultado1.innerHTML = "<p class='cor-resultado'>Peso inválido</p>";
    return;
  }

  if (!altura || altura <= 0) {
    resultado1.innerHTML = "<p class='cor-resultado'>Altura inválida</p>";
    return;
  }

  const imc = (peso / altura ** 2).toFixed(2);
  let classificacao = "";
  let cor1 = "";
if (imc < 18.5) {
  classificacao = "Abaixo do peso";
  cor1 = "cor-errada";
} else if (imc < 25) {
  classificacao = "Peso normal";
  cor1 = "cor-resultado";
} else if (imc < 30) {
  classificacao = "Sobrepeso";
  cor1 = "cor-errada";
} else if (imc < 35) {
  classificacao = "Obesidade grau 1";
  cor1 = "cor-errada";
} else if (imc < 40) {
  classificacao = "Obesidade grau 2";
  cor1 = "cor-errada";
} else {
  classificacao = "Obesidade grau 3";
  cor1 = "cor-errada";
}
  resultado1.innerHTML = `<p class='${cor1}'>Seu IMC é ${imc} (${classificacao}).</p>`;
});
