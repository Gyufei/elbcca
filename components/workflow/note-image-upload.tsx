"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

interface NoteImageUploadProps {
  onImageUpload?: (imageUrl: string) => void;
  className?: string;
}

export function NoteImageUpload({
  onImageUpload,
  className,
}: NoteImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const T = useTranslations("Common");

  // 支持的图片格式
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  // 验证文件类型
  const validateFile = (file: File): boolean => {
    return allowedImageTypes.includes(file.type);
  };

  // 模拟图片上传到图床
  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        // 模拟上传进度
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // 这里应该替换为实际的图床API调用
            // 目前使用base64作为示例
            const base64 = reader.result as string;
            setTimeout(() => {
              resolve(base64);
            }, 500);
          }
          setUploadProgress(progress);
        }, 100);
      };

      reader.onerror = () => {
        reject(new Error("Image read failed"));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!validateFile(file)) {
      toast({
        variant: "destructive",
        title: T("ImageFormatError"),
        description: T("ImageFormatErrorDesc"),
      });
      return;
    }

    // 验证文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: T("ImageTooLarge"),
        description: T("ImageTooLargeDesc"),
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const imageUrl = await uploadImage(file);

      // 调用回调函数，传递图片URL
      onImageUpload?.(imageUrl);

      // 上传成功提示
      toast({
        title: T("ImageUploadSuccess"),
        description: T("ImageUploadSuccessDesc"),
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      toast({
        variant: "destructive",
        title: T("ImageUploadFailed"),
        description: T("ImageUploadFailedDesc"),
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // 清空input的值，允许重复选择同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        title={T("UploadImage")}
        onClick={handleButtonClick}
        disabled={isUploading}
        className={cn(
          "flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border transition-all duration-200",
          "hover:bg-custom-bg-white disabled:cursor-not-allowed disabled:opacity-50",
          isUploading && "border-blue-500",
        )}
      >
        {isUploading ? (
          <div className="relative h-6 w-6">
            {/* 圆形进度条 */}
            <svg className="h-6 w-6 -rotate-90 transform" viewBox="0 0 24 24">
              {/* 背景圆环 */}
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-300"
              />
              {/* 进度圆环 */}
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 10}`}
                strokeDashoffset={`${
                  2 * Math.PI * 10 * (1 - uploadProgress / 100)
                }`}
                className="text-blue-500 transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>
            {/* 进度百分比 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-blue-500">
                {Math.round(uploadProgress)}%
              </span>
            </div>
          </div>
        ) : (
          <Image
            src="/icons/pic.svg"
            width={16}
            height={16}
            alt={T("UploadImage")}
          />
        )}
      </button>
    </div>
  );
}
