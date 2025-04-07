def arithmetic_arranger(problems, show_answers=False):
    if len(problems) > 5:
        return 'Error: Too many problems.'
    #lists needed for proper formatting
    first_line = []
    second_line = []
    dashes_line = []
    answers_line = []

    #split each problem into first number, second number, and operator
    for part in problems:
        parts = part.split()
        if len(parts) != 3:
            return 'Error: Invalid problem format.'
        left, operator, right = parts

        #prevent invalid input formats
        if operator not in ['+', '-']:
            return "Error: Operator must be '+' or '-'."
        if not left.isdigit() or not right.isdigit():
            return 'Error: Numbers must only contain digits.'
        if len(left) > 4 or len(right) > 4:
            return 'Error: Numbers cannot be more than four digits.'

        #two extra spaces on right for operator and spacing
        width = max(len(left), len(right)) + 2
        top = left.rjust(width)
        bottom = operator + ' ' + right.rjust(width - 2)
        line = '-' * width

        first_line.append(top)
        second_line.append(bottom)
        dashes_line.append(line)

        if show_answers:
            answer = str(eval(left + operator + right))
            answers_line.append(answer.rjust(width))

    arranged_top = '    '.join(first_line)
    arranged_bottom = '    '.join(second_line)
    arranged_lines = '    '.join(dashes_line)

    if show_answers:
        arranged_answers = '    '.join(answers_line)
        return f"{arranged_top}\n{arranged_bottom}\n{arranged_lines}\n{arranged_answers}"
    else:
        return f"{arranged_top}\n{arranged_bottom}\n{arranged_lines}"

print(arithmetic_arranger(["3 + 855", "3801 - 2", "45 + 43", "123 + 49"]))

