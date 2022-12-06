import pickle
import torch
import cv2

from glob import glob
from models.superpoint import SuperPoint
from models.utils import read_image


def extract_keypoints(list_files):

    torch.set_grad_enabled(False)

    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f'Using device {device}')

    config = {
        'superpoint': {
            'nms_radius': 4,
            'keypoint_threshold': 0.005,
            'max_keypoints': 1024
        }
    }

    superpoint = SuperPoint(config.get('superpoint', {})).to(device)

    images = {}

    for index, filename in enumerate(list_files):

        image = cv2.imread(filename)
        image1, inp1, scales1 = read_image(image, device, [640, 480], 0, 1)

        pred1 = superpoint({'image': inp1})

        batch = {**pred1, **{k: v for k, v in pred1.items()}}

        images[f'{filename}'] = batch

        print(f'{index} - {filename}')

    return images


files_from_database = [x for x in glob("images/*")]
files_from_user = [x for x in glob("images_from_user/*")]
files = files_from_database + files_from_user
images = extract_keypoints(files)

with open('data/images.p', 'wb') as fp:
    pickle.dump(images, fp, protocol=pickle.HIGHEST_PROTOCOL)
