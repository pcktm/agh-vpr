import numpy as np
import cv2
import faiss


def features(image):
    extractor = cv2.SIFT_create()
    keypoints, descriptors = extractor.detectAndCompute(image, None)
    return descriptors


def multiprocessing_child(img_path):
    img = cv2.imread(img_path)
    des = features(img)
    return {
        "path": img_path,
        "descriptors": des
    }


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


def bow_and_tfidf(files, kmeans):

    for file in files:
        D, I = kmeans.index.search(file['descriptors'].astype(np.float32), 1)
        word_idx = I.flatten()
        bow = np.bincount(word_idx.ravel(), minlength=kmeans.centroids.shape[0])

        file['bow'] = bow

    df = np.zeros(kmeans.centroids.shape[0])
    for i, centroid in enumerate(kmeans.centroids):
        for file in files:
            if file['bow'][i] > 0:
                df[i] += 1

    df = df / len(files)

    for file in files:
        term_frequencies = file['bow'] / np.linalg.norm(file['bow'])
        file['tfidf'] = term_frequencies * np.log(1 / df)

    return files


def faiss_kmeans(descriptors):
    return faiss.Kmeans(descriptors.shape[1],
                        175,
                        niter=200,
                        nredo=3,
                        verbose=True,
                        gpu=True)
