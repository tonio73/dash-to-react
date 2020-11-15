import {API_URL_SAMPLES} from '../config'

import React, { Component } from 'react'
import axios from 'axios'

class SampleList extends Component {

    constructor(props){
        super(props);

        this.state = {
            onSelect: props.onSelect,
            options: []
        }
    }

    get_samples() {
            axios.get(`${API_URL_SAMPLES}`)
                          .then(({ data }) => {
                            this.setState({
                              options: [<option value='' key="no-selection">Please select...</option>]
                                  .concat(data.map(r => (
                                         <option value={r.file} key={r.file}>{r.title}</option>
                                      )))
                            })
                          })
                          .catch(() => this.setState({ error: true }))
    }

    componentDidMount() {
        this.get_samples()
    }

    select = (event) => {
       this.state.onSelect(event.target.value)
    }

    render() {
        return <select className='form-control' onChange={this.select}>{this.state.options}</select>
    }
}

export default SampleList