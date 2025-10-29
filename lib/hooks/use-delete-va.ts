import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import fetcher from "../fetcher";
import { SystemEndPointPathMap } from "../end-point";

interface DeleteVaArg {
  chain_id: number;
  user_name: string;
  va_name: string;
}

export function useDeleteVa() {
  const deleteVa = async (
    url: string,
    { arg }: { arg: DeleteVaArg },
  ) => {
    const res = await fetcher(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arg),
    });

    const vaListKey = `${SystemEndPointPathMap.vaQuery}?chain_id=${arg.chain_id}&user_name=${arg.user_name}`;
    mutate(vaListKey);

    return res;
  };

  const deleteVaMutation = useSWRMutation(SystemEndPointPathMap.vaRemove, deleteVa);

  return {
    ...deleteVaMutation,
  };
}


