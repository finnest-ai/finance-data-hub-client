"use client";

import { useState } from "react";
import { Account } from "./types";

interface AccountListProps {
  accounts: Account[];
  onRefresh?: () => void;
}

const accountTypeLabels: Record<Account["accountType"], string> = {
  deposit: "예금",
  savings: "적금",
  checking: "당좌",
};

export function AccountList({ accounts, onRefresh }: AccountListProps) {
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);

  const toggleAccountDetails = (accountId: string) => {
    setExpandedAccountId((prev) => (prev === accountId ? null : accountId));
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-lg font-semibold">계좌 목록</h3>
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
        {accounts.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            등록된 계좌가 없습니다.
          </div>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="p-4">
              <div
                className="flex cursor-pointer items-center justify-between"
                onClick={() => toggleAccountDetails(account.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{account.bankName}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {accountTypeLabels[account.accountType]}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {account.accountNumber}
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
                    expandedAccountId === account.id ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {expandedAccountId === account.id && (
                <div className="mt-4 space-y-2 rounded-lg bg-muted/50 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">예금주</span>
                    <span className="font-medium">{account.accountHolder}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">은행코드</span>
                    <span className="font-medium">{account.bankCode}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">계좌번호</span>
                    <span className="font-medium">{account.accountNumber}</span>
                  </div>
                  {account.balance !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">잔액</span>
                      <span className="font-medium">
                        {account.balance.toLocaleString()}원
                      </span>
                    </div>
                  )}
                  {account.certificateId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">연동 인증서</span>
                      <span className="font-medium">연동됨</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
