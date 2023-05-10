import torch
import pickle
import cv2
import numpy as np
import scipy.spatial.distance as metrics

# from sklearn.neighbors import NearestNeighbors
from VPR.models.matching import Matching
from VPR.models.utils import read_image
from VPR.BOVW import features, build_histogram, bow_and_tfidf, faiss_kmeans, calculate_descriptors
from sklearn.neighbors import NearestNeighbors
from copy import deepcopy

import crud as crud
import time

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


with open('VPR/data_agh/kmeans_bovw_model.pkl', 'rb') as fp:
    kmeans = pickle.load(fp)


# def bovw(data):
#
#     with open('VPR/data/descriptors.pkl', 'rb') as fp:
#         files = pickle.load(fp)
#
#     descriptor = features(data)
#
#     descriptors = np.concatenate([f['descriptors'] for f in files],
#                                  axis=0).astype(np.float32)
#
#     kmeans_ = faiss_kmeans(descriptors)
#     kmeans_.train(descriptors)
#
#     files_ = bow_and_tfidf(files, kmeans_)
#
#     searched_file = {"path": 'image_from_user', "descriptors": descriptor}
#
#     searched_file = bow_and_tfidf([searched_file], kmeans_)[0]
#
#     distances = {}
#     for file in files_:
#         distance = metrics.cosine(searched_file['bow'], file['bow'])
#         distances[file['path']] = distance
#
#     distances = dict(sorted(distances.items(), key=lambda x: x[1])[:20])
#     return distances.keys()


def bag_of_vwords_search(image_):
    with open("VPR/data_agh/preprocessed_image.pkl", "rb") as fb:
        preprocessed_image = pickle.load(fb)

    descriptor = features(image_)
    histogram = build_histogram(descriptor, kmeans)
    neighbor = NearestNeighbors(n_neighbors=40, algorithm='ball_tree', metric='euclidean')
    neighbor.fit(preprocessed_image)
    dist, result = neighbor.kneighbors([histogram])

    return result[0]


# define a function to compare longitudes and latitudes of two points and return the distance between them
def distance(lat1, lon1, lat2, lon2):
    # The math module contains a function named
    # radians which converts from degrees to radians.
    lon1 = np.radians(lon1)
    lon2 = np.radians(lon2)
    lat1 = np.radians(lat1)
    lat2 = np.radians(lat2)

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = np.sin(dlat / 2) ** 2 + np.cos(lat1) * \
                                np.cos(lat2) * np.sin(dlon / 2) ** 2

    c = 2 * np.arcsin(np.sqrt(a))

    # Radius of earth in kilometers. Use 3956 for miles
    r = 6371

    # calculate the result
    return c * r


# define a function check the distance of one point with all the points from list and returns this list but sorted
# by distance
def check_distance(db, latitude, longitude, places):
    sorted_places = []

    distances = {}
    for place in places:
        longitude_, latitude_ = crud.get_longitudes_and_latitudes(db=db, place_id=place['id'])
        distances[place['id']] = distance(latitude, longitude, latitude_, longitude_)
    distances = dict(sorted(distances.items(), key=lambda x: x[1]))

    for place_id in distances.keys():
        for place in places:
            if place['id'] == place_id:
                sorted_places.append(place)

    return sorted_places


