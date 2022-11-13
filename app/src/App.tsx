import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { shell } from "electron";
import { useState } from "react";

import { Select } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { HashRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import Chat from "./pages/chat";
import Connect from "./pages/connect";
import { trpc } from "./utils/trpc";

function GetStarted() {
  const mutation = trpc.auth.createUser.useMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    console.log({
      name: formData.get("name") as string,
      username: formData.get("username") as string,
    });

    const user = await mutation.mutateAsync({
      json: {
        name: formData.get("name") as string,
        username: formData.get("username") as string,
      },
    } as any);
    localStorage.setItem("user-id", user.id);
    shell.openExternal(
      `http://localhost:3000/auth?username=${encodeURIComponent(
        formData.get("username") as any
      )}`
    );

    setTimeout(() => {
      navigate("/connect");
    }, 1000);
  };

  return (
    <Flex
      h="100vh"
      bgImage="url(/hero.jpg)"
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
          Get Started
        </Heading>
        <Box
          as="form"
          onSubmit={handleSubmit as any}
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
          <FormControl>
            <FormLabel color="gray.100">Name</FormLabel>
            <Input
              color="gray.300"
              placeholder="John Doe"
              rounded="md"
              bg="rgb(30 41 59/1)"
              border="none"
              h={12}
              name="name"
              type="text"
              required
              fontSize="lg"
              px={6}
              _focus={{ border: "none" }}
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.100">Username</FormLabel>
            <Input
              color="gray.300"
              placeholder="johndoe123"
              bg="rgb(30 41 59/1)"
              border="none"
              h={12}
              type="text"
              name="username"
              rounded="md"
              required
              fontSize="lg"
              px={6}
              _focus={{ border: "none" }}
            />
          </FormControl>
          <Button
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
            Login
          </Button>
        </Box>
      </Box>
    </Flex>
  );
}

function App() {
  const [viewType, setView] = useState<"all" | "whatsapp" | "twitter">("all");
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/api/trpc",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ],
    })
  );

  // useEffect(() => {
  //   ipcRenderer.on("twitter-connected", (_, arg) => {
  //     localStorage.setItem("twitter-texts", JSON.stringify(arg));
  //   });
  // }, []);

  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Box
            height="3vh"
            w="100vw"
            px="4"
            py="2"
            h="5vh"
            alignItems="center"
            bg="gray.900"
            color="gray.200"
            display="flex"
            gap="8"
          >
            <Link to="/connect">Connect</Link>
            <Link to="/chat">Chat</Link>
            <Box>
              <Select
                size="sm"
                rounded="lg"
                value={viewType}
                bg="gray.600"
                color="white"
                onChange={(e) => setView(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="twitter">Twitter</option>
                <option value="whatsapp">Whatsapp</option>
              </Select>
            </Box>
            <Box>
              <Popover>
                <PopoverTrigger>
                  <Button>DND Mode</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Set DND timeout</PopoverHeader>
                  <PopoverBody display="flex">
                    <Slider aria-label="slider-ex-6">
                      <SliderMark value={15} {...labelStyles}>
                        15mins
                      </SliderMark>
                      <SliderMark value={30} {...labelStyles}>
                        30mins
                      </SliderMark>
                      <SliderMark value={45} {...labelStyles}>
                        45mins
                      </SliderMark>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
            <Box>
              <Text>
                Usage today: <strong>48mins</strong>
              </Text>
            </Box>
          </Box>
          <Routes>
            <Route path="/" index element={<GetStarted />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/chat" element={<Chat viewType={viewType} />} />
          </Routes>
        </HashRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
