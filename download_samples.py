from yamnet_wrap.samples import samples

import requests
from pathlib import Path

data_paths = [Path('dash_version/assets/samples'), Path('react_version/public/samples')]

for sample in samples:
    r = requests.get(sample['download_url'], allow_redirects=True)
    if r.status_code == 200:
        for path in data_paths:
            fh = open(path / sample['file'], 'wb')
            fh.write(r.content)
            fh.close()
        print('Saved:', sample['title'])
    else:
        print('Fail to download:', r['title'])
