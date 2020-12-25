import React from 'react';
import './styles.css';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			result: '',
			token: [],
			inputValue: '',
			showInput: '0',
			xValue: '',
			yValue: '',
			calcFunc: '',
			operators: ['+', '-', 'X', '/'],
			operatorsId: ['add', 'subtract', 'multiply', 'divide'],
			ctrlKeys: ['AC', 'del', '='],
			ctrlKeysId: ['clear', 'delete', 'equals'],
			digitKeys: ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
			digitKeysId: [
				'decimal',
				'zero',
				'one',
				'two',
				'three',
				'four',
				'five',
				'six',
				'seven',
				'eight',
				'nine'
			]
		};
	}

	genrateToken() {
		const stLength = this.state.inputValue.length;
		let myStatement = this.state.inputValue;
		let j = 0;
		let localToken = [];
		for (let i = 0; i < stLength; i++) {
			// if (this.state.digitKeys.includes(myStatement[i])) {
			if (
				!(
					this.state.operators.includes(myStatement[i - 1]) &&
					this.state.operators.includes(myStatement[i])
				)
			) {
				if (localToken[j] === undefined) {
					localToken[j] = '';
				}
				if (this.state.digitKeys.includes(myStatement[i])) {
					localToken[j] += myStatement[i];
				}
				if (this.state.operators.includes(myStatement[i])) {
					j++;
				}
				// }
			}
			if (
				this.state.operators.includes(myStatement[i]) &&
				!(
					this.state.operators.includes(myStatement[i - 1]) &&
					this.state.operators.includes(myStatement[i])
				)
			) {
				localToken[j] = myStatement[i];
				j++;
			} else if (
				this.state.operators.includes(myStatement[i - 1]) &&
				this.state.operators.includes(myStatement[i])
			) {
				if (myStatement[i] === '-') {
					localToken[j] = myStatement[i];
				}
			}
		}
		// console.log(localToken);

		// separate opearator and operand
		const ltLenght = localToken.length;
		let calcOp = [];
		let calcNum = [];

		for (let i = 0, j = 0, k = 0; i < ltLenght; i++) {
			if (
				this.state.operators.includes(localToken[i]) &&
				!this.state.digitKeys.includes(localToken[i])
			) {
				calcOp[k] = localToken[i];
				k++;
			} else {
				calcNum[j] = localToken[i];
				j++;
			}
		}
		// console.log(calcNum);
		// console.log(calcOp);

		// Calculation
		let calcResult = Number(calcNum[0]);
		for (let i = 0; i < calcOp.length; i++) {
			switch (calcOp[i]) {
				case '+':
					calcResult += Number(calcNum[i + 1]);
					console.log(i + ' + ' + calcResult);
					continue;
				case '-':
					calcResult -= Number(calcNum[i + 1]);
					console.log(i + ' - ' + calcResult);
					continue;
				case '/':
					// calcResult =
					if (calcResult !== 0) {
						calcResult = calcResult / Number(calcNum[i + 1]);
						console.log(
							`True ${i + 1}: ${calcResult} / ${Number(calcNum[i + 1])}`
						);
					} else {
						calcResult = Number(calcNum[i]) / calcResult;
						console.log(`True: ${Number(calcNum[i + 1])} / ${calcResult}`);
					}
					console.log(calcNum);
					continue;
				case 'X':
					// calcResult === 0 ? calcResult * 1 : calcResult;
					calcResult = calcResult * Number(calcNum[i + 1]);
					console.log(i + ' * ' + calcResult);
					continue;
				default:
					calcResult += 0;
			}
		}

		this.setState({
			// expression: calcResult.toString(),
			inputValue: this.state.inputValue + '=' + calcResult.toString(),
			showInput: calcResult.toString(),
			result: calcResult.toString(),
			xValue: calcResult.toString()
		});

		console.log(calcResult);
	}

	handleClick = e => {
		e.persist();

		const targetValue = e.target.getAttribute('value');
		const targetId = e.target.id;
		const targetClass = e.target.className;

		const myState = this.state;
		const lastInputValue = myState.inputValue
			? myState.inputValue[myState.inputValue.length - 1]
			: myState.inputValue;
		const lastItem = myState.showInput
			? myState.showInput[myState.showInput.length - 1]
			: myState.showInput;
		// const firstItem = myState.showInput[0];
		// const setValue = (attr, value) => {
		// 	const elm = document.getElementById(targetId);
		// 	elm.setAttribute(attr, value);
		// };
		// const elm = document.getElementById(targetId);
		// const isDecimal = myState.showInput.includes('.');
		// const siLength = myState.showInput.length;

		if (targetId === 'clear') {
			this.setState({
				result: '',
				inputValue: '',
				showInput: '0'
			});
		}

		if (targetId === 'delete') {
			this.setState({
				// expression: this.state.expression.slice(0, -1),
				inputValue: this.state.inputValue
					? this.state.inputValue.slice(0, -1)
					: this.state.inputValue,
				showInput: this.state.showInput
					? this.state.showInput.slice(0, -1)
					: this.state.showInput
			});
		}

		if (targetId === 'equals') {
			this.setState({
				// inputValue: this.state.inputValue + this.state.result,
				// showInput: this.state.result
				result: myState.inputValue
			});
			this.genrateToken();
			// console.log(myState.token);
		}

		if (targetClass.includes('digit')) {
			if (myState.operators.includes(lastItem)) {
				this.setState({
					showInput: targetValue,
					inputValue: myState.inputValue + targetValue
				});
			} else {
				this.setState({
					showInput: myState.showInput + targetValue,
					inputValue: myState.inputValue + targetValue
				});
			}
		}
		if (myState.result && targetClass.includes('operator')) {
			this.setState({
				result: '',
				showInput: targetValue,
				inputValue: this.state.result + targetValue
			});
			console.log(`result: ${myState.inputValue}`);
		} else if (myState.result && targetClass.includes('digit')) {
			this.setState({
				showInput: targetValue,
				inputValue: targetValue,
				result: ''
			});
			console.log(`result: digit`);
		}
		// first input 0 and clicked 0 then no update
		else if (
			myState.showInput[0] === '0' &&
			!myState.showInput.includes('.') &&
			targetId === 'zero'
		) {
			this.setState({
				showInput: targetValue,
				inputValue: myState.inputValue + ''
			});
			console.log(`myState.showInput[0] === '0' && targetId === 'zero'`);
		}
		// else if (myState.showInput[0] !== '0' && targetId === 'zero') {
		// 	this.setState({
		// 		showInput: targetValue,
		// 		inputValue: myState.inputValue + targetValue
		// 	});
		// 	console.log(`myState.inputValue[0] !== '0' && targetId === 'zero'`);
		// }
		else if (
			myState.showInput[0] === '0' &&
			targetId === 'decimal' &&
			!myState.inputValue
		) {
			this.setState({
				showInput: '0' + targetValue,
				inputValue: '0' + targetValue
			});
			console.log(targetValue);
			console.log(`myState.showInput[0] === '.' && targetId === 'decimal'`);
		} else if (myState.operators.includes(lastItem) && targetId === 'decimal') {
			this.setState({
				showInput: '0' + targetValue
				// inputValue: myState.inputValue + '0'
			});
			// this.setState({
			// 	inputValue: myState.inputValue + targetValue
			// });
			console.log(
				`myState.operators.includes(lastItem) && targetId === 'decimal'`
			);
		} else if (
			(myState.showInput[myState.showInput.length - 1] === '.' &&
				targetId === 'decimal') ||
			(myState.showInput.includes('.') && targetId === 'decimal')
		) {
			// setValue('style', 'pointer-events: none');
			this.setState({
				showInput: myState.showInput + '',
				inputValue: myState.inputValue + ''
			});
			console.log(`myState.showInput[myState.showInput.length - 1] === '.' &&
				targetId === 'decimal'`);
		}
		// else if (!myState.showInput.includes('.') && targetId === 'decimal') {
		// 	this.setState({
		// 		showInput: myState.showInput + targetValue,
		// 		inputValue: myState.inputValue + targetValue
		// 	});
		// 	console.log(`myState.showInput[myState.showInput.length - 1] !== '.' &&
		// 		targetId === 'decimal'`);
		// }
		else if (
			myState.showInput[0] === '0' &&
			!myState.showInput.includes('.') &&
			lastInputValue === '0' &&
			targetClass.includes('digit')
		) {
			this.setState({
				showInput: targetValue,
				inputValue: myState.inputValue.slice(0, -1) + targetValue
			});
			console.log('zero and digit');
		} else if (
			myState.showInput[0] === '0' &&
			!myState.showInput.includes('.') &&
			targetClass.includes('digit')
		) {
			this.setState({
				showInput: targetValue,
				inputValue: targetValue
			});
			console.log('zero and digit');
		}

		if (
			myState.showInput.length === 1 &&
			myState.showInput[0] === '0' &&
			targetId === 'subtract'
		) {
			this.setState({
				showInput: targetValue,
				inputValue: targetValue
			});
			console.log(`double operator: 1`);
		} else if (
			(lastItem === 'X' || lastItem === '/') &&
			targetId === 'subtract'
		) {
			this.setState({
				showInput: myState.showInput + targetValue,
				inputValue: myState.inputValue + targetValue
			});
			console.log(`double operator: 2`);
		} else if (
			myState.operators.includes(lastInputValue) &&
			myState.operators.includes(
				myState.inputValue[myState.inputValue.length - 2]
			) &&
			targetClass.includes('operator')
		) {
			this.setState({
				showInput: targetValue,
				inputValue: myState.inputValue.slice(0, -2) + targetValue
			});
		} else if (
			lastItem === targetValue &&
			myState.operators.includes(lastItem)
		) {
			this.setState({
				showInput: myState.showInput + '',
				inputValue: myState.inputValue + ''
			});
			console.log(`double operator: 3`);
		} else if (
			myState.operators.includes(lastItem) &&
			targetId !== 'subtract' &&
			targetClass.includes('operator')
		) {
			this.setState({
				showInput: targetValue,
				inputValue: myState.inputValue.slice(0, -1) + targetValue
			});
			console.log(
				`myState.operators.includes(lastItem) && targetId !== 'subtract'`
			);
		} else if (
			myState.digitKeys.includes(lastItem) &&
			targetClass.includes('operator') &&
			!myState.result
		) {
			this.setState({
				showInput: targetValue,
				inputValue: myState.inputValue + targetValue
			});
			console.log(`double operator: 5`);
		} else if (
			myState.operators.includes(lastItem) &&
			targetClass.includes('digit')
		) {
			this.setState({
				showInput: targetValue,
				inputValue: myState.inputValue + targetValue
			});
			console.log(`double operator: 6`);
		}

		// console.log(targetClass);
	};

	componentDidMount() {
		// this.setState({
		// 	expression: this.state.inputValue
		// });
		// this.genrateToken();
		// console.log(this.state.inputValue);
	}

	render() {
		return (
			<div className="wrapper d-flex justify-content-center align-items-center">
				<div className="calc-wrapper d-flex justify-content-around align-items-center flex-wrap">
					<div className="key-pad order-1 w-100 text-right bg-primary d-flex flex-column">
						{
							// <div className="expression output-screen">{this.state.result}</div>
						}
						<div className="input-value output-screen">
							{this.state.inputValue}
						</div>
						<div id="display" className="show-input output-screen">
							{this.state.showInput}
						</div>
					</div>
					<div
						onClick={this.handleClick}
						id="clear"
						className="key-pad control-key w-50 order-2 bg-danger">
						AC
					</div>
					<div
						onClick={this.handleClick}
						id="delete"
						className="key-pad control-key order-2 bg-warning">
						Del
					</div>
					<div
						onClick={this.handleClick}
						id="divide"
						value="/"
						className="key-pad operator order-2 bg-secondary">
						/
					</div>
					<div
						onClick={this.handleClick}
						id="seven"
						value="7"
						className="key-pad digit order-3">
						7
					</div>
					<div
						onClick={this.handleClick}
						id="eight"
						value="8"
						className="key-pad digit order-3">
						8
					</div>
					<div
						onClick={this.handleClick}
						id="nine"
						value="9"
						className="key-pad digit order-3">
						9
					</div>

					<div
						onClick={this.handleClick}
						id="multiply"
						value="X"
						className="key-pad operator order-3 bg-secondary">
						X
					</div>
					<div
						onClick={this.handleClick}
						id="four"
						value="4"
						className="key-pad digit order-4">
						4
					</div>
					<div
						onClick={this.handleClick}
						id="five"
						value="5"
						className="key-pad digit order-4">
						5
					</div>
					<div
						onClick={this.handleClick}
						id="six"
						value="6"
						className="key-pad digit order-4">
						6
					</div>

					<div
						onClick={this.handleClick}
						id="subtract"
						value="-"
						className="key-pad operator order-4 bg-secondary">
						-
					</div>
					<div
						onClick={this.handleClick}
						id="one"
						value="1"
						className="key-pad digit order-5">
						1
					</div>
					<div
						onClick={this.handleClick}
						id="two"
						value="2"
						className="key-pad digit order-5">
						2
					</div>
					<div
						onClick={this.handleClick}
						id="three"
						value="3"
						className="key-pad digit order-5">
						3
					</div>

					<div
						onClick={this.handleClick}
						id="add"
						value="+"
						className="key-pad operator order-5 bg-secondary">
						+
					</div>
					<div
						onClick={this.handleClick}
						id="zero"
						value="0"
						className="key-pad digit order-6">
						0
					</div>
					<div
						onClick={this.handleClick}
						id="decimal"
						value="."
						className="key-pad digit order-6">
						.
					</div>
					<div
						onClick={this.handleClick}
						id="equals"
						value="="
						className="key-pad w-50 order-6 bg-info">
						=
					</div>
				</div>
			</div>
		);
	}
}

// ReactDOM.render(<App />, document.querySelector('#app'))
