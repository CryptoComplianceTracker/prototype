import { NftMarketplaceRegistrationForm } from "@/components/nft-marketplace-registration-form";

export default function NftRegistrationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">NFT Marketplace Registration</h1>
      <NftMarketplaceRegistrationForm />
    </div>
  );
}