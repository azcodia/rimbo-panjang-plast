export const getPagination = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};

export const formatPagingData = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit);
  return { total, totalPages, page, limit, data };
};

export const errorResponse = (message = "Error") => ({
  success: false,
  message,
});
