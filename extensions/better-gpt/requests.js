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
    static PATCH(url, body, headers = {}) {
        return new Promise((resolve, reject) => {
            fetch(url,{
                method: 'PATCH',
                body: JSON.stringify(body),
                headers: {
                    'content-type': 'application/json',
                    ...headers
                }
            }).then(response => {
                // Asegúrate de que la respuesta es exitosa
                if (!response.ok) {
                    console.log(response);
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