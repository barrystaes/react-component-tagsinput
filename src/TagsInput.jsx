import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';



export class ClickyText extends React.Component {
	propTypes: {
		onClick: PropTypes.func.isRequired
	}

	render() {
		return <span className="clickyText" onClick={(e) => { this.props.onClick(e)}}>{this.props.children}</span>;
	}
}

export default class TagInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tagregex: /^[a-z0-9-]+$/,
			tagedit: '',
			...this.getStateFromProps(props)
		};
	}

	getStateFromProps = (props) => ({
		tags: props.tags,
		separatorkeycodes: props.seperatorkeycodes || [9, 13, 32], // tab, enter, space.
		readonly: props.readonly || false
	})

	componentWillReceiveProps = (nextProps) => { // This is called when props change after component was mounted.
		this.setState({...this.getStateFromProps(nextProps)});
	}

	propTypes: {
		onChange: PropTypes.func,
		onClickTag: PropTypes.func,
		tags: PropTypes.array.isRequired,
		separatorkeycodes: PropTypes.array,
		readonly: PropTypes.bool
	}

	onTagsChanged = (newtags) => {
		// Gets tags as param because setState() does not immediately update this.state
		if (this.props.onChange) this.props.onChange(newtags);
	}

	handleInputChange = (e) => {
		this.setState({
			tagedit: e.target.value.toLowerCase().trim()
			//tageditmaxlength: this.state.tagsmaxchars - this.tags.join(' ').length
		})
	}

	handleInputKeyDown = (e) => {
		// This code assumes tagedit already got updated by handleChange(), as it should be.
		const { readonly, tags, tagedit, separatorkeycodes, tagregex } = this.state;
		if (readonly) return;

		const keycode = e.keyCode;
		if (separatorkeycodes.indexOf(keycode) > -1) {
			e.preventDefault();
			if (
				(tagedit.match(tagregex) !== null) && // tag valid?
				(tags.map((t) => (t.toLowerCase())).indexOf(tagedit) == -1) // tag unique?
			) {
				// Add tag
				let newtags = tags.slice();
				newtags.push(this.state.tagedit);
				this.setState({tagedit: '', tags: newtags});
				this.onTagsChanged(newtags);
			}
		}
		if ((keycode==8) && (tagedit=='')) {
			// Remove last tag
			e.preventDefault();
			this.handleDelete(this.state.tags.length-1);
		}
		// todo Remove middle tags? (keys left/right/delete, and click support)
	}

	handleDelete = (i) => {
		if (i<0 || i>=this.state.tags.length) return;
		let newtags = this.state.tags.slice();
		newtags.splice(i, 1);
		this.setState({tags: newtags});
		this.onTagsChanged(newtags);
	}

	renderTag = (tag, i) => {
		const { onClickTag } = this.props;
		const { readonly } = this.state;
		return (
			<span className="tag" key={i}>
				{onClickTag ? <ClickyText key={0} onClick={(e)=>{onClickTag(tag)}}>{tag}</ClickyText> : {tag} }
				{readonly ? null : <ClickyText key={1} onClick={(e) => {this.handleDelete(i)}}><FontAwesome name="times" /></ClickyText>}
			</span>
		);
	}

	render() {
		const { readonly, tags, tagedit } = this.state;
		return (
			<div
				className={this.props.className + " tagsInput " + (readonly ? "readonly" : "editable")}
				onClick={!readonly ? (e)=>{React.findDOMNode(this.refs.tagedit).focus()} : null}
			>
				<div className="tags">
					{tags.map(this.renderTag)}
					{!readonly ?
						<span className="input">
							<input type="text" ref="tagedit" value={tagedit} onChange={this.handleInputChange} onKeyDown={this.handleInputKeyDown} />
						</span>
					: null}
				</div>
				<div className="clearfix"></div>{/* todo avoid this react-bootstrap dependancy */}
			</div>
		);
	}
}