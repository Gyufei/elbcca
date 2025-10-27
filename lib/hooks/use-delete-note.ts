import useSWRMutation from "swr/mutation";
import fetcher from "../fetcher";
import useIndexStore from "../state";
import useEffectStore from "../state/use-store";
import { mutate } from "swr";

export function useDeleteNote() {
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const activeUser = useEffectStore(useIndexStore, (state) =>
    state.activeUser(),
  );

  const deleteNote = async (
    url: string,
    { arg }: { arg: { id: number; wallet?: string } },
  ) => {
    const params = {
      id: arg.id,
      user_name: activeUser?.email,
    };

    const res = await fetcher(url, {
      method: "POST",
      body: JSON.stringify(params),
    });

    const walletNoteKey = `${userPathMap.getWalletNote}?wallet=${arg.wallet}&user_name=${activeUser?.email}`;
    mutate(walletNoteKey);

    return res;
  };

  const deleteNoteMutation = useSWRMutation(userPathMap.deleteNote, deleteNote);

  return {
    ...deleteNoteMutation,
  };
}
