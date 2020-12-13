import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ChartList from './components/earningChartList';
import moment from 'moment';
import './App.css';

function App() {
  const [pricesUsd, setPricesUsd] = useState({});
  const [balanceRecords, setBalanceRecords] = useState({});
  const [gains, setGains] = useState([]);
  const [usdGain, setUsdGain] = useState({});
  const [charts, setCharts] = useState([]);

  useEffect(() =>{
    let url = process.env.REACT_APP_API_URL;
    let port = process.env.REACT_APP_API_PORT; 
    axios.get(url+":"+port+"/api/balance/getAll").then((response, error) => {    
      if(error) throw error;
      setBalanceRecords(response.data.data)
    })
    .catch(err => console.log(err));
    axios.get(url+":"+port+"/api/balance/calculateGains").then(gainsData => {
      setGains(gainsData.data.data);
      url = "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,dai,true-usd,tether,usd-coin,chainlink,yearn-finance,binance-usd,wrapped-bitcoin,ethereum,nusd,chainlink,aave-link,lp-sbtc-curve,lp-bcurve,curve-fi-ydai-yusdc-yusdt-ytusd,lp-3pool-curve,gemini-dollar,curve-dao-token&vs_currencies=usd,eth";
      axios.get(url).then(priceString => {
        setPricesUsd(priceString.data);
      }).catch(err=>{
        console.log(err)
        throw err;
      });
    }).catch(err=>{
      console.log(err)
      throw err;
    });
    
  },[])

  useEffect(() =>{
    let tempGains = gains;
    let tempUsdGain = usdGain;
    Object.keys(gains).forEach(gainsKey=>{
      Object.keys(pricesUsd).forEach(cgKey=>{
        if(gainsKey === cgKey){
          tempGains[gainsKey].usdPrice = pricesUsd[cgKey].usd;
          tempGains[gainsKey].usdGains = pricesUsd[cgKey].usd * tempGains[gainsKey].gain;
          tempUsdGain[gainsKey] = (pricesUsd[cgKey].usd * tempGains[gainsKey].gain).toFixed(2);
        }
      })
    })
    setUsdGain(tempUsdGain)
    setGains(tempGains)
  },[pricesUsd,usdGain,gains])

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
          <ChartList  charts={charts} usdGain={usdGain} />
        </div>
      </header>
    </div>
  );
}

export default App;
