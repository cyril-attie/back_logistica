

const baseUrl = 'http://113.30.148.96/api'

async function fetchAsync () {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  }