"use client";

import { useState } from "react";
import { AuthGuard, DefaultLayout } from "@finnest-ai/ui-framework";
import {
  ClientSelector,
  CertificateUpload,
  AccountSelectModal,
  AccountList,
  CertificateList,
  Client,
  Certificate,
  Account,
  CertificateUploadData,
} from "@/components";

// 샘플 데이터
const sampleClients: Client[] = [
  { id: "1", name: "주식회사 핀네스트", businessNumber: "123-45-67890" },
  { id: "2", name: "테스트 기업", businessNumber: "987-65-43210" },
];

const sampleCertificates: Certificate[] = [
  {
    id: "cert-1",
    name: "주식회사 피네스트",
    issuer: "금융결제원",
    registeredAt: "2024-01-15T00:00:00Z",
    expiresAt: "2025-01-15T00:00:00Z",
    type: "corporate",
    linkedAccounts: [
      {
        id: "acc-1",
        bankName: "KB국민은행",
        bankCode: "004",
        accountNumber: "123-456-789012",
        accountHolder: "주식회사 핀네스트",
        accountType: "deposit",
        balance: 50000000,
        certificateId: "cert-1",
      },
    ],
  },
  {
    id: "cert-2",
    name: "김철수",
    issuer: "코스콤",
    registeredAt: "2024-02-01T00:00:00Z",
    expiresAt: "2024-12-31T00:00:00Z",
    type: "individual",
    linkedAccounts: [],
  },
];

const sampleAccounts: Account[] = [
  {
    id: "acc-1",
    bankName: "KB국민은행",
    bankCode: "004",
    accountNumber: "123-456-789012",
    accountHolder: "주식회사 핀네스트",
    accountType: "deposit",
    balance: 50000000,
    certificateId: "cert-1",
  },
  {
    id: "acc-2",
    bankName: "신한은행",
    bankCode: "088",
    accountNumber: "987-654-321098",
    accountHolder: "주식회사 핀네스트",
    accountType: "checking",
    balance: 25000000,
  },
  {
    id: "acc-3",
    bankName: "우리은행",
    bankCode: "020",
    accountNumber: "555-444-333222",
    accountHolder: "테스트 기업",
    accountType: "savings",
    balance: 10000000,
  },
];

export default function Page() {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [certificates, setCertificates] =
    useState<Certificate[]>(sampleCertificates);
  const [accounts, setAccounts] = useState<Account[]>(sampleAccounts);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [selectedCertIdForLink, setSelectedCertIdForLink] = useState<
    string | null
  >(null);

  // 공동인증서 업로드 핸들러
  const handleCertificateUpload = async (
    data: CertificateUploadData
  ): Promise<string> => {
    console.log("인증서 업로드:", data);
    // TODO: API 호출
    // 샘플: 새 인증서 추가
    const newCertId = `cert-${Date.now()}`;
    const newCert: Certificate = {
      id: newCertId,
      name: data.file?.name || "새 인증서",
      issuer: "금융결제원",
      registeredAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      type: "corporate",
      linkedAccounts: [],
    };
    setCertificates((prev) => [...prev, newCert]);
    return newCertId;
  };

  // 공동인증서 등록 성공 후 계좌 선택 모달 열기
  const handleCertificateUploadSuccess = (certificateId: string) => {
    setSelectedCertIdForLink(certificateId);
    setIsAccountModalOpen(true);
  };

  // 계좌 연동 핸들러
  const handleLinkAccounts = (certificateId: string) => {
    setSelectedCertIdForLink(certificateId);
    setIsAccountModalOpen(true);
  };

  // 계좌 선택 완료 핸들러
  const handleAccountSelect = (accountIds: string[]) => {
    if (!selectedCertIdForLink) return;

    // 계좌에 인증서 ID 할당
    setAccounts((prev) =>
      prev.map((account) =>
        accountIds.includes(account.id)
          ? { ...account, certificateId: selectedCertIdForLink }
          : account
      )
    );

    // 인증서에 연동 계좌 업데이트
    setCertificates((prev) =>
      prev.map((cert) =>
        cert.id === selectedCertIdForLink
          ? {
              ...cert,
              linkedAccounts: accounts.filter((acc) =>
                accountIds.includes(acc.id)
              ),
            }
          : cert
      )
    );

    setSelectedCertIdForLink(null);
    alert("계좌가 성공적으로 연동되었습니다.");
  };

  // 인증서 삭제 핸들러
  const handleDeleteCertificate = (certificateId: string) => {
    // 연동된 계좌의 certificateId 제거
    setAccounts((prev) =>
      prev.map((account) =>
        account.certificateId === certificateId
          ? { ...account, certificateId: undefined }
          : account
      )
    );

    // 인증서 삭제
    setCertificates((prev) => prev.filter((cert) => cert.id !== certificateId));
    alert("인증서가 삭제되었습니다.");
  };

  return (
    <AuthGuard>
      <DefaultLayout appName="Finance Data Hub" showHeader maxWidth="4xl" verticalAlign="start">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">공동인증서 관리</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              공동인증서를 등록하여 은행계좌, 세금계산서, 법인카드 내역을
              수집하세요.
            </p>
          </div>

          {/* 고객사 선택 */}
          <ClientSelector
            clients={sampleClients}
            selectedClientId={selectedClientId}
            onClientSelect={setSelectedClientId}
          />

          {/* 2열 레이아웃 */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* 좌측: 공동인증서 등록 및 목록 */}
            <div className="space-y-4">
              {/* 공동인증서 등록 */}
              <CertificateUpload
                clientId={selectedClientId}
                onUpload={handleCertificateUpload}
                onUploadSuccess={handleCertificateUploadSuccess}
              />

              {/* 공동인증서 목록 */}
              <CertificateList
                certificates={selectedClientId ? certificates : []}
                onLinkAccounts={handleLinkAccounts}
                onRefresh={() => {
                  console.log("인증서 목록 새로고침");
                  // TODO: API 호출하여 데이터 다시 가져오기
                }}
                onDelete={handleDeleteCertificate}
              />
            </div>

            {/* 우측: 계좌 목록 */}
            <div className="space-y-6">
              <AccountList
                accounts={
                  selectedClientId
                    ? accounts.filter(
                        (acc) =>
                          !acc.certificateId ||
                          certificates.some(
                            (cert) => cert.id === acc.certificateId
                          )
                      )
                    : []
                }
                onRefresh={() => {
                  console.log("계좌 목록 새로고침");
                  // TODO: API 호출하여 데이터 다시 가져오기
                }}
              />
            </div>
          </div>

          {/* 계좌 선택 모달 */}
          <AccountSelectModal
            isOpen={isAccountModalOpen}
            onClose={() => {
              setIsAccountModalOpen(false);
              setSelectedCertIdForLink(null);
            }}
            accounts={accounts}
            onAccountSelect={handleAccountSelect}
            certificateId={selectedCertIdForLink || undefined}
          />
        </div>
      </DefaultLayout>
    </AuthGuard>
  );
}
