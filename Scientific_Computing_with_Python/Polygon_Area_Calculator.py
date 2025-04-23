class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def set_width(self, width):
        self.width = width

    def set_height(self, height):
        self.height = height

    def get_area(self):
        return self.width * self.height

    def get_perimeter(self):
        return 2 * self.width + 2 * self.height

    def get_diagonal(self):
        return (self.width**2 + self.height**2)**0.5

    def get_picture(self):
        if self.width > 50 or self.height > 50:
            return 'Too big for picture.'
        return ('*' * self.width + '\n') * self.height

    def get_amount_inside(self, shape):
        times_width = self.width // shape.width
        times_height = self.height // shape.height
        return times_width * times_height

    def __str__(self):
        return f"Rectangle(width={self.width}, height={self.height})"

class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)

    def set_side(self, side):
        self.width = side
        self.height = side

    def set_width(self, width):
        self.set_side(width)

    def set_height(self, height):
        self.set_side(height)

    def __str__(self):
        return f"Square(side={self.width})"

#visual output as building
r1 = Rectangle(12, 7)
r2 = Rectangle(3, 5)
s1 = Square(5)
print(r1)
print('area: ' + str(r1.get_area()))
print('perimeter: ' + str(r1.get_perimeter()))
print('diagonal: ' + str(r1.get_diagonal()))
print(r1.get_picture())

print(s1)
print('area: ' + str(s1.get_area()))
print('perimeter: ' + str(s1.get_perimeter()))
print('diagonal: ' + str(s1.get_diagonal()))
print(s1.get_picture())

print(f'How many {s1} fit inside {r1}? {r1.get_amount_inside(s1)}')
