import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Chart from './components/chart';
import moment from 'moment';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pricesUsd, setPricesUsd] = useState({});
  const [balanceRecords, setBalanceRecords] = useState({});
  const [gains, setGains] = useState([]);
  const [usdGain, setUsdGain] = useState({});
  const [charts, setCharts] = useState([]);

  useEffect(() =>{
    let url = process.env.REACT_APP_API_DEV;
    axios.get('http://localhost:3002/api/balance/getAll').then((response, error) => {    
      if(error) throw error;
      setBalanceRecords(response.data.data)
    })
    .catch(err => console.log(err));
    axios.get('http://localhost:3002/api/balance/calculateGains').then(gainsData => {
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
  },[pricesUsd])

  useEffect(() =>{
    displayCharts();
  },[gains])

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

  const displayCharts = () => {
    let newCharts = [];
    let netGain = 0;
    Object.keys(charts).forEach(k=>{
      newCharts.push(charts[k]);
    })
    let rows = newCharts.map((chart,idx) => {
      let vaultId = Object.keys(charts)[idx];
      return <Chart usdGain={usdGain[vaultId]} chart={chart} idx={idx} vaultId={vaultId} key={vaultId} />
    })
    
    return (<>
      {rows}
    </>);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
        
        </p>
        <div style={{height: "800px", width: "800px"}}>
          { displayCharts() }
        </div>
      </header>
    </div>
  );
}

export default App;
