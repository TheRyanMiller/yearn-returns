import React from 'react';
import { Line } from 'react-chartjs-2';

const earningChart = (props) =>{
    console.log("💲",props.usdGain);
    return (
        <div style={{height: "500px", width: "800px"}} key={props.vaultId}>
        <Line data={props.chart} options={{
            responsive: true,
            title: {
                text: props.vaultId, 
                display: true,
                fontSize: 30
            },
            }}/>
        <p style={{color:"gray", fontSize: "18px"}}>
            {`Net earnings $${ +props.usdGain }`}
        </p>
        </div>
    )
}

export default earningChart;