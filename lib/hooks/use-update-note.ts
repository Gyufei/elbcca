import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import fetcher from "../fetcher";
import useIndexStore from "../state";
import useEffectStore from "../state/use-store";

export function useUpdateNote() {
  const userPathMap = useIndexStore((state) => state.userPathMap());

  const activeUser = useEffectStore(useIndexStore, (state) =>
    state.activeUser(),
  );

  const createNote = async (
    url: string,
    {
      arg,
    }: {
      arg: {
        id: number;
        content: string;
        img_list: string[];
        wallet: string;
        chain_id: number;
      };
    },
  ) => {
    const noteData = {
      id: arg.id,
      content: arg.content,
      img_list: arg.img_list,
      user_name: activeUser?.email,
      chain_id: arg.chain_id,
    };

    const res = await fetcher(url, {
      method: "POST",
      body: JSON.stringify(noteData),
    });

    const walletNoteKey = `${userPathMap.getWalletNote}?wallet=${arg.wallet}&user_name=${activeUser?.email}`;
    mutate(walletNoteKey);

    return res;
  };

  const createNoteMutation = useSWRMutation(userPathMap.updateNote, createNote);

  return {
    ...createNoteMutation,
  };
}
