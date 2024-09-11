import Swal from "sweetalert2";
import { apiRequest } from "@/services/fetchService";

export type HandleDeleteParams = {
  endpoint: string
  token: string
  elementId: number
  callback: () => void
}

export const handleDelete = async ({
  endpoint,
  token,
  elementId,
  callback,
}: HandleDeleteParams) => {
  const result = await Swal.fire({
    title: "¿Estás Seguro?",
    text: "¡Esto no se puede revertir!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "¡Sí, Eliminar!",
    cancelButtonText: "¡Cancelar!",
  })
  if (result.isConfirmed) {
    try {
      const response = await apiRequest({
        endpoint,
        method: "DELETE",
        token,
        elementId,
      });        
      if (response.status !== 200) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: response.error || "Error al eliminar el elemento",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.message,
          showConfirmButton: false,
          timer: 1500,
        });
        callback?.()
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: error || "Error al eliminar el elemento",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }
};
