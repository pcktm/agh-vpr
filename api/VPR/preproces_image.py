import pickle
import cv2

from glob import glob
from sklearn.cluster import KMeans
from BOVW import features, build_histogram, vstack_descriptors

# Bag of visual words
# defining feature extractor that we want to use


def calculate_kmeans():
    descriptor_list = []
    images = []

    images_paths1 = glob("images/*")
    images_paths2 = glob("images_from_user/*")
    images_paths3 = glob("images_agh/*")
    images_paths = images_paths2 + images_paths3

    for image_path in images_paths1:
        data = cv2.imread(image_path)
        data = cv2.cvtColor(data, cv2.COLOR_BGR2GRAY)
        descriptor = features(data)
        descriptor_list.append(descriptor)

    for image_path in images_paths:
        data = cv2.imread(image_path)
        data = cv2.cvtColor(data, cv2.COLOR_BGR2GRAY)
        images.append(data)
        descriptor = features(data)
        descriptor_list.append(descriptor)

    descriptor_list = vstack_descriptors(descriptor_list)

    kmeans = KMeans(n_clusters=175)
    kmeans.fit(descriptor_list)

    with open("data_agh/images_paths.pkl", "wb") as f:
        pickle.dump(images_paths, f)

    return kmeans, images


def preproces_images(images, kmeans):

    preprocessed_image = []
    for image in images:
        descriptor = features(image)
        if descriptor is not None:
            histogram = build_histogram(descriptor, kmeans)
            preprocessed_image.append(histogram)

    with open("data_agh/preprocessed_image.pkl", "wb") as f:
        pickle.dump(preprocessed_image, f)

