import React from 'react';
import { Line } from 'react-chartjs-2';

const earningChart = (props) =>{
    console.log("💲",props.gainsData);
    return (
        <div style={{height: "500px", width: "800px"}} key={props.vaultId}>
        <Line 
            data={props.chart} 
            options={{
                responsive: true,
                title: {
                    text: props.vaultId, 
                    display: true,
                    fontSize: 30
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 8
                        }
                    }]
                }
            }}
            />
        <p style={{color:"gray", fontSize: "18px"}}>
            {"Net earnings: $" + props.gainsData.usdGain.toFixed(2)}
        </p>
        </div>
    )
}

export default earningChart;