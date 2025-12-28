// Cấu hình axios instance và interceptors tại đây

const DOMAIN = "YOUR_API_BASE_URL_HERE";
const TOKEN_CYBERSOFT = "YOUR_CYBERSOFT_TOKEN_HERE"; // Nếu backend yêu cầu

export class BaseService {
  // Phương thức PUT
  put = (url, model) => {
    return axios({
      url: `${DOMAIN}${url}`,
      method: "PUT",
      data: model,
      headers: {
        TokenCybersoft: TOKEN_CYBERSOFT,
        // Nếu có đăng nhập và cần Bearer Token thì uncomment dòng dưới:
        // "Authorization": "Bearer " + localStorage.getItem("accessToken")
      },
    });
  };

  // Phương thức POST
  post = (url, model) => {
    return axios({
      url: `${DOMAIN}${url}`,
      method: "POST",
      data: model,
      headers: {
        TokenCybersoft: TOKEN_CYBERSOFT,
        // "Authorization": "Bearer " + localStorage.getItem("accessToken")
      },
    });
  };

  // Phương thức GET
  get = (url) => {
    return axios({
      url: `${DOMAIN}${url}`,
      method: "GET",
      headers: {
        TokenCybersoft: TOKEN_CYBERSOFT,
        // "Authorization": "Bearer " + localStorage.getItem("accessToken")
      },
    });
  };

  // Phương thức DELETE
  delete = (url) => {
    return axios({
      url: `${DOMAIN}${url}`,
      method: "DELETE",
      headers: {
        TokenCybersoft: TOKEN_CYBERSOFT,
        // "Authorization": "Bearer " + localStorage.getItem("accessToken")
      },
    });
  };
}
