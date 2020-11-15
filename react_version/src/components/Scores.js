import LinePlot from './plot'
import {API_URL_INFER} from '../config'

import { Component } from 'react'
import axios from 'axios'
import Spinner from 'react-bootstrap/Spinner';

// Display waveform and scores based on server side inference of the selected audio sample
class Scores extends Component{

    constructor(props){
        super(props)
        this.state = {
            status: 'init',
            timeline: [],
            waveform: [],
            classes: [],
            scores: [],
            subtitle: ''
        }
     }

    // Asynchronously download sample file using Axios
    getSample(file){
        if (file) {
            this.setState({subtitle: 'Performing inference on sample...',
                           status: 'loading'
                           })
            axios.get(`${API_URL_INFER}?file=${file}`)
                  .then(({ data }) => {
                    // Build timeline given length of waveform and sample rate
                    let timeline = []
                    const dt = 1 / data.sample_rate
                    for(var i=0; i < data.waveform.length; i+=1){
                        timeline.push(i*dt)
                    }

                    this.setState({
                      timeline: timeline,
                      waveform: data.waveform,
                      classes: data.classes,
                      scores: data.scores,
                      status: 'success',
                      subtitle: 'Best average score: ' + data.classes[0]
                    })
                  })
                  .catch(() => this.setState({
                    status: 'error'
                   }))
        }
        else {
            // Clear selection
            this.setState({subtitle: null, status: 'init'})
        }
    }

    componentDidMount() {
        this.getSample(this.props.sample)
    }

    componentDidUpdate(prevProps){
        if(prevProps.sample !== this.props.sample){
            this.getSample(this.props.sample)
        }
    }

    render() {
        return (
          <div>
            <h3>{this.state.subtitle}</h3>
            {this.state.status === 'error' && <h3>Error while infering sample</h3>}
            {this.state.status === 'loading' && <Spinner animation="border" />}
            {this.state.status === 'success' && <div>
                <LinePlot x={this.state.timeline} y={this.state.waveform} title='Waveform' />
                <LinePlot x={this.state.classes} y={this.state.scores} title={'Scores: top-' + this.state.classes.length} />
            </div>}
          </div>
        )
    }
}

export default Scores