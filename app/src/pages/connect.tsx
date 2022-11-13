import { trpc } from "@/utils/trpc";
import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  FormControl,
  Input,
  FormLabel,
} from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Connect() {
  const [modalOpen, setModalOpen] = useState<false | "twitter" | "whatsapp">(
    false
  );
  const createConversationMutation = trpc.createConversation.useMutation();
  const navigate = useNavigate();
  const [twitterLoading, setTwitterLoading] = useState(false);
  const onClose = () => setModalOpen(false);

  return (
    <Flex
      h="100vh"
      bgPosition="center"
      bgSize="cover"
      w="100vw"
      flexDir="column"
      bg="gray.900"
      alignItems="center"
      justifyContent="center"
    >
      {/* <Navbar /> */}
      <Box maxW="900px">
        <Heading
          mb={6}
          fontSize="5xl"
          textAlign="center"
          fontWeight={800}
          color="white"
        >
          Connect with Texting Apps
        </Heading>
        <Box
          backdropFilter="blur(8px) brightness(0.9) "
          px={5}
          py={6}
          rounded="lg"
          shadow="lg"
          minW="500px"
          display="flex"
          flexDir="column"
          gridGap={4}
          border="2px solid rgb(30 41 59/1)"
        >
          <Button
            mt={2}
            colorScheme="whatsapp"
            px={8}
            fontSize="md"
            h={12}
            type="submit"
            rounded="lg"
            onClick={() => setModalOpen("whatsapp")}
          >
            Connect Whatsapp
          </Button>
          <Button
            mt={2}
            colorScheme="twitter"
            px={8}
            fontSize="md"
            h={12}
            type="submit"
            rounded="lg"
            onClick={() => setModalOpen("twitter")}
          >
            Connect Twitter
          </Button>

          <Modal isOpen={modalOpen === "twitter"} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
              as="form"
              onSubmit={(e: any) => {
                e.preventDefault();

                const formData = new FormData(e.currentTarget);
                ipcRenderer;
                setTwitterLoading(true);
                ipcRenderer.send("connect-twitter", [
                  formData.get("username"),
                  formData.get("password"),
                ]);

                ipcRenderer.on("twitter-connected", async (_, arg) => {
                  localStorage.setItem("twitter-texts", JSON.stringify(arg));
                  for (const f of arg) {
                    // const node = await IPFS.create()
                    // TODO: encrypt using public key cryptography
                    // const data = await node.add(JSON.stringify(f))
                    // await createConversationMutation.mutateAsync({
                    //   cid: "",
                    //   // cid: data.cid.toString(),
                    //   img: f.img,
                    //   name: f.name,
                    //   integration: "twitter",
                    // });
                  }
                  setTwitterLoading(false);
                  navigate("/chat");
                });
              }}
              border="2px solid rgb(30 41 59/1)"
              bg="gray.900"
            >
              <ModalHeader color="gray.50" fontSize="2xl">
                Twitter
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box
                  rounded="md"
                  // minW="500px"
                  display="flex"
                  flexDir="column"
                  gridGap={4}
                >
                  <FormControl>
                    <FormLabel color="gray.100">Username</FormLabel>
                    <Input
                      color="gray.300"
                      placeholder="johndoe"
                      rounded="md"
                      bg="rgb(30 41 59/1)"
                      border="none"
                      h={12}
                      name="username"
                      type="text"
                      required
                      fontSize="lg"
                      px={6}
                      _focus={{ border: "none" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color="gray.100">password</FormLabel>
                    <Input
                      color="gray.300"
                      placeholder="John Doe"
                      rounded="md"
                      bg="rgb(30 41 59/1)"
                      border="none"
                      h={12}
                      name="password"
                      type="password"
                      required
                      fontSize="lg"
                      px={6}
                      _focus={{ border: "none" }}
                    />
                  </FormControl>
                  {/* <Button
                    mt={2}
                    bg="rgb(14 165 233/1)"
                    px={8}
                    color="white"
                    fontSize="md"
                    _active={{
                      bg: "rgb(56 189 248/1)",
                    }}
                    _hover={{
                      bg: "rgb(56 189 248/1)",
                    }}
                    h={12}
                    type="submit"
                    rounded="lg"
                  >
                    Connect
                  </Button> */}
                </Box>
              </ModalBody>

              <ModalFooter alignItems="center">
                <Button
                  colorScheme="twitter"
                  type="button"
                  mr={3}
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  bg="rgb(14 165 233/1)"
                  color="white"
                  fontSize="md"
                  _active={{
                    bg: "rgb(56 189 248/1)",
                  }}
                  _hover={{
                    bg: "rgb(56 189 248/1)",
                  }}
                  type="submit"
                  rounded="lg"
                  isLoading={twitterLoading}
                >
                  Connect
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={modalOpen === "whatsapp"} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Whastapp</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text mb="6" fontSize="lg">
                  Scan the following code to login :-
                </Text>
                <QrCode />
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="whatsapp" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    ipcRenderer.send("get-whatsapp-qr");
                  }}
                >
                  Retry
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </Flex>
  );
}

function QrCode() {
  const [qrCode, setQrCode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ipcRenderer.send("get-whatsapp-qr");

    ipcRenderer.on("receive-whatsapp-qr", (e, arg) => {
      setQrCode(arg);

      setTimeout(() => {
        ipcRenderer.send("load-chats");
      }, 6000);
    });

    ipcRenderer.on("chats-loaded", (_, arg) => {
      localStorage.setItem("whatsapp-texts", JSON.stringify(arg));
      navigate("/chat");
    });
  }, []);

  if (!qrCode)
    return (
      <Flex
        height="350px"
        width="350px"
        alignItems="center"
        justifyContent="center"
        rounded="md"
        bg="gray.600"
        fontSize="xl"
      >
        Loading...
      </Flex>
    );

  return <Box as="img" height="350px" width="350px" src={`/${qrCode}`} />;
}
