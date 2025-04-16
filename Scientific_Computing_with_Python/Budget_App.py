class Category:
    def __init__(self, name):
        self.name = name
        self.ledger = []

    def deposit(self, amount, description=''):
        self.ledger.append({'amount': amount, 'description': description})

    def withdraw(self, amount, description=''):
        if self.check_funds(amount):
            self.ledger.append({'amount': -amount, 'description': description})
            return True
        return False

    def get_balance(self):
        total = 0
        for item in self.ledger:
            total += item['amount']
        return total

    def check_funds(self, amount):
        return amount <= self.get_balance()

    def transfer(self, amount, category):
        if self.check_funds(amount):
            self.withdraw(amount, f'Transfer to {category.name}')
            category.deposit(amount, f'Transfer from {self.name}')
            return True
        return False

    def __str__(self):
        title = self.name.center(30, '*')

        ledger_lines = ''
        for entry in self.ledger:
            description = entry['description'][:23]
            amount = f"{entry['amount']:.2f}"
            ledger_lines += f"{description:<23}{amount:>7}\n"

        total = self.get_balance()
        total_line = f"Total: {total:.2f}"

        return title + '\n' + ledger_lines + total_line


def create_spend_chart(categories):
    title = 'Percentage spent by category\n'

    # calcualte percentages in order to build the bar chart
    spendings = [sum(-item['amount'] for item in cat.ledger if item['amount'] < 0) for cat in categories]
    total = sum(spendings)
    percentages = [(spend/total) * 100 for spend in spendings]
    rounded_percentages = [int(p // 10) * 10 for p in percentages]

    # create a visual bar chart from the percentage calculations
    chart = ''
    for i in range(100, -1, -10):
        chart += f'{i:>3}|'
        for p in rounded_percentages:
            chart += ' o ' if p >= i else '   '
        chart += ' \n'

    chart += '    ' + '-' * (len(categories) * 3 + 1) + '\n'
    max_len = max(len(cat.name) for cat in categories)
    for i in range(max_len):
        line = '     '
        for cat in categories:
            letter = cat.name[i] if i < len(cat.name) else ' '
            line += f'{letter}  '
        chart += line.rstrip() + '  \n'
    
    return title + chart.rstrip('\n') 
