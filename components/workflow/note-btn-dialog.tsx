import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import { displayText } from "../shared/trunc-text";
import NoteList from "./note-list";
import NoteAdd from "./note-add";
import { useGetWalletNote } from "@/lib/hooks/use-get-wallet-note";
import { useCreateNote } from "@/lib/hooks/use-create-note";
import { useUpdateNote } from "@/lib/hooks/use-update-note";
import { toast } from "../ui/use-toast";
import { useDeleteNote } from "@/lib/hooks/use-delete-note";

export function NoteBtnDialog({ wallet }: { wallet: string }) {
  const T = useTranslations("Common");
  const [open, setOpen] = useState(false);

  const { data: notes } = useGetWalletNote({
    wallet: wallet,
  });
  const { trigger: createNote } = useCreateNote();
  const { trigger: updateNote } = useUpdateNote();
  const { trigger: deleteNote } = useDeleteNote();

  const handleAddNote = (newNote: {
    content: string;
    img_list: string[];
    chain_id: number;
  }) => {
    createNote({
      ...newNote,
      wallet: wallet,
    });
  };

  const handleUpdateNote = (updatedNote: {
    id: number;
    content: string;
    img_list: string[];
    chain_id: number;
  }) => {
    updateNote({
      ...updatedNote,
      wallet: wallet,
    });
  };

  const handleDeleteNote = (arg: { id: number; wallet?: string }) => {
    deleteNote(
      { id: arg.id, wallet },
      {
        onSuccess: () => {
          toast({
            title: T("NoteDeleted"),
          });
        },
        onError: () => {
          toast({
            title: T("NoteDeleteFailed"),
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger className="outline-none">
        <div className="flex items-center">
          {notes?.length > 0 ? (
            <Image
              src="/icons/note.svg"
              className="cursor-pointer"
              alt="note"
              width={16}
              height={16}
            />
          ) : (
            <Image
              src="/icons/note-opacity-0.4.svg"
              className="cursor-pointer"
              alt="note"
              width={16}
              height={16}
            />
          )}
        </div>
      </DialogTrigger>
      <DialogContent
        title={`Note on: ${displayText(wallet, 6, 6)}`}
        className="w-[440px] gap-0 !pb-0"
        showClose={T("Close")}
      >
        <div className="flex flex-col">
          {notes?.length > 0 && (
            <NoteList
              notes={notes || []}
              updateNotes={handleUpdateNote}
              deleteNote={handleDeleteNote}
            />
          )}
          <NoteAdd dialogOpen={open} onAddNote={handleAddNote} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
