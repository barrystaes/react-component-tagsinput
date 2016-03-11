import React, { PropTypes } from 'react';


export default class ClickyText extends React.Component {
	propTypes: {
		onClick: PropTypes.func.isRequired
	}

	render() {
		return <span className="clickyText" onClick={(e) => { this.props.onClick(e)}}>{this.props.children}</span>;
	}
}