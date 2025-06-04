# import libraries (you may add additional imports but you may not have to)
import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
import matplotlib.pyplot as plt

# get data files
!wget https://cdn.freecodecamp.org/project-data/books/book-crossings.zip

!unzip book-crossings.zip

books_filename = 'BX-Books.csv'
ratings_filename = 'BX-Book-Ratings.csv'

# import csv data into dataframes
df_books = pd.read_csv(
    books_filename,
    encoding = "ISO-8859-1",
    sep=";",
    header=0,
    names=['isbn', 'title', 'author'],
    usecols=['isbn', 'title', 'author'],
    dtype={'isbn': 'str', 'title': 'str', 'author': 'str'})

df_ratings = pd.read_csv(
    ratings_filename,
    encoding = "ISO-8859-1",
    sep=";",
    header=0,
    names=['user', 'isbn', 'rating'],
    usecols=['user', 'isbn', 'rating'],
    dtype={'user': 'int32', 'isbn': 'str', 'rating': 'float32'})

# filter books with at least 100 ratings and users with at least 200 ratings to ensure statistical significance
reqd_users = []
for i, row in df_ratings['user'].value_counts().items():
  if row > 200:
    reqd_users.append(i)

df_reqd_ratings = df_ratings[df_ratings['user'].apply(lambda user: user in reqd_users)]

reqd_books = []
for i, row in df_ratings['isbn'].value_counts().items():
  if row > 100:
    reqd_books.append(i)

df_reqd_books = df_books[df_books['isbn'].apply(lambda book: book in reqd_books)]

df = pd.merge(df_reqd_books, df_reqd_ratings, on='isbn').dropna()
df.info()

# create a pivot table
bookmat = df.pivot_table(index='title', columns='user', values='rating').fillna(0)
bookmat.shape


# fit k-nearest neighbor model
nn = NearestNeighbors(metric='cosine', algorithm='brute')
nn.fit(bookmat.values)

# function to return recommended books - this will be tested
def get_recommends(book = ""):
  dist, idx = nn.kneighbors([bookmat.loc[book].values], 6)
  recommended_books = [book]
  rb = []
  for i in range(1, 6):
    rb.append([bookmat.iloc[idx.flatten()].index[i], dist.flatten()[i]])
  rb = sorted(rb, key=(lambda x:x[1]), reverse=True)
  recommended_books.append(rb)
  return recommended_books

books = get_recommends("Where the Heart Is (Oprah's Book Club (Paperback))")
print(books)

# fcc check
def test_book_recommendation():
  test_pass = True
  recommends = get_recommends("Where the Heart Is (Oprah's Book Club (Paperback))")
  if recommends[0] != "Where the Heart Is (Oprah's Book Club (Paperback))":
    test_pass = False
  recommended_books = ["I'll Be Seeing You", 'The Weight of Water', 'The Surgeon', 'I Know This Much Is True']
  recommended_books_dist = [0.8, 0.77, 0.77, 0.77]
  for i in range(2): 
    if recommends[1][i][0] not in recommended_books:
      test_pass = False
    if abs(recommends[1][i][1] - recommended_books_dist[i]) >= 0.05:
      test_pass = False
  if test_pass:
    print("You passed the challenge! 🎉🎉🎉🎉🎉")
  else:
    print("You haven't passed yet. Keep trying!")

test_book_recommendation()
