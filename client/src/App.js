import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ChartList from './components/earningChartList';
import moment from 'moment';
import './App.css';

function App() {
  const [balanceRecords, setBalanceRecords] = useState({});
  const [gainsData, setGainsData] = useState([]);
  const [usdGain, setUsdGain] = useState({});
  const [charts, setCharts] = useState([]);

  useEffect(() =>{
    let url = process.env.REACT_APP_API_URL;
    let port = process.env.REACT_APP_API_PORT; 
    console.log("URL + PORT:",url+":"+port)
    axios.get(url+":"+port+"/api/balance/getAll").then((response, error) => {    
      if(error) throw error;
      setBalanceRecords(response.data.data)
    })
    .catch(err => console.log(err));
    
    axios.get(url+":"+port+"/api/balance/getTotalGains").then(gainsData => {
      setGainsData(gainsData.data.data);
    }).catch(err=>{
      console.log(err)
      throw err;
    });
    
  },[])


  useEffect(() =>{
    if(balanceRecords && balanceRecords.length>0){
      formatChartData(balanceRecords);
    }
  },[balanceRecords])

  const formatChartData = (data) => {
    let chartData = {};
    data.forEach(d=>{
      if(d.priceId && chartData[d.priceId]){
        chartData[d.priceId].labels.push(moment(d.createdAt).format('MM/DD hh:mm'));
        chartData[d.priceId].datasets[0].data.push(d.underlyingBalance);
      }
      else{
        if(d.priceId){
          let newObj = {
              labels:[moment(d.createdAt).format('MM/DD hh:mm')],
              datasets:[{
                label: "Underlying Balance",
                data: [d.underlyingBalance],
                backgroundColor: [
                  'rgba(75, 192, 192, 0.6)'
                ],
                borderWidth:4
              }]
          }
          chartData[d.priceId] = newObj;
        }
        else{
          // No match
        }
      }
    })
    setCharts(chartData);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
        
        </p>
        <div style={{height: "800px", width: "800px"}}>
          <ChartList  charts={charts} gainsData={gainsData} />
        </div>
      </header>
    </div>
  );
}

export default App;
