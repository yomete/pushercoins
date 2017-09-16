import React from 'react';
import PropTypes from 'prop-types';

export const CryptoPrice = ({currency, price}) =>
	<div className={`column ${currency}--section`}>
		<h5>${price}</h5>
		<p>1 {currency.toUpperCase()}</p>
	</div>;

CryptoPrice.propTypes = {
	price: PropTypes.number.isRequired,
	currency: PropTypes.string.isRequired,
};
