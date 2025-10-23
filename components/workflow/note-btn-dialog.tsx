import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import { displayText } from "../shared/trunc-text";
import NoteList from "./note-list";
import NoteAdd from "./note-add";
import { NetworkChainType } from "@/lib/types/network";

// Note类型定义
interface Note {
  id: string;
  nickname: string;
  timestamp: Date;
  content: string;
  images?: string[];
  network?: string;
  networkType?: NetworkChainType;
}

export function NoteBtnDialog({ walletAddr }: { walletAddr: string }) {
  const T = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  const handleAddNote = (newNote: Omit<Note, "id" | "timestamp">) => {
    const note: Note = {
      ...newNote,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setNotes((prev) => [...prev, note]);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger>
        <div className="flex items-center">
          <Image
            src="/icons/note.svg"
            className="cursor-pointer"
            alt="note"
            width={16}
            height={16}
          />
        </div>
      </DialogTrigger>
      <DialogContent
        title={`Note on: ${displayText(walletAddr, 6, 6)}`}
        className="w-[440px] gap-0 !pb-0"
        showClose={T("Close")}
      >
        <div className="flex flex-col">
          {notes.length > 0 && <NoteList notes={notes} setNotes={setNotes} />}
          <NoteAdd dialogOpen={open} onAddNote={handleAddNote} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
