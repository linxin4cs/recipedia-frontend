import axios from 'axios'

const jsonApi = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const formApi = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

export {
  jsonApi,
  formApi,
}
