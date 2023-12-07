class API{
    static GET(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
            .then(response => {
                // Asegúrate de que la respuesta es exitosa
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                resolve(response.json()); // Convierte la respuesta en JSON
            })
            .catch(error => {
                console.error('Error:', error);
            });

        })
    }
}

export default API;