import { CryptoFundRegistrationForm } from "@/components/crypto-fund-registration-form";

export default function FundRegistrationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Crypto Fund & Institutional Investor Registration</h1>
      <CryptoFundRegistrationForm />
    </div>
  );
}