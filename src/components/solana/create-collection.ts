import { 
    createNft,
    fetchDigitalAsset,
    mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";


import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
}   from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { Connection, LAMPORTS_PER_SOL, clusterApiUrl} from "@solana/web3.js";
import { 
    generateSigner,
    keypairIdentity,
    percentAmount,
    publicKey,

} from "@metaplex-foundation/umi";

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile();

await airdropIfRequired( // airdrop 1 sol if wallet doesnt have 0.5 sol
    connection,
    user.publicKey,
     1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL
);

console.log("Load user", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

console.log("Set up Umi instance for user");

const collectionMint = generateSigner(umi);

console.log("Created collection mint", collectionMint.publicKey);
console.log("Creating collection");

const transaction = await createNft(umi, {
    mint: collectionMint,
    name: "testtree", 
    symbol: "T T",
    uri: "https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-nft-collection-offchain-data.json",
    sellerFeeBasisPoints: percentAmount(0.01),
    isCollection: true,
});
await transaction.sendAndConfirm(umi);

const createdCollectionNft = await fetchDigitalAsset(
    umi,
    collectionMint.publicKey
);

console.log(
    `Created Collection T T!!! Address is ${getExplorerLink(
     "address",
     createdCollectionNft.mint.publicKey,
     "devnet"
    )}` 
);