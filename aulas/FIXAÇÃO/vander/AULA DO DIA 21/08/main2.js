// 
fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
.then(response =>{
    return response.json()
})
.then(data =>{
    console.log(data.forms)
})