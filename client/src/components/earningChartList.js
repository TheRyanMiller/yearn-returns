import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import Chart from './earningChart'

const earningChartList = (props) =>{
    let newCharts = [];
    let rows = <>Nothing to display</>;
    console.log("💲",props.gainsData);
    if(props.gainsData.length>0){
      Object.keys(props.charts).forEach(k=>{
        newCharts.push(props.charts[k]);
      })
      rows = newCharts.map((chart,idx) => {
        let vaultId = Object.keys(props.charts)[idx];
        console.log("📊",idx,vaultId,props.gainsData[idx]);
        return (<>
          <Chart gainsData={props.gainsData[idx]} 
              chart={chart} 
              idx={idx} 
              vaultId={vaultId} 
              key={vaultId} />
          </>
        )
      })
    }
    return (<>
        {rows}
        </>
    );
}

export default earningChartList;