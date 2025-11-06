document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-denuncia");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const local = document.querySelector("input[type='text']").value;
    const tipo = document.querySelector("select").value;
    const descricao = document.querySelector("textarea").value;

    if (!local || !tipo || !descricao) {
      alert("⚠️ Preencha todos os campos antes de enviar!");
      return;
    }

    const denuncia = {
      local,
      tipo,
      descricao,
      data: new Date().toLocaleString()
    };

    try {
      const resposta = await fetch("http://localhost:3001/denuncias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(denuncia),
      });

      if (resposta.ok) {
        alert("✅ Denúncia enviada com sucesso!");
        form.reset();
      } else {
        alert("❌ Erro ao enviar denúncia!");
      }
    } catch (erro) {
      alert("🚨 Erro de conexão com o servidor!");
      console.error(erro);
    }
  });
});
