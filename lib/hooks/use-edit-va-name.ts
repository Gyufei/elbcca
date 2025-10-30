import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import fetcher from "../fetcher";
import { SystemEndPointPathMap } from "../end-point";

interface CreateVaArg {
  chain_id: number;
  user_name: string;
  va_name: string;
  new_va_name: string;
}

export function useUpdateVaName() {
  const createVa = async (url: string, { arg }: { arg: CreateVaArg }) => {
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

  const createVaMutation = useSWRMutation(
    SystemEndPointPathMap.vaUpdateName,
    createVa,
  );

  return {
    ...createVaMutation,
  };
}
