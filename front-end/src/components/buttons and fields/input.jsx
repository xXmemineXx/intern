
import Button from '@/components/buttons and fields/button'
import {useState} from 'react'

import '@/styles/component style/text_input.css'
import showen from '@/assets/show.png'
import hidden from '@/assets/hidden.png'

export default function Text_input(in_type) {
	let plc
	const [show, setShow] = useState(false)

	if (in_type.placeholder === undefined) {
		plc = ""
	} else {
		plc = in_type.placeholder
	}
	
	const [code, setCode] = useState('+261')
	const [number, setNumber] = useState('')

	function updatePhone(newCode, newNumber) {
		setCode(newCode)
		setNumber(newNumber)
		in_type.onChange?.({ target: { value: newCode + newNumber } })
	}

	if (in_type.type == "password") {
		return (
			<div className="in_holder">
				<label for={in_type.name}> {in_type.label} </label>
				<input type={show ? "text" : "password"} 
						name={in_type.name} 
						placeholder={plc}
						className="input"
						onChange={in_type.onChange}>
				</input>
				<button className="hide"
						onClick={ (e) => {
							e.preventDefault()
							setShow(s => !s)
						} }>
					<img src={show ? showen : hidden}/>
				</button>
			</div>
		)
	} else if (in_type.type == "tel") {

		const phoneCodes = [
			{ value: '+261', label: '🇲🇬 +261 Madagascar' },
			{ value: '+262', label: '🇷🇪 +262 Réunion' },
			{ value: '+230', label: '🇲🇺 +230 Maurice' },
			{ value: '+269', label: '🇰🇲 +269 Comores' },
			{ value: '+33',  label: '🇫🇷 +33 France' },
			{ value: '+32',  label: '🇧🇪 +32 Belgique' },
			{ value: '+41',  label: '🇨🇭 +41 Suisse' },
			{ value: '+1',   label: '🇺🇸 +1 États-Unis / Canada' },
			{ value: '+44',  label: '🇬🇧 +44 Royaume-Uni' },
			{ value: '+49',  label: '🇩🇪 +49 Allemagne' },
			{ value: '+27',  label: '🇿🇦 +27 Afrique du Sud' },
			{ value: '+86',  label: '🇨🇳 +86 Chine' },
			{ value: '+91',  label: '🇮🇳 +91 Inde' },
		]

		return (
			<div className="phone">
				<select className="dropDown"
						onChange={e => updatePhone(e.target.value, number)}>
					{phoneCodes.map(o => (
						<option key={o.value} value={o.value} 
								className="dropDown">
							{o.label}
						</option>
					))}
				</select>
				<div className="in_holder">
					<label for={in_type.name}> {in_type.label} </label>
					<input className="input"
							type={in_type.type}
							pattern="[0-9 ]{9,10}"
							maxLength={9}
							value={number}
							inputMode="numeric"
							onChange={e => updatePhone(code, e.target.value.replace(/\D/g, ''))}>
					</input>
				</div>
			</div>
		)
	} else if (in_type.type == "select")  {
		return (
			<div className="in_holder">
				<label for={in_type.name}> {in_type.label} </label>
				<select className="input" id={in_type.name} name={in_type.name} value={in_type.value} onChange={in_type.onChange}>
					{in_type.options.map(o => (
						<option key={o.value} value={o.value} className="input">
							{o.label}
						</option>
					))}
				</select>
			</div>
		)
	}

	return (
		<div className="in_holder">
			<label for={in_type.name}> {in_type.label} </label>
			<input 	className="input"
					type={in_type.type}
					name={in_type.name}
					placeholder={plc}
					onChange={in_type.onChange}>
			</input>
		</div>
	)
}