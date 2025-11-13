"use client";

import { useState } from "react";
import { CertificateUploadData } from "./types";

interface CertificateUploadProps {
  clientId?: string;
  onUpload: (data: CertificateUploadData) => Promise<string>;
  onUploadSuccess?: (certificateId: string) => void;
}

export function CertificateUpload({ clientId, onUpload, onUploadSuccess }: CertificateUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId) {
      setError("고객사를 먼저 선택해주세요.");
      return;
    }

    if (!file) {
      setError("인증서 파일을 선택해주세요.");
      return;
    }

    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newCertId = await onUpload({ file, password, clientId });
      // 성공 시 폼 초기화
      setFile(null);
      setPassword("");
      const fileInput = document.getElementById("certificate-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // 계좌 선택 모달 열기
      if (onUploadSuccess) {
        onUploadSuccess(newCertId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "인증서 등록 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">공동인증서 등록</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="certificate-file" className="mb-2 block text-sm font-medium">
            인증서 파일 (.pfx, .p12)
          </label>
          <input
            id="certificate-file"
            type="file"
            accept=".pfx,.p12"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-1.5 file:text-sm file:text-primary-foreground hover:file:bg-primary/90"
            disabled={isLoading}
          />
          {file && (
            <p className="mt-2 text-sm text-muted-foreground">
              선택된 파일: {file.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="certificate-password" className="mb-2 block text-sm font-medium">
            인증서 비밀번호
          </label>
          <input
            id="certificate-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="인증서 비밀번호를 입력하세요"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !file || !password}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "등록 중..." : "인증서 등록"}
        </button>
      </form>
    </div>
  );
}
