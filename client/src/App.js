import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pricesUsd, setPricesUsd] = useState({});

  useEffect(() =>{
    let url = process.env.REACT_APP_API_DEV;
    console.log(url)
    axios.get('http://localhost:3002/api/balance/getAll').then((response, error) => {    
      console.log("error:",error)  
      console.log("BALANCES GET ALL",response)
    })
    .catch(err => console.log(err));
    url = "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,dai,true-usd,tether,usd-coin,chainlink,yearn-finance,binance-usd,wrapped-bitcoin,ethereum,nusd,chainlink,aave-link,lp-sbtc-curve,lp-bcurve,curve-fi-ydai-yusdc-yusdt-ytusd,lp-3pool-curve,gemini-dollar,curve-dao-token&vs_currencies=usd,eth";
    axios.get(url).then(priceString => {
      console.log(priceString.data);
      setPricesUsd(priceString.data);
    }).catch(err=>{
      console.log(err)
      throw err;
    });
  },[])

  useEffect(() =>{
    console.log("PRICES SHOULD POPULATE HERE",pricesUsd);
  },[pricesUsd])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {//JSON.stringify(pricesUsd, null, 4)
          }
          <br/>lp-sbtc-curve ${Object.keys(pricesUsd).length > 0 ? pricesUsd.["lp-sbtc-curve"].usd : ""
          }<br/>
        </p>
      </header>
    </div>
  );
}

export default App;
