

export const get = async (endpoint) => {
    const data = await fetch(`http://localhost:8080/LumayJava/api/` + endpoint);
    return await data.json();
  }
  
  export const post = async (enpoint, info) => {
    return await fetch(`http://localhost:8080/LumayJava/api/` + enpoint, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(info)
    })
  }
  
  export const postFormData = async (endpoint, formData) => {
    return await fetch(`http://localhost:8080/LumayJava/api/` + endpoint, {
      method: 'POST',
      body: formData // No pongas headers, el navegador lo hace solo
    });
  };
  
  export const put = async (enpoint, info) => {
    return await fetch(`http://localhost:8080/LumayJava/api/` + enpoint, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(info)
    })
  }
  
  export const del = async (endpoint) => {
    return await fetch(`http://localhost:8080/LumayJava/api/` + endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  