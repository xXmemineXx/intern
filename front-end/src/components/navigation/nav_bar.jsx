import '@/styles/component style/navigation.css'
import {useRef} from 'react'

export function Bar({ objects = [], direction = ""}) {
	let position = "lateralBar"
	if (direction == "top") {
		position = "topBar"
	} else if(direction == "right") {
		position = "rightBar"
	} else if (direction == "bottom"){
		position = "bottomBar"
	} else if (direction == "left") {
		position = "lateralBar"
	}

	return (
		<div className={position}>
			{objects.map(o => (
				<div key={o.id} className="navButton" ref={o.ref} onClick={o.callback}>
					<p>{o.options}</p>
					{o.image
						? <img src={o.image} alt={o.options} className="ButtonIcon" />
						: o.content}
				</div>
			))}
		</div>
	)

}

export function Floating ({objects = []}){
	return (
		<div className="floating">
			{objects.map(o => (
				<div key={o.id} className="navButton" ref={o.ref} onClick={o.callback}>
					<p>{o.options}</p>
					{o.image
						? <img src={o.image} alt={o.options} className="ButtonIcon" />
						: o.content}
				</div>
			))}
		</div>
	)
}