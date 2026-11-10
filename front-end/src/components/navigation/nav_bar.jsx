import '@/styles/component style/navigation.css'

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
				<div key={o.id} className="navButton" onClick={o.callback}>
					<p>{o.options}</p>
					{o.image
						? <img src={o.image} alt={o.options} className="ButtonIcon" />
						: o.content}
				</div>
			))}
		</div>
	)

}

export function Floating (called){
	return (
		<div className="floating">
			{called.objects.map(o => {
				<div className="navButton"
					 onClick={o.callback}>
					{o.options}
				</div>
			})}
		</div>
	)
}

export function LeftBar() {
	return (
		<Bar objects={[
			{options : 'hello', image : '', callback : undefined},
			{options : 'bye', image : '', callback : undefined},
		]}/>
	)
}