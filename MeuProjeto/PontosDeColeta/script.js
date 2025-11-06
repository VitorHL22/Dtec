// Espera o load completo da página antes de inicializar tudo
window.addEventListener('load', () => {
  console.log("Inicializando mapa e UI...");

  const points = [
    { id: 1, name: "Ponto - Mercado Central", lat: -23.5509, lng: -46.6333, tipos: ["Plástico", "Metal", "Papel"], endereco: "R. Exemplo 123, Centro" },
    { id: 2, name: "Ponto - Escola Verde", lat: -23.5480, lng: -46.6400, tipos: ["Papel", "Orgânico"], endereco: "Av. Escola 45" },
    { id: 3, name: "Ponto - Coleta Shopping", lat: -23.5555, lng: -46.6405, tipos: ["Plástico", "Vidro", "Eletrônicos"], endereco: "Shopping Center, Loja 3" },
    { id: 4, name: "Ponto - Praça Recicla", lat: -23.5522, lng: -46.6200, tipos: ["Metal", "Vidro"], endereco: "Praça das Flores" },
    { id: 5, name: "Ponto - Posto Ecológico", lat: -23.5600, lng: -46.6300, tipos: ["Orgânico", "Papel"], endereco: "Av. Verde, 200" },
    { id: 6, name: "Ponto - Oficina Eletrônica", lat: -23.5450, lng: -46.6350, tipos: ["Eletrônicos", "Metal"], endereco: "R. dos Técnicos, 12" }
  ];

  const wasteTypes = ["Plástico", "Vidro", "Metal", "Papel", "Orgânico", "Eletrônicos"];

  const typeColors = {
    "Plástico": "#2f8f3b",
    "Vidro": "#1f9aa1",
    "Metal": "#437f8a",
    "Papel": "#7aa66f",
    "Orgânico": "#c68c2f",
    "Eletrônicos": "#6b6bde"
  };

  const map = L.map('map', { zoomControl: true }).setView([-23.5509, -46.6333], 13);
  console.log("Mapa criado:", map ? "ok" : "erro");

  setTimeout(() => { try { map.invalidateSize(); console.log("invalidateSize() chamado (timeout 200)"); } catch (e) { console.warn(e); } }, 200);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ''
  }).addTo(map);

  let markersLayer = L.layerGroup().addTo(map);
  let circleLayer = L.layerGroup().addTo(map);

  function createMarker(p) {
    const color = typeColors[p.tipos[0]] || "#2f8f3b";
    const marker = L.circleMarker([p.lat, p.lng], {
      radius: 12,
      fillColor: color,
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 1
    });

    const popupHtml = `
      <div style="min-width:200px">
        <strong>${p.name}</strong><br/>
        <small style="color:#666">${p.endereco}</small><br/>
        <div style="margin-top:6px"><strong>Tipos:</strong> ${p.tipos.join(", ")}</div>
      </div>
    `;
    marker.bindPopup(popupHtml);
    marker.data = p;
    return marker;
  }

  const allMarkers = points.map(p => ({ data: p, marker: createMarker(p) }));

  function showAllMarkers() {
    markersLayer.clearLayers();
    allMarkers.forEach(o => markersLayer.addLayer(o.marker));
  }
  showAllMarkers();

  const typeFiltersDiv = document.getElementById("typeFilters");
  const selectedTypes = new Set();
  wasteTypes.forEach((t, idx) => {
    const div = document.createElement("div");
    div.className = "type-item";
    const id = "chk_" + t.replace(/\s+/g, "");
    div.innerHTML = `
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
        <input type="checkbox" id="${id}" ${idx < 2 ? "checked" : ""}/>
        <span style="display:flex;align-items:center;gap:8px">
          <span style="width:12px;height:12px;border-radius:4px;background:${typeColors[t]};display:inline-block"></span>
          <span>${t}</span>
        </span>
      </label>
    `;
    typeFiltersDiv.appendChild(div);
    const chk = div.querySelector("input");
    if (chk.checked) selectedTypes.add(t);
    chk.addEventListener("change", () => {
      if (chk.checked) selectedTypes.add(t); else selectedTypes.delete(t);
    });
  });

  const radiusRange = document.getElementById("radiusRange");
  const radiusLabel = document.getElementById("radiusLabel");
  let currentRadiusKm = Number(radiusRange.value);
  radiusLabel.textContent = currentRadiusKm + " km";
  radiusRange.addEventListener("input", () => {
    currentRadiusKm = Number(radiusRange.value);
    radiusLabel.textContent = currentRadiusKm + " km";
  });

  const addressInput = document.getElementById("addressInput");
  const btnSearch = document.getElementById("btnSearch");
  let currentSearchLocation = null;

  async function geocodeAddress(q) {
    if (!q) return null;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&addressdetails=1`;
    try {
      const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
      const data = await res.json();
      if (data && data.length > 0) {
        const item = data[0];
        return { lat: parseFloat(item.lat), lng: parseFloat(item.lon), display_name: item.display_name };
      } else return null;
    } catch (e) {
      console.error("Geocode error", e);
      return null;
    }
  }

  btnSearch.addEventListener("click", async () => {
    const q = addressInput.value.trim();
    if (!q) return alert("Digite um endereço ou CEP para buscar.");
    btnSearch.disabled = true;
    btnSearch.textContent = "⏳";
    const res = await geocodeAddress(q);
    btnSearch.disabled = false;
    btnSearch.textContent = "🔎";
    if (!res) return alert("Endereço não encontrado.");
    currentSearchLocation = res;
    map.setView([res.lat, res.lng], 14);
    circleLayer.clearLayers();
    L.marker([res.lat, res.lng], { title: res.display_name }).addTo(circleLayer).bindPopup(`<strong>${res.display_name}</strong>`).openPopup();
    L.circle([res.lat, res.lng], { radius: currentRadiusKm * 1000, color: "#3fa64b", weight: 2, fill: false }).addTo(circleLayer);
    applyFilters();
    setTimeout(() => map.invalidateSize(), 300);
  });

  function haversineDistanceKm(lat1, lon1, lat2, lon2) {
    function toRad(x) { return x * Math.PI / 180; }
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const countBadge = document.getElementById("countBadge");
  const listPanel = document.getElementById("listPanel");

  function updateCount(n) {
    countBadge.textContent = `Exibindo ${n} ponto${n !== 1 ? "s" : ""} de coleta na sua área.`;
  }

  function renderList(items) {
    listPanel.innerHTML = "";
    if (items.length === 0) {
      listPanel.innerHTML = "<div style='padding:12px;color:#666'>Nenhum ponto encontrado.</div>";
      return;
    }
    items.forEach(it => {
      const div = document.createElement("div");
      div.className = "point-item";
      div.innerHTML = `
        <strong>${it.name}</strong>
        <div style="color:#666;font-size:13px">${it.endereco}</div>
        <div style="margin-top:6px;font-size:13px"><strong>Tipos:</strong> ${it.tipos.join(", ")}</div>
        <div style="margin-top:6px"><button data-id="${it.id}" style="padding:8px 10px;border-radius:8px;border:none;background:var(--accent);color:white;cursor:pointer">Ver no mapa</button></div>
      `;
      listPanel.appendChild(div);
    });

    listPanel.querySelectorAll("button[data-id]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = Number(btn.getAttribute("data-id"));
        const p = points.find(x => x.id === id);
        if (p) {
          map.setView([p.lat, p.lng], 15);
          const found = allMarkers.find(m => m.data.id === id);
          if (found) found.marker.openPopup();
        }
      });
    });
  }

  function applyFilters() {
    markersLayer.clearLayers();
    circleLayer.clearLayers();

    if (currentSearchLocation) {
      L.marker([currentSearchLocation.lat, currentSearchLocation.lng]).addTo(circleLayer).bindPopup(`<strong>${currentSearchLocation.display_name}</strong>`);
      L.circle([currentSearchLocation.lat, currentSearchLocation.lng], { radius: currentRadiusKm * 1000, color: "#3fa64b", weight: 2, fill: false }).addTo(circleLayer);
    }

    const selTypes = Array.from(selectedTypes);
    const useTypesFilter = selTypes.length > 0;

    const visible = allMarkers.filter(o => {
      if (useTypesFilter) {
        const intersects = o.data.tipos.some(t => selTypes.includes(t));
        if (!intersects) return false;
      }
      if (currentSearchLocation) {
        const d = haversineDistanceKm(currentSearchLocation.lat, currentSearchLocation.lng, o.data.lat, o.data.lng);
        if (d > currentRadiusKm) return false;
      }
      return true;
    });

    visible.forEach(o => markersLayer.addLayer(o.marker));
    updateCount(visible.length);
    renderList(visible.map(v => v.data));
  }

  applyFilters();

  document.getElementById("applyFilters").addEventListener("click", () => {
    applyFilters();
    const layerCount = markersLayer.getLayers().length;
    if (layerCount > 0) {
      const group = L.featureGroup(markersLayer.getLayers());
      map.fitBounds(group.getBounds().pad(0.3));
    } else {
      if (currentSearchLocation) map.setView([currentSearchLocation.lat, currentSearchLocation.lng], 13);
    }
    setTimeout(() => map.invalidateSize(), 200);
  });

  document.getElementById("clearFilters").addEventListener("click", () => {
    currentSearchLocation = null;
    addressInput.value = "";
    radiusRange.value = 10;
    currentRadiusKm = 10;
    radiusLabel.textContent = "10 km";
    circleLayer.clearLayers();
    selectedTypes.clear();
    wasteTypes.forEach((t, idx) => {
      const chk = document.getElementById("chk_" + t.replace(/\s+/g, ""));
      if (chk) {
        chk.checked = idx < 2;
        if (chk.checked) selectedTypes.add(t);
      }
    });
    showAllMarkers();
    updateCount(allMarkers.length);
    renderList(allMarkers.map(m => m.data));
    map.setView([-23.5509, -46.6333], 13);
    setTimeout(() => map.invalidateSize(), 200);
  });

  const btnMap = document.getElementById("btnMap");
  const btnList = document.getElementById("btnList");
  const listView = document.getElementById("listView");
  const mapbox = document.getElementById("mapbox");

  btnMap.addEventListener("click", () => {
    btnMap.classList.add("active");
    btnList.classList.remove("active");
    mapbox.style.display = "block";
    listView.style.display = "none";
    setTimeout(() => map.invalidateSize(), 200);
  });
  btnList.addEventListener("click", () => {
    btnList.classList.add("active");
    btnMap.classList.remove("active");
    mapbox.style.display = "none";
    listView.style.display = "block";
  });

  renderList(allMarkers.map(m => m.data));
  updateCount(allMarkers.length);
  setTimeout(() => map.invalidateSize(), 800);

  console.log("UI inicializada com sucesso.");
});
