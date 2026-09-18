export const ok = (res, data = {}, message = "Operation successful", status = 200) =>
  res.status(status).json({ success: true, message, data });

export const fail = (res, message = "Something went wrong", status = 400) =>
  res.status(status).json({ success: false, message });
