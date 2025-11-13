"use client";

import { useState } from "react";
import { Certificate } from "./types";

interface CertificateListProps {
  certificates: Certificate[];
  onLinkAccounts?: (certificateId: string) => void;
  onRefresh?: () => void;
  onDelete?: (certificateId: string) => void;
}

const certificateTypeLabels: Record<Certificate["type"], string> = {
  individual: "개인",
  corporate: "법인",
};

export function CertificateList({
  certificates,
  onLinkAccounts,
  onRefresh,
  onDelete,
}: CertificateListProps) {
  const [expandedCertId, setExpandedCertId] = useState<string | null>(null);

  const toggleCertDetails = (certId: string) => {
    setExpandedCertId((prev) => (prev === certId ? null : certId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const isExpiringSoon = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const today = new Date();
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const today = new Date();
    return expiryDate < today;
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-lg font-semibold">공동인증서 목록</h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            새로고침
          </button>
        )}
      </div>

      <div className="divide-y divide-border">
        {certificates.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            등록된 인증서가 없습니다.
          </div>
        ) : (
          certificates.map((cert) => (
            <div key={cert.id} className="p-4">
              <div
                className="flex cursor-pointer items-center justify-between"
                onClick={() => toggleCertDetails(cert.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{cert.name}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {certificateTypeLabels[cert.type]}
                    </span>
                    {isExpired(cert.expiresAt) && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                        만료됨
                      </span>
                    )}
                    {!isExpired(cert.expiresAt) && isExpiringSoon(cert.expiresAt) && (
                      <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600">
                        만료 임박
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {cert.issuer}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    만료일: {formatDate(cert.expiresAt)}
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${
                    expandedCertId === cert.id ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {expandedCertId === cert.id && (
                <div className="mt-4 space-y-4 rounded-lg bg-muted/50 p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">인증서 이름</span>
                      <span className="font-medium">{cert.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">발급자</span>
                      <span className="font-medium">{cert.issuer}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">등록일</span>
                      <span className="font-medium">
                        {formatDate(cert.registeredAt)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">만료일</span>
                      <span className="font-medium">
                        {formatDate(cert.expiresAt)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="mb-2 text-sm font-medium">
                      연동된 계좌 ({cert.linkedAccounts?.length || 0})
                    </div>
                    {cert.linkedAccounts && cert.linkedAccounts.length > 0 ? (
                      <div className="space-y-2">
                        {cert.linkedAccounts.map((account) => (
                          <div
                            key={account.id}
                            className="rounded-lg border border-border bg-background p-3"
                          >
                            <div className="font-medium">{account.bankName}</div>
                            <div className="text-sm text-muted-foreground">
                              {account.accountNumber}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {account.accountHolder}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed p-3 text-center text-sm text-muted-foreground">
                        연동된 계좌가 없습니다.
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 border-t border-border pt-4">
                    {onLinkAccounts && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLinkAccounts(cert.id);
                        }}
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        계좌 연동
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm(
                              "이 인증서를 삭제하시겠습니까? 연동된 계좌도 함께 해제됩니다."
                            )
                          ) {
                            onDelete(cert.id);
                          }
                        }}
                        className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/20"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
