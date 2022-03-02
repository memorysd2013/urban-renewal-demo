import { api_url } from '../static/config'

/**
 * 
 */
export async function postUrbanRenewalList({ body }) {
  let response = await postApi({ body })
  if (response) {
    return response
  } else {
    return null
  }
}

export async function postUrbanRenewalPolygon({ body }) {
  let response = await postApi({ body })
  if (response) {
    return response
  } else {
    return null
  }
}

/**
 * fetch
 */
function postApi({ body, method = 'POST' }) {
  return fetch(api_url, {
    method,
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(err => null)
}

/**
 * web api
 */
export function getGeolocation(timeout = 5000) {
  try {
    let m
    if (navigator.geolocation) {
      m = new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout }))
        .then(val => [val?.coords?.latitude || 0, val?.coords?.longitude || 0])
        .catch(err => null)
    }
    return m
  } catch (e) {
    //
  }
}