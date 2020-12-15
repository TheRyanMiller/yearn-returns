import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ChartList from './components/earningChartList';
import moment from 'moment';
import { Line, Pie } from 'react-chartjs-2';
import './App.css';

function App() {
  const [balanceRecords, setBalanceRecords] = useState({});
  const [gainsData, setGainsData] = useState([]);
  const [charts, setCharts] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() =>{
    console.log("VERSION #",process.env.REACT_APP_VERSION);
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
    let pieLabels = [];
    let pieDatasets= [];
    gainsData.forEach(d=>{
      if(d.priceId && d.usdGain){
        pieLabels.push(d.priceId);
        pieDatasets.push(d.usdGain.toFixed(2));
      }
    })
    let tempPieData = {
      labels: pieLabels,
      datasets:[{
        label: "USD Gains",
        data: pieDatasets,
        backgroundColor: ["#237529"],
        borderWidth:4
      }]
    }
    setPieData(tempPieData);
  },[gainsData])

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
        chartData[d.priceId].datasets[0].data.push(d.underlyingBalance.toFixed(6));
      }
      else{
        if(d.priceId){
          let newObj = {
              labels:[moment(d.createdAt).format('MM/DD hh:mm')],
              datasets:[{
                label: "Underlying Balance",
                data: [d.underlyingBalance],
                backgroundColor: ['#4b0c78'],
                borderWidth:2
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
        <div>
          <ChartList  charts={charts} gainsData={gainsData} />
          <Pie 
            data={pieData} 
            options={{
                responsive: true,
                maintainAspectRatio: true,
                title: {
                    text: "USD Performance", 
                    display: true,
                    fontSize: 30
                }
            }}
            />
        </div>
      </header>
    </div>
  );
}

export default App;
