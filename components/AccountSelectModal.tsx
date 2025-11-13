"use client";

import { useState, useEffect } from "react";
import { Account } from "./types";

interface AccountSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onAccountSelect: (accountIds: string[]) => void;
  certificateId?: string;
}

export function AccountSelectModal({
  isOpen,
  onClose,
  accounts,
  onAccountSelect,
  certificateId,
}: AccountSelectModalProps) {
  // 인증서에 연결 가능한 계좌만 필터링 (이미 다른 인증서에 연결된 계좌 제외)
  const availableAccounts = accounts.filter(
    (account) => !account.certificateId || account.certificateId === certificateId
  );

  // 초기 상태: 모든 가능한 계좌를 선택된 상태로 설정
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // 모달이 열릴 때마다 모든 가능한 계좌를 선택된 상태로 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedAccountIds(availableAccounts.map((acc) => acc.id));
    }
  }, [isOpen, availableAccounts.length]);

  if (!isOpen) return null;

  const handleToggleAccount = (accountId: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleConfirm = () => {
    onAccountSelect(selectedAccountIds);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">계좌 선택</h3>
          <button
            onClick={handleCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mb-4 max-h-96 space-y-2 overflow-y-auto">
          {availableAccounts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              연결 가능한 계좌가 없습니다.
            </div>
          ) : (
            availableAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-muted/50"
              >
                <input
                  type="checkbox"
                  id={`account-${account.id}`}
                  checked={selectedAccountIds.includes(account.id)}
                  onChange={() => handleToggleAccount(account.id)}
                  className="h-4 w-4 rounded border-border"
                />
                <label
                  htmlFor={`account-${account.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium">{account.bankName}</div>
                  <div className="text-sm text-muted-foreground">
                    {account.accountNumber} ({account.accountHolder})
                  </div>
                  {account.balance !== undefined && (
                    <div className="text-sm text-muted-foreground">
                      잔액: {account.balance.toLocaleString()}원
                    </div>
                  )}
                </label>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedAccountIds.length === 0}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            선택 ({selectedAccountIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}
