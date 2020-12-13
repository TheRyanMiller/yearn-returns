import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from './earningChart'

const earningChartList = (props) =>{
    let newCharts = [];
    Object.keys(props.charts).forEach(k=>{
      newCharts.push(props.charts[k]);
    })
    let rows = newCharts.map((chart,idx) => {
      let vaultId = Object.keys(props.charts)[idx];
      return (<>
        <Chart usdGain={props.usdGain[vaultId]} 
            chart={chart} 
            idx={idx} 
            vaultId={vaultId} 
            key={vaultId} />
        </>
      )
    })
    
    return (<>
        {rows}
        </>
    );
}

export default earningChartList;