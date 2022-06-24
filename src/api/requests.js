import api from "./fetch";

export const signIn = async (email, password) => {
    const response = await api.request({
      url: "/auth/signin",
      method: "POST",
      data: {
        'email': email,
        'password': password
      }
    });
    return response;
};

export const signUp = async (email, password, fullName, role) => {
  const response = await api.request({
    url: "/user/signup",
    method: "POST",
    data: {
      'email': email,
      'password': password,
      'fullName': fullName,
      'role': role
    }
  });
  return response;
};

export const addBook = async (title, yearofpublication, author, category, cover, token) => {
  const response = await api.requestByToken({
    url: "/admin/book/add",
    method: "POST",
    data: {
      'title': title,
      'yearofpublication': yearofpublication,
      'author': author,
      'category': category,
      'cover': cover
    },
    token: token
  });
  return response;
}

export const allBooks = async (token, role) => {
  const response = await api.requestByToken({
    url: `/book/all?role=${role}`,
    method: "GET",
    token: token
  });
  return response;
}

export const getBookById = async (id) => {
  const response = await api.request({
    url: `/book/by-id?bookId=${id}`,
    method: "GET",
  });
  return response;
}

export const deleteBook = async (id, userId, token) => {
  const response = await api.requestByToken({
    url: "/admin/book/delete",
    method: 'DELETE',
    token: token,
    data: {
      'id': id,
      'userId': userId
    }
  });
  return response;
}

export const updateBook = async (id, title, yearofpublication, author, category, cover, available, user, token) => {
  const response = await api.requestByToken({
    url: "/admin/book/edit",
    method: "PUT",
    data: {
      'id': id,
      'title': title,
      'yearofpublication': yearofpublication,
      'author': author,
      'category': category,
      'cover': cover,
      'available': available,
      'user': user
    },
    token: token
  });
  return response;
}

export const borrowBook = async(bookId, userId, token) => {
  const response = await api.requestByToken({
    url: "/user/book/borrow",
    method: "PUT",
    data: {
      'bookId': bookId,
      'userId': userId
    },
    token: token
  });
  return response;
}

export const allBorrowedBooks = async(userId, token) => {
  const response = await api.requestByToken({
    url: "/user/books/borrow/all",
    method: "POST",
    token: token,
    data:{
      'userId': userId
    }
  });
  return response;
}

export const unBorrowBook = async(bookId, userId, token) => {
  const response = await api.requestByToken({
    url: "/user/book/unborrow",
    method: "PUT",
    data: {
      'bookId': bookId,
      'userId': userId
    },
    token: token
  });
  return response;
}

export const allUsersNonAdmin = async(token) => {
  const response = await api.requestByToken({
    url: "/admin/users",
    method: "GET",
    token: token
  });
  return response;
}

export const allBooksByCategory = async (token, role, category, limit, page) => {
  const response = await api.requestByToken({
    url: `/book/by-category/all?category=${category}&role=${role}&limit=${limit}&page=${page}`,
    method: "GET",
    token: token
  });
  return response;
}

export const allCategories = async () => {
  const response = await api.requestByToken({
    url: "/book/books/all-categories/",
    method: "GET"
  });
  return response;
}