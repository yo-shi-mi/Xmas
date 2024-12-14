import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { getKeypairFromFile } from "@solana-developers/helpers";

// Interfaces for type safety
export interface NFTAttribute {
    trait_type: string;
    value: string | number;
}

export interface NFTMetadataInput {
    name: string;
    symbol: string;
    description: string;
    image: string;
    attributes?: NFTAttribute[];
    additionalProperties?: Record<string, any>;
}

// Function to initialize Umi and create a signer
export async function initializeUmiAndSigner() {
    // Create a devnet connection
    const connection = new Connection(clusterApiUrl("devnet"));
    const umi = createUmi(connection.rpcEndpoint);
    
    // Get user keypair
    const user = await getKeypairFromFile();
    let keypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
    const signer = createSignerFromKeypair(umi, keypair);

    // Configure Umi
    umi.use(irysUploader());
    umi.use(signerIdentity(signer));

    return { umi, keypair, signer };
}

// Main function to create NFT metadata
export async function createNFTMetadata(
    umi: any, 
    keypair: any, 
    metadataInput: NFTMetadataInput
) {
    try {
        // Prepare metadata following Metaplex JSON structure
        const metadata = {
            name: metadataInput.name,
            symbol: metadataInput.symbol,
            description: metadataInput.description,
            image: metadataInput.image,
            attributes: metadataInput.attributes || [],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: metadataInput.image
                    },
                ],
                ...metadataInput.additionalProperties
            },
            creators: [
                keypair.publicKey
            ]
        };

        // Upload metadata to Irys
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
        return myUri;
    }
    catch(error) {
        console.error("Metadata creation failed", error);
        throw error;
    }
}

// Example of how another file might use this module
export async function createNFTMetadataFromExternal(
    imageUrl: string, 
    attributes: NFTAttribute[], 
    name: string = "My NFT",
    symbol: string = "MYNFT",
    description: string = "A custom NFT"
) {
    try {
        // Initialize Umi and get signer
        const { umi, keypair } = await initializeUmiAndSigner();

        // Prepare metadata input
        const metadataInput: NFTMetadataInput = {
            name,
            symbol,
            description,
            image: imageUrl,
            attributes
        };

        // Create and upload metadata
        return await createNFTMetadata(umi, keypair, metadataInput);
    } catch (error) {
        console.error("Failed to create NFT metadata", error);
        throw error;
    }
}