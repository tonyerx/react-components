import React from 'react'
import ReactDOM from 'react-dom'
import './style'

let el = null
let closeCallback = null
let isSupportAnimationEvent = typeof window['AnimationEvent'] === 'function'

// Dialog组件
const _clickBtn = (callback, holdOn) => function () {
	if (!holdOn) {
		closeCallback = callback
		el.children[0].className = 'base-dialog out'
		// if (!'onanimationend' in window || !'onwebkitanimationend' in window) {
		if (!isSupportAnimationEvent) {
			setTimeout(_close, 500)
		}
		return
	}
	callback && callback()
}

function _animationEnd(e) {
	if (e.animationName === 'fadeOut') {
		_close()
	}
}

const DialogComponent = ({ title, content, buttonList }) => (
	<div className="base-dialog in" onAnimationEnd={_animationEnd}>
		<div className="dialog-body">
			<div className="dialog-wrap">
				<h4 className="dialog-title">{title}</h4>
				<p className="dialog-content">{content}</p>
				<div className="dialog-btns">
					{
						buttonList.length > 0 && buttonList.map((v, i) => (
							<button
								onClick={_clickBtn(v.callback, v.holdOn)}
								className="dialog-btn"
								style={v.style || {}}
								key={i}
							>
								{ v.text }
							</button>
						))
					}
				</div>
			</div>
		</div>
	</div>
)

function _getOpts(opts) {
	const defaultOpts = {
		title: '提示',
		content: '',
		btns: [{ text: '确定' }]
	}
	return Object.assign({}, defaultOpts, opts)
}

function _renderDialog(opts) {
	const container = document.createElement('div')
	container.className = `base-dialog-${Date.now()}`
	document.body.appendChild(container)

	const ref = ReactDOM.render(
		<DialogComponent {..._getOpts(opts)} />,
		container
	)

	el = container

	return { ref, container }
}

function _close() {
	closeCallback && closeCallback();
	destroy()
}

function show(opts) {
	destroy()
	return _renderDialog(opts)
}

function destroy() {
	if (el) {
		document.body.removeChild(el)
		el = null
	}
	closeCallback = null
}


export default {
	show,
	destroy
}