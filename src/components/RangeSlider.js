import React, { Component } from 'react'
import 'react-rangeslider/lib/index.css'
import InputRange from 'react-input-range'
import 'react-input-range/lib/css/index.css'

class RangeSlider extends Component {
  constructor(props) {
    super(props)
    this.parent = this.props.parent
    this.state = {
      value: {
        min: 2,
        max: 10,
      }
    }
    this.min = 2
    this.max = 10
  }

  deepCopy(inObject) {
    let outObject, value, key

    if (typeof inObject !== "object" || inObject === null) {
      return inObject // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {}

    for (key in inObject) {
      value = inObject[key]

      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = this.deepCopy(value)
    }

    return outObject
  }

  handleChange(value) {
    this.setState({ value: value })
  };

  updateParent() {
    let objStore = this.deepCopy(this.parent.state)

    for (let key in objStore) {
      if (['countDown', 'dummy', 'tempMovieList', 'genre', 'search', 'functionality'].includes(key)) continue

      objStore[key]['results'] = objStore[key]['results'].filter((movie) => {
        return (movie.vote_average <= this.state.value.max) && (movie.vote_average >= this.state.value.min)
      })
    }

    this.parent.setState({ ...this.parent.state, tempMovieList: objStore, functionality: 'search' })
  }

  render() {
    return (
      <div className='dn-slider'>
        <InputRange minValue={this.min} maxValue={this.max} value={this.state.value}
          onChange={this.handleChange.bind(this)} onChangeComplete={this.updateParent.bind(this)} />

        <div className='value text-center'>{`Rating: ${this.state.value.min}-${this.state.value.max}`}</div>
      </div>
    )
  }
}

export default RangeSlider