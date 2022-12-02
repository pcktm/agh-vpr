import pickle

from glob import glob
from multiprocessing import Pool
from BOVW import multiprocessing_child

if __name__ == '__main__':
    queue = glob("../../../../../../../Downloads/eee/help/images/*")
    results = []
    # if process argument is not given
    with Pool(processes=20) as pool:
        promises = pool.imap_unordered(multiprocessing_child,
                                       queue,
                                       chunksize=100)
        for promise in promises:
            results.append(promise)
            print(f"Processed {len(results)} / {len(queue)} images")

    with open("data/descriptors.pkl", "wb") as f:
        pickle.dump(results, f)
