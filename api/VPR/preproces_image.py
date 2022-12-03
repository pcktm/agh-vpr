import pickle
import cv2

from glob import glob
from sklearn.cluster import KMeans
from BOVW import features, build_histogram, vstack_descriptors

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


with open("data/kmeans_bovw_model.pkl", "wb") as f:
    pickle.dump(kmeans, f)

with open("data/images_paths.pkl", "wb") as f:
    pickle.dump(images_paths, f)

extractor = cv2.xfeatures2d.SIFT_create()

preprocessed_image = []

for image_path in images_paths:
    image = cv2.imread(f"{image_path}")
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    keypoint, descriptor = features(image, extractor)
    if descriptor is not None:
        histogram = build_histogram(descriptor, kmeans)
        preprocessed_image.append(histogram)

with open("data/preprocessed_image.pkl", "wb") as f:
    pickle.dump(preprocessed_image, f)

