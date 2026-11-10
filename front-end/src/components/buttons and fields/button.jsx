import '@/styles/component style/button.css'

export default function Button(called) {
	let displayed
	if (called.image == "true") {
		displayed = <img src={called.shown}/>
	} else {
		displayed = called.shown
	}

	return (
		<div className = {called.className}>
			<button name={called.name}
					onClick={called.callback}
					type={called.type}
					disabled={called.disabled}>
				{displayed}
			</button>
		</div>
	)

}