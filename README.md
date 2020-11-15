# Plotly Dash to React

This repository is showing a side by side example of implementing a dashboard with Plotly Dash or with React and React-Plotly. 
The test application is exposing a deep-learning model to perform inference on audio files. 
The selected model is [YAMNet](https://github.com/tensorflow/models/tree/master/research/audioset/yamnet), an audio classifier based on Mobilenet and trained on [AudioSet](https://research.google.com/audioset/), a 2 million dataset of 10s audio samples. 

## Content

- `dash_version/`: a Python application based on Plotly Dash and served by Flask development server
- `react_version/`: a React browser application with a Web API server based on Flask

## Install

### Python environment

Python 3.7 and Pip are required. The favored install is through Conda.

Python dependencies are listed in the the file `conda-env.yaml`, they are mainly Dash, Tensorflow and Tensorflow-hub.
If you do not use Conda, you may easily create a `requirements.txt` from the YAML file.

```shell script
conda env create -f conda-env.yaml
```

There is a package shared by the two Flask application: `yamnet_wrap`. 
This package is loading and calling the YAMNet model and is performing a few statics on the returned scores.

To locally install the package:

```shell script
pip install -e .
```

### React environment

NPM and Yarn are pre-requisite.

To install the dependencies:
```shell script
cd react_version
npm install
```

### Sound samples

Sound samples are dowloaded into both application static directory:
- `dash_version/assets/samples/`
- `react_version/public/samples/`

An helper script is provided to populate these directories using some audio samples from 
[Global Biodiversity Information Facility](https://www.gbif.org):

```shell script
python ./download_samples.py
```

## Run the applications

### Run the Dash app in development

```shell script
cd dash_version 
python dash_app.py
```

Open browser on `http://localhost/8050`

### Run the React app

#### Run the API server

From a terminal:

```shell script
cd react_version/api
python app.py
```

Check opening in a browser (or with curl) `http://localhost:5000/infer?file=Panthera_pardus_S0962_05_short.mp3`


#### Run the React app in development with Yarn

From a different terminal:

````shell script
cd react_version
yarn start
````