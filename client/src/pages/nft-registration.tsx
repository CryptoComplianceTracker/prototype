import { NftMarketplaceRegistrationForm } from "@/components/nft-marketplace-registration-form";

export default function NftRegistrationPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">NFT Marketplace Registration</h1>
      <NftMarketplaceRegistrationForm />
    </div>
  );
}
