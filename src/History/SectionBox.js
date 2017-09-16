import React from 'react';
import PropTypes from 'prop-types';

export const SectionBox = ({price}) =>
	<div className="history--section__box__inner">
		<h4>{price.date}</h4>
		<div className="columns">
			<div className="column">
				<p>1 BTC = ${price.btc}</p>
			</div>
			<div className="column">
				<p>1 ETH = ${price.eth}</p>
			</div>
			<div className="column">
				<p>1 LTC = ${price.ltc}</p>
			</div>
		</div>
	</div>;

SectionBox.propTypes = {
	price: PropTypes.object.isRequired
};

SectionBox.defaultProps = {
	price: {
		date: '',
		btc: 0,
		eth: 0,
		ltc: 0
	}
};
