
import React from 'react'
import ReactDOM from 'react-dom'
import './style'

let el = null
let globalOpts = {}
let isSupportAnimationEvent = typeof window['AnimationEvent'] === 'function'

// Notice组件
function _animationEnd(e) {
	if (e.animationName === 'fadeIn') {
		setTimeout(_hide, globalOpts.duration)
	}
	if (e.animationName === 'fadeOut') {
		_close()
	}
}

function _preventDefault(e) {
	e.preventDefault()
	e.stopPropagation()
}

const NoticeComponent = ({ mask, content, duration }) => (
	<div
      className="base-notice in"
      onAnimationEnd={duration !== 0 ? _animationEnd : undefined}
      onClick={mask ? _preventDefault : undefined}
      style={
        mask
          ? {
              position: 'fixed',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0
            }
          : {}
      }
    >
      <div className="content">{content}</div>
    </div>
)

const LoadingComponent = (
	<div className="loading-wrapper">
		+
	</div>
)

function _renderNotice(opts) {
	const container = document.createElement('div')
	container.className = `base-notice-${Date.now()}`
	document.body.appendChild(container)

	const ref = ReactDOM.render(
		<NoticeComponent {...opts} />,
		container
	)

	el = container

	return { ref, container }
}

function _hide() {
	el.children[0].className = 'base-notice out'
}

function _close() {
	globalOpts.onClose && globalOpts.onClose();
	destroy()
}

function _show(opts) {
	destroy()
	globalOpts = opts
	const ret = _renderNotice(globalOpts)
	// 当前环境不支持AnimationEvent，无法通过animationEnd驱动流程执行，换用定时器处理
	if (!isSupportAnimationEvent && globalOpts.duration !== 0) {
		setTimeout(() => {
			setTimeout(() => {
				_hide()
				setTimeout(_close, 400)
			}, globalOpts.duration)
		}, 300)
	}
	return ret
}

function destroy() {
	if (el) {
		document.body.removeChild(el)
		el = null
	}
	globalOpts = {}
}


export default {
	loading: function() {
		_show({content: LoadingComponent, duration: 0, mask: true})
	},
	toast: function(content, duration = 1500, onClose) {
		_show({content, duration, onClose, mask: false})
	},
	destroy
}