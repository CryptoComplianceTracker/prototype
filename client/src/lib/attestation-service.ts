import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { BrowserProvider, JsonRpcSigner } from "ethers";

// EAS Contract Address on Sepolia
const EAS_CONTRACT_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";

// Schema for registration attestations
const REGISTRATION_SCHEMA = "address userAddress,string entityType,string registrationId,uint256 timestamp";

export async function createRegistrationAttestation(
  registrationType: 'exchange' | 'stablecoin' | 'defi' | 'nft' | 'fund',
  registrationId: string,
  userAddress: string
) {
  try {
    // Connect to provider (assuming user has MetaMask or similar wallet)
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Initialize EAS
    const eas = new EAS(EAS_CONTRACT_ADDRESS);
    eas.connect(signer);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(REGISTRATION_SCHEMA);
    const encodedData = schemaEncoder.encodeData([
      { name: "userAddress", value: userAddress, type: "address" },
      { name: "entityType", value: registrationType, type: "string" },
      { name: "registrationId", value: registrationId, type: "string" },
      { name: "timestamp", value: BigInt(Math.floor(Date.now() / 1000)), type: "uint256" },
    ]);

    // Make the attestation
    const tx = await eas.attest({
      schema: REGISTRATION_SCHEMA,
      data: {
        recipient: userAddress,
        expirationTime: BigInt(0), // No expiration
        revocable: true,
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();

    return {
      success: true,
      attestationUID: newAttestationUID,
      error: null
    };
  } catch (error) {
    console.error("Error creating attestation:", error);
    return {
      success: false,
      attestationUID: null,
      error: error instanceof Error ? error.message : "Unknown error creating attestation"
    };
  }
}

export async function verifyAttestation(attestationUID: string) {
  try {
    const provider = new BrowserProvider(window.ethereum);
    const eas = new EAS(EAS_CONTRACT_ADDRESS);
    eas.connect(provider);

    const attestation = await eas.getAttestation(attestationUID);

    return {
      success: true,
      attestation,
      error: null
    };
  } catch (error) {
    console.error("Error verifying attestation:", error);
    return {
      success: false,
      attestation: null,
      error: error instanceof Error ? error.message : "Unknown error verifying attestation"
    };
  }
}