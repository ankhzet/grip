
import * as React from "react";
import { Children, Component, HTMLAttributes, ReactChild, ReactElement } from "react";

export interface RadioGroupProps extends HTMLAttributes<any> {
	value: string;
}

export interface RadioGroupState {
	value: string;
}

export class RadioGroup extends Component<RadioGroupProps, RadioGroupState> {

	constructor(props: RadioGroupProps) {
		super(props);

		this.state = {
			value: props.value,
		};
	}

	render() {
		let { name, children, value, onChange } = this.props;

		return (
			<div { ...this.props }>
				{ Children.map(
					children,
					(child) => {
						let input;
						let traversed = this.traverseToType(child, (child) => {
								if (typeof child !== 'string') {
									let element = child as ReactElement<any>;

									if (element.props.type === 'radio') {
										return [
											child,
										];
									}
								}

								return [];
							})
							.filter((i: ReactElement<any>) => i.props.type === 'radio')
						;

						if (traversed.length && (input = traversed.shift() as ReactElement<any>)) {
							input.props = {
								...input.props,
								name: name,
								checked: value === input.props.value,
								onChange: (e) => {
									this.setState({
										value: value,
									});

									onChange(e);
								},
							};
						}

						return child;
					}
				) }
			</div>
		);
	}

	private traverseToType(child: ReactChild, filter: (child: ReactChild) => ReactChild[]): ReactChild[] {
		let mapped = filter(child);

		if (!(mapped.length || (typeof child === 'string'))) {
			let element = child as ReactElement<any>;
			let children = element.props.children;

			mapped = (
				(children && children.length)
					? mapped.concat(...children.map((child) => filter(child)))
					: mapped
			);
		}

		return mapped.filter((item) => !!item);
	}
}
