import { useState } from "react";
import { shell } from "electron";

function App() {
  const [count, setCount] = useState(0);

  console.log({ shell });

  return (
    <div
      onClick={() => {
        shell.openExternal("https://www.google.com");
      }}
    >
      Works?
    </div>
  );
}

export default App;
