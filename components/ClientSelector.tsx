"use client";

import { useState, useRef, useEffect } from "react";
import { Client } from "./types";

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId?: string;
  onClientSelect: (clientId: string) => void;
}

export function ClientSelector({
  clients,
  selectedClientId,
  onClientSelect,
}: ClientSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (clientId: string) => {
    onClientSelect(clientId);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="relative" ref={dropdownRef}>
        {/* 선택 카드 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full rounded-lg border border-border bg-background p-4 text-left transition-all hover:border-primary/50 hover:bg-muted/50"
        >
          {selectedClient ? (
            <div>
              <div className="font-medium">{selectedClient.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {selectedClient.businessNumber}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">고객사를 선택하세요</div>
          )}
        </button>

        {/* 드롭다운 리스트 */}
        {isOpen && (
          <div className="absolute z-10 mt-2 w-full rounded-lg border border-border bg-background shadow-lg">
            <div className="max-h-60 overflow-y-auto p-2">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleSelect(client.id)}
                  className={`w-full rounded-md p-3 text-left transition-colors ${
                    selectedClientId === client.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="font-medium">{client.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {client.businessNumber}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
