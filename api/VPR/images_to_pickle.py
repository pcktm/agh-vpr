import pickle
import torch
import cv2

from glob import glob
from models.superpoint import SuperPoint
from models.utils import read_image
from sklearn.cluster import KMeans
from BOVW import features, build_histogram, vstack_descriptors


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

for index, filename in enumerate(glob('images/*')):
    image1, inp1, scales1 = read_image(filename, device, [640, 480], 0, 1)
    pred['image'] = inp1
    pred1 = superpoint({'image': inp1})
    pred = {**pred, **{k: v for k, v in pred1.items()}}
    images[f'{filename}'] = pred
# print(images)

with open('../images.p', 'wb') as fp:
    pickle.dump(images, fp, protocol=pickle.HIGHEST_PROTOCOL)

# Bag of visual words
# defining feature extractor that we want to use
extractor = cv2.xfeatures2d.SIFT_create()

descriptor_list = []
images = []
images_paths = []

for image_path in glob("images/*"):
    images_paths.append(image_path)
    data = cv2.imread(image_path)
    data = cv2.cvtColor(data, cv2.COLOR_BGR2GRAY)
    images.append(data)
    keypoint, descriptor = features(data, extractor)
    descriptor_list.append(descriptor)

descriptor_list = vstack_descriptors(descriptor_list)

kmeans = KMeans(n_clusters=800)
kmeans.fit(descriptor_list)

preprocessed_image = []
for image in images:
    keypoint, descriptor = features(image, extractor)
    if descriptor is not None:
        histogram = build_histogram(descriptor, kmeans)
        preprocessed_image.append(histogram)


with open("kmeans_bovw_model.pkl", "wb") as f:
    pickle.dump(kmeans, f)

with open("images_paths.pkl", "wb") as f:
    pickle.dump(images_paths, f)
