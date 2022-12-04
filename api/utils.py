import torch
import pickle
import numpy as np
import scipy.spatial.distance as metrics

from sklearn.neighbors import NearestNeighbors
from VPR.models.matching import Matching
from VPR.models.utils import read_image
from VPR.BOVW import features, build_histogram, bow_and_tfidf, faiss_kmeans
# from sklearn.neighbors import NearestNeighbors

import crud
# import time

torch.set_grad_enabled(False)

device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f'Using device {device}')

config = {
    'superpoint': {
        'nms_radius': 4,
        'keypoint_threshold': 0.005,
        'max_keypoints': 1024
    },
    'superglue': {
        'weights': 'outdoor',
        'sinkhorn_iterations': 20,
        'match_threshold': 0.2,
    }
}

matching = Matching(config).eval().to(device)
superpoint = matching.superpoint.to(device)

with open('VPR/data/images_paths.pkl', 'rb') as f:
    images_paths = pickle.load(f)

with open("VPR/data/preprocessed_image.pkl", "rb") as fb:
    preprocessed_image = pickle.load(fb)

with open('VPR/data/kmeans_bovw_model.pkl', 'rb') as fp:
    kmeans = pickle.load(fp)

with open('VPR/data/descriptors.pkl', 'rb') as fp:
    files = pickle.load(fp)


def bovw(data):
    descriptor = features(data)

    descriptors = np.concatenate([f['descriptors'] for f in files],
                                 axis=0).astype(np.float32)

    kmeans_ = faiss_kmeans(descriptors)
    kmeans_.train(descriptors)

    files_ = bow_and_tfidf(files, kmeans_)

    searched_file = {"path": 'image_from_user', "descriptors": descriptor}

    searched_file = bow_and_tfidf([searched_file], kmeans_)[0]

    distances = {}
    for file in files_:
        distance = metrics.cosine(searched_file['bow'], file['bow'])
        distances[file['path']] = distance

    distances = dict(sorted(distances.items(), key=lambda x: x[1])[:20])
    return distances.keys()


def bag_of_vwords_search(image_):

    descriptor = features(image_)
    histogram = build_histogram(descriptor, kmeans)
    neighbor = NearestNeighbors(n_neighbors=20)
    neighbor.fit(preprocessed_image)
    dist, result = neighbor.kneighbors([histogram])

    return result[0]


def match(img_raw):

    with open('VPR/data/images.p', 'rb') as fp:
        images = pickle.load(fp)

    image0, inp0, scales0 = read_image(img_raw, device, [640, 480], 0, 1)
    pred0 = superpoint({'image': inp0})

    # start = time.time()
    bag_of_vwords_search_result = bag_of_vwords_search(img_raw)
    images_paths_ = [images_paths[x] for x in bag_of_vwords_search_result]
    # images_paths_ = bovw(img_raw)
    # end = time.time()
    # print(end - start)

    best = []

    for image in images_paths_:

        inp1 = images[image]

        pred = matching({
            'image0': inp0,
            'keypoints0': pred0['keypoints'],
            'descriptors0': pred0['descriptors'],
            'scores0': pred0['scores'],
            'image1': inp1['image'],
            'keypoints1': inp1['keypoints'],
            'descriptors1': inp1['descriptors'],
            'scores1': inp1['scores'],
        })
        pred = {k: v[0].cpu().numpy() for k, v in pred.items()}
        kpts0, kpts1 = pred['keypoints0'], pred['keypoints1']
        matches, conf = pred['matches0'], pred['matching_scores0']

        valid = matches > -1
        mkpts0 = kpts0[valid]

        best.append((len(mkpts0), image))

    best.sort(key=lambda tup: tup[0], reverse=True)

    return best


def best_match(image_, db):
    best = match(image_)

    # places = {}
    places = []
    for image in best:
        image_name = image[1]
        try:
            place_id = crud.get_image_by_name(db, image_name).place_id
            place = crud.get_place(db, place_id)
            place_details = (place.name, place.address, place.description)
            if place_details not in places:
                places.append(place_details)
            # places[place.name] = {place.address, place.description}
        except:
            pass
    return places


def add_image_to_file(filepath):

    with open('VPR/data/images.p', 'rb') as fp:
        images = pickle.load(fp)

    pred = {}

    image, inp, scales = read_image(f'VPR/{filepath}', device, [640, 480], 0,
                                    1)

    pred['image'] = inp
    pred1 = superpoint({'image': inp})
    pred = {**pred, **{k: v[0].cpu().numpy() for k, v in pred1.items()}}
    images[f'{filepath}'] = pred

    with open('VPR/data/images.p', 'wb') as fp:
        pickle.dump(images, fp, protocol=pickle.HIGHEST_PROTOCOL)
