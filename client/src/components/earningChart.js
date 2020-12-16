import React from 'react';
import { Line } from 'react-chartjs-2';

const earningChart = (props) =>{
    return (
        <div key={props.vaultId}>
        <Line 
            data={props.chart} 
            options={{
                responsive: true,
                maintainAspectRatio: true,
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
            {console.log("😎",props.gainsData)}
            {"Net earnings: $" + props.gainsData.usdGain.toFixed(2) + " ("+props.gainsData.underlyingGain.toFixed(5)+")"}
        </p>
        </div>
    )
}

export default earningChart;