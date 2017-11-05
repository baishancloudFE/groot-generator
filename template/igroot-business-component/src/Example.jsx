import React from 'react'
import { Button } from 'igroot'

export default class Example extends React.Component {
  render() {
    return (
      <div>
        <Button onClick={() => console.log('Hello World!')}>{this.props.title || 'Example'}</Button>
      </div>
    )
  }
}