def match(img_raw):

    with open('VPR/data_agh/images.pth', 'rb') as fp:
        images = torch.load(fp)

    with open('VPR/data_agh/images_paths.pkl', 'rb') as f:
        images_paths = pickle.load(f)

    image0, inp0, scales0 = read_image(img_raw, device, [640, 480], 0, 1)
    pred0 = superpoint({'image': inp0})

    # start = time.time()
    bag_of_vwords_search_result = bag_of_vwords_search(img_raw)
    images_paths_ = [images_paths[x] for x in bag_of_vwords_search_result]
    # images_paths_ = bovw(img_raw)
    # end = time.time()
    # images_paths_ = images_paths

    best = []

    for image in images_paths_:

        inp1 = images[image]

        pred = matching({
            'image0': inp0.to(device),
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


def best_match(db, image_, latitude, longitude):
    best = match(image_)

    places = []
    places_db = []
    for image in best:
        image_name = image[1]
        try:
            place_id = crud.get_image_by_name(db, image_name).place_id
            place_db = crud.get_place(db, place_id)
            if place_db not in places_db:
                places_db.append(place_db)

                main_img = crud.get_image_by_id(db, place_db.main_image_id).image
                filepath = "/static/" + main_img
                place = deepcopy(place_db)
                place = place.__dict__
                place.pop("main_image_id")
                place["main_image"] = filepath

                if place not in places:
                    places.append(place)
        except:
            pass

    places = check_distance(db, latitude, longitude, places)
    return places


def add_image_to_file(filepath, image):

    with open('VPR/data_agh/images.pth', 'rb') as fp:
        images = torch.load(fp)

    with open("VPR/data_agh/preprocessed_image.pkl", "rb") as fb:
        preprocessed_image = pickle.load(fb)

    with open('VPR/data_agh/images_paths.pkl', 'rb') as f:
        images_paths = pickle.load(f)


    image1, inp1, scales1 = read_image(image, device, [640, 480], 0, 1)

    pred1 = superpoint({'image': inp1})

    batch = {**pred1, **{k: v for k, v in pred1.items()}, 'image': inp1}

    images[f'{filepath}'] = batch

    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    descriptor = features(image)

    if descriptor is not None:
        histogram = build_histogram(descriptor, kmeans)
        preprocessed_image.append(histogram)

    images_paths.append(filepath)

    # calculate_descriptors("VPR/images/*", "VPR/images_from_user/*", "VPR/data/descriptors.pkl")

    with open('VPR/data_agh/images.pth', 'wb') as fp:
        torch.save(images, fp)

    with open("VPR/data_agh/preprocessed_image.pkl", "wb") as fp:
        pickle.dump(preprocessed_image, fp, protocol=pickle.HIGHEST_PROTOCOL)

    with open("VPR/data_agh/images_paths.pkl", "wb") as fp:
        pickle.dump(images_paths, fp, protocol=pickle.HIGHEST_PROTOCOL)


async def get_places_from_history(user, db):
    history = await crud.get_user_history(db, user.id)
    places = []

    for history_e in list(history):
        date = history_e.date
        place_id = history_e.place_id
        place = crud.get_place(db, place_id)
        if place is not None:
            main_img = crud.get_image_by_id(db, place.main_image_id).image
            place = deepcopy(place)
            place = place.__dict__
            filepath = "/static/" + main_img
            place['date'] = date
            place["main_image"] = filepath
            places.append(place)

    return places


async def get_user_created_places(user, db):
    db_places = await crud.get_user_created_places(db, user.id)
    places = []

    for place in list(db_places):
        place_id = place.id
        place = crud.get_place(db, place_id)
        if place is not None:
            main_img = crud.get_image_by_id(db, place.main_image_id).image
            place = deepcopy(place)
            place = place.__dict__
            filepath = "/static/" + main_img
            place["main_image"] = filepath
            places.append(place)

    return places


def update_data(removed_images):
    with open('VPR/data_agh/images.pth', 'rb') as fp:
        images = torch.load(fp)

    with open("VPR/data_agh/preprocessed_image.pkl", "rb") as fb:
        preprocessed_image = pickle.load(fb)

    with open('VPR/data_agh/images_paths.pkl', 'rb') as f:
        images_paths = pickle.load(f)

    img_indexes = []
    for rm_img in removed_images:
        images.pop(rm_img)
        img_indexes.append(images_paths.index(rm_img))

    new_preprocessed_image = []
    new_images_paths = []
    for idx in range(0, len(preprocessed_image)):
        if idx not in img_indexes:
            new_preprocessed_image.append(preprocessed_image[idx])
            new_images_paths.append(images_paths[idx])

    with open('VPR/data_agh/images.pth', 'wb') as fp:
        torch.save(images, fp)

    with open("VPR/data_agh/images_paths.pkl", "wb") as f:
        pickle.dump(new_images_paths, f)

    with open("VPR/data_agh/preprocessed_image.pkl", "wb") as f:
        pickle.dump(new_preprocessed_image, f)
