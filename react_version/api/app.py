from yamnet_wrap import YamnetWrap
from yamnet_wrap.samples import samples

from flask import Flask, request, jsonify
import librosa
from pathlib import Path
import os

own_path = Path(os.path.abspath(os.path.dirname(__file__)))
# Local path to the samples
data_path = Path('../public/samples')

app = Flask(__name__)


@app.route('/api/samples', methods=['GET'])
def get_sample_list():
    return jsonify(samples)


@app.route('/api/infer', methods=['GET'])
def inference():
    file_name = request.args.get('file')

    if file_name not in map(lambda s: s['file'], samples):
        return 'Sample not found', 404

    file_path = str(own_path / data_path / file_name)

    # Read MP3 as mono at 16kHz
    waveform, sampling_rate = librosa.load(file_path, mono=True, sr=YamnetWrap.target_sampling_rate, duration=10)

    # Run the model, check the output.
    model = YamnetWrap.get_model()
    scores, embeddings, log_mel_spectrogram = model(waveform)

    topn = 20
    classes_top, scores_top = YamnetWrap.get_top_scores(topn, scores)

    return {'sample_rate': YamnetWrap.target_sampling_rate,
            'waveform': waveform.tolist(),
            'classes': classes_top.tolist(),
            'scores': scores_top.tolist()
            }


if __name__ == '__main__':
    app.run(debug=True)
