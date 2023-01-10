import pickle
import torch
import cv2

from glob import glob
from models.superpoint import SuperPoint
from models.utils import read_image
from preproces_image import calculate_kmeans, preproces_images
from BOVW import calculate_descriptors


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

        batch = {**pred1, **{k: v for k, v in pred1.items()}, 'image': inp1}

        images[f'{filename}'] = batch

        print(f'{index} - {filename}')

    return images


if __name__ == '__main__':
    files_from_database = glob("images_agh/*")
    files_from_user = glob("images_from_user/*")
    files = files_from_database + files_from_user
    images = extract_keypoints(files)

    # calculate_descriptors("images/*", "images_from_user/*", "data/descriptors.pkl")
    #
    with open('data_agh/images.pth', 'wb') as fp:
        torch.save(images, fp)

    # kmeans, images = calculate_kmeans()
    with open('data_agh/kmeans_bovw_model.pkl', 'rb') as fp:
        kmeans = pickle.load(fp)
    images = []
    for image_path in files:
        data = cv2.imread(image_path)
        data = cv2.cvtColor(data, cv2.COLOR_BGR2GRAY)
        images.append(data)

    preproces_images(images, kmeans)

    with open("data_agh/kmeans_bovw_model.pkl", "wb") as f:
        pickle.dump(kmeans, f)

