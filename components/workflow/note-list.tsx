import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { networkConfigs } from "@/lib/constants/network-config";
import { NetworkChainType } from "@/lib/types/network";
import { cn } from "@/lib/utils";

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

interface NoteListProps {
  notes: Note[];
  updateNotes: (updatedNotes: Note[]) => void;
}

export default function NoteList({ notes, updateNotes }: NoteListProps) {
  const T = useTranslations("Common");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 格式化时间显示
  const formatTimestamp = (timestamp: Date) => {
    return format(timestamp, "HH:mm a MMM dd, yyyy");
  };

  // 开始编辑
  const handleStartEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingNoteId) {
      const newNotes = notes.map((note) =>
        note.id === editingNoteId ? { ...note, content: editContent } : note,
      );
      updateNotes(newNotes);
      setEditingNoteId(null);
      setEditContent("");
    }
  };

  // 处理回车键保存
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
  };

  // 调整textarea高度
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const lineHeight = 20;
    const minHeight = lineHeight * 2;
    textarea.style.height = `${Math.max(scrollHeight, minHeight)}px`;
  };

  // 当进入编辑模式时，聚焦并调整textarea高度
  useEffect(() => {
    if (editingNoteId && textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight(textareaRef.current);
    }
  }, [editingNoteId]);

  // 获取网络logo
  const getNetworkLogo = (networkType?: NetworkChainType) => {
    if (!networkType) return null;
    return networkConfigs[networkType]?.logo || null;
  };

  // 删除确认
  const handleDelete = (noteId: string) => {
    setDeletingNoteId(noteId);
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (deletingNoteId) {
      const newNotes = notes.filter((note) => note.id !== deletingNoteId);
      updateNotes(newNotes);
      setDeletingNoteId(null);
    }
  };

  // 取消删除
  const handleCancelDelete = () => {
    setDeletingNoteId(null);
  };

  return (
    <div className="flex flex-col gap-0 border-b border-[#d6d6d6] px-5">
      {notes.map((note, index) => (
        /* 笔记内容 */
        <div key={note.id} className="flex items-start gap-3 pt-5">
          {/* 用户头像 */}
          <div className="relative flex-shrink-0">
            <Image
              src="/placeholder-avatar.png"
              alt="avatar"
              width={24}
              height={24}
              className="rounded"
            />
            {/* 网络logo */}
            {note.networkType && getNetworkLogo(note.networkType) && (
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-gray-200 bg-white">
                <Image
                  src={getNetworkLogo(note.networkType)!}
                  alt="network logo"
                  width={12}
                  height={12}
                />
              </div>
            )}
          </div>

          {/* 笔记内容区域 */}
          <div
            className={cn(
              "min-w-0 flex-1 pb-5",
              index !== notes.length - 1 && "border-b border-[#d6d6d6]",
            )}
          >
            {/* 用户信息和时间戳 */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {note.nickname}
                </span>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(note.timestamp)}
                </span>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartEdit(note)}
                  className="rounded p-1 transition-colors hover:bg-gray-100"
                  title="编辑"
                >
                  <Image
                    src="/icons/edit-2.svg"
                    width={16}
                    height={16}
                    alt="编辑"
                  />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="rounded p-1 transition-colors hover:bg-gray-100"
                  title="删除"
                >
                  <Image
                    src="/icons/delete-2.svg"
                    width={16}
                    height={16}
                    alt="删除"
                  />
                </button>
              </div>
            </div>

            {/* 笔记文本内容 */}
            {editingNoteId === note.id ? (
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => {
                  setEditContent(e.target.value);
                  adjustTextareaHeight(e.target);
                }}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveEdit}
                className="w-full resize-none rounded-md border p-2 text-sm leading-relaxed text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ minHeight: "40px" }}
              />
            ) : (
              <div
                className={`cursor-pointer rounded-md text-base leading-relaxed text-[#333] transition-colors hover:bg-[#f6f7f8]`}
                onClick={() => handleStartEdit(note)}
              >
                {note.content}
              </div>
            )}

            {/* 图片展示 */}
            {note.images && note.images.length > 0 && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {note.images.map((image, imgIndex) => (
                  <Image
                    key={imgIndex}
                    src={image}
                    alt={`note image ${imgIndex + 1}`}
                    width={88}
                    height={88}
                    className="rounded border"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* 删除确认对话框 */}
      <Dialog
        open={!!deletingNoteId}
        onOpenChange={(open) => !open && handleCancelDelete()}
      >
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>{T("ConfirmDelete")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">{T("DeleteNoteConfirmMessage")}</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelDelete}>
                {T("Cancel")}
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                {T("Confirm")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
