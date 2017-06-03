import React from 'react'
import {render} from 'react-dom'
import {App} from './pages/App'

window.React = React

// Render the main component into the dom
render(<App />, document.getElementById('app'))
