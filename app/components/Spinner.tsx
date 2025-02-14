import React from 'react';
import { TailSpin } from 'react-loader-spinner';

interface SpinnerProps {
    height?: number;
    width?: number;
    color?: string;
}
const Spinner: React.FC<SpinnerProps> = ({ height = 25, width = 25, color = "#fff" }) => {
    return (
        <div className="flex justify-center">
            <TailSpin
                visible={true}
                height={height}  // Dynamic height
                width={width}    // Dynamic width
                color={color}
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
};

export default Spinner;
