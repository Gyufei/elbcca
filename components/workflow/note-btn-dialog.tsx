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

// 模拟数据
const mockNotes: Note[] = [
  {
    id: "1",
    nickname: "NickName",
    timestamp: new Date("2025-09-20T14:45:00"),
    content: "Remarks Text Remarks Text Remarks Text Remarks Text Remarks Text",
    network: "Ethereum",
    networkType: NetworkChainType.ETH,
  },
  {
    id: "2",
    nickname: "NickName",
    timestamp: new Date(),
    content: "Remarks Text Remarks Text Remarks Text Remarks Text Remarks Text",
    images: [
      "/placeholder-avatar.png",
      "/placeholder-avatar.png",
      "/placeholder-avatar.png",
      "/placeholder-avatar.png",
    ],
    networkType: NetworkChainType.SOLANA,
  },
];

export function NoteBtnDialog({ walletAddr }: { walletAddr: string }) {
  const T = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const notes = mockNotes;

  const handleAddNote = (newNote: Omit<Note, "id" | "timestamp">) => {
    const note: Note = {
      ...newNote,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    console.log(note);
  };

  const updateNotes = (updatedNotes: Note[]) => {
    console.log(updatedNotes);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger className="outline-none">
        <div className="flex items-center">
          {notes.length > 0 ? (
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
        title={`Note on: ${displayText(walletAddr, 6, 6)}`}
        className="w-[440px] gap-0 !pb-0"
        showClose={T("Close")}
      >
        <div className="flex flex-col">
          {notes.length > 0 && (
            <NoteList notes={notes} updateNotes={updateNotes} />
          )}
          <NoteAdd dialogOpen={open} onAddNote={handleAddNote} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
