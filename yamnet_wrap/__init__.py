import tensorflow as tf
import tensorflow_hub as hub
import csv
import io
import numpy as np


class YamnetWrap:

    target_sampling_rate = 16e3

    _model = None
    _class_names = None

    # Load the model.
    @staticmethod
    def get_model():
        if YamnetWrap._model is None:
            YamnetWrap._model = hub.load('https://tfhub.dev/google/yamnet/1')
        return YamnetWrap._model

    @staticmethod
    def class_names_from_csv(class_map_csv_text):
        """Returns list of class names corresponding to score vector."""
        class_map_csv = io.StringIO(class_map_csv_text)
        names = [display_name for (class_index, mid, display_name) in csv.reader(class_map_csv)]
        names = names[1:]  # Skip CSV header
        return names

    @staticmethod
    def get_class_names():
        if YamnetWrap._class_names is None:
            class_map_path = YamnetWrap.get_model().class_map_path().numpy()
            file_read = tf.io.read_file(class_map_path).numpy().decode('utf-8')
            YamnetWrap._class_names = YamnetWrap.class_names_from_csv(file_read)
        return YamnetWrap._class_names

    @staticmethod
    def get_top_scores(topn: int, scores) -> (np.ndarray, np.ndarray):
        """ Get the scores and labels of top N scores """
        class_names = YamnetWrap.get_class_names()
        mean_scores = scores.numpy().mean(axis=0)
        top_idx = np.argpartition(mean_scores, -topn, axis=0)[-topn:]
        classes_top = np.take_along_axis(np.array(class_names), top_idx, 0)
        scores_top = np.take_along_axis(mean_scores, top_idx, 0)
        top_idx_sorted = np.flip(np.argsort(scores_top))
        scores_top = np.take_along_axis(scores_top, top_idx_sorted, 0)
        classes_top = np.take_along_axis(classes_top, top_idx_sorted, 0)
        return classes_top, scores_top
