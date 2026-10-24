import { ClipLoader, PropagateLoader } from "react-spinners";
import { PulseLoader } from "react-spinners";
import { RingLoader } from "react-spinners";
import { HashLoader } from "react-spinners";


export function LoadingComponent() {

    return (
        <div className="sweet-loading">

            <PulseLoader
                color="#dedfde"
                size={10}
            />
            <p>
                Loading...
            </p>

        </div>
    );
}


export function LoadingContent() {

    return (

        <HashLoader
            color="#b9b9b9"
            size={26}
            speedMultiplier={1.2}
        />
    );
}




