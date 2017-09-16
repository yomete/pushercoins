import React, {Component} from 'react';
import './Today.css'
import axios from 'axios'
import Pusher from 'pusher-js'
import {CryptoPrice} from "./CryptoPrice";

class Today extends Component {
	/**
	 * If you're not using the props to initialize your state, you can
	 * just define the state like this and remove the constructor
	 */
	state = {
		btcprice: 0, // I guess you can keep it an empty string, I just think its better to give it a default value of 0 since they're numbers
		ltcprice: 0,
		ethprice: 0
	};

	sendPricePusher(data) {
		axios.post('/prices/new', {
			prices: data
		})
			.then(console.log)
			.catch(console.error) // if you do (x => yourFunc(x)) you can replace it with (yourFunc)
	}

	/**
	 * ComponentWillMount is deprecated and should never be used
	 * The only exception is:
	 * When doing Server Side Rendering, this is the only lifecycle method called
	 *
	 * Source: https://facebook.github.io/react/docs/react-component.html
	 */
	componentWillMount() {}

	/**
	 * Let's create utilitary functions to keep our code D.R.Y.
	 * Btw, in our use case it's perfectly fine to save the entire state here
	 */
	saveStateToLocalStorage = () => {
		localStorage.setItem('today-state', JSON.stringify(this.state));
	};

	restoreStateFromLocalStorage = () => {
		const state = JSON.parse(localStorage.getItem('today-state'));
		this.setState(state);
	};

	componentDidMount() {
		if (!navigator.onLine) {
			return this.restoreStateFromLocalStorage();
		}
		this.pusher = new Pusher('APP_KEY', {
			cluster: 'YOUR_CLUSTER',
			encrypted: true
		});
		this.prices = this.pusher.subscribe('coin-prices');
		axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD')
			.then(({data: {BTC, ETH, LTC}}) => { // Since we're never using responseh or data directly might aswell deconstruct it here
				/**
				 * Avoid calling setStates multiple times, just do every calls in one go and let react
				 * handle the batching
				 */
				this.setState({
					btcprice: BTC.USD,
					ethprice: ETH.USD,
					ltcprice: LTC.USD
				}, this.saveStateToLocalStorage); // You can pass a callback function to setState

			})
			.catch(console.error);
		// Let's store this interval in our class so that we can remove it in componentWillUnmount
		this.cryptoSubscription = setInterval(() => {
			axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD')
				.then(({data}) => { // This is a style question, I prefed doing it this way, to each its own
					this.sendPricePusher(data)
				})
				.catch(console.error)
		}, 10000);
		this.prices.bind('prices', ({prices: {BTC, ETH, LTC}}) => {
			this.setState({
				btcprice: BTC.usd,
				ethprice: ETH.usd,
				ltcprice: LTC.usd
			}, this.saveStateToLocalStorage);
		}, this);
	}

	componentWillUnmount() {
		clearInterval(this.cryptoSubscription);
	}

	render() {
		// Let's extract everything uptop to keep our render method cleaner ;)
		const {ethprice, btcprice, ltcprice} = this.state;
		return (
			<div className="today--section container">
				<h2>Current Price</h2>
				<div className="columns today--section__box">
					{/** Creating components for things that repeat themselves is also pretty good**/}
					<CryptoPrice currency="btc" price={btcprice}/>
					<CryptoPrice currency="eth" price={ethprice}/>
					<CryptoPrice currency="ltc" price={ltcprice}/>
				</div>
			</div>
		)
	}
}

export default Today;