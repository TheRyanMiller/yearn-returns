import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const chart = (props) =>{
    let netGain = props.usdGain && props.usdGain[props.vaultId] ? props.usdGain[props.vaultId] : 0;
    console.log("💲",netGain);
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
            {"Net earnings $"+netGain}
        </p>
        </div>
    )
}

export default chart;