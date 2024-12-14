import {
    createNft,
    fetchDigitalAsset,
    mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import { 
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
} from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

import { 
    generateSigner,
    keypairIdentity,
    percentAmount,
    publicKey,
} from "@metaplex-foundation/umi";

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"));

    const user = await getKeypairFromFile();

    await airdropIfRequired(
        connection,
        user.publicKey,
        1 * LAMPORTS_PER_SOL,
        0.5 * LAMPORTS_PER_SOL
    );

    console.log("Loaded user", user.publicKey.toBase58());

    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());

    const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
    umi.use(keypairIdentity(umiUser));

    console.log("Setting up Umi instance for user");

    // Collection this NFT belongs to
    const collectionAddress = publicKey(
        "BCNfgxM85BrRE2foWdKvvBSdWzbiBygUa33gDQNeGRvi"
    );

    console.log(`Creating NFT....`);

    const mint = generateSigner(umi);

    const transaction = await createNft(umi, {
        mint,
        name: "Christmastree0",
        symbol: "T T",
        uri: "https://devnet.irys.xyz/BnHRWGdd6EjWfgLcpZsGjEjikyUKnPJ8gHHNmwFuDtsX",
        sellerFeeBasisPoints: percentAmount(0.001),
        collection: {
            key: collectionAddress,
            verified: false,
        },
    });

    await transaction.sendAndConfirm(umi);

    const createdNft = await fetchDigitalAsset(umi, mint.publicKey);

    console.log(
        `🖼️ Created NFT: ${getExplorerLink(
            "address",
            createdNft.mint.publicKey,
            "devnet"
        )}`
    );
})();
