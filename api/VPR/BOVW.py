import numpy as np


def features(image, extractor):
    keypoints, descriptors = extractor.detectAndCompute(image, None)
    return keypoints, descriptors


def vstack_descriptors(descriptor_list_):
    if len(descriptor_list_) > 0:
        descriptors = np.array(descriptor_list_[0])
        for descriptor in descriptor_list_[1:]:
            descriptors = np.vstack((descriptors, descriptor))
        return descriptors


def build_histogram(descriptor_list_, cluster_alg):
    histogram = np.zeros(len(cluster_alg.cluster_centers_))
    cluster_result = cluster_alg.predict(descriptor_list_)
    for i in cluster_result:
        histogram[i] += 1.0
    return histogram


