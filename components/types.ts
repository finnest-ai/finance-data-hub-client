// 고객사 타입
export interface Client {
  id: string;
  name: string;
  businessNumber: string;
}

// 공동인증서 타입
export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  registeredAt: string;
  expiresAt: string;
  type: "individual" | "corporate";
  linkedAccounts?: Account[];
}

// 계좌 타입
export interface Account {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  accountType: "deposit" | "savings" | "checking";
  balance?: number;
  certificateId?: string;
}

// 공동인증서 등록 데이터
export interface CertificateUploadData {
  file: File | null;
  password: string;
  clientId: string;
}
