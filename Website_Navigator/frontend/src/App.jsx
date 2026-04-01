import { uploadFile } from "./api/Upload.js";
import { useNavigator } from "./hooks/useNavigator.js";

const App = () => {
  const nav = useNavigator()
  console.log(nav)

  // Test for backend
  const handlTest = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e) => {
      const result = await uploadFile(e.target.files[0]);
      console.log(result); 
    };
    input.click();
  };

  return (
    <div>
      <button onClick={handlTest} className="bg-cyan-500 text-md text-black p-3">Click Test</button>
    </div>
  );
};

export default App;
