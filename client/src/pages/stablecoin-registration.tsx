import { StablecoinRegistrationForm } from "@/components/stablecoin-registration-form";

export default function StablecoinRegistrationPage() {
  return (
    <div className="container px-4 md:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Stablecoin Issuer Registration</h1>
      <StablecoinRegistrationForm />
    </div>
  );
}