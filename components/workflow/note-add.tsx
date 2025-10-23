import NetworkOp from "./note-network-select";
import { NoteImageUpload } from "./note-image-upload";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, useContext } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { NetworkChainType } from "@/lib/types/network";
import { NetworkContext } from "@/lib/providers/network-provider";

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

interface NoteAddProps {
  dialogOpen: boolean;
  onAddNote?: (note: Omit<Note, 'id' | 'timestamp'>) => void;
}

export default function NoteAdd({ dialogOpen, onAddNote }: NoteAddProps) {
  const T = useTranslations("Common");
  const { networkList } = useContext(NetworkContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [network, setNetwork] = useState("NotSet");
  const [images, setImages] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = 20; // 假设每行高度为 20px
      const minHeight = lineHeight * 2; // 最小两行高度
      textarea.style.height = `${Math.max(scrollHeight, minHeight)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    adjustTextareaHeight();
  };

  const handleSave = () => {
    if (note.trim() && onAddNote) {
      // 根据网络选择确定网络类型
      let networkType: NetworkChainType | undefined;
      if (network !== "NotSet") {
        // 从networkList中找到对应的网络信息
        const selectedNetwork = networkList.find(n => n.chain_name === network);
        if (selectedNetwork) {
          networkType = selectedNetwork.currency_name as NetworkChainType;
        }
      }

      onAddNote({
        nickname: "NickName", // 这里应该从用户信息获取
        content: note.trim(),
        network: network !== "NotSet" ? network : undefined,
        networkType,
        images: images.length > 0 ? images : undefined,
      });
      
      // 重置表单
      setNote("");
      setImages([]);
      setNetwork("NotSet");
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setImages((prev) => [...prev, imageUrl]);
  };

  // 当对话框打开时，聚焦到 textarea
  useEffect(() => {
    if (dialogOpen && textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight();
    }
  }, [dialogOpen]);

  return (
    <div className="p-5">
      <div className="mt-2 flex items-start justify-between">
        <Image
          src="/placeholder-avatar.png"
          alt="note"
          width={24}
          height={24}
        />
        <div className="flex-1 flex-col gap-y-2 pl-3">
          <textarea
            ref={textareaRef}
            value={note}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="min-h-[40px] flex-1 resize-none leading-5 outline-none"
            placeholder={T("EnterNewNote")}
            style={{ height: "40px" }}
          />
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image) => (
                <Image
                  key={image}
                  src={image}
                  alt="note"
                  width={88}
                  height={88}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-3">
        <NetworkOp value={network} onChange={setNetwork} />
        <NoteImageUpload onImageUpload={handleImageUpload} />
        <button
          title={T("Save")}
          onClick={handleSave}
          className={cn(
            "flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border transition-all duration-200",
            "hover:bg-custom-bg-white disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <Image src="/icons/enter.svg" width={12} height={9} alt={T("Save")} />
        </button>
      </div>
    </div>
  );
}
