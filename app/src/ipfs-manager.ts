// // const node = await IPFS.create()
// export function useUploadToIpfs(f: any) {
//   // const createConversationMutation = trpc.createConversation.useMutation();
//   // TODO: encrypt using public key cryptography
//   // const data = await node.add(JSON.stringify(f))
//   // return await createConversationMutation.mutateAsync({
//   //   cid: "",
//   //   // cid: data.cid.toString(),
//   //   img: f.img,
//   //   name: f.name,
//   //   integration: "twitter",
//   // });
// }

import { trpc } from "./utils/trpc";
import pinataSdk from "@pinata/sdk";

// export async function readFromIpfs() {
//   // const cid = await getConversation(id).data.cid;
//   // const stream = node.cat(cid)
//   // const decoder = new TextDecoder()
//   // let data = "";
//   // for await (const chunk of stream) {
//   //   data += decoder.decode(chunk, { stream: true });
//   // }
//   // return data
// }

// export function encryptIpfsFiles(pubKey: string) {}

// const pinata = new pinataSdk("", "");

// export function useUploadToIpfs() {
//   const createConversationMutation = trpc.createConversation.useMutation();

//   pinata;
// }
