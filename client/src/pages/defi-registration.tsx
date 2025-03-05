import { DefiProtocolRegistrationForm } from "@/components/defi-protocol-registration-form";

export default function DefiRegistrationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">DeFi Protocol Registration</h1>
      <DefiProtocolRegistrationForm />
    </div>
  );
}