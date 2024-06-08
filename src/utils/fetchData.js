import Swal from "sweetalert2";
import { apiRequest } from "@/services/fetchService";

export const fetchData = async ({ endpoint, token, showAlert = true }) => {
  try {
    const response = await apiRequest({
      endpoint: endpoint,
      method: "GET",
      token: token,
    });

    if (response.status !== 200) {
      if (showAlert) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: response.error,
          showConfirmButton: false,
          timer: 3000,
        });
      }
      return null;
    } else {
      if (showAlert) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      return response.data;
    }
  } catch (error) {
    if (showAlert) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 3000,
      });
    }
    return null;
  }
};
