import api from './api'

export const recommend = async (student) => {
  const res = await api.post('/recommend', student)
  return res.data
}