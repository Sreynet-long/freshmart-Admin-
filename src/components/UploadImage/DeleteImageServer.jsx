import { useMutation } from "@apollo/client/react";

import { deleteFileAPI } from "../../api/axios";

export function useDeleteImageServer() {
  return useMutation(deleteFileAPI, {
    onSuccess: (data, variables, context) => {
      if (data?.data?.status) {
        console.log("sucess::", data?.data?.message);
      } else {
        console.log("error::", data?.data?.message);
      }
    },
    onError: (error, variables, context) => {
      console.log(error);
    },
  });
}
