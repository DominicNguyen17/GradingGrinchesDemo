import './App.css';
import {Route, Routes} from "react-router-dom";
import ClassList from "./pages/ClassList";
import AppProvider from "./util/contextProvider";
import GradingPage from "./pages/Grading";
import Home from "./pages/Home";
import RubricPage from "./pages/RubricPage";
import DownloadPage from "./pages/DownloadPage";

function App() {

    return (
        <AppProvider>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home/>}></Route>
                    <Route path="/rubric" element={<RubricPage/>}></Route>
                    <Route path="/class" element={<ClassList/>}></Route>
                    <Route path="/marking" element={<GradingPage/>}></Route>
                    <Route path="/download" element={<DownloadPage/>}></Route>
                </Routes>
            </div>
        </AppProvider>

    );
}

export default App;
