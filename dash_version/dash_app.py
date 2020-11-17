"""
    Dash implementation of the dashboard showing YAMNet inference results
"""

from pathlib import Path
import os

from yamnet_wrap import YamnetWrap
from yamnet_wrap.samples import samples

from dash import Dash
from dash.exceptions import PreventUpdate
from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_html_components as html
import dash_bootstrap_components as dbc
import plotly.graph_objects as go
import numpy as np
import librosa

own_path = Path(os.path.abspath(os.path.dirname(__file__)))
data_path = Path('assets/samples')

# Dash application
app = Dash(__name__,
           title='Inference with Yamnet',
           external_stylesheets=[dbc.themes.BOOTSTRAP])


def main():
    """ Setup the layout of the Dash application """
    select_file_options = [{'value': s['file'], 'label': s['title']} for s in samples]

    app.layout = dbc.Container(
        dbc.Jumbotron([
            html.H1('Sound recognition with Yamnet', className='mb-3'),
            dbc.Row([dbc.Col(dcc.Dropdown(id='select-file', options=select_file_options, value='',
                                          persistence=True, persistence_type='session'), width='md-6'),
                     dbc.Col(html.Audio(id='listen', controls=True), width='md-6')],
                    className='align-items-center mb-3'),
            html.H3(id='subtitle'),
            dcc.Loading(
                html.Div(id='graph_wrapper',
                         children=[dcc.Graph(id='waveform'),
                                   dcc.Graph(id='scores')])
            )
        ])
    )
    return app.server


@app.callback(Output('listen', 'src'),
              [Input('select-file', 'value')])
def select_audio(file_name):
    """ Set the URL of the audio player """
    if file_name is None or file_name == '':
        raise PreventUpdate

    file_url = str(data_path / file_name)
    return file_url


@app.callback(Output('graph_wrapper', 'hidden'),
              [Input('select-file', 'value')])
def show_graphs(file_name):
    """ Hide the plots when no file is selected """
    return file_name is None or file_name == ''


@app.callback([Output('subtitle', 'children'),
               Output('waveform', 'figure'),
               Output('scores', 'figure')],
              [Input('select-file', 'value')])
def select_file(file_name):
    """ Select a file => set subtitle and plots """
    if file_name is None or file_name == '':
        raise PreventUpdate

    file_path = str(own_path / data_path / file_name)

    # Read MP3 as mono at 16kHz
    waveform, sampling_rate = librosa.load(file_path, mono=True, sr=YamnetWrap.target_sampling_rate, duration=10)
    duration = len(waveform) / sampling_rate

    # Run the model, check the output.
    model = YamnetWrap.get_model()
    scores, embeddings, log_mel_spectrogram = model(waveform)

    topn = 20
    classes_top, scores_top = YamnetWrap.get_top_scores(topn, scores)

    figure_margins = dict(l=10, r=10, b=30, t=40)
    fig_time = go.Figure(layout=dict(title='Waveform', margin=figure_margins, height=300, xaxis=dict(title='Time [s]')))
    fig_time.add_scatter(x=np.arange(0, duration, 1 / sampling_rate), y=waveform)
    fig_score = go.Figure(layout=dict(title=f'Scores: top-{topn}', margin=figure_margins, height=300))
    fig_score.add_scatter(x=classes_top, y=scores_top)

    subtitle = f'Best average score: {classes_top[0]}'
    return subtitle, fig_time, fig_score


if __name__ == '__main__':
    main()
    app.run_server(debug=True)
