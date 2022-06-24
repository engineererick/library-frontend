import axios from "axios";
import { SERVER_URL } from "../config";

const axiosInstance = async () => {
    const instance = axios.create({
      baseURL: SERVER_URL,
    });
    return instance;
};
  
const parseResponse = (response) => {
    try {
      const data = JSON.parse(response);
      if (data?.errors) {
        return {
          remote: "failure",
          error: {
            errors: data.errors,
          },
        };
      }
      return {
        remote: "success",
        data: data,
      };
    } catch (error) {
      return {
        remote: "failure",
        error: {
          errors: response,
        },
      };
    }
};
  
const request = async (config) => {
    try {
      const token = localStorage.getItem("token");
      const instance = await axiosInstance();
      if (!config.headers) {
        config.headers = {};
      }
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }
      config.headers["session-token"] = token;
      const response = await instance.request({
        ...config,
        transformResponse: (res) => {
          const resp = parseResponse(res);
          return resp.remote === "success" ? resp.data : resp;
        },
      });
      return {
        remote: "success",
        data: response.data,
      };
    } catch (error) {
      if (error) {
        if (error?.response) {
          const axiosError = error;
          if (axiosError?.response?.data) {
            let errorMessage = axiosError?.response?.data?.errors;
            if (axiosError?.response?.status === 500) {
              errorMessage =
                axiosError?.response?.data?.error || "Internal Server Error";
            } else if (axiosError?.response?.status === 401) {
              errorMessage = "Forbidden";
              localStorage.clear();
              window.location.reload();
            } else {
              errorMessage =
                error?.response?.data?.error?.errors ||
                axiosError?.response?.data;
            }
            return {
              remote: "failure",
              errors: {
                status: axiosError?.response?.status,
                errors: errorMessage,
              },
            };
          }
        }
      } else {
        const axiosError = error;
        let errorMessage = axiosError.message;
        if (errorMessage === "Network Error") {
          errorMessage = "No internet connection";
        }
        return {
          remote: "failure",
          errors: {
            errors: errorMessage,
          },
        };
      }
      return error;
    }
};

const requestByToken = async (config) => {
  try {
    const token = config.token || localStorage.getItem("session-token");
    const instance = await axiosInstance();
    if (!config.headers) {
      config.headers = {};
    }
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    config.headers["session-token"] = token;
    const response = await instance.request({
      ...config,
      transformResponse: (res) => {
        const resp = parseResponse(res);
        return resp.remote === "success" ? resp.data : resp;
      },
    });
    return {
      remote: "success",
      data: response.data,
    };
  } catch (error) {
    if (error) {
      if (error?.response) {
        const axiosError = error;
        if (axiosError?.response?.data) {
          let errorMessage = axiosError?.response?.data?.errors;
          if (axiosError?.response?.status === 500) {
            errorMessage = "Internal Server Error";
          } else if (axiosError?.response?.status === 401) {
            errorMessage = "Forbidden";
          } else {
            errorMessage =
              error?.response?.data?.error?.errors ||
              axiosError?.response?.data;
          }
          return {
            remote: "failure",
            errors: {
              status: axiosError?.response?.status,
              errors: errorMessage,
            },
          };
        }
      }
    } else {
      const axiosError = error;
      let errorMessage = axiosError.message;
      if (errorMessage === "Network Error") {
        errorMessage = "No internet connection";
      }
      return {
        remote: "failure",
        errors: {
          errors: errorMessage,
        },
      };
    }
    throw error;
  }
};

const toExport = {
  request,
  requestByToken,
  parseResponse,
};

export default toExport;