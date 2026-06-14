import { ThemeProvider } from "contexts/theme/themeProvider";
import Ocr from "./Ocr";

function App() {
  return (
    <>
      <ThemeProvider>
        <Ocr />
      </ThemeProvider>
    </>
  );
}

export default App;
