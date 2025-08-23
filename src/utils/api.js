const API_URL = "http://localhost:8080/LumayJava/api/";

export const get = async (endpoint) => {
  let res = await fetch(API_URL + endpoint, {
    headers: { "Authorization": `Bearer ${localStorage.getItem("accessToken")}` }
  });

  if (res.status === 401) {
    await refreshAccessToken();
    res = await fetch(API_URL + endpoint, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("accessToken")}` }
    });
  }

  return await res.json();
};

export const post = async (endpoint, info) => {
  const token = localStorage.getItem("accessToken");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  return fetch(API_URL + endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(info)
  });
};

export const postFormData = async (endpoint, formData) => {
  let res = await fetch(API_URL + endpoint, {
    method: "POST",
    body: formData,
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    }
  });

  if (res.status === 401) {
    await refreshAccessToken();
    res = await fetch(API_URL + endpoint, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
  }

  return res;
};

export const put = async (endpoint, info) => {
  let res = await fetch(API_URL + endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(info)
  });

  if (res.status === 401) {
    await refreshAccessToken();
    res = await fetch(API_URL + endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify(info)
    });
  }

  return res;
};

export const del = async (endpoint) => {
  let res = await fetch(API_URL + endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    }
  });

  if (res.status === 401) {
    await refreshAccessToken();
    res = await fetch(API_URL + endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
  }

  return res;
};

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return;

  const res = await fetch(API_URL + "usuarios/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
  } else {
    localStorage.clear();
    window.location.hash = "login";
  }
}
