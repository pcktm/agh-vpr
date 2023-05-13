import json
import torch
import pickle
import cv2
import numpy as np
import crud as crud

from VPR.models.matching import Matching
from VPR.models.utils import read_image
from VPR.BOVW import features, build_histogram
from copy import deepcopy

torch.set_grad_enabled(False)

device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f'Using device {device}')

with open('VPR/config.json', 'r') as fp:
    config = json.load(fp)

matching = Matching(config).eval().to(device)
superpoint = matching.superpoint.to(device)

with open('VPR/data_agh/kmeans_bovw_model.pkl', 'rb') as fp:
    kmeans = pickle.load(fp)


def get_images_paths(db, places):
    images_paths = []
    for place in places:
        images = crud.get_images_by_place_id(db=db, place_id=place.id)
        for image in images:
            images_paths.append(image.image)
    return images_paths


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
def check_distance(db, latitude, longitude):
    sorted_places = []

    distances = {}
    places = crud.get_all_places(db=db)
    for place in places:
        longitude_, latitude_ = place.longitude, place.latitude
        distances[place.id] = distance(latitude, longitude, latitude_, longitude_)
    distances = dict(sorted(distances.items(), key=lambda x: x[1]))
    # choose 20 closest places
    distances = dict(list(distances.items())[:5])

    for place_id in distances.keys():
        for place in places:
            if place.id == place_id:
                sorted_places.append(place)

    return sorted_places


def match(db, img_raw, latitude, longitude):
    with open('VPR/data_agh/images.pth', 'rb') as f:
        images = torch.load(f)

    # select 20 closest places
    places = check_distance(db, latitude, longitude)
    images_paths = get_images_paths(db, places)

    image0, inp0, scales0 = read_image(img_raw, device, [640, 480], 0, 1)
    pred0 = superpoint({'image': inp0})

    best = []

    for image in images_paths:
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
    best = match(db, image_, latitude, longitude)

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

    return places


def add_image_to_file(filepath, image):
    with open('VPR/data_agh/images.pth', 'rb') as f:
        images = torch.load(f)

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

    with open('VPR/data_agh/images.pth', 'wb') as img:
        torch.save(images, img)

    with open("VPR/data_agh/preprocessed_image.pkl", "wb") as p:
        pickle.dump(preprocessed_image, p, protocol=pickle.HIGHEST_PROTOCOL)

    with open("VPR/data_agh/images_paths.pkl", "wb") as ip:
        pickle.dump(images_paths, ip, protocol=pickle.HIGHEST_PROTOCOL)


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
    with open('VPR/data_agh/images.pth', 'rb') as f:
        images = torch.load(f)

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

    with open('VPR/data_agh/images.pth', 'wb') as f:
        torch.save(images, f)

    with open("VPR/data_agh/images_paths.pkl", "wb") as f:
        pickle.dump(new_images_paths, f)

    with open("VPR/data_agh/preprocessed_image.pkl", "wb") as f:
        pickle.dump(new_preprocessed_image, f)
