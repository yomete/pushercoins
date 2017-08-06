import React, { Component } from 'react';
import './Today.css'
import axios from 'axios'
import Pusher from 'pusher-js'

class Today extends Component {
    constructor () {
        super();
        this.state = {
            btcprice: '',
            ltcprice: '',
            ethprice: ''
        };
    }
    sendPricePusher (data) {
        axios.post('/prices/new', {
            prices: data
        })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }
    componentWillMount () {
        this.pusher = new Pusher('18b94d3420ae0dc82f6c', {
            cluster: 'eu',
            encrypted: true
        });
        this.prices = this.pusher.subscribe('coin-prices');
        axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD')
            .then(response => {
                this.setState({ btcprice: response.data.BTC.USD });
                localStorage.setItem('BTC', response.data.BTC.USD);

                this.setState({ ethprice: response.data.ETH.USD });
                localStorage.setItem('ETH', response.data.ETH.USD);

                this.setState({ ltcprice: response.data.LTC.USD });
                localStorage.setItem('LTC', response.data.LTC.USD);
            })
            .catch(error => {
                console.log(error)
            })
    }
    componentDidMount () {
        if (!navigator.onLine) {
            this.setState({ btcprice: localStorage.getItem('BTC') });
            this.setState({ ethprice: localStorage.getItem('ETH') });
            this.setState({ ltcprice: localStorage.getItem('LTC') });
        }
        setInterval(() => {
            axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD')
                .then(response => {
                    this.sendPricePusher (response.data)
                })
                .catch(error => {
                    console.log(error)
                })
        }, 10000)
        this.prices.bind('prices', price => {
            localStorage.setItem('BTC', price.prices.BTC.USD);
            localStorage.setItem('ETH', price.prices.ETH.USD);
            localStorage.setItem('LTC', price.prices.LTC.USD);
            this.setState({ btcprice: price.prices.BTC.USD });
            this.setState({ ethprice: price.prices.ETH.USD });
            this.setState({ ltcprice: price.prices.LTC.USD });
        }, this);
    }
    render() {
        return (
            <div className="today--section container">
                <h2>Current Price</h2>
                <div className="columns today--section__box">
                    <div className="column btc--section">
                        <h5>${this.state.btcprice}</h5>
                        <p>1 BTC</p>
                    </div>
                    <div className="column eth--section">
                        <h5>${this.state.ethprice}</h5>
                        <p>1 ETH</p>
                    </div>
                    <div className="column ltc--section">
                        <h5>${this.state.ltcprice}</h5>
                        <p>1 LTC</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Today;