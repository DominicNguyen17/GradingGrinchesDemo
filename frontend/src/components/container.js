// define a container to contain some fields
import "../css/container.css";

const Container = ({children}) => {
    return <div className="container">
        {children}
    </div>
}


export default Container;