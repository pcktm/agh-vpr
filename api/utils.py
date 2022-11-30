import torch
import pickle
import cv2

from VPR.models.matching import Matching
from VPR.models.superpoint import SuperPoint
from VPR.models.utils import read_image
from VPR.BOVW import features, build_histogram
from sklearn.neighbors import NearestNeighbors

import crud

torch.set_grad_enabled(False)

device = 'cuda' if torch.cuda.is_available() else 'cpu'

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
superpoint = SuperPoint(config.get('superpoint', {}))
extractor = cv2.xfeatures2d.SIFT_create()

with open('VPR/images_paths.pkl', 'rb') as f:
    images_paths = pickle.load(f)

with open("VPR/preprocessed_image.pkl", "rb") as fb:
    preprocessed_image = pickle.load(fb)

with open('VPR/kmeans_bovw_model.pkl', 'rb') as fp:
    kmeans = pickle.load(fp)


def bag_of_vwords_search(img_name):

    data = cv2.imread(f"ImgFromUser/{img_name}")
    data = cv2.cvtColor(data, cv2.COLOR_BGR2GRAY)
    keypoint, descriptor = features(data, extractor)
    histogram = build_histogram(descriptor, kmeans)
    neighbor = NearestNeighbors(n_neighbors=20)
    neighbor.fit(preprocessed_image)
    dist, result = neighbor.kneighbors([histogram])

    return result[0]


def match(img_name):

    with open('VPR/images.p', 'rb') as fp:
        images = pickle.load(fp)

    image0, inp0, scales0 = read_image(f"ImgFromUser/{img_name}", device, [640, 480], 0, 1)
    pred0 = superpoint({'image': inp0})

    bag_of_vwords_search_result = bag_of_vwords_search(img_name)
    images_paths_ = [images_paths[x] for x in bag_of_vwords_search_result]

    best = []

    for image in images_paths_:
        pred1 = {}
        pred1['image0'] = inp0
        pred1 = {**pred1, **{k + '0': v for k, v in pred0.items()}}
        pred1 = {**pred1, **{k + '1': v for k, v in images[image].items()}}
        pred = matching(pred1)
        pred = {k: v[0].cpu().numpy() for k, v in pred.items()}
        kpts0, kpts1 = pred['keypoints0'], pred['keypoints1']
        matches, conf = pred['matches0'], pred['matching_scores0']

        valid = matches > -1
        mkpts0 = kpts0[valid]

        best.append((len(mkpts0), image))

    best.sort(key=lambda tup: tup[0], reverse=True)

    return best


def best_match(img_name, db):
    best = match(img_name)

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


def add_image_to_file(filename):

    with open('VPR/images.p', 'rb') as fp:
        images = pickle.load(fp)

    pred = {}

    image, inp, scales = read_image(filename, device, [640, 480], 0, 1)

    pred['image'] = inp
    pred1 = superpoint({'image': inp})
    pred = {**pred, **{k: v for k, v in pred1.items()}}
    images[f'{filename}'] = pred

    with open('VPR/images.p', 'wb') as fp:
        pickle.dump(images, fp, protocol=pickle.HIGHEST_PROTOCOL)
