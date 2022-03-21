export const generateId = () => Math.random().toString(36).substring(2, 9);

export const fetchAPI = async ({
    url,
    method = 'GET',
    headers = {
        'Content-Type': 'application/json'
    },
    body
}) => fetch(url, {
    method,
    headers,
    body
})
    .then(data => data.json())
    .catch(err => console.error(err));
