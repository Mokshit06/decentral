import { useEffect, useState } from 'react';
import { useHandleLogin } from '../components/siwe';
import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';
import { useSession } from 'next-auth/react';

function Internal() {
  const handleLogin = useHandleLogin();
  const session = useSession();

  useEffect(() => {
    handleLogin().then(() => {
      document.location.href = 'text-app://open';
    });
  }, []);

  return session ? (
    <div>Authenticated! You can close this tab</div>
  ) : (
    <div>Logging in</div>
  );
}

export default function Auth() {
  const [wagmiClient] = useState(() =>
    createClient({ autoConnect: true, provider: getDefaultProvider() })
  );

  return (
    <WagmiConfig client={wagmiClient}>
      <Internal />
    </WagmiConfig>
  );
}
