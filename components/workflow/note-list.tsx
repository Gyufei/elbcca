import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NetworkOp, { NoteNetLogoConfig } from "./note-network-select";
import { NoteImageUpload } from "./note-image-upload";
import { XCircle } from "lucide-react";
import useIndexStore from "@/lib/state";

// Note类型定义
interface Note {
  id: number;
  content: string;
  img_list: string[];
  account: string;
  chain_id: number;
  create_at: Date;
}

interface NoteListProps {
  notes: Note[];
  updateNotes: (updatedNotes: Note) => void;
  deleteNote: (arg: { id: number; wallet?: string }) => void;
}

export default function NoteList({
  notes,
  updateNotes,
  deleteNote,
}: NoteListProps) {
  const T = useTranslations("Common");

  const curTimezoneStr = useIndexStore((state) => state.curTimezoneStr());
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 格式化时间显示（将 UTC 时间按当前时区转换并格式化）
  const formatNoteDate = (utcInput: Date | string | number) => {
    let dateObj: Date;
    if (typeof utcInput === "string") {
      const s = utcInput.trim();
      // 处理形如 "yyyy-MM-dd HH:mm:ss" 的 UTC 字符串
      const simpleUtc = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      if (simpleUtc.test(s)) {
        dateObj = new Date(`${s.replace(" ", "T")}Z`);
      } else {
        dateObj = new Date(s);
      }
    } else {
      dateObj = new Date(utcInput);
    }
    const zonedDate = utcToZonedTime(dateObj, curTimezoneStr);
    return format(zonedDate, "HH:mm a MMM dd, yyyy");
  };

  // 开始编辑
  const handleStartEdit = (note: Note) => {
    setEditingNote(note);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingNote?.id) {
      const newNotes = {
        ...editingNote,
        img_list: editingNote?.img_list || [],
        chain_id: editingNote?.chain_id || 0,
      };
      updateNotes(newNotes);
      setEditingNote(null);
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
    if (editingNote?.id && textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight(textareaRef.current);
    }
  }, [editingNote?.id]);

  // 获取网络logo
  const getNetworkLogo = (chain_id?: number) => {
    if (!chain_id) return null;
    return (
      NoteNetLogoConfig[chain_id as keyof typeof NoteNetLogoConfig] || null
    );
  };

  const handleDelete = (noteId: number) => {
    setDeletingNoteId(noteId);
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (deletingNoteId) {
      deleteNote({ id: deletingNoteId });
      setDeletingNoteId(null);
    }
  };

  // 取消删除
  const handleCancelDelete = () => {
    setDeletingNoteId(null);
  };
  
  return (
    <div className="flex max-h-[60vh] flex-col gap-0 overflow-y-auto border-b border-[#d6d6d6] px-5">
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
            {note.chain_id !== 0 && getNetworkLogo(note.chain_id) && (
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-gray-200 bg-white">
                <Image
                  src={getNetworkLogo(note.chain_id)!}
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
                  {note.account}
                </span>
                <span className="text-sm text-gray-500">
                  {formatNoteDate(note.create_at)}
                </span>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartEdit(note)}
                  className="rounded p-1 transition-colors hover:bg-gray-100"
                  title="edit"
                >
                  <Image
                    src="/icons/edit-2.svg"
                    width={16}
                    height={16}
                    alt="edit"
                  />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="rounded p-1 transition-colors hover:bg-gray-100"
                  title="delete"
                >
                  <Image
                    src="/icons/delete.svg"
                    width={16}
                    height={16}
                    alt="delete"
                  />
                </button>
              </div>
            </div>

            {/* 笔记文本内容 */}
            {editingNote?.id === note.id ? (
              <>
                <textarea
                  ref={textareaRef}
                  value={editingNote?.content}
                  onChange={(e) => {
                    setEditingNote({
                      ...editingNote,
                      content: e.target.value,
                    });
                    adjustTextareaHeight(e.target);
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full resize-none rounded-md border p-2 text-sm leading-relaxed text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ minHeight: "40px" }}
                />
                {editingNote?.img_list && editingNote?.img_list.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {editingNote?.img_list.map((image, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <button
                          onClick={() =>
                            setEditingNote({
                              ...editingNote,
                              img_list: editingNote?.img_list?.filter(
                                (_, i) => i !== imgIndex,
                              ),
                            })
                          }
                          className="absolute -right-2 -top-2 text-red-400"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                        <Image
                          src={image}
                          alt={`note image ${imgIndex + 1}`}
                          width={88}
                          height={88}
                          className="rounded border"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <NoteImageUpload
                      onImageUpload={(imageUrl) =>
                        setEditingNote({
                          ...editingNote,
                          img_list: [
                            ...(editingNote?.img_list || []),
                            imageUrl,
                          ],
                        })
                      }
                    />
                    <NetworkOp
                      value={editingNote?.chain_id || 0}
                      onChange={(value) =>
                        setEditingNote({
                          ...editingNote,
                          chain_id: value as unknown as number,
                        })
                      }
                    />
                  </div>
                  <button
                    title={T("Save")}
                    onClick={handleSaveEdit}
                    className={cn(
                      "flex h-10 cursor-pointer items-center justify-center rounded-full border border-primary px-6 transition-all duration-200",
                      "bg-primary text-white disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                  >
                    {T("Save")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`cursor-pointer rounded-md text-base leading-relaxed text-[#333] transition-colors hover:bg-[#f6f7f8] break-words`}
                  onClick={() => handleStartEdit(note)}
                >
                  {note.content}
                </div>
                {note.img_list && note.img_list.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {note.img_list.map((image, imgIndex) => (
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
              </>
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
