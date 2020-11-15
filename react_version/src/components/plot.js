import React, { Component } from 'react'
import Plot from 'react-plotly.js';

class LinePlot extends Component{

    constructor(props){
        super(props);

        let template = {
            layout: {
                "colorway": [
                    "#636efa",
                    "#EF553B",
                    "#00cc96",
                    "#ab63fa",
                    "#FFA15A",
                    "#19d3f3",
                    "#FF6692",
                    "#B6E880",
                    "#FF97FF",
                    "#FECB52"
                ],
                "font": {
                    "color": "#2a3f5f"
                },
                "hovermode": "closest",
                "hoverlabel": {
                    "align": "left"
                },
                "paper_bgcolor": "white",
                "plot_bgcolor": "#E5ECF6",
                "coloraxis": {
                    "colorbar": {
                        "outlinewidth": 0,
                        "ticks": ""
                    }
                },
                "xaxis": {
                    "gridcolor": "white",
                    "linecolor": "white",
                    "ticks": "",
                    "title": {
                        "standoff": 15
                    },
                    "zerolinecolor": "white",
                    "automargin": true,
                    "zerolinewidth": 2
                },
                "yaxis": {
                    "gridcolor": "white",
                    "linecolor": "white",
                    "ticks": "",
                    "title": {
                        "standoff": 15
                    },
                    "zerolinecolor": "white",
                    "automargin": true,
                    "zerolinewidth": 2
                },
                "scene": {
                    "xaxis": {
                        "backgroundcolor": "#E5ECF6",
                        "gridcolor": "white",
                        "linecolor": "white",
                        "showbackground": true,
                        "ticks": "",
                        "zerolinecolor": "white",
                        "gridwidth": 2
                    },
                    "yaxis": {
                        "backgroundcolor": "#E5ECF6",
                        "gridcolor": "white",
                        "linecolor": "white",
                        "showbackground": true,
                        "ticks": "",
                        "zerolinecolor": "white",
                        "gridwidth": 2
                    },
                    "zaxis": {
                        "backgroundcolor": "#E5ECF6",
                        "gridcolor": "white",
                        "linecolor": "white",
                        "showbackground": true,
                        "ticks": "",
                        "zerolinecolor": "white",
                        "gridwidth": 2
                    }
                },
                "shapedefaults": {
                    "line": {
                        "color": "#2a3f5f"
                    }
                },
                "annotationdefaults": {
                    "arrowcolor": "#2a3f5f",
                    "arrowhead": 0,
                    "arrowwidth": 1
                },
                "geo": {
                    "bgcolor": "white",
                    "landcolor": "#E5ECF6",
                    "subunitcolor": "white",
                    "showland": true,
                    "showlakes": true,
                    "lakecolor": "white"
                },
                "title": {
                    "x": 0.05
                },
                "mapbox": {
                    "style": "light"
                }
            }
        }

        this.state = {
           data: [{ x: props.x, y: props.y, type: 'scatter', mode: 'lines'}],
           layout: {title: props.title, height: 300, autosize: true, margin: {l: 10, r: 10, b: 30, t: 40},
                    template: template}
        }
    }


    render() {
            return <Plot
                       data={this.state.data}
                       layout={this.state.layout}
                       useResizeHandler
                       style={{ width: "100%" }}
                       onInitialized={(figure) => this.setState(figure)}
                       onUpdate={(figure) => this.setState(figure)}
                    />
    }
}

export default LinePlot;