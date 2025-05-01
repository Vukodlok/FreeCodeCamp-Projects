import numpy as np

def calculate(list):
    if len(list) != 9:
        raise ValueError("List must contain nine numbers.")

    array = np.array(list).reshape(3, 3)

    mean_col = np.mean(array, axis=0).tolist()
    mean_row = np.mean(array, axis=1).tolist()
    mean = np.mean(array).item()

    variance_col = np.var(array, axis=0).tolist()
    variance_row = np.var(array, axis=1).tolist()
    variance = np.var(array).item()

    std_col = np.std(array, axis=0).tolist()
    std_row = np.std(array, axis=1).tolist()
    std = np.std(array).item()

    max_col = np.max(array, axis=0).tolist()
    max_row = np.max(array, axis=1).tolist()  # ✅ Fix axis=1
    max_list = np.max(array).item()

    min_col = np.min(array, axis=0).tolist()
    min_row = np.min(array, axis=1).tolist()  # ✅ Fix axis=1
    min_list = np.min(array).item()

    sum_col = np.sum(array, axis=0).tolist()
    sum_row = np.sum(array, axis=1).tolist()
    sum_list = np.sum(array).item()

    calculations = {
        'mean': [mean_col, mean_row, mean],
        'variance': [variance_col, variance_row, variance],
        'standard deviation': [std_col, std_row, std],
        'max': [max_col, max_row, max_list],
        'min': [min_col, min_row, min_list],
        'sum': [sum_col, sum_row, sum_list]
    }

    return calculations
