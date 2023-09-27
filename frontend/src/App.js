import './App.css';
import Home from "./pages/home";
import {Route, Routes} from "react-router-dom";
import Rubric from "./pages/rubric";
import Class from "./pages/class";
import AppProvider from "./util/contextProvider";
import Marking from "./pages/marking";

function App() {

    return (
        <AppProvider>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home/>}></Route>
                    <Route path="/rubric" element={<Rubric/>}></Route>
                    <Route path="/class" element={<Class/>}></Route>
                    <Route path="/marking" element={<Marking/>}></Route>
                </Routes>
            </div>
        </AppProvider>

    );
}

export default App;
