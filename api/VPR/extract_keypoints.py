import pickle
import torch

from glob import glob
from models.superpoint import SuperPoint
from models.utils import read_image


device = 'cuda' if torch.cuda.is_available() else 'cpu'

config = {
    'superpoint': {
        'nms_radius': 4,
        'keypoint_threshold': 0.005,
        'max_keypoints': 1024
    }
}

superpoint = SuperPoint(config.get('superpoint', {}))

images = {}
pred = {}

for index, filename in enumerate(glob('../../../../../../../Downloads/eee/help/images/*')):
    image1, inp1, scales1 = read_image(filename, device, [640, 480], 0, 1)
    pred['image'] = inp1
    pred1 = superpoint({'image': inp1})
    pred = {**pred, **{k: v for k, v in pred1.items()}}
    images[f'{filename}'] = pred
# print(images)

with open('VPR/data/images.p', 'wb') as fp:
    pickle.dump(images, fp, protocol=pickle.HIGHEST_PROTOCOL)
