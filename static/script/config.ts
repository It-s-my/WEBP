const xhr: XMLHttpRequest = new XMLHttpRequest();

xhr.open('GET', '../../server/config/config.json', true);
xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const config = JSON.parse(xhr.responseText);
        const port: number = config.port;
        const root: string = config.path;
        const path: string = `http://localhost:${port}/${root}`;
    }
};
xhr.send();
