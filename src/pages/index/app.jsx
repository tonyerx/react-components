import React from 'react'
import './app.less'

import Dialog from '@components/Dialog'
import Notice from '@components/Notice'

export default () => (
  <div>
    App
    <button onClick={() => {
      Dialog.show({title: 'test', content: 'test words', buttonList: [
        {text: 'sure'}
      ]})
    }}>开启弹窗</button>
    <button onClick={() => {
      Dialog.show({title: 'test2', content: 'test words2', buttonList: [
        {text: 'sure2', callback: () => { console.log(33333) }}
      ]})
    }}>开启弹窗2</button>
    <button onClick={() => {
      Notice.toast('恭喜测试通过', 3000, () => { console.log('测试测试') })
    }}>开启toast</button>
    <button onClick={() => {
      Notice.loading()
      setTimeout(Notice.destroy, 5000)
    }}>开启loading</button>
  </div>
)
