import api from './api'

export const sendToSheet = async (data) => {
  const res = await api.post('/send-to-sheet', data)
  return res.data
}