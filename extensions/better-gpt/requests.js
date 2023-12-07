class API{
    static GET(url, headers = {}) {
        return new Promise((resolve, reject) => {
            fetch(url,{
                headers: {
                    'content-type': 'application/json',
                    ...headers
                }
            })
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