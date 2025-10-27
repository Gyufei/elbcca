import useSWRMutation from "swr/mutation";
import fetcher from "../fetcher";
import useIndexStore from "../state";
import useEffectStore from "../state/use-store";
import { mutate } from "swr";

export function useCreateNote() {
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
        content: string;
        img_list: string[];
        chain_id: number;
        wallet: string;
      };
    },
  ) => {
    const noteData = {
      content: arg.content,
      img_list: arg.img_list,
      chain_id: arg.chain_id,
      wallet: arg.wallet,
      user_name: activeUser?.email,
    };

    const res = await fetcher(url, {
      method: "POST",
      body: JSON.stringify(noteData),
    });

    const walletNoteKey = `${userPathMap.getWalletNote}?wallet=${arg.wallet}&user_name=${activeUser?.email}`;
    mutate(walletNoteKey);

    return res;
  };

  const createNoteMutation = useSWRMutation(userPathMap.createNote, createNote);

  return {
    ...createNoteMutation,
  };
}
