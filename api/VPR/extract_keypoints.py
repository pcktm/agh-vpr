import numpy as np
import torch
from pathlib import Path
from glob import glob
from models.superpoint import SuperPoint
from models.utils import read_image

torch.set_grad_enabled(False)

device = 'cuda' if torch.cuda.is_available() else 'cpu'
print('Running inference on device \"{}\"'.format(device))

config = {
  'nms_radius': 4,
  'keypoint_threshold': 0.005,
  'max_keypoints': 1024
}

superpoint = SuperPoint(config).eval().to(device)

for (i, img_path) in enumerate(glob('data/*')):
    print("Processing image {}".format(img_path))
    image, inp, scales = read_image(img_path, device, [640, 480], 0, 1)
    pred = superpoint({'image': inp})
    pred = {k: v[0].cpu().numpy() for k, v in pred.items()}
    kpts = pred['keypoints']
    np.savez_compressed(Path(img_path).with_suffix('.npz'), kpts)