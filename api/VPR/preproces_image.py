import pickle
import cv2

from glob import glob
from sklearn.cluster import KMeans
from BOVW import features, build_histogram, vstack_descriptors

# Bag of visual words
# defining feature extractor that we want to use

descriptor_list = []
images = []

images_paths1 = glob("images/*")
images_paths2 = glob("images_from_user/*")
images_paths = images_paths1 + images_paths2

for image_path in images_paths:
    data = cv2.imread(image_path)
    data = cv2.cvtColor(data, cv2.COLOR_BGR2GRAY)
    images.append(data)
    descriptor = features(data)
    descriptor_list.append(descriptor)

descriptor_list = vstack_descriptors(descriptor_list)

kmeans = KMeans(n_clusters=800)
kmeans.fit(descriptor_list)

preprocessed_image = []
for image in images:
    descriptor = features(image)
    if descriptor is not None:
        histogram = build_histogram(descriptor, kmeans)
        preprocessed_image.append(histogram)

with open("data/kmeans_bovw_model.pkl", "wb") as f:
    pickle.dump(kmeans, f)

with open("data/images_paths.pkl", "wb") as f:
    pickle.dump(images_paths, f)

with open("data/preprocessed_image.pkl", "wb") as f:
    pickle.dump(preprocessed_image, f)

