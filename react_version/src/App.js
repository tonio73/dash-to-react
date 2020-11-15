import Scores from './components/Scores'
import SampleList from './components/SampleList'
import {API_URL_SAMPLE_DOWNLOAD} from './config'

import {Component} from 'react'
import {Row, Col} from 'react-bootstrap'
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedSample: '',
            selectedSampleUrl: ''
        }
    }

    // A sample audio file is selected
    select = (sample) => {
        let url = ''
        if(sample){
            url = API_URL_SAMPLE_DOWNLOAD + '/' + sample
        }
        this.setState({
            selectedSample: sample,
            selectedSampleUrl: url
        })
    }

    render() {
      return (
        <Container>
        <div className="container">
            <Jumbotron>
                <h1 className='mb-3'>Sound recognition with Yamnet</h1>
                <form>
                    <Row className='align-items-center mb-3'>
                        <Col md={6}>
                            <SampleList onSelect={this.select}/>
                        </Col>
                        <Col md={6}>
                            <audio controls src={this.state.selectedSampleUrl}/>
                        </Col>
                    </Row>
                </form>
                <Scores sample={this.state.selectedSample} />
            </Jumbotron>
        </div>
        </Container>
      );
    }
}

export default App;
