import random

opponent_history = []
my_history = []
round_number = 0

def player(prev_play):
    global opponent_history, my_history, round_number
    round_number += 1

    # Track play history
    if prev_play:
        opponent_history.append(prev_play)

    # Call different strategies based on who the opponent is
    if round_number == 1:
        my_move = "R"
    else:
        if round_number < 50:
            my_move = counter_quincy()
        elif round_number < 100:
            my_move = counter_kris()
        elif round_number < 200:
            my_move = counter_mrugesh()
        else:
            my_move = counter_abbey()

    my_history.append(my_move)
    return my_move

# Quincy has the same pattern over and over again
def counter_quincy():
    if len(opponent_history) < 1:
        return "R"
    seq = ['R', 'P', 'S']
    predicted = seq[(len(opponent_history)) % 3]
    return counter_move(predicted)

# Mrugesh counters based on your last 10 throws
def counter_mrugesh():
    if len(opponent_history) < 3:
        return "R"
    last_moves = opponent_history[-3:]
    most_common = max(set(last_moves), key=last_moves.count)
    return counter_move(most_common)

# Kris counters based on your move frequent throw
def counter_kris():
    if len(opponent_history) < 1:
        return "R"
    return counter_move(opponent_history[-1])

# Abbey counters based on your last 3 throws
def counter_abbey():
    if len(opponent_history) < 4:
        return "R"

    #history of 3 was not enough history to gather patterns, used 6
    sequences = {}
    for i in range(len(opponent_history) - 5):
        key = tuple(opponent_history[i:i+5])
        next_move = opponent_history[i + 5]

        if next_move not in ['R', 'P', 'S']:
            continue

        if key not in sequences:
            sequences[key] = {"R": 0, "P": 0, "S": 0}
        sequences[key][next_move] += 1

    last_seq = tuple(opponent_history[-5:])
    if last_seq in sequences:
        prediction = max(sequences[last_seq], key=sequences[last_seq].get)
    else:
        prediction = random.choice(["R", "P", "S"])

    return counter_move(prediction)

# Helper function for opponent strategies
def counter_move(move):
    return {"R": "P", "P": "S", "S": "R"}[move]
