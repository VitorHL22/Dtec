const paisInput = document.getElementById("paisInput");
const buscarBtn = document.getElementById("buscarBtn");
const container = document.getElementById("container");

document.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        buscarBtn.click();
    }
});

buscarBtn.addEventListener('click', () => {
    const nomePais = paisInput.value.trim();

    if (nomePais === "") {
        alert("Por favor, digite o nome de um país");
        return;
    }

    let lat, lon, pais;

    const url = `https://nominatim.openstreetmap.org/search?q=${nomePais}&format=json&limit=1`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Erro na busca');
            return response.json();
        })
        .then(data => {
            if (data.length === 0) throw new Error("País não encontrado");

            pais = data[0];
            lat = pais.lat;
            lon = pais.lon;

            const meteo = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
            return fetch(meteo);
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro na busca do clima');
            return response.json();
        })
        .then(clima => {
            const temp = clima.current_weather.temperature;
            const dia = clima.current_weather.is_day === 1 ? "Dia" : "Noite";
        
            container.innerHTML = `
                <h2>${pais.display_name}</h2>  
                <p><strong>Longitude: </strong> ${lon}</p> 
                <p><strong>Latitude: </strong> ${lat}</p>
                <p><strong>Temperatura Atual: </strong> ${temp} °C</p>
                <p><strong>Período: </strong> ${dia}</p>
            `;
        })
        .catch(error => {
            console.error(error);
            container.innerHTML = `<p style="color: red;">Erro: ${error.message}</p>`;
        });
});
